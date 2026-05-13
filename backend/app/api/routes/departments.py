from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user, require_roles
from app.models import Department, DepartmentResource, Faculty, Subject, User
from app.schemas.common import DepartmentCreateRequest, DepartmentUpdateRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_department, serialize_resource

router = APIRouter()


@router.get("/faculties")
def list_faculties(db: Session = Depends(get_db)) -> list[dict]:
    faculties = db.scalars(select(Faculty).order_by(Faculty.id)).all()
    return [{"id": item.id, "name": item.name, "slug": item.slug} for item in faculties]


@router.get("/departments")
def list_departments(db: Session = Depends(get_db)) -> list[dict]:
    return [serialize_department(department) for department in db.scalars(select(Department).order_by(Department.id)).all()]


@router.post("/departments")
def create_department(payload: DepartmentCreateRequest, current_user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)) -> dict:
    department = Department(**payload.model_dump())
    db.add(department)
    db.commit()
    db.refresh(department)
    write_audit_log(db, "departments.create", department.name, current_user.id)
    return serialize_department(department)


@router.get("/departments/{department_id}")
def get_department(department_id: int, db: Session = Depends(get_db)) -> dict:
    department = db.get(Department, department_id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return serialize_department(department)


@router.patch("/departments/{department_id}")
def update_department(department_id: int, payload: DepartmentUpdateRequest, current_user: User = Depends(require_roles("admin", "department")), db: Session = Depends(get_db)) -> dict:
    department = db.get(Department, department_id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(department, key, value)
    db.commit()
    db.refresh(department)
    write_audit_log(db, "departments.update", department.name, current_user.id)
    return serialize_department(department)


@router.get("/departments/{department_id}/statistics")
def department_statistics(department_id: int, db: Session = Depends(get_db)) -> dict:
    resources_count = db.scalar(select(func.count(DepartmentResource.id)).where(DepartmentResource.department_id == department_id)) or 0
    subjects_count = db.scalar(select(func.count(Subject.id)).where(Subject.department_id == department_id)) or 0
    approved_count = db.scalar(select(func.count(DepartmentResource.id)).where(DepartmentResource.department_id == department_id, DepartmentResource.status == "approved")) or 0
    pending_count = db.scalar(select(func.count(DepartmentResource.id)).where(DepartmentResource.department_id == department_id, DepartmentResource.status == "pending_review")) or 0
    return {"data": {"resources": resources_count, "subjects": subjects_count, "approved": approved_count, "pending": pending_count}}


@router.get("/departments/{department_id}/resources")
def department_resources(department_id: int, db: Session = Depends(get_db)) -> list[dict]:
    resources = db.scalars(select(DepartmentResource).where(DepartmentResource.department_id == department_id).order_by(DepartmentResource.id.desc())).all()
    return [serialize_resource(db, resource) for resource in resources]

