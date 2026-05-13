from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.db import Base, SessionLocal, engine
from app.services.seed import seed_database

settings = get_settings()

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.api_prefix)


@app.on_event("startup")
def startup_event() -> None:
    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)
    if settings.auto_seed:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()


@app.get("/")
def root() -> dict:
    return {"message": "ATMU Smart UniLibrary API is running", "docs": "/docs"}

