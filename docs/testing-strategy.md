# ACME Salary Management — Testing Strategy

## 1. Testing Philosophy

Testing will focus on business-critical behavior rather than maximizing the number of tests.

The goal is to provide confidence that:

- Employee management works correctly.
- Salary updates are safe and transactional.
- Salary history remains consistent.
- Currency conversion is deterministic.
- Analytics return correct results.
- API validation behaves consistently.
- Concurrent updates do not silently overwrite data.

Tests should be:

- Fast.
- Deterministic.
- Isolated where possible.
- Easy to understand.
- Repeatable in local development and CI.

---

# 2. Testing Pyramid

The project will follow a testing pyramid:

```text
                    ┌─────────────┐
                    │  E2E Tests  │
                    │   Few       │
                    └──────┬──────┘
                           │
                  ┌────────▼────────┐
                  │ Integration     │
                  │ Tests           │
                  │ Moderate        │
                  └────────┬────────┘
                           │
             ┌─────────────▼─────────────┐
             │       Unit Tests          │
             │       Many / Fast         │
             └───────────────────────────┘