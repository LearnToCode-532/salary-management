package com.acme.salary.seed;

import com.acme.salary.employee.domain.Employee;
import com.acme.salary.employee.repository.EmployeeRepository;
import com.acme.salary.salary.domain.SalaryHistory;
import com.acme.salary.salary.repository.SalaryHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeDataSeederTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private SalaryHistoryRepository salaryHistoryRepository;

    private EmployeeDataSeeder seeder;

    @BeforeEach
    void setUp() {

        SeedDataConfiguration configuration =
                new SeedDataConfiguration(true, 10);

        seeder = new EmployeeDataSeeder(
                configuration,
                employeeRepository,
                salaryHistoryRepository
        );
    }

    @Test
    void shouldSkipSeedWhenEmployeesAlreadyExist() {

        when(employeeRepository.count())
                .thenReturn(1L);

        seeder.run();

        verify(employeeRepository, never())
                .saveAll(any());

        verify(salaryHistoryRepository, never())
                .saveAll(any());
    }

    @Test
    void shouldCreateEmployeesAndSalaryHistory() {

        when(employeeRepository.count())
                .thenReturn(0L);

        when(employeeRepository.saveAll(anyList()))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        when(salaryHistoryRepository.saveAll(anyList()))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        seeder.run();

        ArgumentCaptor<List<Employee>> employeeCaptor =
                ArgumentCaptor.forClass(List.class);

        verify(employeeRepository)
                .saveAll(employeeCaptor.capture());

        List<Employee> employees =
                employeeCaptor.getValue();

        assertThat(employees)
                .hasSize(10);

        assertThat(employees.get(0).getEmployeeCode())
                .isEqualTo("EMP-00001");

        assertThat(employees.get(9).getEmployeeCode())
                .isEqualTo("EMP-00010");

        ArgumentCaptor<List<SalaryHistory>> historyCaptor =
                ArgumentCaptor.forClass(List.class);

        verify(salaryHistoryRepository)
                .saveAll(historyCaptor.capture());

        assertThat(historyCaptor.getValue())
                .hasSize(10);
    }

    @Test
    void shouldNotSeedWhenDisabled() {

        SeedDataConfiguration disabledConfiguration =
                new SeedDataConfiguration(false, 10);

        EmployeeDataSeeder disabledSeeder =
                new EmployeeDataSeeder(
                        disabledConfiguration,
                        employeeRepository,
                        salaryHistoryRepository
                );

        disabledSeeder.run();

        verifyNoInteractions(
                employeeRepository,
                salaryHistoryRepository
        );
    }
}