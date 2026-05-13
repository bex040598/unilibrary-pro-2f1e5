from fastapi import APIRouter

from app.api.routes import ai, audit, auth, books, departments, face, loans, reading_rooms, reports, reservations, resources, users

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(departments.router, tags=["departments"])
api_router.include_router(resources.router, tags=["department-resources"])
api_router.include_router(books.router, tags=["books"])
api_router.include_router(reservations.router, tags=["reservations"])
api_router.include_router(loans.router, tags=["loans"])
api_router.include_router(reading_rooms.router, tags=["reading-rooms"])
api_router.include_router(face.router, tags=["face"])
api_router.include_router(ai.router, tags=["ai"])
api_router.include_router(reports.router, tags=["reports"])
api_router.include_router(audit.router, tags=["audit"])

