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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

        @Mock
        private EmployeeRepository employeeRepository;
        
        @Mock
        private SalaryHistoryRepository salaryHistoryRepository;

        private EmployeeServiceImpl employeeService;

        @BeforeEach
        void setUp() {
                employeeService = new EmployeeServiceImpl(employeeRepository, salaryHistoryRepository);
        }
        
        private CreateEmployeeRequest createRequest() {
                return new CreateEmployeeRequest(
                                "EMP-10001",
                                "Rahul",
                                "Sharma",
                                "rahul@acme.com",
                                "India",
                                new BigDecimal("1500000"),
                                "INR");
        }

        private Employee employee() {
                Employee employee = new Employee();

                employee.setId(1L);
                employee.setEmployeeCode("EMP-10001");
                employee.setFirstName("Rahul");
                employee.setLastName("Sharma");
                employee.setEmail("rahul@acme.com");
                employee.setCountry("India");
                employee.setCurrentSalary(new BigDecimal("1500000"));
                employee.setCurrency("INR");
                employee.setVersion(0L);

                return employee;
        }

        @Test
        void shouldCreateEmployee() {
                CreateEmployeeRequest request = createRequest();
                when(employeeRepository.existsByEmployeeCode("EMP-10001"))
                                .thenReturn(false);
                when(employeeRepository.existsByEmail("rahul@acme.com"))
                                .thenReturn(false);
                Employee saved = employee();
                when(employeeRepository.save(any(Employee.class))).thenReturn(saved);
                when(salaryHistoryRepository.save(any(SalaryHistory.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));
                EmployeeResponse response = employeeService.create(request);

                assertThat(response.employeeCode()).isEqualTo("EMP-10001");
                assertThat(response.currentSalary()).isEqualByComparingTo("1500000");
                verify(employeeRepository).save(any(Employee.class));
                verify(salaryHistoryRepository).save(any(SalaryHistory.class));
        }

        @Test
        void shouldRejectDuplicateEmployeeCode() {
                CreateEmployeeRequest request = createRequest();

                when(employeeRepository.existsByEmployeeCode("EMP-10001"))
                                .thenReturn(true);

                assertThatThrownBy(() -> employeeService.create(request))
                                .isInstanceOf(DuplicateEmployeeException.class)
                                .hasMessageContaining("Employee code already exists");

                verify(employeeRepository, never()).save(any());
        }

        @Test
        void shouldRejectDuplicateEmail() {
                CreateEmployeeRequest request = createRequest();

                when(employeeRepository.existsByEmployeeCode("EMP-10001"))
                                .thenReturn(false);

                when(employeeRepository.existsByEmail("rahul@acme.com"))
                                .thenReturn(true);

                assertThatThrownBy(() -> employeeService.create(request))
                                .isInstanceOf(DuplicateEmployeeException.class)
                                .hasMessageContaining("Email already exists");

                verify(employeeRepository, never()).save(any());
        }

        @Test
        void shouldGetEmployeeById() {
                Employee employee = employee();

                when(employeeRepository.findById(1L))
                                .thenReturn(Optional.of(employee));

                EmployeeResponse response = employeeService.getById(1L);

                assertThat(response.id()).isEqualTo(1L);
                assertThat(response.employeeCode()).isEqualTo("EMP-10001");
        }

        @Test
        void shouldThrowWhenEmployeeDoesNotExist() {
                when(employeeRepository.findById(999L))
                                .thenReturn(Optional.empty());

                assertThatThrownBy(() -> employeeService.getById(999L))
                                .isInstanceOf(EmployeeNotFoundException.class)
                                .hasMessage("Employee not found: 999");
        }

        @Test
        void shouldReturnPaginatedEmployees() {
                Employee employee = employee();

                Page<Employee> page = new PageImpl<>(
                                java.util.List.of(employee),
                                PageRequest.of(0, 20),
                                1);

                when(employeeRepository.findAll(any(Pageable.class)))
                                .thenReturn(page);

                Page<EmployeeResponse> result = employeeService.getAll(PageRequest.of(0, 20));

                assertThat(result.getTotalElements()).isEqualTo(1);
                assertThat(result.getContent()).hasSize(1);
                assertThat(result.getContent().getFirst().employeeCode())
                                .isEqualTo("EMP-10001");
        }

        @Test
        void shouldUpdateEmployee() {
                Employee employee = employee();

                when(employeeRepository.findById(1L))
                                .thenReturn(Optional.of(employee));

                UpdateEmployeeRequest request = new UpdateEmployeeRequest(
                                "Rahul",
                                "Sharma",
                                "rahul.new@acme.com",
                                "India",
                                new BigDecimal("1600000"),
                                "INR");

                when(employeeRepository.existsByEmail("rahul.new@acme.com"))
                                .thenReturn(false);

                EmployeeResponse response = employeeService.update(1L, request);

                assertThat(response.email())
                                .isEqualTo("rahul.new@acme.com");

                assertThat(response.currentSalary())
                                .isEqualByComparingTo("1600000");

                verify(employeeRepository, never()).save(any());
        }

        @Test
        void shouldRejectUpdateWithDuplicateEmail() {
                Employee employee = employee();

                when(employeeRepository.findById(1L))
                                .thenReturn(Optional.of(employee));

                when(employeeRepository.existsByEmail("existing@acme.com"))
                                .thenReturn(true);

                UpdateEmployeeRequest request = new UpdateEmployeeRequest(
                                "Rahul",
                                "Sharma",
                                "existing@acme.com",
                                "India",
                                new BigDecimal("1600000"),
                                "INR");

                assertThatThrownBy(
                                () -> employeeService.update(1L, request))
                                .isInstanceOf(DuplicateEmployeeException.class);

                assertThat(employee.getEmail())
                                .isEqualTo("rahul@acme.com");
        }
        
        @Test
        void shouldAllowUpdateWhenEmailRemainsUnchanged() {

                Employee employee = employee();

                when(employeeRepository.findById(1L))
                                .thenReturn(Optional.of(employee));

                UpdateEmployeeRequest request = new UpdateEmployeeRequest(
                                "Rahul",
                                "Sharma",
                                "rahul@acme.com",
                                "India",
                                new BigDecimal("1600000"),
                                "INR");

                EmployeeResponse response = employeeService.update(1L, request);

                assertThat(response.currentSalary())
                                .isEqualByComparingTo("1600000");

                verify(employeeRepository, never())
                                .existsByEmail("rahul@acme.com");
        }
        
        @Test
        void shouldCreateInitialSalaryHistory() {

                CreateEmployeeRequest request = createRequest();

                when(employeeRepository.existsByEmployeeCode("EMP-10001"))
                        .thenReturn(false);

                when(employeeRepository.existsByEmail("rahul@acme.com"))
                        .thenReturn(false);

                Employee saved = employee();

                when(employeeRepository.save(any(Employee.class)))
                        .thenReturn(saved);

                when(salaryHistoryRepository.save(any(SalaryHistory.class)))
                        .thenAnswer(invocation -> invocation.getArgument(0));

                employeeService.create(request);

                verify(salaryHistoryRepository).save(
                        argThat(history ->
                                history.getEmployee() == saved
                                        && history.getSalary()
                                        .compareTo(new BigDecimal("1500000")) == 0
                                        && history.getCurrency().equals("INR")
                                        && history.getEffectiveFrom()
                                        != null
                        )
                );
        }
}