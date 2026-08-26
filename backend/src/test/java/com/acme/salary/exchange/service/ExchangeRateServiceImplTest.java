package com.acme.salary.exchange.service;

import com.acme.salary.exchange.repository.ExchangeRateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExchangeRateServiceImplTest {

    @Mock
    private ExchangeRateRepository exchangeRateRepository;

    @InjectMocks
    private ExchangeRateServiceImpl exchangeRateService;

    @Test
    void shouldReturnSupportedCurrencies() {

        List<String> currencies =
                List.of("EUR", "GBP", "INR", "USD");

        when(exchangeRateRepository.findSupportedCurrencies())
                .thenReturn(currencies);

        List<String> result =
                exchangeRateService.getSupportedCurrencies();

        assertThat(result)
                .containsExactly(
                        "EUR",
                        "GBP",
                        "INR",
                        "USD"
                );

        verify(exchangeRateRepository)
                .findSupportedCurrencies();

        verifyNoMoreInteractions(exchangeRateRepository);
    }


    @Test
    void shouldReturnEmptyListWhenNoCurrenciesExist() {

        when(exchangeRateRepository.findSupportedCurrencies())
                .thenReturn(List.of());

        List<String> result =
                exchangeRateService.getSupportedCurrencies();

        assertThat(result)
                .isEmpty();

        verify(exchangeRateRepository)
                .findSupportedCurrencies();

        verifyNoMoreInteractions(exchangeRateRepository);
    }
}