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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalaryServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private SalaryHistoryRepository salaryHistoryRepository;

    private SalaryServiceImpl salaryService;

    @BeforeEach
    void setUp() {
        salaryService = new SalaryServiceImpl(
                employeeRepository,
                salaryHistoryRepository
        );
    }

    @Test
    void shouldGetCurrentSalary() {

        Employee employee = employee();

        SalaryHistory history =
                salaryHistory(
                        employee,
                        new BigDecimal("1500000"),
                        LocalDate.of(2026, 8, 1)
                );

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(salaryHistoryRepository
                .findTopByEmployeeIdOrderByEffectiveFromDesc(1L))
                .thenReturn(Optional.of(history));

        SalaryResponse response =
                salaryService.getCurrentSalary(1L);

        assertThat(response.employeeId()).isEqualTo(1L);
        assertThat(response.salary())
                .isEqualByComparingTo("1500000");
        assertThat(response.currency()).isEqualTo("INR");
        assertThat(response.effectiveFrom())
                .isEqualTo(LocalDate.of(2026, 8, 1));
    }

    @Test
    void shouldThrowWhenGettingSalaryForUnknownEmployee() {

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(
                () -> salaryService.getCurrentSalary(999L)
        )
                .isInstanceOf(EmployeeNotFoundException.class)
                .hasMessage("Employee not found: 999");
    }

    @Test
    void shouldUpdateSalaryAndCreateHistory() {

        Employee employee = employee();

        SalaryHistory previousHistory =
                salaryHistory(
                        employee,
                        new BigDecimal("1500000"),
                        LocalDate.of(2026, 8, 1)
                );

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(salaryHistoryRepository
                .findTopByEmployeeIdOrderByEffectiveFromDesc(1L))
                .thenReturn(Optional.of(previousHistory));

        when(salaryHistoryRepository.save(any(SalaryHistory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UpdateSalaryRequest request =
                new UpdateSalaryRequest(
                        new BigDecimal("1700000"),
                        "INR",
                        LocalDate.of(2026, 9, 1)
                );

        SalaryResponse response =
                salaryService.updateSalary(1L, request);

        assertThat(employee.getCurrentSalary())
                .isEqualByComparingTo("1700000");

        assertThat(employee.getCurrency())
                .isEqualTo("INR");

        assertThat(response.salary())
                .isEqualByComparingTo("1700000");

        assertThat(response.effectiveFrom())
                .isEqualTo(LocalDate.of(2026, 9, 1));

        verify(salaryHistoryRepository)
                .save(argThat(history ->
                        history.getSalary()
                                .compareTo(new BigDecimal("1700000")) == 0
                                && history.getCurrency().equals("INR")
                                && history.getEffectiveFrom()
                                .equals(LocalDate.of(2026, 9, 1))
                ));
    }

    @Test
    void shouldRejectSalaryUpdateWithEarlierEffectiveDate() {

        Employee employee = employee();

        SalaryHistory previousHistory =
                salaryHistory(
                        employee,
                        new BigDecimal("1500000"),
                        LocalDate.of(2026, 8, 1)
                );

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(salaryHistoryRepository
                .findTopByEmployeeIdOrderByEffectiveFromDesc(1L))
                .thenReturn(Optional.of(previousHistory));

        UpdateSalaryRequest request =
                new UpdateSalaryRequest(
                        new BigDecimal("1700000"),
                        "INR",
                        LocalDate.of(2026, 7, 1)
                );

        assertThatThrownBy(
                () -> salaryService.updateSalary(1L, request)
        )
                .isInstanceOf(
                        InvalidSalaryEffectiveDateException.class
                );

        assertThat(employee.getCurrentSalary())
                .isEqualByComparingTo("1500000");

        verify(salaryHistoryRepository, never())
                .save(any(SalaryHistory.class));
    }

    @Test
    void shouldRejectSalaryUpdateForUnknownEmployee() {

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        UpdateSalaryRequest request =
                new UpdateSalaryRequest(
                        new BigDecimal("1700000"),
                        "INR",
                        LocalDate.of(2026, 9, 1)
                );

        assertThatThrownBy(
                () -> salaryService.updateSalary(999L, request)
        )
                .isInstanceOf(EmployeeNotFoundException.class);
    }

    @Test
    void shouldReturnPaginatedSalaryHistory() {

        Employee employee = employee();

        SalaryHistory history =
                salaryHistory(
                        employee,
                        new BigDecimal("1500000"),
                        LocalDate.of(2026, 8, 1)
                );

        Page<SalaryHistory> page =
                new PageImpl<>(
                        List.of(history),
                        PageRequest.of(0, 20),
                        1
                );

        when(employeeRepository.existsById(1L))
                .thenReturn(true);

        when(salaryHistoryRepository
                .findByEmployeeIdOrderByEffectiveFromDesc(
                        eq(1L),
                        any(Pageable.class)
                ))
                .thenReturn(page);

        Page<SalaryHistoryResponse> result =
                salaryService.getSalaryHistory(
                        1L,
                        PageRequest.of(0, 20)
                );

        assertThat(result.getTotalElements())
                .isEqualTo(1);

        assertThat(result.getContent())
                .hasSize(1);

        assertThat(result.getContent().getFirst().salary())
                .isEqualByComparingTo("1500000");
    }

    @Test
    void shouldThrowWhenGettingHistoryForUnknownEmployee() {

        when(employeeRepository.existsById(999L))
                .thenReturn(false);

        assertThatThrownBy(
                () -> salaryService.getSalaryHistory(
                        999L,
                        PageRequest.of(0, 20)
                )
        )
                .isInstanceOf(EmployeeNotFoundException.class);
    }

    private Employee employee() {

        Employee employee = new Employee();

        employee.setId(1L);
        employee.setEmployeeCode("EMP-10001");
        employee.setFirstName("Rahul");
        employee.setLastName("Sharma");
        employee.setEmail("rahul@acme.com");
        employee.setCountry("India");
        employee.setCurrentSalary(
                new BigDecimal("1500000")
        );
        employee.setCurrency("INR");
        employee.setVersion(0L);

        return employee;
    }

    private SalaryHistory salaryHistory(
            Employee employee,
            BigDecimal salary,
            LocalDate effectiveFrom) {

        SalaryHistory history = new SalaryHistory();

        history.setId(1L);
        history.setEmployee(employee);
        history.setSalary(salary);
        history.setCurrency("INR");
        history.setEffectiveFrom(effectiveFrom);

        return history;
    }
}