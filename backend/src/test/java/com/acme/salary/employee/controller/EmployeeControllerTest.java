package com.acme.salary.employee.controller;

import com.acme.salary.employee.dto.CreateEmployeeRequest;
import com.acme.salary.employee.dto.EmployeeResponse;
import com.acme.salary.employee.dto.UpdateEmployeeRequest;
import com.acme.salary.employee.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EmployeeService employeeService;

    @Test
    void shouldCreateEmployee() throws Exception {

        CreateEmployeeRequest request =
                new CreateEmployeeRequest(
                        "EMP-10001",
                        "Rahul",
                        "Sharma",
                        "rahul@acme.com",
                        "India",
                        new BigDecimal("1500000"),
                        "INR"
                );

        EmployeeResponse response = response();

        when(employeeService.create(any(CreateEmployeeRequest.class)))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/v1/employees")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.employeeCode")
                        .value("EMP-10001"));
    }

    @Test
    void shouldGetEmployee() throws Exception {

        when(employeeService.getById(1L))
                .thenReturn(response());

        mockMvc.perform(
                        get("/api/v1/employees/1")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeCode")
                        .value("EMP-10001"));
    }

    @Test
    void shouldGetEmployees() throws Exception {

        PageImpl<EmployeeResponse> page =
                new PageImpl<>(
                        List.of(response()),
                        PageRequest.of(0, 20),
                        1
                );

        when(employeeService.getAll(any()))
                .thenReturn(page);

        mockMvc.perform(
                        get("/api/v1/employees")
                                .param("page", "0")
                                .param("size", "20")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].employeeCode")
                        .value("EMP-10001"));
    }

    @Test
    void shouldRejectInvalidCreateRequest() throws Exception {

        CreateEmployeeRequest request =
                new CreateEmployeeRequest(
                        "",
                        "Rahul",
                        "Sharma",
                        "invalid-email",
                        "India",
                        new BigDecimal("-100"),
                        "INR"
                );

        mockMvc.perform(
                        post("/api/v1/employees")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateEmployee() throws Exception {

        UpdateEmployeeRequest request =
                new UpdateEmployeeRequest(
                        "Rahul",
                        "Sharma",
                        "rahul@acme.com",
                        "India",
                        new BigDecimal("1600000"),
                        "INR"
                );

        when(employeeService.update(
                eq(1L),
                any(UpdateEmployeeRequest.class)
        )).thenReturn(response());

        mockMvc.perform(
                        put("/api/v1/employees/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk());
    }

    private EmployeeResponse response() {
        Instant now = Instant.parse("2026-08-25T00:00:00Z");

        return new EmployeeResponse(
                1L,
                "EMP-10001",
                "Rahul",
                "Sharma",
                "rahul@acme.com",
                "India",
                new BigDecimal("1500000"),
                "INR",
                now,
                now
        );
    }
}