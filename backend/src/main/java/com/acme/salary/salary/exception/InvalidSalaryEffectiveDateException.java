package com.acme.salary.salary.exception;

public class InvalidSalaryEffectiveDateException
        extends RuntimeException {

    public InvalidSalaryEffectiveDateException(String message) {
        super(message);
    }
}