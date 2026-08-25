package com.acme.salary.analytics.repository;

import java.math.BigDecimal;

public interface SalarySummaryProjection {

    Long getEmployeeCount();

    BigDecimal getTotalSalary();

    BigDecimal getAverageSalary();

    BigDecimal getMedianSalary();
}