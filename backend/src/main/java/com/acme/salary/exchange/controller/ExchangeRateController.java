package com.acme.salary.exchange.controller;

import com.acme.salary.exchange.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exchange-rates")
@RequiredArgsConstructor
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    @GetMapping("/currencies")
    public List<String> getSupportedCurrencies() {
        return exchangeRateService.getSupportedCurrencies();
    }
}