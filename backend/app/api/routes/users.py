from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.models import AuditLog, Loan, Reservation, SeatReservation, User
from app.schemas.common import ChangePasswordRequest, UpdateUserRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_user

router = APIRouter()


@router.get("/users/me")
def get_me(current_user: User = Depends(get_current_user)) -> dict:
    return serialize_user(current_user)


@router.patch("/users/me")
def update_me(payload: UpdateUserRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    if payload.phone is not None:
        current_user.phone = payload.phone
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url
    db.commit()
    db.refresh(current_user)
    write_audit_log(db, "users.update_me", "Updated profile", current_user.id)
    return serialize_user(current_user)


@router.patch("/users/me/password")
def change_password(payload: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.password_hash = hash_password(payload.new_password)
    db.commit()
    write_audit_log(db, "users.change_password", "Updated password", current_user.id)
    return {"data": {"success": True}}


@router.get("/users/me/activity")
def user_activity(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    items = db.scalars(select(AuditLog).where(AuditLog.user_id == current_user.id).order_by(AuditLog.created_at.desc()).limit(20)).all()
    return {"data": [{"id": item.id, "action": item.action, "created_at": item.created_at.isoformat()} for item in items]}


@router.get("/users/me/library-summary")
def library_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    reservations = db.scalar(select(func.count(Reservation.id)).where(Reservation.user_id == current_user.id)) or 0
    loans = db.scalar(select(func.count(Loan.id)).where(Loan.user_id == current_user.id, Loan.status == "active")) or 0
    overdue = db.scalar(select(func.count(Loan.id)).where(Loan.user_id == current_user.id, Loan.status == "overdue")) or 0
    seat_bookings = db.scalar(select(func.count(SeatReservation.id)).where(SeatReservation.user_id == current_user.id, SeatReservation.status.in_(["reserved", "checked_in"]))) or 0
    return {"data": {"reservations": reservations, "loans": loans, "overdue": overdue, "seat_bookings": seat_bookings}}

