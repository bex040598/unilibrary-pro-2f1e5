# API

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Profile

- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/password`
- `GET /users/me/activity`
- `GET /users/me/library-summary`

## Departments

- `GET /faculties`
- `GET /departments`
- `POST /departments`
- `GET /departments/{id}`
- `PATCH /departments/{id}`
- `GET /departments/{id}/statistics`
- `GET /departments/{id}/resources`

## Department Resources

- `GET /department-resources`
- `POST /department-resources`
- `GET /department-resources/{id}`
- `PATCH /department-resources/{id}`
- `POST /department-resources/{id}/submit`
- `PATCH /department-resources/{id}/approve`
- `PATCH /department-resources/{id}/reject`
- `PATCH /department-resources/{id}/request-revision`
- `PATCH /department-resources/{id}/archive`
- `POST /department-resources/{id}/view`
- `POST /department-resources/{id}/download`

## Books

- `GET /books`
- `POST /books`
- `GET /books/{id}`
- `PATCH /books/{id}`
- `DELETE /books/{id}`
- `GET /books/{id}/availability`

## Reservations

- `POST /reservations`
- `GET /reservations/my`
- `GET /reservations`
- `PATCH /reservations/{id}/approve`
- `PATCH /reservations/{id}/reject`
- `PATCH /reservations/{id}/cancel`
- `PATCH /reservations/{id}/mark-picked-up`

## Loans

- `POST /loans/issue`
- `POST /loans/{id}/return`
- `GET /loans/my`
- `GET /loans/due-today`
- `GET /loans/overdue`
- `POST /loans/{id}/renew-request`

## Reading Rooms

- `GET /reading-rooms`
- `GET /reading-rooms/{id}/seats`
- `POST /seat-reservations`
- `GET /seat-reservations/my`
- `PATCH /seat-reservations/{id}/check-in`
- `PATCH /seat-reservations/{id}/check-out`
- `PATCH /seat-reservations/{id}/cancel`

## Face

- `POST /face/register`
- `POST /face/verify`
- `GET /face/status`
- `DELETE /face/remove`

## AI

- `POST /ai/chat`
- `POST /ai/search`
- `POST /ai/recommend`
- `POST /ai/department-search`
- `POST /ai/citation`
- `POST /ai/normalize-query`

## Reports And Audit

- `GET /reports/library`
- `GET /reports/departments`
- `GET /reports/loans`
- `GET /reports/reading-room`
- `GET /reports/users`
- `GET /audit-logs`

