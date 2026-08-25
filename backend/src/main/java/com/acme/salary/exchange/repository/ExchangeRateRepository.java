package com.acme.salary.exchange.repository;

import com.acme.salary.exchange.domain.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExchangeRateRepository
        extends JpaRepository<ExchangeRate, Long> {

    Optional<ExchangeRate>
    findTopByCurrencyCodeAndReportingCurrencyOrderByEffectiveFromDesc(
            String currencyCode,
            String reportingCurrency
    );
}