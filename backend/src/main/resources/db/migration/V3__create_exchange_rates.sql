CREATE TABLE exchange_rates (
    id BIGSERIAL PRIMARY KEY,

    currency_code VARCHAR(3) NOT NULL,

    reporting_currency VARCHAR(3) NOT NULL,

    rate NUMERIC(19, 8) NOT NULL,

    effective_from DATE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT uk_exchange_rates_currency_reporting_date
        UNIQUE (
            currency_code,
            reporting_currency,
            effective_from
        ),

    CONSTRAINT chk_exchange_rates_currency
        CHECK (currency_code ~ '^[A-Z]{3}$'),

    CONSTRAINT chk_exchange_rates_reporting_currency
        CHECK (reporting_currency ~ '^[A-Z]{3}$'),

    CONSTRAINT chk_exchange_rates_rate
        CHECK (rate > 0)
);

CREATE INDEX idx_exchange_rates_lookup
    ON exchange_rates (
        currency_code,
        reporting_currency,
        effective_from DESC
    );
INSERT INTO exchange_rates (
    currency_code,
    reporting_currency,
    rate,
    effective_from,
    created_at
)
VALUES
    ('USD', 'USD', 1.00000000, '2026-01-01', CURRENT_TIMESTAMP),
    ('INR', 'USD', 0.01190000, '2026-01-01', CURRENT_TIMESTAMP),
    ('EUR', 'USD', 1.17000000, '2026-01-01', CURRENT_TIMESTAMP),
    ('GBP', 'USD', 1.35000000, '2026-01-01', CURRENT_TIMESTAMP),
    ('SGD', 'USD', 0.78000000, '2026-01-01', CURRENT_TIMESTAMP),
    ('AED', 'USD', 0.27230000, '2026-01-01', CURRENT_TIMESTAMP);