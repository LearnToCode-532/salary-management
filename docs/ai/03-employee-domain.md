# AI Prompt — Employee Domain

## 1. Purpose

This prompt was used to design and implement the initial employee
domain and its database schema.

The project foundation and common development conventions are
documented in:

- `docs/ai/01-project-foundation.md`
- `docs/ai/02-postgresql-flyway.md`

The product and architectural context is documented in:

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/database-design.md`
- `docs/tradeoffs.md`

---

## 2. Prompt

```text
Continue the ACME Salary Management project from the existing
Spring Boot and PostgreSQL/Flyway foundation.

Read the existing project documentation before making changes.

Implement the initial Employee domain.

Requirements:

1. Create an Employee JPA entity.
2. Create the corresponding Flyway database migration.
3. Use BigDecimal for monetary salary values.
4. Use PostgreSQL NUMERIC for salary storage.
5. Use Instant for system timestamps such as createdAt and updatedAt.
6. Use LocalDate for business-effective dates where applicable.
7. Add optimistic locking using JPA @Version.
8. Store the employee's current salary and currency.
9. Ensure employeeCode is unique.
10. Ensure email is unique.
11. Add appropriate database constraints.
12. Add indexes only for fields that have a clear query/filter use case.
13. Create an EmployeeRepository using Spring Data JPA.
14. Do not expose JPA entities directly through REST APIs.
15. Do not implement employee REST APIs yet.
16. Do not implement salary history yet.
17. Do not add unnecessary abstractions or infrastructure.

Keep the implementation consistent with the existing project
architecture and use Flyway as the source of truth for database
schema changes.

After implementation:

- Run the test suite.
- Verify Flyway migration execution.
- Verify Hibernate schema validation.
- Verify the resulting PostgreSQL schema.
- Report any issues found.