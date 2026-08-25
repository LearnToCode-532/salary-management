# AI Prompt — Employee Seed Data & Salary Analytics

## Purpose

This prompt is used to implement deterministic employee seed data and
salary analytics for the ACME Salary Management application.

Refer to the existing project documentation and previous AI prompts for
project conventions and decisions.

Previous prompts:

- `docs/ai/01-project-foundation.md`
- `docs/ai/02-postgresql-flyway.md`
- `docs/ai/03-employee-domain.md`
- `docs/ai/04-employee-api.md`
- `docs/ai/05-salary-management.md`

---

## Prompt

Continue the ACME Salary Management project.

The application manages salary information for approximately 10,000
employees across multiple countries.

Implement the next phase:

1. Deterministic seed data for 10,000 employees.
2. Salary analytics APIs for the HR Manager.

Do not change existing API contracts unless there is a strong technical
reason.

### Seed Data

Create a repeatable seed mechanism that can populate 10,000 employees.

The seed data should:

- contain exactly 10,000 employees
- use deterministic values
- generate unique employee codes
- generate unique email addresses
- contain employees across multiple countries
- contain multiple currencies
- contain realistic but deterministic salary ranges
- create corresponding initial salary history records
- be safe to run in a clean local environment
- avoid relying on external APIs

The seed mechanism must not execute automatically in every production
application startup.

Prefer an explicit command, profile, or dedicated seed runner.

Consider database performance when inserting 10,000 employees and their
salary history records.

### Analytics

Implement APIs allowing an HR Manager to understand how the organization
pays employees.

The analytics functionality should include:

1. Total current salary spend.
2. Average salary.
3. Median salary.
4. Employee count.
5. Salary statistics grouped by country.
6. Salary statistics grouped by currency where appropriate.
7. Filtering by country.
8. Filtering by currency where appropriate.

Use SQL/database aggregation rather than loading all 10,000 employees into
Java memory.

Do not implement natural-language or AI-powered salary queries.

### API Design

Design clear REST endpoints.

For example:

GET /api/v1/analytics/summary

GET /api/v1/analytics/countries

The API should support optional filters where useful.

Use DTO projections rather than returning database entities.

### Currency Normalization

The organization operates across multiple countries.

Use a documented static exchange-rate table for reporting normalization.

Do not integrate with a live exchange-rate API.

Define one reporting currency, such as USD.

The exchange rates must be deterministic and documented.

The analytics response should make clear when values are normalized into the
reporting currency.

### SQL and Performance

Prefer database-side aggregation.

Consider:

- SUM
- AVG
- COUNT
- percentile/median functionality supported by PostgreSQL
- GROUP BY
- indexes
- filtering before aggregation

Do not retrieve all employee rows and calculate analytics in Java.

Review query plans where appropriate.

The solution should comfortably support 10,000 employees without unnecessary
complexity.

### Testing

Add meaningful tests covering:

- total employee count
- total salary calculation
- average salary
- median salary
- country aggregation
- currency filtering
- country filtering
- empty-result scenarios
- deterministic seed behavior

Use unit tests for business logic and repository/integration tests where
database-specific SQL behavior needs verification.

Tests must be deterministic and easy to understand.

### Maintainability

Keep analytics logic separate from employee CRUD logic.

Use clear package boundaries.

Do not introduce unnecessary microservices or infrastructure.

This remains a modular Spring Boot application for the assessment.

### Out of Scope

Do not implement:

- authentication
- authorization
- live exchange-rate APIs
- AI/natural-language analytics
- Kafka
- Redis
- Kubernetes
- microservices
- complex event sourcing
- real-time analytics

Keep the implementation appropriate for a 10,000-employee internal HR
application.

Review the implementation for correctness, SQL performance, maintainability,
and API clarity before completing the phase.