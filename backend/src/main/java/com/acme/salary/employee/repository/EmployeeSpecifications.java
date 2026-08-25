package com.acme.salary.employee.repository;

import com.acme.salary.employee.domain.Employee;
import org.springframework.data.jpa.domain.Specification;

public final class EmployeeSpecifications {

    private EmployeeSpecifications() {
    }

    public static Specification<Employee> search(String search) {

        if (search == null || search.isBlank()) {
            return null;
        }

        String value = search.trim().toLowerCase();

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(

                        criteriaBuilder.equal(
                                criteriaBuilder.lower(
                                        root.get("email")
                                ),
                                value
                        ),

                        criteriaBuilder.equal(
                                criteriaBuilder.lower(
                                        root.get("employeeCode")
                                ),
                                value
                        ),

                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("firstName")
                                ),
                                "%" + value + "%"
                        ),

                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("lastName")
                                ),
                                "%" + value + "%"
                        ),

                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("country")
                                ),
                                "%" + value + "%"
                        )
                );
    }
}