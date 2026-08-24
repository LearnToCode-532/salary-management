# AI Prompt — PostgreSQL & Flyway Setup

## 1. Purpose

This prompt was used to configure PostgreSQL and Flyway after the
initial Spring Boot project foundation was established.

For project context, technology choices, AI workflow, and general
engineering principles, refer to:

- `docs/ai/01-project-foundation.md`
- `docs/requirements.md`
- `docs/architecture.md`
- `docs/database-design.md`

---

## 2. Prompt

```text
Continue the ACME Salary Management project from the existing
Spring Boot foundation.

Refer to the existing project documentation before making changes,
especially:

- docs/requirements.md
- docs/architecture.md
- docs/database-design.md
- docs/tradeoffs.md
- docs/performance.md
- docs/ai/01-project-foundation.md

Configure the backend for local PostgreSQL development.

Requirements:

1. Use PostgreSQL as the application database.
2. Provide a Docker Compose configuration for PostgreSQL.
3. Configure Spring Boot using application.properties.
4. Use a dedicated local-development database, username and password.
5. Configure Spring Data JPA/Hibernate to validate the database
   schema rather than automatically modifying it.
6. Configure Flyway for database schema management.
7. Keep database credentials suitable only for local development.
8. Do not create business tables yet.
9. Do not manually modify the PostgreSQL schema.
10. Do not introduce Redis, Kafka, Kubernetes, microservices,
    or other infrastructure.
11. Add only the configuration required for this phase.
12. Preserve the existing project structure and conventions.

After implementation, provide commands to:

- Start PostgreSQL.
- Verify the PostgreSQL container.
- Run the Spring Boot application.
- Run the test suite.
- Verify the application health endpoint.

Do not implement employee or salary functionality yet.