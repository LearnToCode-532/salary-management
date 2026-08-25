package com.acme.salary.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.acme.salary.employee.domain.Employee;

import java.util.List;

public interface SalaryAnalyticsRepository
        extends JpaRepository<Employee, Long> {

    @Query(value = """
        SELECT
            COUNT(e.id) AS employeeCount,

            COALESCE(
                SUM(e.current_salary * er.rate),
                0
            ) AS totalSalary,

            COALESCE(
                AVG(e.current_salary * er.rate),
                0
            ) AS averageSalary,

            COALESCE(
                PERCENTILE_CONT(0.5)
                WITHIN GROUP (
                    ORDER BY e.current_salary * er.rate
                ),
                0
            ) AS medianSalary

        FROM employees e

        JOIN exchange_rates er
          ON er.currency_code = e.currency
         AND er.reporting_currency = 'USD'

        WHERE (:country IS NULL OR e.country = :country)
          AND (:currency IS NULL OR e.currency = :currency)
        """,
        nativeQuery = true)
    SalarySummaryProjection getSalarySummary(
            @Param("country") String country,
            @Param("currency") String currency
    );

    @Query(value = """
        SELECT
            e.country AS country,

            COUNT(e.id) AS employeeCount,

            COALESCE(
                SUM(e.current_salary * er.rate),
                0
            ) AS totalSalary,

            COALESCE(
                AVG(e.current_salary * er.rate),
                0
            ) AS averageSalary,

            COALESCE(
                PERCENTILE_CONT(0.5)
                WITHIN GROUP (
                    ORDER BY e.current_salary * er.rate
                ),
                0
            ) AS medianSalary

        FROM employees e

        JOIN exchange_rates er
          ON er.currency_code = e.currency
         AND er.reporting_currency = 'USD'

        WHERE (:currency IS NULL OR e.currency = :currency)

        GROUP BY e.country

        ORDER BY e.country
        """,
        nativeQuery = true)
    List<CountrySalaryStatisticsProjection>
    getSalaryStatisticsByCountry(
            @Param("currency") String currency
    );
}