from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_optional_current_user
from app.models import User
from app.schemas.common import AIQueryRequest, CitationRequest
from app.services.ai import build_ai_answer, normalize_query_text, search_sources

router = APIRouter()


@router.post("/ai/chat")
def ai_chat(payload: AIQueryRequest, db: Session = Depends(get_db), current_user: User | None = Depends(get_optional_current_user)) -> dict:
    return build_ai_answer(db, payload.query, payload.department_id)


@router.post("/ai/search")
def ai_search(payload: AIQueryRequest, db: Session = Depends(get_db)) -> dict:
    return {"data": search_sources(db, payload.query, payload.department_id)}


@router.post("/ai/recommend")
def ai_recommend(payload: AIQueryRequest, db: Session = Depends(get_db)) -> dict:
    return {"data": search_sources(db, payload.query or "recommended", payload.department_id)[:3]}


@router.post("/ai/department-search")
def ai_department_search(payload: AIQueryRequest, db: Session = Depends(get_db)) -> dict:
    return {"data": search_sources(db, payload.query, payload.department_id)}


@router.post("/ai/citation")
def ai_citation(payload: CitationRequest) -> dict:
    return {"data": {"citation": f'{payload.author}. ({payload.year}). {payload.title}. ATMU Smart UniLibrary.'}}


@router.post("/ai/normalize-query")
def ai_normalize_query(payload: AIQueryRequest) -> dict:
    return {"data": {"normalized_query": normalize_query_text(payload.query)}}
