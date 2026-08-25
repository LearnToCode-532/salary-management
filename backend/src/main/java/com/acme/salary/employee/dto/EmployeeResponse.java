package com.acme.salary.employee.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record EmployeeResponse(
        Long id,
        String employeeCode,
        String firstName,
        String lastName,
        String email,
        String country,
        BigDecimal currentSalary,
        String currency,
        Instant createdAt,
        Instant updatedAt
) {
}