package com.acme.salary.analytics.controller;

import com.acme.salary.analytics.dto.CountrySalaryStatisticsResponse;
import com.acme.salary.analytics.dto.SalarySummaryResponse;
import com.acme.salary.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public SalarySummaryResponse getSalarySummary(
            @RequestParam(required = false)
            String country,

            @RequestParam(required = false)
            String currency) {

        return analyticsService.getSalarySummary(
                country,
                currency
        );
    }

    @GetMapping("/countries")
    public List<CountrySalaryStatisticsResponse>
    getCountryStatistics(
            @RequestParam(required = false)
            String currency) {

        return analyticsService
                .getSalaryStatisticsByCountry(currency);
    }
}