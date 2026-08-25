package com.acme.salary.analytics.dto;

import java.math.BigDecimal;

public record SalarySummaryResponse(
        long employeeCount,
        BigDecimal totalSalary,
        BigDecimal averageSalary,
        BigDecimal medianSalary,
        String reportingCurrency
) {
}