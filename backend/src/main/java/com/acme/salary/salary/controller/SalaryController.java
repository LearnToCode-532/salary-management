package com.acme.salary.salary.controller;

import com.acme.salary.salary.dto.SalaryHistoryResponse;
import com.acme.salary.salary.dto.SalaryResponse;
import com.acme.salary.salary.dto.UpdateSalaryRequest;
import com.acme.salary.salary.service.SalaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employees/{employeeId}")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping("/salary")
    public SalaryResponse getCurrentSalary(
            @PathVariable Long employeeId) {

        return salaryService.getCurrentSalary(employeeId);
    }

    @PutMapping("/salary")
    public SalaryResponse updateSalary(
            @PathVariable Long employeeId,
            @Valid @RequestBody UpdateSalaryRequest request) {

        return salaryService.updateSalary(
                employeeId,
                request
        );
    }

    @GetMapping("/salary-history")
    public Page<SalaryHistoryResponse> getSalaryHistory(
            @PathVariable Long employeeId,
            @PageableDefault(size = 20)
            Pageable pageable) {

        return salaryService.getSalaryHistory(
                employeeId,
                pageable
        );
    }
}