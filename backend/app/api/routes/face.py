import hashlib

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models import FaceEmbedding, User
from app.services.audit import write_audit_log

router = APIRouter()


def make_embedding_hash(user_id: int, content: bytes) -> str:
    return hashlib.sha256(f"{user_id}".encode() + content).hexdigest()


@router.post("/face/register")
async def register_face(
    image: UploadFile = File(...),
    consent: str = Form("false"),
    liveness_check: str = Form("placeholder"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    content = await image.read()
    embedding_hash = make_embedding_hash(current_user.id, content)
    face_embedding = db.scalar(select(FaceEmbedding).where(FaceEmbedding.user_id == current_user.id))
    if not face_embedding:
        face_embedding = FaceEmbedding(user_id=current_user.id, embedding_hash=embedding_hash, liveness_status=liveness_check, consented=consent.lower() == "true")
        db.add(face_embedding)
    else:
        face_embedding.embedding_hash = embedding_hash
        face_embedding.consented = consent.lower() == "true"
        face_embedding.liveness_status = liveness_check
    current_user.face_id_enabled = True
    db.commit()
    write_audit_log(db, "face.register", "Registered face embedding", current_user.id)
    return {"data": {"enabled": True}, "message": "Face ID faollashtirildi"}


@router.post("/face/verify")
async def verify_face(image: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    content = await image.read()
    face_embedding = db.scalar(select(FaceEmbedding).where(FaceEmbedding.user_id == current_user.id))
    if not face_embedding:
        raise HTTPException(status_code=404, detail="Face ID not registered")
    verified = bool(content) and current_user.face_id_enabled
    write_audit_log(db, "face.verify", f"Verified={verified}", current_user.id)
    return {"data": {"verified": verified, "message": "Verification placeholder success" if verified else "Verification failed"}}


@router.get("/face/status")
def face_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    face_embedding = db.scalar(select(FaceEmbedding).where(FaceEmbedding.user_id == current_user.id))
    return {"data": {"enabled": bool(face_embedding), "updated_at": face_embedding.updated_at.isoformat() if face_embedding else None}}


@router.delete("/face/remove")
def remove_face(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    face_embedding = db.scalar(select(FaceEmbedding).where(FaceEmbedding.user_id == current_user.id))
    if face_embedding:
        db.delete(face_embedding)
    current_user.face_id_enabled = False
    db.commit()
    write_audit_log(db, "face.remove", "Removed face embedding", current_user.id)
    return {"data": {"removed": True}}

