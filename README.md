# ATMU Smart UniLibrary

ATMU Smart UniLibrary is a premium electronic library ecosystem for Axborot texnologiyalari va menejment universiteti. The platform combines department-specific electronic libraries, a university-wide catalog, book reservations, loan tracking, reading room seat booking, Face ID capture, AI librarian search, and role-based dashboards.

## What Is Included

- Premium multilingual frontend built with Vite, React, TypeScript, and locale-based routes.
- FastAPI backend with JWT authentication, RBAC, Swagger docs, audit logs, seed data, and workflow endpoints.
- Department library hub for six ATMU departments across two faculties.
- Resource upload and approval workflow for teacher, department, and librarian roles.
- Book reservation, loan, renewal request, and reading room seat reservation flows.
- Face ID capture UI with camera permission handling and multipart upload to the backend.
- AI librarian endpoints that return source cards from books and department resources.

## Project Structure

- `frontend/`: UI application, components, messages, styles, and API client.
- `backend/`: FastAPI service, SQLAlchemy models, Alembic migration, and seed logic.
- `docs/`: Architecture, API, database, and deployment documents.

## Frontend Run

```bash
cd frontend
npm install
npm run dev
```

Frontend build:

```bash
npm run build
```

## Backend Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Swagger URL:

- [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Database Setup

Default local runtime uses `sqlite:///./unilibrary.db` so the project can start immediately.

For PostgreSQL, copy `backend/.env.example` to `backend/.env` and set:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/atmu_unilibrary
AUTO_CREATE_TABLES=true
AUTO_SEED=true
```

## Migration

```bash
cd backend
.venv\Scripts\alembic upgrade head
```

## Seed Data

Seed data runs automatically on backend startup when `AUTO_SEED=true`.

## Test Logins

- `admin@atmu.uz / Admin123!`
- `student@atmu.uz / Student123!`
- `teacher@atmu.uz / Teacher123!`
- `librarian@atmu.uz / Librarian123!`
- `department@atmu.uz / Department123!`

## Integration Notes

- Frontend backend URL is taken from `frontend/.env.example` through `VITE_API_BASE_URL`.
- Register auto-logs in by storing returned tokens and redirecting to the role dashboard.
- Header avatar dropdown appears after successful login or register.

## Deploy

- Review [docs/deployment.md](/C:/Users/User/OneDrive/Документы/New%20project%2011/docs/deployment.md)
- Review [docs/architecture.md](/C:/Users/User/OneDrive/Документы/New%20project%2011/docs/architecture.md)
- Review [docs/api.md](/C:/Users/User/OneDrive/Документы/New%20project%2011/docs/api.md)
- Review [docs/database.md](/C:/Users/User/OneDrive/Документы/New%20project%2011/docs/database.md)

## Render Blueprint

This repository now includes a root `render.yaml` for Render Blueprint deployment:

- `atmu-unilibrary-api`: FastAPI web service
- `atmu-unilibrary-web`: static frontend
- `atmu-unilibrary-db`: Render Postgres

Blueprint notes:

- Frontend build uses `scripts/render-frontend-build.mjs` to derive `VITE_API_BASE_URL` from the backend service host.
- Backend runs `alembic upgrade head` before deploy.
- Backend CORS is opened with `*` for first live deployment simplicity.

Latest official references used for this setup:

- [Blueprint YAML Reference](https://render.com/docs/blueprint-spec)
- [Deploy a FastAPI App](https://render.com/docs/deploy-fastapi)
- [Static Sites](https://render.com/docs/static-sites/)
- [Static Site Redirects and Rewrites](https://render.com/docs/redirects-rewrites)
- [Render Postgres](https://render.com/docs/postgresql)
- [Deploy for Free](https://render.com/docs/free)

## Netlify Frontend Deploy

The repository also includes `netlify.toml` for deploying the frontend to Netlify.

Required Netlify environment variable:

- `VITE_API_BASE_URL`

Example:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

Important:

- Netlify is configured only for the frontend static site.
- The FastAPI backend still needs to run on a public backend host such as Render.
