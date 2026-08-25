package com.acme.salary.analytics.service;

import com.acme.salary.analytics.dto.CountrySalaryStatisticsResponse;
import com.acme.salary.analytics.dto.SalarySummaryResponse;

import java.util.List;

public interface AnalyticsService {

    SalarySummaryResponse getSalarySummary(
            String country,
            String currency
    );

    List<CountrySalaryStatisticsResponse>
    getSalaryStatisticsByCountry(
            String currency
    );
}