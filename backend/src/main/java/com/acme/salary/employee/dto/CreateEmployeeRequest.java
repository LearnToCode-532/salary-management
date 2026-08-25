package com.acme.salary.employee.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateEmployeeRequest(

        @NotBlank
        @Size(max = 50)
        String employeeCode,

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(max = 100)
        String country,

        @NotNull
        @DecimalMin(value = "0.0")
        BigDecimal currentSalary,

        @NotBlank
        @Pattern(regexp = "^[A-Z]{3}$")
        String currency
) {
}