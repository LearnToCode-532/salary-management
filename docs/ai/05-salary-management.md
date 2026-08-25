# AI Prompt — Salary Management & Salary History

## Purpose

This prompt was used to design and implement salary management and
salary history functionality.

The existing project context and conventions are documented in:

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/database-design.md`
- `docs/tradeoffs.md`

Previous implementation prompts:

- `docs/ai/01-project-foundation.md`
- `docs/ai/02-postgresql-flyway.md`
- `docs/ai/03-employee-domain.md`
- `docs/ai/04-employee-api.md`

---

## Prompt

```text
Continue the ACME Salary Management project from the existing
Employee domain and Employee REST API implementation.

First review the existing project structure and documentation.
Do not duplicate or change established conventions without a
specific reason.

Implement salary management and append-only salary history.

Business requirements:

1. Each employee has a current salary and currency.
2. Salary changes must be recorded in an append-only salary_history
   table.
3. The initial salary assigned when an employee is created should
   also create the first salary history record.
4. A salary change must update the employee's current salary and
   create a corresponding salary history record.
5. Updating the employee salary and creating the salary history
   record must happen within the same database transaction.
6. If either operation fails, both operations must roll back.
7. Salary history must contain:
   - employee
   - salary
   - currency
   - effectiveFrom
   - createdAt
8. Use BigDecimal for monetary values.
9. Use LocalDate for salary effective dates.
10. Use Instant for system timestamps.
11. Salary effective dates must move forward chronologically.
12. Prevent a new salary record from having an effective date that
    is earlier than or equal to the latest salary history record.
13. Provide an API to retrieve the employee's current salary.
14. Provide an API to update an employee's salary.
15. Provide a paginated API to retrieve salary history.
16. Do not expose JPA entities through REST APIs.
17. Use DTOs for API requests and responses.
18. Use optimistic locking on the Employee entity to protect against
    concurrent salary updates.
19. Keep salary history append-only. Do not provide an API that
    modifies or deletes historical records.
20. Add appropriate database constraints and indexes.

API requirements:

GET /api/v1/employees/{id}/salary

PUT /api/v1/employees/{id}/salary

GET /api/v1/employees/{id}/salary-history

Salary update request:

{
  "salary": 1700000.00,
  "currency": "INR",
  "effectiveFrom": "2026-09-01"
}

Salary history must be returned in descending effective-date order
and support pagination.

Testing requirements:

Add fast, deterministic unit tests covering:

- retrieving current salary
- employee not found
- successful salary update
- salary history creation
- invalid effective date
- salary history pagination
- unknown employee history request

Add controller tests covering:

- GET current salary
- PUT salary
- GET salary history
- request validation failures

Review the implementation for:

- transactional correctness
- concurrency concerns
- data integrity
- maintainability
- API design
- validation
- unnecessary complexity

Do not implement analytics, Angular UI, AWS deployment,
authentication, or bulk seeding in this phase.