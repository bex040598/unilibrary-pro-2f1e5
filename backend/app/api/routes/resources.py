from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user, require_roles
from app.models import DepartmentResource, ResourceDownload, ResourceVersion, ResourceView, Subject, User
from app.schemas.common import ResourceUpdateRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_resource

router = APIRouter()


def get_or_create_subject(db: Session, department_id: int, subject_name: str | None, course: int, semester: int) -> Subject | None:
    if not subject_name:
        return None
    subject = db.scalar(select(Subject).where(Subject.department_id == department_id, Subject.name == subject_name))
    if subject:
        return subject
    subject = Subject(department_id=department_id, name=subject_name, course=course, semester=semester)
    db.add(subject)
    db.flush()
    return subject


@router.get("/department-resources")
def list_resources(db: Session = Depends(get_db)) -> list[dict]:
    resources = db.scalars(select(DepartmentResource).order_by(DepartmentResource.id.desc())).all()
    return [serialize_resource(db, item) for item in resources]


@router.post("/department-resources")
async def create_resource(
    title: str = Form(...),
    description: str = Form(""),
    author_name: str = Form(...),
    department_id: int = Form(...),
    subject_name: str = Form(...),
    course: int = Form(...),
    semester: int = Form(...),
    material_type: str = Form(...),
    language: str = Form("uz"),
    format: str = Form("PDF"),
    academic_year: str = Form("2025/2026"),
    visibility: str = Form("department"),
    download_allowed: bool = Form(True),
    online_read_allowed: bool = Form(True),
    keywords: str = Form(""),
    tags: str = Form(""),
    version_note: str = Form("Initial version"),
    file: UploadFile | None = File(default=None),
    cover_image: UploadFile | None = File(default=None),
    current_user: User = Depends(require_roles("teacher", "department", "admin")),
    db: Session = Depends(get_db),
) -> dict:
    subject = get_or_create_subject(db, department_id, subject_name, course, semester)
    resource = DepartmentResource(
        department_id=department_id,
        subject_id=subject.id if subject else None,
        uploaded_by_id=current_user.id,
        title=title,
        description=description,
        author_name=author_name,
        course=course,
        semester=semester,
        material_type=material_type,
        language=language,
        format=format,
        status="draft",
        academic_year=academic_year,
        visibility=visibility,
        download_allowed=download_allowed,
        online_read_allowed=online_read_allowed,
        keywords=[item.strip() for item in keywords.split(",") if item.strip()],
        tags=[item.strip() for item in tags.split(",") if item.strip()],
        version_note=version_note,
        file_url=f"/uploads/{file.filename}" if file else None,
        cover_url=f"/uploads/{cover_image.filename}" if cover_image else None,
    )
    db.add(resource)
    db.flush()
    db.add(ResourceVersion(resource_id=resource.id, version_label="v1", version_note=version_note, file_url=resource.file_url, created_by_id=current_user.id))
    db.commit()
    db.refresh(resource)
    write_audit_log(db, "resources.create", resource.title, current_user.id)
    return serialize_resource(db, resource)


@router.get("/department-resources/{resource_id}")
def get_resource(resource_id: int, db: Session = Depends(get_db)) -> dict:
    resource = db.get(DepartmentResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return serialize_resource(db, resource)


@router.patch("/department-resources/{resource_id}")
def patch_resource(resource_id: int, payload: ResourceUpdateRequest, current_user: User = Depends(require_roles("teacher", "department", "admin")), db: Session = Depends(get_db)) -> dict:
    resource = db.get(DepartmentResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        if key == "subject_name":
            subject = get_or_create_subject(db, resource.department_id, value, resource.course, resource.semester)
            resource.subject_id = subject.id if subject else None
        else:
            setattr(resource, key, value)
    db.commit()
    db.refresh(resource)
    write_audit_log(db, "resources.update", resource.title, current_user.id)
    return serialize_resource(db, resource)


def transition_resource(resource_id: int, next_status: str, current_user: User, db: Session) -> dict:
    resource = db.get(DepartmentResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.status = next_status
    db.commit()
    db.refresh(resource)
    write_audit_log(db, f"resources.{next_status}", resource.title, current_user.id)
    return serialize_resource(db, resource)


@router.post("/department-resources/{resource_id}/submit")
def submit_resource(resource_id: int, current_user: User = Depends(require_roles("teacher", "department", "admin")), db: Session = Depends(get_db)) -> dict:
    return transition_resource(resource_id, "pending_review", current_user, db)


@router.patch("/department-resources/{resource_id}/approve")
def approve_resource(resource_id: int, current_user: User = Depends(require_roles("librarian", "department", "admin")), db: Session = Depends(get_db)) -> dict:
    return transition_resource(resource_id, "approved", current_user, db)


@router.patch("/department-resources/{resource_id}/reject")
def reject_resource(resource_id: int, current_user: User = Depends(require_roles("librarian", "department", "admin")), db: Session = Depends(get_db)) -> dict:
    return transition_resource(resource_id, "rejected", current_user, db)


@router.patch("/department-resources/{resource_id}/request-revision")
def request_revision(resource_id: int, current_user: User = Depends(require_roles("librarian", "department", "admin")), db: Session = Depends(get_db)) -> dict:
    return transition_resource(resource_id, "needs_revision", current_user, db)


@router.patch("/department-resources/{resource_id}/archive")
def archive_resource(resource_id: int, current_user: User = Depends(require_roles("librarian", "department", "admin")), db: Session = Depends(get_db)) -> dict:
    return transition_resource(resource_id, "archived", current_user, db)


@router.post("/department-resources/{resource_id}/view")
def view_resource(resource_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    db.add(ResourceView(resource_id=resource_id, user_id=current_user.id))
    db.commit()
    return {"data": {"success": True}}


@router.post("/department-resources/{resource_id}/download")
def download_resource(resource_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    db.add(ResourceDownload(resource_id=resource_id, user_id=current_user.id))
    db.commit()
    return {"data": {"success": True}}

