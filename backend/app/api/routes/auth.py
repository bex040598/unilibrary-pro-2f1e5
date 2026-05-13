from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, create_refresh_token, decode_refresh_token, hash_password, verify_password
from app.models import Librarian, Role, Student, Teacher, User, UserRole, UserSession
from app.schemas.common import LoginRequest, RefreshRequest, RegisterRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_user

router = APIRouter()


def build_auth_payload(db: Session, user: User) -> dict:
    access_token = create_access_token(str(user.id), user.primary_role)
    refresh_token = create_refresh_token(str(user.id), user.primary_role)
    session = UserSession(
        user_id=user.id,
        refresh_token=refresh_token,
        expires_at=datetime.now(UTC) + timedelta(days=14),
        is_active=True,
    )
    db.add(session)
    db.commit()
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@router.post("/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> dict:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role_name=payload.role,
        phone=payload.phone,
        faculty_id=payload.faculty_id,
        department_id=payload.department_id,
        student_id=payload.student_id,
        teacher_title=payload.teacher_title,
    )
    db.add(user)
    db.flush()

    role = db.scalar(select(Role).where(Role.name == payload.role))
    if role:
        db.add(UserRole(user_id=user.id, role_id=role.id))

    if payload.role == "student":
        db.add(Student(user_id=user.id, faculty_id=payload.faculty_id, department_id=payload.department_id, course=payload.course or 1, semester=payload.semester or 1))
    elif payload.role in {"teacher", "department"}:
        db.add(Teacher(user_id=user.id, faculty_id=payload.faculty_id, department_id=payload.department_id, title=payload.teacher_title))
    elif payload.role == "librarian":
        db.add(Librarian(user_id=user.id, badge_code=f"LIB-{user.id:03d}"))

    db.commit()
    db.refresh(user)
    write_audit_log(db, "auth.register", f"Registered {payload.email}", user.id)
    return build_auth_payload(db, user)


@router.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict:
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    write_audit_log(db, "auth.login", f"Login for {user.email}", user.id)
    return build_auth_payload(db, user)


@router.post("/auth/refresh")
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)) -> dict:
    try:
        token_payload = decode_refresh_token(payload.refresh_token)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    session = db.scalar(select(UserSession).where(UserSession.refresh_token == payload.refresh_token, UserSession.is_active.is_(True)))
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh session not found")

    user = db.get(User, int(token_payload["sub"]))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return build_auth_payload(db, user)


@router.post("/auth/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    sessions = db.scalars(select(UserSession).where(UserSession.user_id == current_user.id, UserSession.is_active.is_(True))).all()
    for session in sessions:
        session.is_active = False
    db.commit()
    write_audit_log(db, "auth.logout", "Logged out active sessions", current_user.id)
    return {"data": {"success": True}}


@router.get("/auth/me")
def auth_me(current_user: User = Depends(get_current_user)) -> dict:
    return serialize_user(current_user)

