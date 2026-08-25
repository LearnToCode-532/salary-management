CREATE TABLE salary_history (
    id BIGSERIAL PRIMARY KEY,

    employee_id BIGINT NOT NULL,

    salary NUMERIC(19, 4) NOT NULL,

    currency VARCHAR(3) NOT NULL,

    effective_from DATE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_salary_history_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id),

    CONSTRAINT chk_salary_history_salary_non_negative
        CHECK (salary >= 0),

    CONSTRAINT chk_salary_history_currency
        CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX idx_salary_history_employee
    ON salary_history(employee_id);

CREATE INDEX idx_salary_history_employee_effective_date
    ON salary_history(employee_id, effective_from DESC);