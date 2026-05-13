# Deployment

## Docker Compose

The repository includes a root `docker-compose.yml` for PostgreSQL-backed local deployment.

## Nginx

- Proxy frontend static build or Vite preview on `/`.
- Proxy FastAPI on `/api` or directly on the desired internal host.
- Enable HTTPS so Face ID camera access works outside localhost.

## Environment

Frontend:

- `VITE_API_BASE_URL`

Backend:

- `APP_NAME`
- `JWT_SECRET_KEY`
- `JWT_REFRESH_SECRET_KEY`
- `DATABASE_URL`
- `AUTO_CREATE_TABLES`
- `AUTO_SEED`
- `CORS_ORIGINS`

## Backup

- Schedule PostgreSQL logical backups with `pg_dump`.
- Persist uploaded assets and database volumes outside the application container.

## Monitoring

- Watch audit logs, AI query volume, overdue loans, and reading room occupancy.
- Add reverse proxy access logs and health checks for uptime reporting.

