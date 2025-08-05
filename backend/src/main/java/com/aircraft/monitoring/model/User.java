package com.aircraft.monitoring.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * User entity for authentication and authorization
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.VIEWER;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    @Column(name = "account_non_expired", nullable = false)
    private boolean accountNonExpired = true;
    
    @Column(name = "account_non_locked", nullable = false)
    private boolean accountNonLocked = true;
    
    @Column(name = "credentials_non_expired", nullable = false)
    private boolean credentialsNonExpired = true;
    
    public enum Role {
        ADMIN("Full system access, can manage users and trigger simulations"),
        OPERATOR("Monitor data, limited simulation access"),
        VIEWER("Read-only access to dashboard");
        
        private final String description;
        
        Role(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
}