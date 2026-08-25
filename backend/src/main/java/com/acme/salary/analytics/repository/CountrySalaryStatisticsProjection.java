package com.acme.salary.analytics.repository;

import java.math.BigDecimal;

public interface CountrySalaryStatisticsProjection {

    String getCountry();

    Long getEmployeeCount();

    BigDecimal getTotalSalary();

    BigDecimal getAverageSalary();

    BigDecimal getMedianSalary();
}