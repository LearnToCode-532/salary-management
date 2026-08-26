# AI Prompt 09 — Frontend Testing & Stabilization

## Objective

Complete the Employee Salary Management assessment by adding comprehensive frontend tests and stabilizing the Angular application.

The frontend functionality has already been implemented.

The goal of this phase is to verify the existing implementation rather than introduce new features.

## Existing Frontend

The Angular frontend currently provides:

* Dashboard
* Employee list
* Employee detail
* Employee create/edit form
* Salary history
* Employee search
* Server-side pagination
* Direct page navigation
* Server-side sorting
* Currency loading
* Salary management
* Analytics charts

Refer to the existing implementation and documentation.

Do not rewrite working functionality unnecessarily.

## Testing Technology

Use the testing setup already configured in the Angular project.

Use:

* Vitest
* Angular TestBed
* RxJS
* Angular testing utilities

Do not introduce another testing framework.

## Service Tests

Create and maintain unit tests for frontend services.

Cover:

* Successful HTTP requests
* Correct HTTP methods
* Correct URLs
* Query parameters
* Request bodies
* Returned data
* HTTP error handling where applicable

Services include:

* EmployeeService
* SalaryService
* CurrencyService
* AnalyticsService

Verify that sorting and pagination parameters are sent correctly.

For employee sorting, verify the API receives:

```text
sort=employeeCode,asc
sort=employeeCode,desc
```

and equivalent values for the other supported fields.

## Employee List Tests

Test:

* Component creation
* Employee loading
* Loading state
* API error state
* Search
* Clear search
* Next page
* Previous page
* Direct page navigation
* Invalid page navigation
* Sorting
* Ascending sorting
* Descending sorting
* Changing sort column
* Sort indicators

Verify that pagination and sorting trigger the expected service calls.

## Employee Form Tests

Test:

* Component creation
* Create mode
* Edit mode
* Required field validation
* Email validation
* Salary validation
* Currency validation
* Currency loading
* Currency loading error
* Employee creation
* Employee creation error
* Employee update
* Salary update when salary changes
* No salary update when salary remains unchanged
* Employee update error
* Salary update error
* Cancel navigation
* Successful navigation

When testing the form, remember that the currency control is initially disabled and becomes enabled after supported currencies are loaded.

Tests must reflect the actual component behavior rather than assuming the control is enabled immediately.

## Employee Detail Tests

Test:

* Component creation
* Employee loading
* Successful employee display
* Loading state
* Missing employee ID
* Invalid employee ID
* API error handling

## Salary History Tests

Test:

* Component creation
* Salary history loading
* Successful response
* Empty history
* Loading state
* API error
* Missing employee ID
* Invalid employee ID
* Next page
* Previous page
* First-page boundary
* Last-page boundary

When testing pagination, ensure the component's employee ID is initialized before calling pagination methods.

Verify both:

```text
page state
```

and:

```text
service call arguments
```

## Dashboard Tests

Test:

* Component creation
* Analytics loading
* Successful analytics response
* Analytics loading error
* Summary data
* Country summary data
* Employee chart data
* Average salary chart data
* Country sorting
* Ascending sorting
* Descending sorting
* Changing sort column
* Sort indicators

The dashboard uses Chart.js/ng2-charts.

Do not make tests depend on actual browser canvas rendering.

Mock or isolate chart rendering where necessary.

## Test Mocks

Use appropriate mocks for:

* EmployeeService
* SalaryService
* CurrencyService
* AnalyticsService
* Router
* ActivatedRoute

Avoid unnecessary real HTTP calls.

Use RxJS helpers such as:

```text
of(...)
throwError(...)
```

where appropriate.

## Angular Router Testing

Components using:

* RouterLink
* Router
* ActivatedRoute

must be provided with the required testing configuration.

Avoid incomplete router configuration that causes errors such as:

```text
No provider found for ActivatedRoute
```

or:

```text
Cannot read properties of undefined (reading 'root')
```

Use the simplest router setup required by the component under test.

## Assertions

Use assertions supported by the project's configured Vitest environment.

Do not use Jasmine-specific APIs unless Jasmine is actually configured.

Prefer assertions such as:

```text
toBe(true)
toBe(false)
toBeTruthy()
toBeFalsy()
toHaveBeenCalled()
toHaveBeenCalledWith(...)
```

Do not introduce unnecessary dependencies only to support Jasmine matchers.

## Test Quality

Tests should verify behavior rather than implementation details.

Prioritize:

1. User-visible behavior
2. Service interaction
3. State transitions
4. Validation
5. Error handling
6. Navigation
7. Pagination
8. Sorting

Do not add tests merely to increase the test count.

## Verification

Run the complete frontend test suite.

Fix all:

* Compilation errors
* TypeScript errors
* Router configuration errors
* Mock configuration errors
* Assertion failures
* Canvas-related test issues

The final result should have:

```text
Tests: 0 failed
Tests: all passing
```

Also run the frontend application after tests pass and verify that testing changes have not broken the actual application.

## Important Constraint

Do not modify the backend.

Do not modify:

* Java code
* Spring Boot code
* Controllers
* Services
* Repositories
* Entities
* DTOs
* Database schema
* Flyway migrations
* Backend tests

Only make frontend changes that are necessary to fix genuine frontend issues discovered during testing.

## Final Review

After all tests pass, review the complete frontend for:

* Functional correctness
* API integration
* UI consistency
* Error handling
* Pagination
* Sorting
* Salary history
* Form validation
* Dashboard functionality
* Test coverage

Update the current phase documentation with the final frontend testing and stabilization status.
