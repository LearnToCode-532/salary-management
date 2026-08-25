CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,

    employee_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,

    current_salary NUMERIC(19, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL,

    version BIGINT NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT uk_employees_employee_code UNIQUE (employee_code),
    CONSTRAINT uk_employees_email UNIQUE (email),

    CONSTRAINT chk_employees_salary_non_negative
        CHECK (current_salary >= 0),

    CONSTRAINT chk_employees_currency
        CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX idx_employees_country
    ON employees(country);

CREATE INDEX idx_employees_currency
    ON employees(currency);