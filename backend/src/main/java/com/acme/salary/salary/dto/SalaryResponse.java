package com.acme.salary.salary.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalaryResponse(
        Long employeeId,
        BigDecimal salary,
        String currency,
        LocalDate effectiveFrom
) {
}