# ACME Salary Management — Product Requirements

## 1. Goal

Build a web-based salary management platform for ACME's HR team to replace spreadsheet-based salary management for approximately 10,000 employees across multiple countries.

The platform will provide the HR Manager with a centralized way to manage employee compensation and understand how ACME pays its workforce through searchable employee data, salary management, salary history, and structured analytics.

The application will be production-oriented, maintainable, testable, and deployable on AWS.

---

## 2. Primary User

**HR Manager**

The MVP assumes a single internal HR Manager who is already authenticated. Authentication, SSO, and identity-provider integration are deliberately excluded from this assessment.

---

## 3. MVP Scope

### Employee Management

* View employees using server-side pagination.
* Search by employee name, employee number, or email.
* Filter by country, department, and salary range.
* View employee details.
* Create and update employee information.
* Validate employee and salary data.

### Salary Management

* View an employee's current salary and currency.
* Update an employee's salary.
* Maintain an append-only salary history when compensation changes.
* Record the effective date of salary changes.
* Support salaries in multiple currencies.
* Use a static, documented exchange-rate table for cross-country salary comparison.

### Salary Analytics

Provide a structured dashboard containing:

* Total employee count.
* Total annual payroll.
* Average salary.
* Median salary.
* Payroll by country.
* Payroll by department.
* Salary distribution.
* Highest-paid employees.
* Interactive filtering where useful.

Analytics will normalize salaries to USD using the static exchange-rate data.

Natural-language or AI-driven salary queries are optional and will only be considered after the core MVP is complete.

---

## 4. Data & Scale

The application will be seeded with **10,000 deterministic employee records** representing a realistic multi-country organization.

The system will use PostgreSQL as the relational database and Hibernate/JPA for persistence.

Employee search, filtering, and pagination will be performed server-side. Aggregations should be executed by the database where appropriate rather than loading the complete employee dataset into application memory.

---

## 5. Non-Functional Requirements

* Backend: Java with Spring Boot.
* ORM: Hibernate/JPA.
* Database: PostgreSQL.
* Frontend: Angular with TypeScript.
* Reactive programming: RxJS where appropriate.
* Build: Maven.
* Testing: JUnit 5, Mockito, and appropriate Angular tests.
* Database migrations: Flyway.
* Containerization: Docker.
* CI/CD: Git-based automated build and test pipeline.
* Deployment: AWS.
* Observability: application health checks, structured logging, and basic metrics.
* Maintainability: clear separation of presentation, business, and persistence responsibilities.
* Performance: appropriate database indexes, pagination, efficient queries, and database-side aggregation.

---

## 6. Deliberately Out of Scope

The following are intentionally excluded from the MVP:

* Authentication, SSO, and identity-provider integration.
* Employee self-service.
* Payroll processing or salary disbursement.
* Tax calculation and statutory compliance.
* Benefits management.
* Attendance, leave, or performance management.
* Recruitment or onboarding.
* Bank/payment integrations.
* Real-time foreign-exchange API integration.
* Multi-tenant organization support.
* Complex role-based authorization.
* Native mobile applications.
* AI-generated compensation recommendations.
* Natural-language salary querying unless time permits after the core MVP is complete.

These capabilities can be added in future iterations but are not necessary to solve the core problem or demonstrate the required engineering skills within the assessment scope.

---

## 7. Key Architectural/Product Decisions

* **Modular monolith:** A single Spring Boot application is sufficient for 10,000 employees and avoids unnecessary distributed-system complexity.
* **PostgreSQL:** Provides a robust relational database suitable for the workload while allowing the solution to demonstrate SQL, indexing, aggregation, and performance tuning.
* **Salary history:** Included as a lightweight append-only record to provide traceability for compensation changes without introducing a complex audit framework.
* **Static exchange rates:** Keeps analytics deterministic and removes dependency on external FX services.
* **Structured analytics first:** Dashboards, metrics, charts, and filters directly address the stated HR use case. AI querying is secondary.
* **AWS deployment:** The application will be containerized and deployed using appropriate AWS managed services, with the final service selection documented separately.
* **AI-assisted development:** AI tools may be used throughout development for implementation, testing, debugging, code review, and performance analysis. AI-generated output will be reviewed and validated before acceptance.

---

## 8. Success Criteria

The MVP will be considered successful when:

1. An HR Manager can manage employee and salary information through the web application.
2. Salary changes are persisted and historically traceable.
3. The application can search, filter, and paginate 10,000 employees efficiently.
4. The dashboard provides meaningful salary and payroll analytics.
5. Multi-country salaries can be compared using the documented USD exchange rates.
6. Core business functionality is covered by fast and deterministic automated tests.
7. The application is deployed and accessible on AWS.
8. The repository demonstrates incremental development through meaningful Git commits.
9. Architecture, trade-offs, performance considerations, and AI-assisted development are documented.
10. A short video demonstrates the key user workflows of the deployed application.