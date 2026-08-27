# Salary Management System

A full-stack employee salary management system designed to manage employee information, current salaries, salary history, and salary analytics through a RESTful backend and a modern web frontend.

The application is designed with a clear separation between presentation, business logic, and persistence layers, with database migrations, automated testing, containerization, CI/CD, and application observability built into the development workflow.

---

## 1. Project Overview

The Salary Management System provides functionality for:

* Employee management
* Current salary management
* Salary history tracking
* Multi-currency salary support
* Currency normalization for reporting
* Salary analytics
* Country-level salary statistics
* Employee search, filtering, sorting, and pagination
* REST APIs for backend integration
* Angular-based web interface
* Database versioning with Flyway
* Docker-based local deployment
* Automated CI/CD with GitHub Actions
* Container image publishing to Amazon ECR
* Application health checks and metrics

The system is designed to remain simple and maintainable while providing a foundation that can be extended for larger-scale deployments.

---
## Demo

[![Watch the Project Demo](https://img.youtube.com/vi/O0rs8xt7VHE/maxresdefault.jpg)](https://www.youtube.com/watch?v=O0rs8xt7VHE)

▶️ **[Watch the full project demo on YouTube](https://www.youtube.com/watch?v=O0rs8xt7VHE)**
---

## 2. Architecture

The application follows a layered full-stack architecture.

```text
                    ┌──────────────────────┐
                    │      Angular UI      │
                    │   TypeScript / HTML  │
                    │        SCSS          │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot API   │
                    │                      │
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    │ Domain Models        │
                    └──────────┬───────────┘
                               │
                               │ JPA / SQL
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │                      │
                    │ Employees            │
                    │ Salary History       │
                    │ Exchange Rates       │
                    └──────────────────────┘
                               │
                               │
                         Flyway migrations
```

### Containerized architecture

```text
                     Docker Compose
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Angular/Nginx  Spring Boot   PostgreSQL
         Container      Container     Container
```

### CI/CD architecture

```text
Git Repository
      │
      ▼
GitHub Actions
      │
      ├── Backend Tests
      ├── Frontend Tests
      ├── Application Build
      ├── Docker Image Build
      │
      ▼
AWS OIDC
      │
      ▼
AWS ECR
      │
      ├── Backend Image
      └── Frontend Image
```

---

## 3. Technology Stack

### Backend

* Java 25
* Spring Boot 4.0.8
* Spring Web MVC
* Spring Data JPA
* Hibernate
* Bean Validation
* Spring Boot Actuator
* Lombok

### Database

* PostgreSQL
* Flyway

### Frontend

* Angular
* TypeScript
* RxJS
* HTML
* SCSS
* Chart.js / ng2-charts where applicable

### Testing

* JUnit
* Spring Boot Test
* Spring MVC Test
* Spring Data JPA Test
* Testcontainers
* PostgreSQL Testcontainers
* Angular testing tools

### DevOps

* Docker
* Docker Compose
* GitHub Actions
* Amazon ECR
* GitHub Actions OIDC authentication with AWS

---

## 4. Prerequisites

For local development, install:

* Java 25
* Maven or use the included Maven Wrapper
* Node.js
* npm
* Docker Desktop
* Git
* PostgreSQL, if running the backend without Docker

Verify the installations:

```bash
java -version
node --version
npm --version
docker --version
git --version
```

The project includes the Maven Wrapper, so Maven does not need to be installed separately when using:

```bash
./mvnw
```

On Windows:

```bash
mvnw.cmd
```

---

## 5. Local Setup

Clone the repository:

```bash
git clone <repository-url>
cd salary-management
```

### Backend

From the project root:

```bash
./mvnw clean test
```

Start the application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8080
```

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The frontend API URL is configured through the Angular environment configuration.

---

## 6. Environment Variables

The application supports environment-based database configuration.

### Backend

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

The application provides development defaults when these variables are not supplied.

Example:

```text
DB_URL=jdbc:postgresql://localhost:5432/salary_management
DB_USERNAME=salary_app
DB_PASSWORD=<your-password>
```

For local development, environment variables can be supplied through the shell, Docker Compose, or another environment configuration mechanism.

Do not commit real credentials, secrets, access keys, or passwords to the repository.

### Frontend

Angular environment configuration contains the backend API URL.

Example:

```text
http://localhost:8080/api/v1
```

Production deployments should provide an appropriate API endpoint through the production environment configuration.

---

## 7. Database and Flyway

PostgreSQL is used as the primary relational database.

The database schema is managed using Flyway migrations.

The application uses:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

Hibernate therefore validates the existing schema instead of automatically modifying it.

This provides a clear separation:

```text
Flyway
   ↓
Schema creation / modification

Hibernate
   ↓
Entity-to-schema validation
```

### Database entities

The primary database structures include:

* `employees`
* `salary_history`
* `exchange_rates`

### Salary history

Salary changes are stored separately from the employee's current salary.

The employee record represents the current salary state, while the salary history table preserves previous salary records and their effective dates.

### Currency normalization

Salary analytics use exchange-rate data to convert salaries into a common reporting currency.

This allows employees with different salary currencies to participate in the same aggregate calculations.

---

## 8. Running with Docker Compose

Docker Compose provides a consistent local environment containing the application components and PostgreSQL.

Build and start the complete application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop the environment:

```bash
docker compose down
```

To remove containers and the associated Compose network:

```bash
docker compose down
```

### Services

The Compose environment includes:

```text
Frontend
    ↓
Backend
    ↓
PostgreSQL
```

Typical local endpoints:

```text
Frontend:
http://localhost

Backend:
http://localhost:8080

Health:
http://localhost:8080/actuator/health

Metrics:
http://localhost:8080/actuator/metrics
```

PostgreSQL is exposed on the configured database port for local development.

---

## 9. API Overview

The backend exposes REST APIs under:

```text
/api/v1
```

The API is organized around the application's primary resources.

### Employee APIs

Typical operations include:

```text
GET    /api/v1/employees
GET    /api/v1/employees/{id}
POST   /api/v1/employees
PUT    /api/v1/employees/{id}
```

Employee listing supports capabilities such as:

* Pagination
* Sorting
* Searching
* Filtering

### Salary History APIs

Salary history endpoints provide access to historical salary records associated with employees.

Typical operations include retrieving the salary history for an employee and managing salary history records where supported by the application.

### Analytics APIs

Analytics endpoints provide aggregated salary information including:

* Employee count
* Total salary
* Average salary
* Median salary
* Country-level statistics
* Currency-normalized salary values

The exact API contract is defined by the controllers and DTOs in the backend source code.

---

## 10. Frontend

The frontend is implemented using Angular and TypeScript.

The application follows Angular's standalone component architecture.

A simplified structure is:

```text
src/
│
├── core/
│   ├── models/
│   └── services/
│
├── app/features/
│   ├── dashboard/
│   └── employees/
│   |   ├── employee-list/
│   |   ├── employee-detail/
│   |   └── employee-form/
|   |__ salary/
|       |__ salary-history/
│
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.scss
```

### Frontend responsibilities

The frontend provides:

* Dashboard
* Employee listing
* Employee search
* Pagination
* Sorting
* Employee creation
* Employee details
* Salary information
* Salary history
* Salary analytics
* Loading states
* Error handling
* API integration

The frontend communicates with the backend through REST APIs rather than maintaining duplicate business logic.

---

## 11. Testing

Testing is provided for both backend and frontend components.

### Backend tests

Run:

```bash
./mvnw test
```

On Windows:

```bash
mvnw.cmd test
```

The backend test suite includes unit, controller, repository, integration, and application-context testing where appropriate.

Testcontainers is used for PostgreSQL integration testing to provide isolated database environments.

### Frontend tests

From the frontend directory:

```bash
npm test
```

### Frontend production build

```bash
npm run build
```

The CI pipeline also executes automated tests to prevent broken changes from being integrated.

---

## 12. CI/CD

GitHub Actions is used to automate validation and container image delivery.

The CI workflow performs tasks such as:

```text
Source Checkout
      ↓
Backend Build & Tests
      ↓
Frontend Tests & Build
      ↓
Docker Image Build
      ↓
AWS Authentication
      ↓
Amazon ECR Login
      ↓
Image Push
```

The workflow is triggered by repository changes such as pushes and pull requests according to the configured workflow rules.

The pipeline ensures that application changes are automatically validated before container images are published.

---

## 13. AWS and Amazon ECR

Amazon Elastic Container Registry (ECR) is used as the container image registry.

Separate images are maintained for:

```text
salary-management-backend
salary-management-frontend
```

GitHub Actions authenticates with AWS using GitHub's OIDC federation rather than storing long-lived AWS access keys in the repository.

The authentication flow is:

```text
GitHub Actions
      │
      │ OIDC token
      ▼
AWS IAM
      │
      │ AssumeRoleWithWebIdentity
      ▼
AWS permissions
      │
      ▼
Amazon ECR
```

This approach reduces the need to store long-lived AWS credentials as GitHub secrets.

Production runtime deployment can be implemented using AWS services such as ECS, EKS, or other container hosting infrastructure depending on operational requirements.

---

## 14. Observability

The application uses Spring Boot Actuator for basic operational visibility.

### Health

```text
/actuator/health
```

Provides application health information.

### Application information

```text
/actuator/info
```

Provides basic application metadata.

### Metrics

```text
/actuator/metrics
```

Provides application and JVM metrics exposed through Spring Boot Actuator.

### Logging

Application logging uses SLF4J/Logback through the standard Spring Boot logging infrastructure.

Logs are intended to provide useful application context while avoiding sensitive information such as:

* Passwords
* Authentication tokens
* AWS credentials
* Database secrets
* Other confidential values

---

## 15. Design Decisions

### Layered architecture

The application separates:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

This keeps HTTP handling, business logic, and persistence responsibilities separate.

### Database-side aggregation

Salary analytics are calculated in PostgreSQL using operations such as:

```text
COUNT
SUM
AVG
PERCENTILE_CONT
GROUP BY
```

This avoids unnecessarily loading large datasets into application memory.

### Pagination

Employee listing uses database-backed pagination to avoid retrieving the entire employee dataset for a single request.

### Indexing

Indexes are used for frequently queried fields and common lookup patterns, including:

* Employee country
* Employee currency
* Salary-history employee lookup
* Salary-history employee/effective-date lookup
* Exchange-rate lookup

Primary keys and unique constraints also provide appropriate indexing for identity and uniqueness requirements.

### Salary history

Current salary and historical salary are separated conceptually:

```text
Employee
    ↓
Current salary

Salary History
    ↓
Historical salary changes
```

This keeps current-state queries simple while preserving historical information.

### Flyway migrations

Database changes are version-controlled through Flyway rather than relying on Hibernate to automatically modify production schemas.

### Environment-based configuration

Database connection information can be supplied through environment variables, allowing the same application artifact to run in different environments without changing application code.

### Containerization

Docker provides reproducible application environments and Docker Compose simplifies local multi-service execution.

### OIDC authentication

GitHub Actions uses short-lived AWS federation through OIDC rather than requiring long-lived AWS access keys.

---

## 16. Known Limitations

The current implementation intentionally keeps the system focused and lightweight.

### Production deployment

Container images can be published to Amazon ECR, but production runtime deployment infrastructure is not included as part of the application itself.

A production environment may additionally require:

* ECS/EKS or another container runtime
* Load balancing
* RDS or managed PostgreSQL
* VPC/network configuration
* Secrets Manager or Parameter Store
* Autoscaling
* CDN configuration where appropriate

### Exchange-rate history

The exchange-rate model contains effective dates, but the current analytics flow primarily operates against the configured reporting rate rather than implementing full historical point-in-time currency conversion.

### Search scalability

Employee search supports application requirements appropriate for the current dataset. For very large datasets and high-volume substring searches, PostgreSQL-specific indexing strategies such as trigram indexes could be introduced.

### Observability

The current observability implementation provides health checks, application information, metrics, and application logging. A larger production environment could additionally introduce centralized log aggregation, distributed tracing, dashboards, alerting, and long-term metrics storage.

### Authentication and authorization

Authentication and authorization are not the primary focus of the current application architecture. These capabilities can be added when the application is integrated into a broader secured platform.

---

## License

This project is provided for learning, demonstration, and software development purposes. Add an appropriate license if the repository is intended for public redistribution.
