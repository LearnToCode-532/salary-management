package com.acme.salary.salary.service;

import com.acme.salary.salary.dto.SalaryHistoryResponse;
import com.acme.salary.salary.dto.SalaryResponse;
import com.acme.salary.salary.dto.UpdateSalaryRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SalaryService {

    SalaryResponse getCurrentSalary(Long employeeId);

    SalaryResponse updateSalary(
            Long employeeId,
            UpdateSalaryRequest request
    );

    Page<SalaryHistoryResponse> getSalaryHistory(
            Long employeeId,
            Pageable pageable
    );
}