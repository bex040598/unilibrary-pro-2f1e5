from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import require_roles
from app.models import AuditLog, User

router = APIRouter()


@router.get("/audit-logs")
def audit_logs(current_user: User = Depends(require_roles("admin", "librarian")), db: Session = Depends(get_db)) -> dict:
    items = db.scalars(select(AuditLog).order_by(AuditLog.id.desc()).limit(100)).all()
    return {"data": [{"id": item.id, "user_id": item.user_id, "action": item.action, "details": item.details, "created_at": item.created_at.isoformat()} for item in items]}

