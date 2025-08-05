package com.aircraft.monitoring.service;

import org.owasp.encoder.Encode;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

/**
 * Service for input sanitization and validation
 */
@Service
public class SanitizationService {
    
    // Patterns for various input validations
    private static final Pattern ALPHANUMERIC_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s._-]+$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    
    /**
     * Sanitize HTML content to prevent XSS attacks
     */
    public String sanitizeHtml(String input) {
        if (input == null) {
            return null;
        }
        return Encode.forHtml(input.trim());
    }
    
    /**
     * Sanitize JavaScript content
     */
    public String sanitizeJavaScript(String input) {
        if (input == null) {
            return null;
        }
        return Encode.forJavaScript(input.trim());
    }
    
    /**
     * Sanitize for XML content
     */
    public String sanitizeXml(String input) {
        if (input == null) {
            return null;
        }
        return Encode.forXml(input.trim());
    }
    
    /**
     * Sanitize general text input
     */
    public String sanitizeText(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove potentially dangerous characters
        String sanitized = input.trim()
                .replaceAll("[<>\"'&]", "") // Remove HTML/XML special chars
                .replaceAll("\\p{Cntrl}", "") // Remove control characters
                .replaceAll("[\r\n\t]", " ") // Replace line breaks with spaces
                .replaceAll("\\s+", " "); // Normalize whitespace
        
        return sanitized.length() > 1000 ? sanitized.substring(0, 1000) : sanitized;
    }
    
    /**
     * Validate and sanitize alert messages
     */
    public String sanitizeAlertMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Alert message cannot be empty");
        }
        
        String sanitized = sanitizeText(message);
        
        if (sanitized.length() > 500) {
            throw new IllegalArgumentException("Alert message too long (max 500 characters)");
        }
        
        return sanitized;
    }
    
    /**
     * Validate alphanumeric input
     */
    public boolean isValidAlphanumeric(String input) {
        return input != null && ALPHANUMERIC_PATTERN.matcher(input).matches();
    }
    
    /**
     * Validate email format
     */
    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Sanitize SQL input (basic protection)
     */
    public String sanitizeSql(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove common SQL injection patterns
        return input.replaceAll("(?i)(union|select|insert|update|delete|drop|create|alter|exec|execute)", "")
                .replaceAll("[';\"\\\\]", "")
                .trim();
    }
}