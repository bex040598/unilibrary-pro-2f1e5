from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import AIQuery, Book, Department, DepartmentResource, Subject
from app.services.serializers import serialize_book, serialize_resource


CYRILLIC_TO_LATIN = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "j", "з": "z",
    "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r",
    "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x", "ц": "s", "ч": "ch", "ш": "sh", "щ": "sh",
    "ъ": "", "ы": "i", "ь": "", "э": "e", "ю": "yu", "я": "ya", "қ": "q", "ғ": "g'", "ў": "o'",
    "ҳ": "h",
}


def normalize_query_text(query: str) -> str:
    lowered = query.lower().strip()
    return "".join(CYRILLIC_TO_LATIN.get(char, char) for char in lowered)


def search_sources(db: Session, query: str, department_id: int | None = None) -> list[dict]:
    normalized = normalize_query_text(query)
    resource_filters = [
        DepartmentResource.title.ilike(f"%{query}%"),
        DepartmentResource.description.ilike(f"%{query}%"),
        DepartmentResource.author_name.ilike(f"%{query}%"),
    ]
    if department_id:
        resource_filters.append(DepartmentResource.department_id == department_id)

    matched_resources = db.scalars(select(DepartmentResource).where(or_(*resource_filters)).limit(5)).all()
    matched_books = db.scalars(select(Book).where(or_(Book.title.ilike(f"%{query}%"), Book.summary.ilike(f"%{query}%"))).limit(3)).all()

    payload = []
    for resource in matched_resources:
        serialized = serialize_resource(db, resource)
        payload.append({
            "id": serialized["id"],
            "title": serialized["title"],
            "department": serialized["department_name"],
            "subject": serialized["subject_name"],
            "author": serialized["author_name"],
            "format": serialized["format"],
            "citation": f'{serialized["author_name"]}. ({serialized["academic_year"]}). {serialized["title"]}. ATMU Smart UniLibrary.'
        })

    for book in matched_books:
        serialized_book = serialize_book(db, book)
        payload.append({
            "id": 1000 + serialized_book["id"],
            "title": serialized_book["title"],
            "department": serialized_book["department_name"],
            "subject": serialized_book["subject_name"],
            "author": ", ".join(serialized_book["author_names"]),
            "format": serialized_book["format"],
            "citation": f'{", ".join(serialized_book["author_names"])}. {serialized_book["title"]}. ATMU Library Collection.'
        })

    db.add(AIQuery(user_id=None, query=query, normalized_query=normalized, result_count=len(payload)))
    db.commit()
    return payload


def build_ai_answer(db: Session, query: str, department_id: int | None = None) -> dict:
    sources = search_sources(db, query, department_id)
    answer = (
        f'So‘rov: "{query}". '
        f'Tizim katalog, kafedra resurslari va bog‘liq fanlar bo‘yicha {len(sources)} ta mos manba topdi. '
        "Natijalarda material turi, muallif, format va citation ko‘rsatildi."
    )
    return {"answer": answer, "sources": sources}

