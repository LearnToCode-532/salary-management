package com.acme.salary.salary.service;

import com.acme.salary.common.exception.EmployeeNotFoundException;
import com.acme.salary.employee.domain.Employee;
import com.acme.salary.employee.repository.EmployeeRepository;
import com.acme.salary.salary.domain.SalaryHistory;
import com.acme.salary.salary.dto.SalaryHistoryResponse;
import com.acme.salary.salary.dto.SalaryResponse;
import com.acme.salary.salary.dto.UpdateSalaryRequest;
import com.acme.salary.salary.exception.InvalidSalaryEffectiveDateException;
import com.acme.salary.salary.repository.SalaryHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalaryServiceImpl implements SalaryService {

    private final EmployeeRepository employeeRepository;
    private final SalaryHistoryRepository salaryHistoryRepository;

    @Override
    public SalaryResponse getCurrentSalary(Long employeeId) {

            Employee employee = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new EmployeeNotFoundException(employeeId));

            SalaryHistory latestHistory = salaryHistoryRepository
                            .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                            employeeId)
                            .orElse(null);

            return new SalaryResponse(
                            employee.getId(),
                            employee.getCurrentSalary(),
                            employee.getCurrency(),
                            latestHistory != null
                                            ? latestHistory.getEffectiveFrom()
                                            : null);
    }

    @Override
    @Transactional
    public SalaryResponse updateSalary(
            Long employeeId,
            UpdateSalaryRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(employeeId));

        SalaryHistory latestHistory =
                salaryHistoryRepository
                        .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                employeeId
                        )
                        .orElse(null);

        if (latestHistory != null &&
                !request.effectiveFrom()
                        .isAfter(latestHistory.getEffectiveFrom())) {

            throw new InvalidSalaryEffectiveDateException(
                    "Salary effective date must be after the latest salary effective date"
            );
        }

        employee.setCurrentSalary(request.salary());
        employee.setCurrency(request.currency());

        SalaryHistory history = new SalaryHistory();
        history.setEmployee(employee);
        history.setSalary(request.salary());
        history.setCurrency(request.currency());
        history.setEffectiveFrom(request.effectiveFrom());

        salaryHistoryRepository.save(history);

        return new SalaryResponse(
                employee.getId(),
                employee.getCurrentSalary(),
                employee.getCurrency(),
                request.effectiveFrom()
        );
    }

    @Override
    public Page<SalaryHistoryResponse> getSalaryHistory(
            Long employeeId,
            Pageable pageable) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new EmployeeNotFoundException(employeeId);
        }

        return salaryHistoryRepository
                .findByEmployeeIdOrderByEffectiveFromDesc(
                        employeeId,
                        pageable
                )
                .map(history ->
                        new SalaryHistoryResponse(
                                history.getId(),
                                history.getEmployee().getId(),
                                history.getSalary(),
                                history.getCurrency(),
                                history.getEffectiveFrom(),
                                history.getCreatedAt()
                        )
                );
    }
}