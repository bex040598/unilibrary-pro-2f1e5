from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    role: str = "student"
    full_name: str
    email: str
    password: str
    phone: str | None = None
    faculty_id: int | None = None
    department_id: int | None = None
    course: int | None = 1
    semester: int | None = 1
    student_id: str | None = None
    teacher_title: str | None = None
    consent_face_id: bool = False


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class UpdateUserRequest(BaseModel):
    phone: str | None = None
    avatar_url: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


class DepartmentCreateRequest(BaseModel):
    faculty_id: int
    name: str
    slug: str
    summary: str | None = None
    head_name: str | None = None


class DepartmentUpdateRequest(BaseModel):
    name: str | None = None
    slug: str | None = None
    summary: str | None = None
    head_name: str | None = None


class ResourceUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    subject_name: str | None = None
    course: int | None = None
    semester: int | None = None
    material_type: str | None = None
    language: str | None = None
    format: str | None = None
    visibility: str | None = None
    academic_year: str | None = None


class BookCreateRequest(BaseModel):
    title: str
    summary: str
    department_id: int | None = None
    subject_id: int | None = None
    language: str = "uz"
    format: str = "Print"
    category_name: str | None = None
    shelf_code: str | None = None
    authors: list[str] = Field(default_factory=list)
    total_copies: int = 1


class BookUpdateRequest(BaseModel):
    title: str | None = None
    summary: str | None = None
    language: str | None = None
    format: str | None = None
    shelf_code: str | None = None


class ReservationCreateRequest(BaseModel):
    book_id: int
    pickup_date: str
    pickup_time: str


class IssueLoanRequest(BaseModel):
    reservation_id: int
    due_days: int = 10


class SeatReservationCreateRequest(BaseModel):
    seat_id: int
    date: str
    start_time: str
    end_time: str


class AIQueryRequest(BaseModel):
    query: str
    locale: str | None = "uz"
    department_id: int | None = None


class CitationRequest(BaseModel):
    title: str
    author: str
    year: str = "2025/2026"
