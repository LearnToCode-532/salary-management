package com.acme.salary.common.exception;

public class DuplicateEmployeeException extends RuntimeException {

    public DuplicateEmployeeException(String message) {
        super(message);
    }
}