# AI Prompt 07 — Angular Frontend

## Objective

Continue the Employee Salary Management assessment by implementing the
Angular frontend against the completed Spring Boot backend.

The backend is considered complete for the current MVP and should not be
expanded unless a frontend requirement exposes a genuine API gap.

## Existing Backend

The backend already provides:

- Employee management
- Current salary management
- Salary analytics
- PostgreSQL persistence
- Flyway migrations
- Request validation
- REST APIs
- Unit and controller tests
- Analytics repository integration testing
- Testcontainers PostgreSQL isolation
- Local seed data for 10,000 employees

Refer to the existing project documentation rather than repeating these
details.

## Frontend Technology

Use:

- Angular
- TypeScript
- RxJS
- HTML
- SCSS
- Chart.js / ng2-charts where useful

Use the current Angular standalone component approach.

Do not introduce NgModules unnecessarily.

## Frontend Goals

Build a simple, professional Angular UI suitable for an engineering assessment.

Prioritize:

1. Correct API integration
2. Clean component separation
3. Reusable services and models
4. Loading and error states
5. Responsive but simple styling
6. No unnecessary UI libraries
7. No over-engineering

## Frontend Structure

Preserve the existing structure:

src/app/

├── core/
│   ├── models/
│   │   ├── analytics.model.ts
│   │   ├── employee.model.ts
│   │   └── salary.model.ts
│   │
│   └── services/
│       ├── analytics.service.ts
│       └── employee.service.ts
│
├── features/
│   ├── dashboard/
│   │
│   └── employees/
│       ├── employee-list/
│       ├── employee-detail/
│       └── employee-form/
│
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.scss

The UI should display:

- Total employees
- Total salary
- Average salary
- Median salary
- Country-level salary information

Do not use mock analytics data when the backend API is available.

## Angular State Handling

The dashboard must correctly transition between:

```text
Loading
   ↓
Success
   ↓
Display data