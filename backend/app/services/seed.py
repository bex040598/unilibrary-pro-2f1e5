from __future__ import annotations

from datetime import UTC, date, datetime, time, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import (
    Announcement,
    Author,
    Book,
    BookAuthor,
    BookCopy,
    Category,
    Department,
    DepartmentResource,
    Faculty,
    Librarian,
    Loan,
    ReadingRoom,
    Reservation,
    ResourceRating,
    Role,
    Seat,
    Student,
    Subject,
    Teacher,
    User,
    UserRole,
)


def seed_database(db: Session) -> None:
    if db.scalar(select(User.id).limit(1)):
        return

    roles = {}
    for role_name in ["admin", "student", "teacher", "librarian", "department"]:
        role = Role(name=role_name, description=f"{role_name} role")
        db.add(role)
        db.flush()
        roles[role_name] = role

    faculty_tech = Faculty(name="Raqamli texnologiyalar fakulteti", slug="raqamli-texnologiyalar", summary="Digital technology programs")
    faculty_social = Faculty(name="Ijtimoiy fanlar fakulteti", slug="ijtimoiy-fanlar", summary="Humanities and social sciences")
    db.add_all([faculty_tech, faculty_social])
    db.flush()

    departments = [
        Department(
            faculty_id=faculty_tech.id,
            name="Axborot texnologiyalari kafedrasi",
            slug="axborot-texnologiyalari",
            summary="Sun’iy intellekt, dasturlash, ma’lumotlar bazasi va kiberxavfsizlik resurslari.",
            head_name="DSc. Dilorom Karimova",
            resources_count=184,
            subjects_count=22,
            teachers_count=17,
            downloads_count=16320,
            active_subject="Ma’lumotlar bazasi",
            has_new_materials=True,
        ),
        Department(
            faculty_id=faculty_tech.id,
            name="Iqtisodiyot kafedrasi",
            slug="iqtisodiyot",
            summary="Moliyaviy tahlil, menejment va iqtisodiy modellashtirish resurslari.",
            head_name="PhD. Bekzod Rasulov",
            resources_count=127,
            subjects_count=18,
            teachers_count=12,
            downloads_count=11480,
            active_subject="Mikroiqtisodiyot",
            has_new_materials=True,
        ),
        Department(
            faculty_id=faculty_tech.id,
            name="Matematika kafedrasi",
            slug="matematika",
            summary="Oliy matematika, statistika va analitik modellar.",
            head_name="Dots. Nilufar Abdullayeva",
            resources_count=93,
            subjects_count=14,
            teachers_count=9,
            downloads_count=8420,
            active_subject="Ehtimollar nazariyasi",
            has_new_materials=False,
        ),
        Department(
            faculty_id=faculty_social.id,
            name="Filologiya kafedrasi",
            slug="filologiya",
            summary="Tilshunoslik va akademik yozuv resurslari.",
            head_name="PhD. Mohira Xudoyberdiyeva",
            resources_count=88,
            subjects_count=12,
            teachers_count=8,
            downloads_count=6570,
            active_subject="Akademik yozuv",
            has_new_materials=True,
        ),
        Department(
            faculty_id=faculty_social.id,
            name="Tarix kafedrasi",
            slug="tarix",
            summary="Tarixiy resurslar bazasi.",
            head_name="Prof. Abdumalik Turg‘unov",
            resources_count=76,
            subjects_count=11,
            teachers_count=7,
            downloads_count=4890,
            active_subject="O‘zbekiston tarixi",
            has_new_materials=False,
        ),
        Department(
            faculty_id=faculty_social.id,
            name="Pedagogika kafedrasi",
            slug="pedagogika",
            summary="Ta’lim metodikasi va pedagogik texnologiyalar resurslari.",
            head_name="Dots. Shaxnoza Mamatova",
            resources_count=102,
            subjects_count=16,
            teachers_count=10,
            downloads_count=7030,
            active_subject="Ta’lim metodikasi",
            has_new_materials=True,
        ),
    ]
    db.add_all(departments)
    db.flush()

    users = [
        User(full_name="ATMU Administrator", email="admin@atmu.uz", password_hash=hash_password("Admin123!"), role_name="admin"),
        User(full_name="Azizbek Talaba", email="student@atmu.uz", password_hash=hash_password("Student123!"), role_name="student", faculty_id=faculty_tech.id, department_id=departments[0].id, phone="+998901112233", student_id="ST-24001"),
        User(full_name="Aziza Yuldasheva", email="teacher@atmu.uz", password_hash=hash_password("Teacher123!"), role_name="teacher", faculty_id=faculty_tech.id, department_id=departments[0].id, teacher_title="Senior Lecturer"),
        User(full_name="Kutubxonachi Malika", email="librarian@atmu.uz", password_hash=hash_password("Librarian123!"), role_name="librarian", faculty_id=faculty_tech.id),
        User(full_name="Dilorom Karimova", email="department@atmu.uz", password_hash=hash_password("Department123!"), role_name="department", faculty_id=faculty_tech.id, department_id=departments[0].id, teacher_title="Department Head"),
    ]
    db.add_all(users)
    db.flush()

    for user in users:
        db.add(UserRole(user_id=user.id, role_id=roles[user.role_name].id))

    db.add(Student(user_id=users[1].id, faculty_id=faculty_tech.id, department_id=departments[0].id, course=2, semester=4))
    db.add(Teacher(user_id=users[2].id, faculty_id=faculty_tech.id, department_id=departments[0].id, title="Senior Lecturer"))
    db.add(Librarian(user_id=users[3].id, badge_code="LIB-01"))
    db.add(Teacher(user_id=users[4].id, faculty_id=faculty_tech.id, department_id=departments[0].id, title="Department Head"))

    subjects = [
        Subject(department_id=departments[0].id, name="Ma’lumotlar bazasi", code="DB201", course=2, semester=4),
        Subject(department_id=departments[0].id, name="Kiberxavfsizlik", code="SEC301", course=3, semester=5),
        Subject(department_id=departments[1].id, name="Mikroiqtisodiyot", code="EC101", course=1, semester=2),
        Subject(department_id=departments[3].id, name="Akademik yozuv", code="PH204", course=2, semester=3),
    ]
    db.add_all(subjects)
    db.flush()

    resources = [
        DepartmentResource(
            department_id=departments[0].id,
            subject_id=subjects[0].id,
            uploaded_by_id=users[2].id,
            title="Ma’lumotlar bazasi: 2-kurs laboratoriya ishlari",
            description="SQL, indekslash, tranzaksiyalar va ORM asosida ishlab chiqilgan laboratoriya to‘plami.",
            author_name="Aziza Yuldasheva",
            course=2,
            semester=4,
            language="uz",
            material_type="Laboratoriya ishi",
            format="PDF",
            status="approved",
            academic_year="2025/2026",
            keywords=["sql", "orm", "postgresql"],
            tags=["lab", "db", "backend"],
        ),
        DepartmentResource(
            department_id=departments[0].id,
            subject_id=subjects[1].id,
            uploaded_by_id=users[2].id,
            title="Kiberxavfsizlik bo‘yicha o‘zbekcha darslik",
            description="Tarmoq xavfsizligi, autentifikatsiya va risklarni boshqarish bo‘yicha asosiy o‘quv qo‘llanma.",
            author_name="Aziza Yuldasheva",
            course=3,
            semester=5,
            language="uz",
            material_type="Darslik",
            format="PDF",
            status="approved",
            academic_year="2025/2026",
            keywords=["security", "auth", "risk"],
            tags=["cyber", "textbook"],
        ),
        DepartmentResource(
            department_id=departments[1].id,
            subject_id=subjects[2].id,
            uploaded_by_id=users[4].id,
            title="Mikroiqtisodiyot bo‘yicha case study to‘plami",
            description="Talab, taklif va narx elastikligi bo‘yicha mahalliy biznes misollari.",
            author_name="Bekzod Rasulov",
            course=1,
            semester=2,
            language="uz",
            material_type="Amaliy mashg‘ulot",
            format="DOCX",
            status="pending_review",
            academic_year="2025/2026",
            keywords=["elasticity", "market", "cases"],
            tags=["economy", "practice"],
        ),
        DepartmentResource(
            department_id=departments[3].id,
            subject_id=subjects[3].id,
            uploaded_by_id=users[4].id,
            title="Akademik yozuv: iqtibos va bibliografiya",
            description="APA, MLA va Chicago uslublariga mos yozuv va citation qo‘llanmasi.",
            author_name="Mahliyo Rahmonova",
            course=2,
            semester=3,
            language="en",
            material_type="Metodik qo‘llanma",
            format="PDF",
            status="approved",
            academic_year="2025/2026",
            keywords=["citation", "writing", "apa"],
            tags=["style", "methodology"],
        ),
    ]
    db.add_all(resources)
    db.flush()
    db.add(ResourceRating(resource_id=resources[0].id, user_id=users[1].id, rating=4.8, comment="Juda foydali"))
    db.add(ResourceRating(resource_id=resources[1].id, user_id=users[1].id, rating=4.9, comment="Kuchli darslik"))

    category = Category(name="Computer Science", slug="computer-science")
    db.add(category)
    db.flush()
    authors = [Author(name="Carlos Coronel"), Author(name="Steven Morris"), Author(name="Shavkat Raximov"), Author(name="N. Gregory Mankiw")]
    db.add_all(authors)
    db.flush()

    books = [
        Book(title="Advanced Database Systems", summary="Transaction processing, distributed systems, and normalization patterns.", department_id=departments[0].id, subject_id=subjects[0].id, language="en", format="Print + PDF", category_id=category.id, shelf_code="AT-DB-204"),
        Book(title="Kiberxavfsizlik asoslari", summary="Threat modeling, identity protection, and secure campus infrastructure.", department_id=departments[0].id, subject_id=subjects[1].id, language="uz", format="Print", category_id=category.id, shelf_code="AT-SEC-118"),
        Book(title="Principles of Microeconomics", summary="Market equilibrium, elasticity, incentives, and macro connections.", department_id=departments[1].id, subject_id=subjects[2].id, language="en", format="Print + EPUB", category_id=category.id, shelf_code="IQ-MIC-101"),
    ]
    db.add_all(books)
    db.flush()

    db.add_all([
        BookAuthor(book_id=books[0].id, author_id=authors[0].id),
        BookAuthor(book_id=books[0].id, author_id=authors[1].id),
        BookAuthor(book_id=books[1].id, author_id=authors[2].id),
        BookAuthor(book_id=books[2].id, author_id=authors[3].id),
    ])

    copy_specs = [(books[0].id, 5), (books[1].id, 4), (books[2].id, 3)]
    for book_id, count in copy_specs:
        for copy_number in range(1, count + 1):
            status = "available"
            if book_id == books[1].id and copy_number == 1:
                status = "reserved"
            db.add(BookCopy(book_id=book_id, barcode=f"BC-{book_id}-{copy_number}", copy_number=copy_number, status=status, shelf_location="Central Library"))

    reservation = Reservation(book_id=books[0].id, user_id=users[1].id, pickup_date=date.today() + timedelta(days=1), pickup_time=time(hour=10), status="approved", qr_code="QR-ATMU-001", approved_by_id=users[3].id)
    db.add(reservation)
    db.flush()

    db.add(Loan(reservation_id=reservation.id, book_copy_id=1, user_id=users[1].id, issued_by_id=users[3].id, issued_at=datetime.now(UTC) - timedelta(days=2), due_at=datetime.now(UTC) + timedelta(days=8), status="active", renewal_count=0, fine_amount=0))

    rooms = [
        ReadingRoom(name="Markaziy o‘quv zali", floor="2-qavat", total_seats=30),
        ReadingRoom(name="IT quiet zone", floor="3-qavat", total_seats=18),
    ]
    db.add_all(rooms)
    db.flush()

    for room in rooms:
        total = room.total_seats
        row_labels = ["A", "B", "C", "D", "E", "F"]
        for index in range(total):
            db.add(
                Seat(
                    reading_room_id=room.id,
                    code=f"{row_labels[index // 6]}-{(index % 6) + 1}",
                    row_label=row_labels[index // 6],
                    seat_number=(index % 6) + 1,
                    status="reserved" if index % 7 == 0 else "occupied" if index % 11 == 0 else "available",
                )
            )

    db.add_all([
        Announcement(title="ATMU digital resource week", body="Kutubxona fondini raqamlashtirish bo‘yicha amaliy seminar."),
        Announcement(title="Extended reading room hours", body="Oraliq nazoratlar davrida o‘quv zali 22:00 gacha ishlaydi."),
    ])
    db.commit()
