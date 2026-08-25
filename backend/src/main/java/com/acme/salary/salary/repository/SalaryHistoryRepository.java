package com.acme.salary.salary.repository;

import com.acme.salary.salary.domain.SalaryHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaryHistoryRepository
        extends JpaRepository<SalaryHistory, Long> {

    Optional<SalaryHistory>
    findTopByEmployeeIdOrderByEffectiveFromDesc(Long employeeId);

    Page<SalaryHistory>
    findByEmployeeIdOrderByEffectiveFromDesc(
            Long employeeId,
            Pageable pageable
    );
}