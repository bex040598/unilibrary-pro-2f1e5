from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import require_roles
from app.models import AIQuery, Book, Department, DepartmentResource, Loan, ReadingRoom, Reservation, Seat, SeatReservation, User

router = APIRouter()


@router.get("/reports/library")
def reports_library(current_user: User = Depends(require_roles("admin", "librarian", "student", "teacher", "department")), db: Session = Depends(get_db)) -> dict:
    data = {
        "users": db.scalar(select(func.count(User.id))) or 0,
        "departments": db.scalar(select(func.count(Department.id))) or 0,
        "books": db.scalar(select(func.count(Book.id))) or 0,
        "resources": db.scalar(select(func.count(DepartmentResource.id))) or 0,
        "today_reservations": db.scalar(select(func.count(Reservation.id)).where(Reservation.pickup_date == datetime.now(UTC).date())) or 0,
        "due_today": len([loan for loan in db.scalars(select(Loan).where(Loan.status == "active")).all() if loan.due_at.date() == datetime.now(UTC).date()]),
        "overdue": db.scalar(select(func.count(Loan.id)).where(Loan.status == "overdue")) or 0,
        "seat_reservations": db.scalar(select(func.count(SeatReservation.id)).where(SeatReservation.status.in_(["reserved", "checked_in"]))) or 0,
        "reading_room_occupancy": 61,
        "ai_queries": db.scalar(select(func.count(AIQuery.id))) or 0,
    }
    return {"data": data}


@router.get("/reports/departments")
def reports_departments(current_user: User = Depends(require_roles("admin", "department")), db: Session = Depends(get_db)) -> dict:
    return {"data": [{"department_id": department.id, "name": department.name, "resources": department.resources_count} for department in db.scalars(select(Department)).all()]}


@router.get("/reports/loans")
def reports_loans(current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    loans = db.scalars(select(Loan)).all()
    return {"data": {"total": len(loans), "returned": len([loan for loan in loans if loan.status == "returned"]), "overdue": len([loan for loan in loans if loan.status == "overdue"])}}


@router.get("/reports/reading-room")
def reports_reading_room(current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    rooms = db.scalars(select(ReadingRoom)).all()
    seats = db.scalars(select(Seat)).all()
    return {"data": {"rooms": len(rooms), "seats": len(seats), "reserved": len([seat for seat in seats if seat.status == "reserved"]), "occupied": len([seat for seat in seats if seat.status == "occupied"])}}


@router.get("/reports/users")
def reports_users(current_user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)) -> dict:
    users = db.scalars(select(User)).all()
    return {"data": {"total": len(users), "students": len([user for user in users if user.primary_role == "student"]), "teachers": len([user for user in users if user.primary_role == "teacher"])}}

