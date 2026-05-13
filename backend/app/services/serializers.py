from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import (
    Author,
    Book,
    BookAuthor,
    BookCopy,
    Department,
    DepartmentResource,
    Loan,
    ReadingRoom,
    Reservation,
    ResourceDownload,
    ResourceRating,
    ResourceView,
    Seat,
    Subject,
    User,
)


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.primary_role,
        "department_id": user.department_id,
        "faculty_id": user.faculty_id,
        "avatar_url": user.avatar_url,
        "phone": user.phone,
        "student_id": user.student_id,
        "teacher_title": user.teacher_title,
        "face_id_enabled": user.face_id_enabled,
    }


def serialize_department(department: Department) -> dict:
    return {
        "id": department.id,
        "faculty_id": department.faculty_id,
        "slug": department.slug,
        "name": department.name,
        "summary": department.summary,
        "head_name": department.head_name,
        "resources_count": department.resources_count,
        "subjects_count": department.subjects_count,
        "teachers_count": department.teachers_count,
        "downloads_count": department.downloads_count,
        "active_subject": department.active_subject,
        "updated_at": department.updated_at.isoformat() if department.updated_at else None,
        "has_new_materials": department.has_new_materials,
    }


def serialize_resource(db: Session, resource: DepartmentResource) -> dict:
    subject_name = None
    if resource.subject_id:
        subject_name = db.scalar(select(Subject.name).where(Subject.id == resource.subject_id))

    department_name = db.scalar(select(Department.name).where(Department.id == resource.department_id))
    views_count = db.scalar(select(func.count(ResourceView.id)).where(ResourceView.resource_id == resource.id)) or 0
    downloads_count = db.scalar(select(func.count(ResourceDownload.id)).where(ResourceDownload.resource_id == resource.id)) or 0
    average_rating = db.scalar(select(func.avg(ResourceRating.rating)).where(ResourceRating.resource_id == resource.id)) or 0.0

    return {
        "id": resource.id,
        "title": resource.title,
        "description": resource.description or "",
        "author_name": resource.author_name,
        "department_id": resource.department_id,
        "department_name": department_name,
        "subject_name": subject_name or "Unknown subject",
        "course": resource.course,
        "semester": resource.semester,
        "language": resource.language,
        "material_type": resource.material_type,
        "format": resource.format,
        "views_count": int(views_count),
        "downloads_count": int(downloads_count),
        "average_rating": float(round(average_rating, 2)),
        "status": resource.status,
        "cover_url": resource.cover_url,
        "file_url": resource.file_url,
        "online_read_allowed": resource.online_read_allowed,
        "download_allowed": resource.download_allowed,
        "academic_year": resource.academic_year or "",
        "keywords": resource.keywords or [],
        "tags": resource.tags or [],
    }


def serialize_book(db: Session, book: Book) -> dict:
    author_rows = db.scalars(
        select(Author.name)
        .join(BookAuthor, BookAuthor.author_id == Author.id)
        .where(BookAuthor.book_id == book.id)
    ).all()
    department_name = db.scalar(select(Department.name).where(Department.id == book.department_id)) or "General"
    subject_name = db.scalar(select(Subject.name).where(Subject.id == book.subject_id)) or "General subject"
    copies = db.scalars(select(BookCopy).where(BookCopy.book_id == book.id)).all()
    available = len([copy for copy in copies if copy.status == "available"])

    return {
        "id": book.id,
        "title": book.title,
        "author_names": author_rows,
        "department_name": department_name,
        "subject_name": subject_name,
        "language": book.language,
        "format": book.format,
        "available_copies": available,
        "total_copies": len(copies),
        "rating": 4.7,
        "views_count": 400 + book.id * 37,
        "downloads_count": 90 + book.id * 19,
        "summary": book.summary or "",
        "shelf_code": book.shelf_code or "",
    }


def serialize_reservation(db: Session, reservation: Reservation) -> dict:
    book_title = db.scalar(select(Book.title).where(Book.id == reservation.book_id)) or "Unknown book"
    return {
        "id": reservation.id,
        "book_id": reservation.book_id,
        "book_title": book_title,
        "pickup_date": reservation.pickup_date.isoformat(),
        "pickup_time": reservation.pickup_time.strftime("%H:%M"),
        "status": reservation.status,
        "qr_code": reservation.qr_code,
    }


def serialize_loan(db: Session, loan: Loan) -> dict:
    if loan.reservation_id:
        reservation = db.get(Reservation, loan.reservation_id)
        book_title = db.scalar(select(Book.title).where(Book.id == reservation.book_id)) if reservation else "Unknown book"
    else:
        book_title = "Unknown book"

    due_at = loan.due_at.replace(tzinfo=timezone.utc) if loan.due_at.tzinfo is None else loan.due_at.astimezone(timezone.utc)
    issued_at = loan.issued_at.replace(tzinfo=timezone.utc) if loan.issued_at.tzinfo is None else loan.issued_at.astimezone(timezone.utc)
    returned_at = None
    if loan.returned_at:
        returned_at = loan.returned_at.replace(tzinfo=timezone.utc) if loan.returned_at.tzinfo is None else loan.returned_at.astimezone(timezone.utc)
    now = datetime.now(timezone.utc)
    remaining_days = int((due_at - now).total_seconds() // 86400)
    return {
        "id": loan.id,
        "book_title": book_title,
        "issued_at": issued_at.isoformat(),
        "due_at": due_at.isoformat(),
        "returned_at": returned_at.isoformat() if returned_at else None,
        "status": loan.status,
        "renewal_count": loan.renewal_count,
        "fine_amount": loan.fine_amount,
        "remaining_days": remaining_days,
    }


def serialize_reading_room(room: ReadingRoom, seats: list[Seat]) -> dict:
    available = len([seat for seat in seats if seat.status == "available"])
    occupancy_rate = 0 if room.total_seats == 0 else int(round(((room.total_seats - available) / room.total_seats) * 100))
    return {
        "id": room.id,
        "name": room.name,
        "floor": room.floor,
        "total_seats": room.total_seats,
        "available_seats": available,
        "occupancy_rate": occupancy_rate,
    }


def serialize_seat(seat: Seat) -> dict:
    return {
        "id": seat.id,
        "reading_room_id": seat.reading_room_id,
        "code": seat.code,
        "row_label": seat.row_label,
        "seat_number": seat.seat_number,
        "status": seat.status,
    }
