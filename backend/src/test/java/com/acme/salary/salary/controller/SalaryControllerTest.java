package com.acme.salary.salary.controller;

import com.acme.salary.salary.dto.SalaryHistoryResponse;
import com.acme.salary.salary.dto.SalaryResponse;
import com.acme.salary.salary.dto.UpdateSalaryRequest;
import com.acme.salary.salary.service.SalaryService;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SalaryController.class)
class SalaryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SalaryService salaryService;

    @Test
    void shouldGetCurrentSalary() throws Exception {

        when(salaryService.getCurrentSalary(1L))
                .thenReturn(salaryResponse());

        mockMvc.perform(
                        get("/api/v1/employees/1/salary")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId")
                        .value(1))
                .andExpect(jsonPath("$.salary")
                        .value(1500000))
                .andExpect(jsonPath("$.currency")
                        .value("INR"));
    }

    @Test
    void shouldUpdateSalary() throws Exception {

        UpdateSalaryRequest request =
                new UpdateSalaryRequest(
                        new BigDecimal("1700000"),
                        "INR",
                        LocalDate.of(2026, 9, 1)
                );

        when(salaryService.updateSalary(
                eq(1L),
                any(UpdateSalaryRequest.class)
        )).thenReturn(
                new SalaryResponse(
                        1L,
                        new BigDecimal("1700000"),
                        "INR",
                        LocalDate.of(2026, 9, 1)
                )
        );

        mockMvc.perform(
                        put("/api/v1/employees/1/salary")
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.salary")
                        .value(1700000))
                .andExpect(jsonPath("$.effectiveFrom")
                        .value("2026-09-01"));
    }

    @Test
    void shouldRejectInvalidSalaryRequest() throws Exception {

        UpdateSalaryRequest request =
                new UpdateSalaryRequest(
                        new BigDecimal("-100"),
                        "INVALID",
                        null
                );

        mockMvc.perform(
                        put("/api/v1/employees/1/salary")
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldGetSalaryHistory() throws Exception {

        SalaryHistoryResponse history =
                new SalaryHistoryResponse(
                        1L,
                        1L,
                        new BigDecimal("1500000"),
                        "INR",
                        LocalDate.of(2026, 8, 1),
                        Instant.parse(
                                "2026-08-25T00:00:00Z"
                        )
                );

        PageImpl<SalaryHistoryResponse> page =
                new PageImpl<>(
                        List.of(history),
                        PageRequest.of(0, 20),
                        1
                );

        when(salaryService.getSalaryHistory(
                eq(1L),
                any()
        )).thenReturn(page);

        mockMvc.perform(
                        get("/api/v1/employees/1/salary-history")
                                .param("page", "0")
                                .param("size", "20")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].salary")
                        .value(1500000));
    }

    private SalaryResponse salaryResponse() {

        return new SalaryResponse(
                1L,
                new BigDecimal("1500000"),
                "INR",
                LocalDate.of(2026, 8, 1)
        );
    }
}