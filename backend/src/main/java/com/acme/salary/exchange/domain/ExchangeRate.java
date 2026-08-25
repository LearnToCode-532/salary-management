package com.acme.salary.exchange.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
    name = "exchange_rates",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_exchange_rates_currency_reporting_date",
            columnNames = {
                "currency_code",
                "reporting_currency",
                "effective_from"
            }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        name = "currency_code",
        nullable = false,
        length = 3
    )
    private String currencyCode;

    @Column(
        name = "reporting_currency",
        nullable = false,
        length = 3
    )
    private String reportingCurrency;

    @Column(
        nullable = false,
        precision = 19,
        scale = 8
    )
    private BigDecimal rate;

    @Column(
        name = "effective_from",
        nullable = false
    )
    private LocalDate effectiveFrom;

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}