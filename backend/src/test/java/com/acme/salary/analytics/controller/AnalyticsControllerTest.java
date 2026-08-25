package com.acme.salary.analytics.controller;

import com.acme.salary.analytics.dto.CountrySalaryStatisticsResponse;
import com.acme.salary.analytics.dto.SalarySummaryResponse;
import com.acme.salary.analytics.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AnalyticsService analyticsService;

    @Test
    void shouldReturnSalarySummary() throws Exception {

        SalarySummaryResponse response =
                new SalarySummaryResponse(
                        10000L,
                        new BigDecimal("125000000"),
                        new BigDecimal("12500"),
                        new BigDecimal("11000"),
                        "USD"
                );

        when(analyticsService.getSalarySummary(
                null,
                null
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/v1/analytics/summary")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeCount")
                        .value(10000))
                .andExpect(jsonPath("$.totalSalary")
                        .value(125000000))
                .andExpect(jsonPath("$.averageSalary")
                        .value(12500))
                .andExpect(jsonPath("$.medianSalary")
                        .value(11000))
                .andExpect(jsonPath("$.reportingCurrency")
                        .value("USD"));
    }

    @Test
    void shouldReturnSalarySummaryWithFilters() throws Exception {

        SalarySummaryResponse response =
                new SalarySummaryResponse(
                        2500L,
                        new BigDecimal("30000000"),
                        new BigDecimal("12000"),
                        new BigDecimal("10500"),
                        "USD"
                );

        when(analyticsService.getSalarySummary(
                "India",
                "INR"
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/v1/analytics/summary")
                                .param("country", "India")
                                .param("currency", "INR")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeCount")
                        .value(2500))
                .andExpect(jsonPath("$.totalSalary")
                        .value(30000000))
                .andExpect(jsonPath("$.reportingCurrency")
                        .value("USD"));
    }

    @Test
    void shouldReturnCountryStatistics() throws Exception {

        CountrySalaryStatisticsResponse india =
                new CountrySalaryStatisticsResponse(
                        "India",
                        5000L,
                        new BigDecimal("60000000"),
                        new BigDecimal("12000"),
                        new BigDecimal("10500"),
                        "USD"
                );

        CountrySalaryStatisticsResponse usa =
                new CountrySalaryStatisticsResponse(
                        "United States",
                        3000L,
                        new BigDecimal("45000000"),
                        new BigDecimal("15000"),
                        new BigDecimal("14000"),
                        "USD"
                );

        when(analyticsService.getSalaryStatisticsByCountry(null))
                .thenReturn(List.of(india, usa));

        mockMvc.perform(
                        get("/api/v1/analytics/countries")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()")
                        .value(2))
                .andExpect(jsonPath("$[0].country")
                        .value("India"))
                .andExpect(jsonPath("$[0].employeeCount")
                        .value(5000))
                .andExpect(jsonPath("$[1].country")
                        .value("United States"))
                .andExpect(jsonPath("$[1].employeeCount")
                        .value(3000));
    }

    @Test
    void shouldPassCurrencyFilterToCountryStatistics()
            throws Exception {

        when(analyticsService.getSalaryStatisticsByCountry("INR"))
                .thenReturn(List.of());

        mockMvc.perform(
                        get("/api/v1/analytics/countries")
                                .param("currency", "INR")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()")
                        .value(0));
    }
}