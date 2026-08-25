package com.acme.salary.analytics.dto;

import java.math.BigDecimal;

public record CountrySalaryStatisticsResponse(
        String country,
        long employeeCount,
        BigDecimal totalSalary,
        BigDecimal averageSalary,
        BigDecimal medianSalary,
        String reportingCurrency
) {
}