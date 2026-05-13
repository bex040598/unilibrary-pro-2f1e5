from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user, require_roles
from app.models import BookCopy, Loan, RenewalRequest, Reservation, User
from app.schemas.common import IssueLoanRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_loan

router = APIRouter()


def as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


@router.post("/loans/issue")
def issue_loan(payload: IssueLoanRequest, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    reservation = db.get(Reservation, payload.reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    copy = db.scalar(select(BookCopy).where(BookCopy.book_id == reservation.book_id, BookCopy.status.in_(["available", "reserved"])).limit(1))
    if not copy:
        raise HTTPException(status_code=400, detail="No book copies available")
    copy.status = "loaned"
    loan = Loan(
        reservation_id=reservation.id,
        book_copy_id=copy.id,
        user_id=reservation.user_id,
        issued_by_id=current_user.id,
        issued_at=datetime.now(UTC),
        due_at=datetime.now(UTC) + timedelta(days=payload.due_days),
        status="active",
        renewal_count=0,
        fine_amount=0,
    )
    reservation.status = "picked_up"
    db.add(loan)
    db.commit()
    db.refresh(loan)
    write_audit_log(db, "loans.issue", f"Loan {loan.id}", current_user.id)
    return serialize_loan(db, loan)


@router.post("/loans/{loan_id}/return")
def return_loan(loan_id: int, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    loan = db.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    loan.returned_at = datetime.now(UTC)
    loan.status = "returned"
    if loan.book_copy_id:
        copy = db.get(BookCopy, loan.book_copy_id)
        if copy:
            copy.status = "available"
    db.commit()
    db.refresh(loan)
    write_audit_log(db, "loans.return", f"Loan {loan.id}", current_user.id)
    return serialize_loan(db, loan)


@router.get("/loans/my")
def my_loans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[dict]:
    loans = db.scalars(select(Loan).where(Loan.user_id == current_user.id).order_by(Loan.id.desc())).all()
    for loan in loans:
        if loan.status == "active" and as_utc(loan.due_at) < datetime.now(UTC):
            loan.status = "overdue"
            loan.fine_amount = max(loan.fine_amount, 2500.0)
    db.commit()
    return [serialize_loan(db, loan) for loan in loans]


@router.get("/loans/due-today")
def due_today(current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> list[dict]:
    today = datetime.now(UTC).date()
    loans = db.scalars(select(Loan).where(Loan.status == "active")).all()
    items = [loan for loan in loans if as_utc(loan.due_at).date() == today]
    return [serialize_loan(db, loan) for loan in items]


@router.get("/loans/overdue")
def overdue_loans(current_user: User = Depends(require_roles("admin", "librarian", "student", "teacher", "department")), db: Session = Depends(get_db)) -> list[dict]:
    loans = [loan for loan in db.scalars(select(Loan).where(Loan.status.in_(["active", "overdue"]))).all() if as_utc(loan.due_at) < datetime.now(UTC)]
    for loan in loans:
        loan.status = "overdue"
        loan.fine_amount = max(loan.fine_amount, 2500.0)
    db.commit()
    if current_user.primary_role == "student":
        loans = [loan for loan in loans if loan.user_id == current_user.id]
    return [serialize_loan(db, loan) for loan in loans]


@router.post("/loans/{loan_id}/renew-request")
def renew_request(loan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    loan = db.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    request = RenewalRequest(loan_id=loan.id, status="pending", approved_by_id=None)
    loan.renewal_count += 1
    db.add(request)
    db.commit()
    write_audit_log(db, "loans.renew_request", f"Loan {loan.id}", current_user.id)
    return {"data": {"status": "pending"}}
