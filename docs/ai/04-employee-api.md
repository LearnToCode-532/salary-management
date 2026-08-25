# AI Prompt — Employee Management API

## Purpose

This prompt was used to implement the employee management REST API.

Existing project context is documented in:

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/database-design.md`
- `docs/tradeoffs.md`
- `docs/ai/01-project-foundation.md`
- `docs/ai/02-postgresql-flyway.md`
- `docs/ai/03-employee-domain.md`

## Prompt

```text
Continue the ACME Salary Management project from the existing
employee domain implementation.

Implement the Employee management REST API.

Required endpoints:

POST   /api/v1/employees
GET    /api/v1/employees/{id}
GET    /api/v1/employees
PUT    /api/v1/employees/{id}

Requirements:

1. Use request and response DTOs.
2. Do not expose JPA entities through REST APIs.
3. Validate incoming request data.
4. Use pagination for employee listing.
5. Do not return all 10,000 employees in a single unbounded query.
6. employeeCode should be immutable after creation.
7. Prevent duplicate employee codes and emails.
8. Use a service layer between controllers and repositories.
9. Add meaningful unit tests for core service behavior.
10. Add controller tests for HTTP behavior and validation.
11. Keep tests fast and deterministic.
12. Do not implement salary history yet.
13. Do not implement authentication yet.
14. Do not add unnecessary infrastructure.

Review the implementation for correctness, maintainability,
validation, error handling, and test quality before finishing.