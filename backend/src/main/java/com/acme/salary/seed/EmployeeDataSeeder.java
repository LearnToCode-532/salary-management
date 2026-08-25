package com.acme.salary.seed;

import com.acme.salary.employee.domain.Employee;
import com.acme.salary.employee.repository.EmployeeRepository;
import com.acme.salary.salary.domain.SalaryHistory;
import com.acme.salary.salary.repository.SalaryHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmployeeDataSeeder implements CommandLineRunner {

    private final SeedDataConfiguration configuration;
    private final EmployeeRepository employeeRepository;
    private final SalaryHistoryRepository salaryHistoryRepository;

    private static final String[] COUNTRIES = {
            "India",
            "United States",
            "United Kingdom",
            "Germany",
            "Singapore",
            "United Arab Emirates"
    };

    private static final String[] CURRENCIES = {
            "INR",
            "USD",
            "GBP",
            "EUR",
            "SGD",
            "AED"
    };

    @Override
    @Transactional
    public void run(String... args) {

        if (!configuration.enabled()) {
            return;
        }

        if (employeeRepository.count() > 0) {
            log.info("Seed skipped because employees already exist");
            return;
        }

        log.info(
                "Starting employee seed: {} employees",
                configuration.employeeCount()
        );

        List<Employee> employees = new ArrayList<>(
                configuration.employeeCount()
        );

        for (int i = 1; i <= configuration.employeeCount(); i++) {

            String country = COUNTRIES[(i - 1) % COUNTRIES.length];
            String currency = CURRENCIES[(i - 1) % CURRENCIES.length];

            Employee employee = new Employee();

            employee.setEmployeeCode(
                    String.format("EMP-%05d", i)
            );

            employee.setFirstName("Employee");
            employee.setLastName(String.valueOf(i));

            employee.setEmail(
                    "employee" + i + "@acme.com"
            );

            employee.setCountry(country);

            BigDecimal salary = generateSalary(i, currency);

            employee.setCurrentSalary(salary);
            employee.setCurrency(currency);

            employees.add(employee);
        }

        List<Employee> savedEmployees =
                employeeRepository.saveAll(employees);

        List<SalaryHistory> histories =
                new ArrayList<>(savedEmployees.size());

        for (Employee employee : savedEmployees) {

            SalaryHistory history = new SalaryHistory();

            history.setEmployee(employee);
            history.setSalary(employee.getCurrentSalary());
            history.setCurrency(employee.getCurrency());
            history.setEffectiveFrom(
                    LocalDate.of(2026, 1, 1)
            );

            histories.add(history);
        }

        salaryHistoryRepository.saveAll(histories);

        log.info(
                "Employee seed completed: {} employees",
                savedEmployees.size()
        );
    }

    private BigDecimal generateSalary(
                    int index,
                    String currency) {

            return switch (currency) {

                    case "INR" ->
                            BigDecimal.valueOf(
                                            500_000L
                                                            + ((long) index * 13_750L
                                                                            % 4_500_000L));

                    case "USD" ->
                            BigDecimal.valueOf(
                                            50_000L
                                                            + ((long) index * 1_375L
                                                                            % 150_000L));

                    case "GBP" ->
                            BigDecimal.valueOf(
                                            40_000L
                                                            + ((long) index * 1_100L
                                                                            % 120_000L));

                    case "EUR" ->
                            BigDecimal.valueOf(
                                            40_000L
                                                            + ((long) index * 1_100L
                                                                            % 120_000L));

                    case "SGD" ->
                            BigDecimal.valueOf(
                                            50_000L
                                                            + ((long) index * 1_300L
                                                                            % 150_000L));

                    case "AED" ->
                            BigDecimal.valueOf(
                                            120_000L
                                                            + ((long) index * 3_000L
                                                                            % 300_000L));

                    default ->
                            throw new IllegalArgumentException(
                                            "Unsupported currency: " + currency);
            };
    }
}