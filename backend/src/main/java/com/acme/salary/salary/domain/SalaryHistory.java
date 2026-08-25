package com.acme.salary.salary.domain;

import com.acme.salary.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
    name = "salary_history",
    indexes = {
        @Index(
            name = "idx_salary_history_employee",
            columnList = "employee_id"
        ),
        @Index(
            name = "idx_salary_history_employee_effective_date",
            columnList = "employee_id,effective_from"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class SalaryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "employee_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_salary_history_employee"
        )
    )
    private Employee employee;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal salary;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}