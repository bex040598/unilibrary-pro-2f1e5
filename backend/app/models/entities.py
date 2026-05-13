from __future__ import annotations

from datetime import date, datetime, time
from typing import Optional

from sqlalchemy import JSON, Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role_name: Mapped[str] = mapped_column(String(40), default="student")
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    faculty_id: Mapped[Optional[int]] = mapped_column(ForeignKey("faculties.id"), nullable=True)
    department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
    student_id: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    teacher_title: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    face_id_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    sessions: Mapped[list["UserSession"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def primary_role(self) -> str:
        return self.role_name


class UserRole(Base, TimestampMixin):
    __tablename__ = "user_roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), index=True)


class UserSession(Base, TimestampMixin):
    __tablename__ = "user_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    refresh_token: Mapped[str] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="sessions")


class Student(Base, TimestampMixin):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    faculty_id: Mapped[Optional[int]] = mapped_column(ForeignKey("faculties.id"), nullable=True)
    department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
    course: Mapped[int] = mapped_column(Integer, default=1)
    semester: Mapped[int] = mapped_column(Integer, default=1)


class Teacher(Base, TimestampMixin):
    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    faculty_id: Mapped[Optional[int]] = mapped_column(ForeignKey("faculties.id"), nullable=True)
    department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)


class Librarian(Base, TimestampMixin):
    __tablename__ = "librarians"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    badge_code: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)


class Faculty(Base, TimestampMixin):
    __tablename__ = "faculties"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class Department(Base, TimestampMixin):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id"), index=True)
    name: Mapped[str] = mapped_column(String(150))
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    head_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    resources_count: Mapped[int] = mapped_column(Integer, default=0)
    subjects_count: Mapped[int] = mapped_column(Integer, default=0)
    teachers_count: Mapped[int] = mapped_column(Integer, default=0)
    downloads_count: Mapped[int] = mapped_column(Integer, default=0)
    active_subject: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    has_new_materials: Mapped[bool] = mapped_column(Boolean, default=False)


class DepartmentMember(Base, TimestampMixin):
    __tablename__ = "department_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    position: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)


class Subject(Base, TimestampMixin):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    name: Mapped[str] = mapped_column(String(150))
    code: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    course: Mapped[int] = mapped_column(Integer, default=1)
    semester: Mapped[int] = mapped_column(Integer, default=1)


class DepartmentResource(Base, TimestampMixin):
    __tablename__ = "department_resources"

    id: Mapped[int] = mapped_column(primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    subject_id: Mapped[Optional[int]] = mapped_column(ForeignKey("subjects.id"), nullable=True)
    uploaded_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    author_name: Mapped[str] = mapped_column(String(150))
    course: Mapped[int] = mapped_column(Integer, default=1)
    semester: Mapped[int] = mapped_column(Integer, default=1)
    language: Mapped[str] = mapped_column(String(10), default="uz")
    material_type: Mapped[str] = mapped_column(String(80))
    format: Mapped[str] = mapped_column(String(20), default="PDF")
    status: Mapped[str] = mapped_column(String(40), default="draft", index=True)
    cover_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    visibility: Mapped[str] = mapped_column(String(40), default="department")
    download_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    online_read_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    academic_year: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    version_note: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    keywords: Mapped[list[str]] = mapped_column(JSON, default=list)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)


class ResourceFile(Base, TimestampMixin):
    __tablename__ = "resource_files"

    id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("department_resources.id"), index=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    content_type: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)


class ResourceVersion(Base, TimestampMixin):
    __tablename__ = "resource_versions"

    id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("department_resources.id"), index=True)
    version_label: Mapped[str] = mapped_column(String(60), default="v1")
    version_note: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)


class ResourceView(Base, TimestampMixin):
    __tablename__ = "resource_views"

    id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("department_resources.id"), index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)


class ResourceDownload(Base, TimestampMixin):
    __tablename__ = "resource_downloads"

    id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("department_resources.id"), index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)


class ResourceRating(Base, TimestampMixin):
    __tablename__ = "resource_ratings"

    id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("department_resources.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    rating: Mapped[float] = mapped_column(Float, default=5.0)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class ResourceComment(Base, TimestampMixin):
    __tablename__ = "resource_comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("department_resources.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    comment: Mapped[str] = mapped_column(Text)


class Author(Base, TimestampMixin):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True)


class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True)


class Book(Base, TimestampMixin):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id"), nullable=True)
    subject_id: Mapped[Optional[int]] = mapped_column(ForeignKey("subjects.id"), nullable=True)
    language: Mapped[str] = mapped_column(String(10), default="uz")
    format: Mapped[str] = mapped_column(String(40), default="Print")
    category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"), nullable=True)
    shelf_code: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)


class BookAuthor(Base, TimestampMixin):
    __tablename__ = "book_authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"), index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), index=True)


class Shelf(Base, TimestampMixin):
    __tablename__ = "shelves"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    code: Mapped[str] = mapped_column(String(60), unique=True)
    room: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)


class BookCopy(Base, TimestampMixin):
    __tablename__ = "book_copies"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"), index=True)
    barcode: Mapped[str] = mapped_column(String(120), unique=True)
    copy_number: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(40), default="available")
    shelf_id: Mapped[Optional[int]] = mapped_column(ForeignKey("shelves.id"), nullable=True)
    shelf_location: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)


class Reservation(Base, TimestampMixin):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    pickup_date: Mapped[date] = mapped_column(Date)
    pickup_time: Mapped[time] = mapped_column(Time)
    status: Mapped[str] = mapped_column(String(40), default="pending")
    qr_code: Mapped[str] = mapped_column(String(120))
    approved_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)


class Loan(Base, TimestampMixin):
    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(primary_key=True)
    reservation_id: Mapped[Optional[int]] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    book_copy_id: Mapped[Optional[int]] = mapped_column(ForeignKey("book_copies.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    issued_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    returned_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="active")
    renewal_count: Mapped[int] = mapped_column(Integer, default=0)
    fine_amount: Mapped[float] = mapped_column(Float, default=0.0)


class RenewalRequest(Base, TimestampMixin):
    __tablename__ = "renewal_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    loan_id: Mapped[int] = mapped_column(ForeignKey("loans.id"), index=True)
    status: Mapped[str] = mapped_column(String(40), default="pending")
    requested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    approved_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)


class Fine(Base, TimestampMixin):
    __tablename__ = "fines"

    id: Mapped[int] = mapped_column(primary_key=True)
    loan_id: Mapped[int] = mapped_column(ForeignKey("loans.id"), index=True)
    amount: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(40), default="unpaid")


class ReadingRoom(Base, TimestampMixin):
    __tablename__ = "reading_rooms"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150))
    floor: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    total_seats: Mapped[int] = mapped_column(Integer, default=0)


class Seat(Base, TimestampMixin):
    __tablename__ = "seats"

    id: Mapped[int] = mapped_column(primary_key=True)
    reading_room_id: Mapped[int] = mapped_column(ForeignKey("reading_rooms.id"), index=True)
    code: Mapped[str] = mapped_column(String(60))
    row_label: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    seat_number: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(40), default="available")


class SeatReservation(Base, TimestampMixin):
    __tablename__ = "seat_reservations"

    id: Mapped[int] = mapped_column(primary_key=True)
    seat_id: Mapped[int] = mapped_column(ForeignKey("seats.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    date: Mapped[date] = mapped_column(Date)
    start_time: Mapped[time] = mapped_column(Time)
    end_time: Mapped[time] = mapped_column(Time)
    status: Mapped[str] = mapped_column(String(40), default="reserved")
    qr_code: Mapped[str] = mapped_column(String(120))
    checked_in_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    checked_out_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class FaceEmbedding(Base, TimestampMixin):
    __tablename__ = "face_embeddings"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    embedding_hash: Mapped[str] = mapped_column(Text)
    liveness_status: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    consented: Mapped[bool] = mapped_column(Boolean, default=False)


class AISession(Base, TimestampMixin):
    __tablename__ = "ai_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)


class AIMessage(Base, TimestampMixin):
    __tablename__ = "ai_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("ai_sessions.id"), index=True)
    role: Mapped[str] = mapped_column(String(40))
    content: Mapped[str] = mapped_column(Text)


class AIQuery(Base, TimestampMixin):
    __tablename__ = "ai_queries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    query: Mapped[str] = mapped_column(Text)
    normalized_query: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    result_count: Mapped[int] = mapped_column(Integer, default=0)


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)


class Announcement(Base, TimestampMixin):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(255))
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class Setting(Base, TimestampMixin):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(120), unique=True)
    value: Mapped[str] = mapped_column(Text)
