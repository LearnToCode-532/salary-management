# ACME Salary Management — Database Design

## 1. Database Selection

The application will use PostgreSQL as the relational database.

PostgreSQL was selected because:

- It is a mature relational database suitable for the expected workload.
- It provides strong transactional guarantees and data integrity features.
- It supports the SQL required for salary analytics and aggregation.
- It provides useful tools for query analysis and performance tuning.
- It is available as a managed service through Amazon RDS.
- It allows the project to demonstrate relational database knowledge beyond the developer's existing MySQL experience.

The application will access PostgreSQL through Spring Data JPA and Hibernate.

Database schema changes will be managed using Flyway migrations.

---

## 2. Design Principles

The database design follows these principles:

1. Store monetary values using exact numeric types.
2. Keep employee current state separate from salary history.
3. Preserve salary-change history as append-only data.
4. Enforce important data integrity rules at the database level.
5. Use foreign keys for relationships.
6. Add indexes based on actual query patterns.
7. Avoid unnecessary normalization that makes common queries unnecessarily complex.
8. Keep reporting/currency data explicit and deterministic.
9. Use optimistic locking for concurrent employee updates.

---

# 3. Entity Relationship Overview

```text
┌──────────────────────────┐
│        employees         │
├──────────────────────────┤
│ id PK                    │
│ employee_number UK       │
│ first_name               │
│ last_name                │
│ email UK                 │
│ country                  │
│ department               │
│ job_title                │
│ current_salary           │
│ currency_code            │
│ hire_date                │
│ active                   │
│ version                  │
│ created_at               │
│ updated_at               │
└────────────┬─────────────┘
             │
             │ 1:N
             │
             ▼
┌──────────────────────────┐
│      salary_history      │
├──────────────────────────┤
│ id PK                    │
│ employee_id FK           │
│ salary_amount            │
│ currency_code            │
│ effective_date           │
│ created_at               │
└──────────────────────────┘


┌──────────────────────────┐
│      currency_rates      │
├──────────────────────────┤
│ id PK                    │
│ currency_code UK         │
│ rate_to_usd              │
│ effective_date           │
│ created_at               │
└──────────────────────────┘