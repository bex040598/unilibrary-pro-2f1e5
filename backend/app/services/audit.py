from sqlalchemy.orm import Session

from app.models import AuditLog


def write_audit_log(db: Session, action: str, details: str | None = None, user_id: int | None = None) -> None:
    entry = AuditLog(user_id=user_id, action=action, details=details)
    db.add(entry)
    db.commit()

