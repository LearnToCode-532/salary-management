package com.acme.salary.analytics.service;

import com.acme.salary.analytics.dto.CountrySalaryStatisticsResponse;
import com.acme.salary.analytics.dto.SalarySummaryResponse;
import com.acme.salary.analytics.repository.CountrySalaryStatisticsProjection;
import com.acme.salary.analytics.repository.SalaryAnalyticsRepository;
import com.acme.salary.analytics.repository.SalarySummaryProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl
        implements AnalyticsService {

    private static final String REPORTING_CURRENCY = "USD";

    private final SalaryAnalyticsRepository
            salaryAnalyticsRepository;

    @Override
    public SalarySummaryResponse getSalarySummary(
            String country,
            String currency) {

        SalarySummaryProjection result =
                salaryAnalyticsRepository.getSalarySummary(
                        country,
                        currency
                );

        return new SalarySummaryResponse(
                result.getEmployeeCount(),
                result.getTotalSalary(),
                result.getAverageSalary(),
                result.getMedianSalary(),
                REPORTING_CURRENCY
        );
    }

    @Override
    public List<CountrySalaryStatisticsResponse>
    getSalaryStatisticsByCountry(String currency) {

        return salaryAnalyticsRepository
                .getSalaryStatisticsByCountry(currency)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CountrySalaryStatisticsResponse toResponse(
            CountrySalaryStatisticsProjection projection) {

        return new CountrySalaryStatisticsResponse(
                projection.getCountry(),
                projection.getEmployeeCount(),
                projection.getTotalSalary(),
                projection.getAverageSalary(),
                projection.getMedianSalary(),
                REPORTING_CURRENCY
        );
    }
}