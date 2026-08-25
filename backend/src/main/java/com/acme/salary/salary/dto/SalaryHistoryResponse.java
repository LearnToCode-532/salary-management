package com.acme.salary.salary.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record SalaryHistoryResponse(
        Long id,
        Long employeeId,
        BigDecimal salary,
        String currency,
        LocalDate effectiveFrom,
        Instant createdAt
) {
}