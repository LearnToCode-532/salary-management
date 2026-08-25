package com.acme.salary.employee.service;

import com.acme.salary.employee.dto.CreateEmployeeRequest;
import com.acme.salary.employee.dto.EmployeeResponse;
import com.acme.salary.employee.dto.UpdateEmployeeRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {

    EmployeeResponse create(CreateEmployeeRequest request);

    EmployeeResponse getById(Long id);

    Page<EmployeeResponse> getAll(String search, Pageable pageable);

    EmployeeResponse update(Long id, UpdateEmployeeRequest request);
}