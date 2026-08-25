package com.acme.salary.analytics;

import com.acme.salary.analytics.repository.CountrySalaryStatisticsProjection;
import com.acme.salary.analytics.repository.SalaryAnalyticsRepository;
import com.acme.salary.analytics.repository.SalarySummaryProjection;
import com.acme.salary.employee.domain.Employee;
import com.acme.salary.employee.repository.EmployeeRepository;
import com.acme.salary.exchange.domain.ExchangeRate;
import com.acme.salary.exchange.repository.ExchangeRateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SalaryAnalyticsRepositoryIntegrationTest {

    @Autowired
    private SalaryAnalyticsRepository analyticsRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ExchangeRateRepository exchangeRateRepository;

    @BeforeEach
    void setUp() {

        employeeRepository.deleteAll();

        exchangeRateRepository.deleteAll();

        createRate("USD", BigDecimal.ONE);
        createRate("INR", new BigDecimal("0.0119"));

        createEmployee(
                "EMP-00001",
                "India",
                "INR",
                new BigDecimal("1000000")
        );

        createEmployee(
                "EMP-00002",
                "India",
                "INR",
                new BigDecimal("2000000")
        );

        createEmployee(
                "EMP-00003",
                "United States",
                "USD",
                new BigDecimal("100000")
        );
    }

    @Test
    void shouldCalculateSalarySummary() {

        SalarySummaryProjection result =
                analyticsRepository.getSalarySummary(
                        null,
                        null
                );

        assertThat(result.getEmployeeCount())
                .isEqualTo(3);

        /*
         * INR:
         *
         * 1,000,000 × 0.0119 = 11,900
         * 2,000,000 × 0.0119 = 23,800
         *
         * USD:
         *
         * 100,000 × 1 = 100,000
         *
         * Total = 135,700 USD
         */
        assertThat(result.getTotalSalary())
                .isEqualByComparingTo(
                        new BigDecimal("135700")
                );

        assertThat(result.getAverageSalary())
                .isEqualByComparingTo(
                        new BigDecimal("45233.333333333333")
                );

        assertThat(result.getMedianSalary())
                .isEqualByComparingTo(
                        new BigDecimal("23800")
                );
    }

    @Test
    void shouldFilterByCountry() {

        SalarySummaryProjection result =
                analyticsRepository.getSalarySummary(
                        "India",
                        null
                );

        assertThat(result.getEmployeeCount())
                .isEqualTo(2);

        assertThat(result.getTotalSalary())
                .isEqualByComparingTo(
                        new BigDecimal("35700")
                );
    }

    @Test
    void shouldFilterByCurrency() {

        SalarySummaryProjection result =
                analyticsRepository.getSalarySummary(
                        null,
                        "INR"
                );

        assertThat(result.getEmployeeCount())
                .isEqualTo(2);

        assertThat(result.getTotalSalary())
                .isEqualByComparingTo(
                        new BigDecimal("35700")
                );
    }

    @Test
    void shouldGroupSalaryByCountry() {

        List<CountrySalaryStatisticsProjection> results =
                analyticsRepository
                        .getSalaryStatisticsByCountry(null);

        assertThat(results)
                .hasSize(2);

        CountrySalaryStatisticsProjection india =
                results.stream()
                        .filter(result ->
                                result.getCountry()
                                        .equals("India"))
                        .findFirst()
                        .orElseThrow();

        assertThat(india.getEmployeeCount())
                .isEqualTo(2);

        assertThat(india.getTotalSalary())
                .isEqualByComparingTo(
                        new BigDecimal("35700")
                );
    }

    private void createRate(
            String currency,
            BigDecimal rate) {

        ExchangeRate exchangeRate =
                new ExchangeRate();

        exchangeRate.setCurrencyCode(currency);
        exchangeRate.setReportingCurrency("USD");
        exchangeRate.setRate(rate);
        exchangeRate.setEffectiveFrom(
                LocalDate.of(2026, 1, 1)
        );

        exchangeRateRepository.save(exchangeRate);
    }

    private void createEmployee(
            String employeeCode,
            String country,
            String currency,
            BigDecimal salary) {

        Employee employee = new Employee();

        employee.setEmployeeCode(employeeCode);
        employee.setFirstName("Test");
        employee.setLastName(employeeCode);
        employee.setEmail(
                employeeCode.toLowerCase()
                        + "@test.com"
        );
        employee.setCountry(country);
        employee.setCurrency(currency);
        employee.setCurrentSalary(salary);

        employeeRepository.save(employee);
    }
}