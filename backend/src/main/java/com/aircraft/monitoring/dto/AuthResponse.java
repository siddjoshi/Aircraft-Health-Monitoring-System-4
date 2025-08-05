package com.aircraft.monitoring.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for authentication responses
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private String role;
    private LocalDateTime expiresAt;
    
    public AuthResponse(String token, String username, String email, String role, LocalDateTime expiresAt) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.expiresAt = expiresAt;
    }
}