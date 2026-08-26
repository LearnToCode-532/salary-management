package com.acme.salary.exchange.service;

import com.acme.salary.exchange.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangeRateServiceImpl
        implements ExchangeRateService {

    private final ExchangeRateRepository exchangeRateRepository;

    @Override
    public List<String> getSupportedCurrencies() {
        return exchangeRateRepository.findSupportedCurrencies();
    }
}