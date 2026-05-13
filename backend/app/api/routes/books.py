from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import require_roles
from app.models import Author, Book, BookAuthor, BookCopy, Category, User
from app.schemas.common import BookCreateRequest, BookUpdateRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_book

router = APIRouter()


def get_or_create_author(db: Session, name: str) -> Author:
    author = db.scalar(select(Author).where(Author.name == name))
    if author:
        return author
    author = Author(name=name)
    db.add(author)
    db.flush()
    return author


def get_or_create_category(db: Session, name: str | None) -> Category | None:
    if not name:
        return None
    category = db.scalar(select(Category).where(Category.name == name))
    if category:
        return category
    category = Category(name=name, slug=name.lower().replace(" ", "-"))
    db.add(category)
    db.flush()
    return category


@router.get("/books")
def list_books(db: Session = Depends(get_db)) -> list[dict]:
    return [serialize_book(db, book) for book in db.scalars(select(Book).order_by(Book.id)).all()]


@router.post("/books")
def create_book(payload: BookCreateRequest, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    category = get_or_create_category(db, payload.category_name)
    book = Book(
        title=payload.title,
        summary=payload.summary,
        department_id=payload.department_id,
        subject_id=payload.subject_id,
        language=payload.language,
        format=payload.format,
        category_id=category.id if category else None,
        shelf_code=payload.shelf_code,
    )
    db.add(book)
    db.flush()
    for author_name in payload.authors:
        author = get_or_create_author(db, author_name)
        db.add(BookAuthor(book_id=book.id, author_id=author.id))
    for copy_number in range(1, payload.total_copies + 1):
        db.add(BookCopy(book_id=book.id, barcode=f"BC-{book.id}-{copy_number}", copy_number=copy_number, status="available", shelf_location="Central Library"))
    db.commit()
    db.refresh(book)
    write_audit_log(db, "books.create", book.title, current_user.id)
    return serialize_book(db, book)


@router.get("/books/{book_id}")
def get_book(book_id: int, db: Session = Depends(get_db)) -> dict:
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return serialize_book(db, book)


@router.patch("/books/{book_id}")
def update_book(book_id: int, payload: BookUpdateRequest, current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    write_audit_log(db, "books.update", book.title, current_user.id)
    return serialize_book(db, book)


@router.delete("/books/{book_id}")
def delete_book(book_id: int, current_user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)) -> dict:
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    write_audit_log(db, "books.delete", f"Deleted book {book_id}", current_user.id)
    return {"data": {"success": True}}


@router.get("/books/{book_id}/availability")
def book_availability(book_id: int, db: Session = Depends(get_db)) -> dict:
    copies = db.scalars(select(BookCopy).where(BookCopy.book_id == book_id)).all()
    available = len([copy for copy in copies if copy.status == "available"])
    return {"data": {"available_copies": available, "total_copies": len(copies)}}

