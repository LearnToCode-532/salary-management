package com.acme.salary.analytics.service;

import com.acme.salary.analytics.repository.SalaryAnalyticsRepository;
import com.acme.salary.analytics.repository.SalarySummaryProjection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class AnalyticsServiceImplTest {

    @Mock
    private SalaryAnalyticsRepository repository;

    private AnalyticsServiceImpl service;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        service = new AnalyticsServiceImpl(repository);
    }

    @Test
    void shouldMapSalarySummary() {

        SalarySummaryProjection projection =
                new SalarySummaryProjection() {

                    @Override
                    public Long getEmployeeCount() {
                        return 100L;
                    }

                    @Override
                    public BigDecimal getTotalSalary() {
                        return new BigDecimal("5000000");
                    }

                    @Override
                    public BigDecimal getAverageSalary() {
                        return new BigDecimal("50000");
                    }

                    @Override
                    public BigDecimal getMedianSalary() {
                        return new BigDecimal("45000");
                    }
                };

        when(repository.getSalarySummary(
                null,
                null
        )).thenReturn(projection);

        var response =
                service.getSalarySummary(
                        null,
                        null
                );

        assertThat(response.employeeCount())
                .isEqualTo(100);

        assertThat(response.totalSalary())
                .isEqualByComparingTo("5000000");

        assertThat(response.averageSalary())
                .isEqualByComparingTo("50000");

        assertThat(response.medianSalary())
                .isEqualByComparingTo("45000");

        assertThat(response.reportingCurrency())
                .isEqualTo("USD");
    }
}