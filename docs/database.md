# Database

## Core Identity

- `users`
- `roles`
- `user_roles`
- `user_sessions`
- `students`
- `teachers`
- `librarians`

## Academic Structure

- `faculties`
- `departments`
- `department_members`
- `subjects`

## Resource Library

- `department_resources`
- `resource_files`
- `resource_versions`
- `resource_views`
- `resource_downloads`
- `resource_ratings`
- `resource_comments`

## Book Circulation

- `books`
- `authors`
- `book_authors`
- `categories`
- `book_copies`
- `shelves`
- `reservations`
- `loans`
- `renewal_requests`
- `fines`

## Reading Room

- `reading_rooms`
- `seats`
- `seat_reservations`

## AI, Face ID, Notifications, Audit

- `face_embeddings`
- `ai_sessions`
- `ai_messages`
- `ai_queries`
- `notifications`
- `announcements`
- `audit_logs`
- `settings`

## Notes

- Default runtime uses SQLite for immediate local startup.
- PostgreSQL is supported through the `DATABASE_URL` setting.
- The initial Alembic migration creates all tables from SQLAlchemy metadata.

