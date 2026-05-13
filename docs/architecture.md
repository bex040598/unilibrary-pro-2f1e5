# Architecture

## Users

- `student`: accesses loans, reservations, reading room bookings, saved materials, and AI recommendations.
- `teacher`: uploads department resources and tracks approval statuses.
- `department`: reviews department resources and analytics.
- `librarian`: manages approvals, reservations, loans, reading room operations, and audit visibility.
- `admin`: oversees users, roles, reports, AI logs, and system health.

## Presentation Layer

- Vite + React + TypeScript frontend.
- Locale-first routes: `/:locale/...`
- Premium glassmorphism portal UI with hero, dashboards, and department library surfaces.

## Application Layer

- FastAPI route modules for auth, profile, departments, resources, books, reservations, loans, reading rooms, Face ID, AI, reports, and audit logs.
- Role-aware access controls through JWT and RBAC dependencies.
- AI helpers that search books and department resources and format source cards.

## Data Layer

- SQLAlchemy models define the full library, department, AI, and audit schema.
- SQLite is the default runtime database for immediate local startup.
- PostgreSQL is the target deployment database through `DATABASE_URL`.
- Alembic migration entrypoint is included in `backend/alembic`.

## Integration Layer

- REST API consumed by `frontend/src/lib/api.ts`.
- Frontend auth provider stores tokens locally and calls `/auth/me` for session restoration.
- Face ID uses multipart upload against `/face/register` and `/face/verify`.

## Security Layer

- Access and refresh JWT tokens.
- Password hashing through `pbkdf2_sha256`.
- Role-restricted operations for approvals, reports, and audit visibility.
- Biometric consent stored separately from raw image capture.

## Infrastructure Layer

- Local development via `npm run dev` and `uvicorn`.
- Docker Compose targets PostgreSQL-backed deployment.
- Swagger docs exposed at `/docs`.

## Workflows

- Register -> auto login -> `/auth/me` -> role dashboard redirect.
- Teacher upload -> `draft` -> `pending_review` -> librarian/department approval.
- Student reservation -> librarian approval -> picked up -> loan created -> due/renew/return cycle.
- Reading room seat booking -> QR confirmation -> check-in/check-out.
- AI query -> normalization -> source lookup -> source cards response.

