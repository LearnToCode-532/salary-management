package com.acme.salary.employee.service;

import com.acme.salary.common.exception.DuplicateEmployeeException;
import com.acme.salary.common.exception.EmployeeNotFoundException;
import com.acme.salary.employee.domain.Employee;
import com.acme.salary.employee.dto.CreateEmployeeRequest;
import com.acme.salary.employee.dto.EmployeeResponse;
import com.acme.salary.employee.dto.UpdateEmployeeRequest;
import com.acme.salary.employee.repository.EmployeeRepository;
import com.acme.salary.salary.domain.SalaryHistory;
import com.acme.salary.salary.repository.SalaryHistoryRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final SalaryHistoryRepository salaryHistoryRepository;

    @Override
    @Transactional
    public EmployeeResponse create(CreateEmployeeRequest request) {

        if (employeeRepository.existsByEmployeeCode(request.employeeCode())) {
                throw new DuplicateEmployeeException(
                                "Employee code already exists: " + request.employeeCode());
        }

        if (employeeRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already exists: " + request.email()
            );
        }

        Employee employee = new Employee();
        employee.setEmployeeCode(request.employeeCode());
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setCountry(request.country());
        employee.setCurrentSalary(request.currentSalary());
        employee.setCurrency(request.currency());

        Employee savedEmployee = employeeRepository.save(employee);

        SalaryHistory history = new SalaryHistory();

        history.setEmployee(savedEmployee);
        history.setSalary(request.currentSalary());
        history.setCurrency(request.currency());
        history.setEffectiveFrom(LocalDate.now());

        salaryHistoryRepository.save(history);
        return toResponse(savedEmployee);
    }

    @Override
    public EmployeeResponse getById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id)
                );

        return toResponse(employee);
    }

    @Override
    public Page<EmployeeResponse> getAll(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional
    public EmployeeResponse update(Long id, UpdateEmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id)
                );

        if (!employee.getEmail().equals(request.email())
                && employeeRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already exists: " + request.email()
            );
        }

        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setCountry(request.country());
        employee.setCurrentSalary(request.currentSalary());
        employee.setCurrency(request.currency());

        return toResponse(employee);
    }

    private EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getCountry(),
                employee.getCurrentSalary(),
                employee.getCurrency(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }
}