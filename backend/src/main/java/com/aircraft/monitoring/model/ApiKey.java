package com.aircraft.monitoring.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * API Key entity for service-to-service authentication
 */
@Entity
@Table(name = "api_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiKey {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Key ID is required")
    @Column(name = "key_id", unique = true, nullable = false)
    private String keyId;
    
    @NotBlank(message = "Hashed key is required")
    @Column(name = "hashed_key", nullable = false)
    private String hashedKey;
    
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false)
    private String name;
    
    @ElementCollection(targetClass = ApiKeyScope.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "api_key_scopes", joinColumns = @JoinColumn(name = "api_key_id"))
    @Column(name = "scope")
    private Set<ApiKeyScope> scopes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "key_type", nullable = false)
    private ApiKeyType keyType = ApiKeyType.SERVICE;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "last_used")
    private LocalDateTime lastUsed;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @Column(name = "rate_limit_per_minute", nullable = false)
    private int rateLimitPerMinute = 100;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    public enum ApiKeyType {
        ADMIN("Full API access, can manage other keys"),
        SERVICE("Programmatic access, specific endpoint access"),
        READ_ONLY("GET endpoints only"),
        MONITORING("Health and status endpoints only");
        
        private final String description;
        
        ApiKeyType(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    public enum ApiKeyScope {
        READ_DATA("Access to aircraft data endpoints"),
        WRITE_DATA("Access to data modification endpoints"),
        SIMULATE("Access to simulation endpoints"),
        ADMIN("Access to admin endpoints"),
        HEALTH("Access to health and status endpoints");
        
        private final String description;
        
        ApiKeyScope(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
}