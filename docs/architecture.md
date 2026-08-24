# ACME Salary Management — Architecture & Technical Design

## 1. Architecture Overview

The application will use a **modular monolith** architecture with a clear separation between the Angular frontend, Spring Boot backend, and PostgreSQL database.

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │ Angular + TypeScript │
                         └──────────┬───────────┘
                                    │ HTTPS / REST
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         │                      │
                         │ Employee Module      │
                         │ Salary Module        │
                         │ Analytics Module     │
                         │ Currency Module      │
                         └──────────┬───────────┘
                                    │
                              JPA / Hibernate
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     PostgreSQL       │
                         │                      │
                         │ employees            │
                         │ salary_history       │
                         │ currency_rates       │
                         └──────────────────────┘
```

The modular monolith was chosen instead of microservices because the expected workload is approximately 10,000 employees and the problem does not require independent service deployment, independent scaling, or distributed transaction management.

The design maintains clear module boundaries so that individual modules can be extracted into services later if the product grows substantially.

---

## 2. Backend Architecture

The backend will use Java 25, Spring Boot, Spring Data JPA, Hibernate, Maven, and Flyway.

The application will follow a layered structure:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller Layer

Responsible for:

* HTTP request handling.
* Request validation.
* Mapping HTTP requests to application operations.
* Returning appropriate HTTP responses.

Controllers will not contain business logic.

### Service Layer

Responsible for:

* Business rules.
* Transaction boundaries.
* Salary updates.
* Salary-history creation.
* Salary calculations.
* Analytics orchestration.

### Repository Layer

Responsible for:

* Database access.
* JPA queries.
* Database-side filtering and aggregation.

### DTO Layer

API DTOs will be separated from persistence entities to avoid exposing database models directly through the API.

This also allows the API contract to evolve independently of the database schema.

---

## 3. Backend Modules

The initial backend will contain the following logical modules.

### Employee Module

Responsible for:

* Employee creation.
* Employee updates.
* Employee lookup.
* Search.
* Filtering.
* Pagination.

### Salary Module

Responsible for:

* Current salary.
* Salary updates.
* Salary validation.
* Salary history.
* Currency handling.

### Analytics Module

Responsible for:

* Total employee count.
* Total payroll.
* Average salary.
* Median salary.
* Payroll by country.
* Payroll by department.
* Salary distribution.
* Top-paid employees.

### Currency Module

Responsible for:

* Maintaining static exchange rates.
* Converting salary values to USD for analytics.
* Providing a single location for currency conversion rules.

---

## 4. Frontend Architecture

The frontend will use Angular and TypeScript.

The application will use feature-oriented organization rather than putting all components into a single directory.

```text
src/app/
│
├── core/
│   ├── services/
│   ├── interceptors/
│   └── models/
│
├── shared/
│   ├── components/
│   ├── pipes/
│   └── directives/
│
└── features/
    ├── dashboard/
    ├── employees/
    └── salary/
```

### Dashboard

Provides:

* KPI cards.
* Payroll charts.
* Country breakdown.
* Department breakdown.
* Salary distribution.
* Interactive filters.

### Employee Management

Provides:

* Employee list.
* Search.
* Filters.
* Pagination.
* Employee details.
* Employee creation/editing.

### Salary Management

Provides:

* Current compensation.
* Salary update form.
* Salary history.
* Currency information.

---

## 5. Angular State & Reactive Programming

The frontend will use Angular services and RxJS for asynchronous operations and API communication.

Employee search will use a debounced reactive flow:

```text
User Input
    ↓
debounceTime
    ↓
distinctUntilChanged
    ↓
switchMap
    ↓
HTTP Request
    ↓
Employee Results
```

`switchMap` prevents obsolete search requests from updating the UI after a newer search has been initiated.

NgRx will not be introduced initially because the application's state complexity does not justify the additional framework and boilerplate.

Angular Signals may be used for simple local/UI state where they improve clarity.

---

## 6. Database Architecture

PostgreSQL will be used as the relational database.

The initial schema will contain:

```text
employees
salary_history
currency_rates
```

### Employees

Stores the current state of each employee, including:

* Employee identifier.
* Employee number.
* Name.
* Email.
* Country.
* Department.
* Job title.
* Current salary.
* Currency.
* Hire date.
* Active status.
* Version for optimistic locking.

### Salary History

Stores append-only records for salary changes.

A salary update will be performed within a transaction:

```text
Begin Transaction
    ↓
Validate employee
    ↓
Validate salary
    ↓
Update current salary
    ↓
Insert salary history
    ↓
Commit
```

If any operation fails, the complete transaction is rolled back.

### Currency Rates

Stores static exchange rates used for USD normalization.

Exchange rates will include an effective date so that the source data is explicit and reproducible.

---

## 7. Salary Representation

Salary values will use PostgreSQL `NUMERIC` and Java `BigDecimal`.

Floating-point types such as `double` will not be used for monetary values because binary floating-point arithmetic can introduce precision errors.

Employees retain their original salary and currency.

For analytics:

```text
Local Salary
     ↓
Exchange Rate
     ↓
USD Equivalent
     ↓
Aggregation
```

The original salary value will never be overwritten as a result of currency conversion.

---

## 8. Employee Search & Pagination

Employee listing APIs will support server-side pagination and filtering.

Example:

```text
GET /api/v1/employees
    ?search=john
    &country=India
    &department=Engineering
    &page=0
    &size=25
```

The application will not load all 10,000 employees into the browser.

Database indexes will be introduced for frequently queried fields based on the actual access patterns.

---

## 9. Analytics Strategy

Analytics calculations will be pushed to PostgreSQL where appropriate.

For example:

```sql
SELECT department,
       COUNT(*) AS employee_count,
       SUM(salary_amount) AS total_payroll,
       AVG(salary_amount) AS average_salary
FROM employees
GROUP BY department;
```

This avoids retrieving all employee records into the JVM simply to calculate aggregates.

Median salary and salary distribution will be designed as database-backed analytics where practical.

Query execution plans will be inspected for important queries using PostgreSQL tooling such as `EXPLAIN ANALYZE`.

---

## 10. Concurrency & Data Integrity

Salary updates will use optimistic locking through a version field.

Conceptually:

```text
HR Manager A reads Employee version 5
HR Manager B reads Employee version 5

A updates salary
→ version becomes 6

B attempts update using version 5
→ update rejected
```

This prevents a stale HR operation from silently overwriting a newer change.

Database constraints and application-level validation will both be used where appropriate.

---

## 11. API Design Principles

The backend will expose REST APIs under:

```text
/api/v1
```

Representative endpoints:

```text
GET    /api/v1/employees
GET    /api/v1/employees/{id}
POST   /api/v1/employees
PUT    /api/v1/employees/{id}
PATCH  /api/v1/employees/{id}/salary

GET    /api/v1/employees/{id}/salary-history

GET    /api/v1/analytics/summary
GET    /api/v1/analytics/payroll-by-country
GET    /api/v1/analytics/payroll-by-department
GET    /api/v1/analytics/salary-distribution
GET    /api/v1/analytics/top-paid
```

The API will use:

* Appropriate HTTP status codes.
* Request validation.
* Consistent error responses.
* Pagination metadata.
* DTOs rather than exposing JPA entities.

---

## 12. Error Handling

A centralized exception-handling mechanism will provide consistent API responses.

Expected categories include:

```text
400 Bad Request
    Invalid input

404 Not Found
    Employee does not exist

409 Conflict
    Concurrent modification / optimistic locking conflict

500 Internal Server Error
    Unexpected server-side failure
```

Internal implementation details and stack traces will not be exposed to clients.

---

## 13. AWS Deployment Architecture

The application will be containerized using Docker.

The planned AWS deployment is:

```text
                         Internet
                            │
                            ▼
                  ┌──────────────────┐
                  │    CloudFront    │
                  │                  │
                  │ Angular frontend │
                  └────────┬─────────┘
                           │
                           │ API requests
                           ▼
                  ┌──────────────────┐
                  │   AWS App Runner │
                  │                  │
                  │ Spring Boot API  │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    AWS RDS       │
                  │   PostgreSQL     │
                  └──────────────────┘
```

The Angular production build will be deployed as static assets using Amazon S3 and served through CloudFront.

The Spring Boot application will run as a container on AWS App Runner.

PostgreSQL will run on Amazon RDS.

This architecture minimizes infrastructure management while providing a realistic cloud deployment.

---

## 14. AWS Service Selection Trade-off

### App Runner vs ECS/Fargate

ECS/Fargate provides greater control but introduces additional infrastructure configuration.

App Runner is selected because this assessment contains a single backend service and the primary objective is demonstrating application engineering rather than complex infrastructure management.

The backend remains containerized, so migration to ECS/Fargate would not require major application changes.

### RDS vs Self-managed PostgreSQL

RDS is preferred because database backups, patching, and infrastructure management should not be part of the application's responsibilities.

### S3 + CloudFront for Angular

Angular produces static assets, making S3 an appropriate hosting mechanism. CloudFront provides HTTPS delivery and caching.

---

## 15. Security Scope

Authentication and authorization are explicitly out of scope for the MVP based on the assessment clarification.

The application will nevertheless follow secure development practices:

* Input validation.
* Parameterized database access through JPA.
* No secrets committed to Git.
* Environment-based configuration.
* Secure handling of database credentials.
* Appropriate CORS configuration.
* Production HTTPS.

Authentication/SSO can be added later through an enterprise identity provider.

---

## 16. Observability

The backend will provide:

* Spring Boot Actuator health checks.
* Structured application logs.
* Basic request and application metrics.
* Error logging with sufficient context for debugging.

A full distributed observability stack is intentionally excluded because the MVP is a single deployable backend.

---

## 17. Testing Strategy

Testing will focus on business behavior.

### Unit Tests

JUnit 5 and Mockito will cover:

* Employee service behavior.
* Salary validation.
* Salary updates.
* Salary history creation.
* Currency conversion.
* Analytics calculations where application logic exists.

### Integration Tests

Selected API and persistence flows will be tested against PostgreSQL.

Important scenarios include:

```text
Create employee
Update employee
Search/filter employees
Update salary
Create salary history
Reject invalid salary
Handle employee not found
Handle concurrent salary update
Calculate payroll analytics
```

Tests should be deterministic and independent of external services.

---

## 18. AI-Assisted Development

AI tools will be used throughout development for:

* Requirements analysis.
* Architecture review.
* Code generation.
* Test generation.
* Debugging.
* Code review.
* Performance analysis.
* Documentation.

AI-generated code will not be accepted blindly. Generated implementations will be reviewed for correctness, security, performance, maintainability, and consistency with the architecture.

Prompts and representative AI-assisted development workflows will be documented in the repository.

---

## 19. Architecture Principles

The implementation will prioritize:

1. Simplicity over unnecessary infrastructure.
2. Clear separation of responsibilities.
3. Database-side processing for data-intensive operations.
4. Explicit business rules.
5. Testability.
6. Maintainability.
7. Observable and debuggable behavior.
8. Incremental development through small Git commits.
9. AI-assisted development with human validation.
10. The simplest architecture that satisfies the current requirements.