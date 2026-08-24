# ACME Salary Management — Architecture & Engineering Trade-offs

## 1. Modular Monolith vs Microservices

### Decision

Use a modular monolith for the MVP.

### Why

The application has:

- One primary user persona.
- A single backend application.
- Approximately 10,000 employees.
- No requirement for independently scalable business domains.
- No requirement for multiple independently deployable teams.

Introducing microservices would add:

- Network communication.
- Distributed tracing requirements.
- Service discovery/configuration.
- Distributed failure modes.
- More deployment complexity.
- More complicated local development.

None of these provide meaningful value for the current problem.

The backend will therefore remain a single deployable application while maintaining clear module boundaries.

### Future

If the system grows significantly, modules such as analytics or employee management could potentially be extracted into separate services.

---

# 2. PostgreSQL vs MySQL

### Decision

Use PostgreSQL.

### Why

MySQL would satisfy the functional requirements and is a valid relational database for this workload.

PostgreSQL was selected because:

- It is well suited for analytical SQL.
- It provides strong relational and transactional capabilities.
- It has useful PostgreSQL-specific features for salary analytics.
- `PERCENTILE_CONT` can be used for median calculations.
- It provides strong tooling for query analysis.
- It integrates well with AWS RDS.
- It allows the implementation to demonstrate experience with another production-grade relational database.

The expected 10,000 employee dataset is easily within the capabilities of either database.

The choice is therefore primarily based on technical fit and learning value rather than scale requirements.

---

# 3. AWS App Runner vs ECS/Fargate

### Decision

Use AWS App Runner for the backend deployment.

### Why

The application contains one backend container.

App Runner provides:

- Container deployment.
- Managed infrastructure.
- HTTPS support.
- Automatic scaling capabilities.
- Reduced operational configuration.

ECS/Fargate provides more control, but that additional flexibility is not required for this MVP.

Using App Runner allows more time to be spent on application correctness, testing, UI, and product functionality.

### Future

The Dockerized application can be moved to ECS/Fargate if more control over networking, scaling, deployment strategies, or infrastructure becomes necessary.

---

# 4. Amazon RDS vs Self-Managed PostgreSQL

### Decision

Use Amazon RDS for PostgreSQL.

### Why

Database infrastructure should not be the primary focus of this assessment.

RDS provides managed:

- PostgreSQL infrastructure.
- Backups.
- Maintenance.
- Monitoring capabilities.
- Storage management.

Running PostgreSQL directly on an EC2 instance would require additional operational work without providing meaningful product value for the MVP.

---

# 5. S3 + CloudFront vs Hosting Angular with the Backend

### Decision

Deploy Angular static assets separately using Amazon S3 and CloudFront.

### Why

Angular's production output consists of static files.

S3 is therefore an appropriate hosting mechanism.

CloudFront provides:

- CDN delivery.
- HTTPS.
- Caching.
- Global distribution.

This also separates frontend and backend deployment concerns.

### Alternative

The Angular application could be served directly by Spring Boot.

That would simplify deployment but would couple frontend and backend releases.

For this assessment, separating the frontend demonstrates a more realistic production deployment model without introducing significant application complexity.

---

# 6. Current Salary + Salary History vs Only Current Salary

### Decision

Store both:

- Current salary on the employee record.
- Historical salary changes in `salary_history`.

### Why

The product needs to answer questions about how the organization pays people.

Historical data provides useful context such as:

- How an employee's compensation changed.
- Previous salary values.
- Effective dates.
- Compensation progression.

At the same time, storing current salary directly on the employee record makes common operations and dashboard queries straightforward.

### Trade-off

This introduces some duplication:

```text
employees.current_salary

salary_history.latest.salary_amount