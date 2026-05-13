from datetime import UTC, date, datetime, time, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user, require_roles
from app.models import BookCopy, Loan, Reservation, User
from app.schemas.common import ReservationCreateRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_reservation

router = APIRouter()


@router.post("/reservations")
def create_reservation(payload: ReservationCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    reservation = Reservation(
        book_id=payload.book_id,
        user_id=current_user.id,
        pickup_date=date.fromisoformat(payload.pickup_date),
        pickup_time=time.fromisoformat(payload.pickup_time),
        status="pending",
        qr_code=f"QR-ATMU-{current_user.id}-{payload.book_id}-{int(datetime.now().timestamp())}",
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    write_audit_log(db, "reservations.create", f"Reservation {reservation.id}", current_user.id)
    return serialize_reservation(db, reservation)


@router.get("/reservations/my")
def my_reservations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    reservations = db.scalars(select(Reservation).where(Reservation.user_id == current_user.id).order_by(Reservation.id.desc())).all()
    return [serialize_reservation(db, reservation) for reservation in reservations]


@router.get("/reservations")
def list_reservations(current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> list[dict]:
    reservations = db.scalars(select(Reservation).order_by(Reservation.id.desc())).all()
    return [serialize_reservation(db, reservation) for reservation in reservations]


def move_reservation_status(reservation_id: int, status_value: str, current_user: User, db: Session) -> dict:
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    reservation.status = status_value
    reservation.approved_by_id = current_user.id
    db.commit()
    db.refresh(reservation)
    write_audit_log(db, f"reservations.{status_value}", f"Reservation {reservation.id}", current_user.id)
    return serialize_reservation(db, reservation)


@router.patch("/reservations/{reservation_id}/approve")
def approve_reservation(reservation_id: int, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    return move_reservation_status(reservation_id, "approved", current_user, db)


@router.patch("/reservations/{reservation_id}/reject")
def reject_reservation(reservation_id: int, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    return move_reservation_status(reservation_id, "rejected", current_user, db)


@router.patch("/reservations/{reservation_id}/cancel")
def cancel_reservation(reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if reservation.user_id != current_user.id and current_user.primary_role not in {"admin", "librarian"}:
        raise HTTPException(status_code=403, detail="Cannot cancel this reservation")
    reservation.status = "cancelled"
    db.commit()
    db.refresh(reservation)
    write_audit_log(db, "reservations.cancelled", f"Reservation {reservation.id}", current_user.id)
    return serialize_reservation(db, reservation)


@router.patch("/reservations/{reservation_id}/mark-picked-up")
def mark_picked_up(reservation_id: int, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    reservation.status = "picked_up"
    copy = db.scalar(select(BookCopy).where(BookCopy.book_id == reservation.book_id, BookCopy.status == "available").limit(1))
    if copy:
        copy.status = "loaned"
        if not db.scalar(select(Loan).where(Loan.reservation_id == reservation.id)):
            db.add(
                Loan(
                    reservation_id=reservation.id,
                    book_copy_id=copy.id,
                    user_id=reservation.user_id,
                    issued_by_id=current_user.id,
                    issued_at=datetime.now(UTC),
                    due_at=datetime.now(UTC) + timedelta(days=10),
                    status="active",
                    renewal_count=0,
                    fine_amount=0,
                )
            )
    db.commit()
    db.refresh(reservation)
    write_audit_log(db, "reservations.picked_up", f"Reservation {reservation.id}", current_user.id)
    return serialize_reservation(db, reservation)
