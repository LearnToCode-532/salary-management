# ACME Salary Management — Performance Considerations

## 1. Performance Goal

The application is designed for an organization with approximately 10,000 employees.

10,000 employees is not a large dataset for PostgreSQL, so the architecture does not require distributed databases, caching infrastructure, or microservices purely for scale.

The primary performance goal is to avoid inefficient application behavior and maintain predictable response times.

---

# 2. Main Performance Risks

The main risks are:

1. Loading all employees into the browser.
2. Loading all employees into JVM memory for analytics.
3. Missing database indexes.
4. N+1 queries.
5. Inefficient salary-history queries.
6. Unbounded API requests.
7. Unnecessary frontend API calls.
8. Poorly designed analytics queries.

---

# 3. Server-Side Pagination

The employee API will always use server-side pagination.

Example:

```text
GET /api/v1/employees?page=0&size=25