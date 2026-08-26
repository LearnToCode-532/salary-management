package com.acme.salary.employee.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record UpdateEmployeeRequest(

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
        String country
) {
}