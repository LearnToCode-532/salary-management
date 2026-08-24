# ACME Salary Management — API Design

## 1. API Overview

The backend exposes REST APIs under:

    /api/v1

The API is designed around the core business resources:

- Employees
- Salary
- Salary History
- Analytics

Authentication is intentionally excluded from the MVP. The API assumes an authenticated internal HR Manager context.

---

# 2. API Conventions

## Base URL

    /api/v1

## Content Type

Requests and responses use:

    application/json

## Date Format

Dates use ISO-8601 format:

    YYYY-MM-DD

Example:

    2026-08-24

## Timestamp Format

Timestamps use ISO-8601 format with timezone information.

Example:

    2026-08-24T10:30:00Z

## Currency

Currency values use three-letter currency codes.

Example:

    INR
    USD
    EUR
    GBP

## Monetary Values

Money is represented as a decimal number and mapped to Java `BigDecimal`.

Example:

    1500000.00