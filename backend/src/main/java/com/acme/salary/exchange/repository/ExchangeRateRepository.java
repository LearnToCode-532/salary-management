package com.acme.salary.exchange.repository;

import com.acme.salary.exchange.domain.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExchangeRateRepository
        extends JpaRepository<ExchangeRate, Long> {

    @Query("""
        SELECT DISTINCT e.currencyCode
        FROM ExchangeRate e
        ORDER BY e.currencyCode
    """)
    List<String> findSupportedCurrencies();
}