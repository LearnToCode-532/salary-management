package com.acme.salary.exchange.controller;

import com.acme.salary.exchange.service.ExchangeRateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExchangeRateController.class)
class ExchangeRateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExchangeRateService exchangeRateService;


    @Test
    void shouldReturnSupportedCurrencies() throws Exception {

        when(exchangeRateService.getSupportedCurrencies())
                .thenReturn(
                        List.of(
                                "EUR",
                                "GBP",
                                "INR",
                                "USD"
                        )
                );

        mockMvc.perform(
                get("/api/v1/exchange-rates/currencies")
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(
                MediaType.APPLICATION_JSON
        ))
        .andExpect(jsonPath("$[0]").value("EUR"))
        .andExpect(jsonPath("$[1]").value("GBP"))
        .andExpect(jsonPath("$[2]").value("INR"))
        .andExpect(jsonPath("$[3]").value("USD"));

        verify(exchangeRateService)
                .getSupportedCurrencies();

        verifyNoMoreInteractions(exchangeRateService);
    }


    @Test
    void shouldReturnEmptyListWhenNoCurrenciesExist()
            throws Exception {

        when(exchangeRateService.getSupportedCurrencies())
                .thenReturn(List.of());

        mockMvc.perform(
                get("/api/v1/exchange-rates/currencies")
                        .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));

        verify(exchangeRateService)
                .getSupportedCurrencies();

        verifyNoMoreInteractions(exchangeRateService);
    }
}