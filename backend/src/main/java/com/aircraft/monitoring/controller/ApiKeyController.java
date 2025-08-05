package com.aircraft.monitoring.controller;

import com.aircraft.monitoring.model.ApiKey;
import com.aircraft.monitoring.repository.ApiKeyRepository;
import com.aircraft.monitoring.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * API Key Management Controller - Admin only
 */
@RestController
@RequestMapping("/api/admin/keys")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class ApiKeyController {
    
    private final ApiKeyRepository apiKeyRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PostMapping
    public ResponseEntity<?> createApiKey(@RequestBody CreateApiKeyRequest request, Authentication authentication) {
        try {
            // Generate unique key ID and secret
            String keyId = "ak_" + UUID.randomUUID().toString().replace("-", "");
            String keySecret = UUID.randomUUID().toString() + UUID.randomUUID().toString();
            
            // Get current user
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
            
            // Create API key
            ApiKey apiKey = new ApiKey();
            apiKey.setKeyId(keyId);
            apiKey.setHashedKey(passwordEncoder.encode(keySecret));
            apiKey.setName(request.getName());
            apiKey.setKeyType(ApiKey.ApiKeyType.valueOf(request.getKeyType()));
            apiKey.setRateLimitPerMinute(request.getRateLimitPerMinute());
            apiKey.setCreatedBy(userPrincipal.getUser().getId());
            
            if (request.getExpiryDays() > 0) {
                apiKey.setExpiresAt(LocalDateTime.now().plusDays(request.getExpiryDays()));
            }
            
            ApiKey savedKey = apiKeyRepository.save(apiKey);
            
            // Return response with key secret (only time it's visible)
            Map<String, Object> response = new HashMap<>();
            response.put("keyId", keyId);
            response.put("keySecret", keySecret); // Only returned once!
            response.put("name", savedKey.getName());
            response.put("keyType", savedKey.getKeyType());
            response.put("rateLimitPerMinute", savedKey.getRateLimitPerMinute());
            response.put("expiresAt", savedKey.getExpiresAt());
            response.put("message", "API key created successfully. Store the key secret securely - it will not be shown again!");
            
            log.info("API key created: {} by user: {}", keyId, userPrincipal.getUser().getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to create API key: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create API key: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ApiKeyInfo>> listApiKeys() {
        List<ApiKey> keys = apiKeyRepository.findByActiveTrue();
        
        List<ApiKeyInfo> keyInfos = keys.stream()
                .map(key -> new ApiKeyInfo(
                        key.getKeyId(),
                        key.getName(),
                        key.getKeyType().name(),
                        key.getRateLimitPerMinute(),
                        key.getCreatedAt(),
                        key.getExpiresAt(),
                        key.getLastUsed(),
                        key.isActive()
                ))
                .toList();
        
        return ResponseEntity.ok(keyInfos);
    }
    
    @DeleteMapping("/{keyId}")
    public ResponseEntity<?> revokeApiKey(@PathVariable String keyId, Authentication authentication) {
        try {
            ApiKey apiKey = apiKeyRepository.findByKeyId(keyId)
                    .orElseThrow(() -> new RuntimeException("API key not found"));
            
            apiKey.setActive(false);
            apiKeyRepository.save(apiKey);
            
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                    (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
            
            log.info("API key revoked: {} by user: {}", keyId, userPrincipal.getUser().getUsername());
            return ResponseEntity.ok(Map.of("message", "API key revoked successfully"));
            
        } catch (Exception e) {
            log.error("Failed to revoke API key {}: {}", keyId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to revoke API key: " + e.getMessage()));
        }
    }
    
    // DTOs
    public static class CreateApiKeyRequest {
        private String name;
        private String keyType = "SERVICE";
        private int rateLimitPerMinute = 100;
        private int expiryDays = 365;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getKeyType() { return keyType; }
        public void setKeyType(String keyType) { this.keyType = keyType; }
        public int getRateLimitPerMinute() { return rateLimitPerMinute; }
        public void setRateLimitPerMinute(int rateLimitPerMinute) { this.rateLimitPerMinute = rateLimitPerMinute; }
        public int getExpiryDays() { return expiryDays; }
        public void setExpiryDays(int expiryDays) { this.expiryDays = expiryDays; }
    }
    
    public static class ApiKeyInfo {
        private String keyId;
        private String name;
        private String keyType;
        private int rateLimitPerMinute;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;
        private LocalDateTime lastUsed;
        private boolean active;
        
        public ApiKeyInfo(String keyId, String name, String keyType, int rateLimitPerMinute, 
                         LocalDateTime createdAt, LocalDateTime expiresAt, LocalDateTime lastUsed, boolean active) {
            this.keyId = keyId;
            this.name = name;
            this.keyType = keyType;
            this.rateLimitPerMinute = rateLimitPerMinute;
            this.createdAt = createdAt;
            this.expiresAt = expiresAt;
            this.lastUsed = lastUsed;
            this.active = active;
        }
        
        // Getters
        public String getKeyId() { return keyId; }
        public String getName() { return name; }
        public String getKeyType() { return keyType; }
        public int getRateLimitPerMinute() { return rateLimitPerMinute; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public LocalDateTime getLastUsed() { return lastUsed; }
        public boolean isActive() { return active; }
    }
}