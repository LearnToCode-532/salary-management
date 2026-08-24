# AI Prompt — Project Foundation

## 1. Purpose

This prompt was used to plan and establish the initial backend
foundation for the ACME Employee Salary Management assessment.

The objective was to create a clean, minimal Spring Boot project
aligned with the assessment JD and the previously agreed architecture.

---

## 2. AI Tool

**AI Assistant:** ChatGPT

**Development Environment:** VS Code

The AI assistant was used for planning, technology selection,
implementation guidance, and validation.

The actual project files were created and modified in VS Code,
with the developer reviewing and executing the changes.

---

## 3. Prompt

```text
We are starting development of an employee salary management
application for ACME organization.

The application will manage salary information for approximately
10,000 employees and will primarily be used by an HR Manager.

The assessment requires:

- Production-quality code
- Meaningful unit tests
- Clean architecture
- Relational database
- React/NextJS or Angular frontend
- AWS deployment
- Seed data for 10,000 employees
- AI-assisted development
- Incremental Git commits

The provided JD strongly prefers:

Backend:
- Java
- Spring
- Hibernate
- Maven or Gradle
- JUnit

Frontend:
- Angular
- TypeScript
- RxJS

Database:
- Relational database

DevOps:
- Git
- CI/CD
- AWS
- Observability familiarity

Previously agreed product decisions:

- Authentication is out of scope for the MVP.
- Current salary management is required.
- Salary history/audit trail is an architectural choice.
- PostgreSQL will be used as the relational database.
- Static documented exchange rates will be used for
  cross-country salary normalization.
- USD will be the common reporting currency.
- Natural-language/AI salary queries are optional and should
  not be implemented unless time permits.
- The application should remain simple and avoid premature
  infrastructure complexity.
- The backend will use a modular monolith architecture.
- Redis, Kafka, Kubernetes and microservices are not required
  for the MVP.
- AWS will be used for deployment.

Create the initial Spring Boot backend foundation.

Use:

- Java 25
- Spring Boot 4.x
- Maven
- Spring Web
- Spring Data JPA / Hibernate
- PostgreSQL Driver
- Bean Validation
- Flyway
- Spring Boot Actuator
- Spring Boot DevTools where appropriate
- JUnit 5 / Spring Boot Test

Use the package:

com.acme.salary

The application artifact should be:

salary-management

The project should be structured so that it can later contain
modules such as:

- employee
- salary
- analytics
- common
- config

Do not implement those business modules yet.

For this phase:

1. Create the Spring Boot project.
2. Configure Maven.
3. Configure Java 25.
4. Add the required dependencies.
5. Create the main Spring Boot application class.
6. Establish the standard src/main and src/test structure.
7. Keep the generated project minimal.
8. Do not implement employee or salary functionality.
9. Do not add authentication.
10. Do not add Redis, Kafka, Kubernetes or microservices.
11. Do not introduce unnecessary third-party dependencies.

The project must compile and the default Spring Boot test must pass.

Explain the important technology and dependency choices before
making implementation recommendations.

Keep the change focused only on project foundation.