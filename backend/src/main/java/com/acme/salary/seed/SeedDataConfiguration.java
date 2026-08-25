package com.acme.salary.seed;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.seed")
public record SeedDataConfiguration(
        boolean enabled,
        int employeeCount
) {
}