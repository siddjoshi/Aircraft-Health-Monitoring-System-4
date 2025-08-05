package com.aircraft.monitoring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for alert requests with validation
 */
@Data
public class AlertRequest {
    
    @NotBlank(message = "Alert type is required")
    @Pattern(regexp = "^(ENGINE|FUEL|HYDRAULIC|SYSTEM|CUSTOM)$", 
             message = "Alert type must be one of: ENGINE, FUEL, HYDRAULIC, SYSTEM, CUSTOM")
    private String type;
    
    @NotBlank(message = "Message is required")
    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;
    
    @Pattern(regexp = "^(INFO|WARNING|CRITICAL)$", 
             message = "Severity must be one of: INFO, WARNING, CRITICAL")
    private String severity = "INFO";
}