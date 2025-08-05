package com.aircraft.monitoring.security;

import com.aircraft.monitoring.model.ApiKey;
import com.aircraft.monitoring.repository.ApiKeyRepository;
import com.aircraft.monitoring.service.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * API Key Authentication Filter
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {
    
    private final ApiKeyRepository apiKeyRepository;
    private final RateLimitService rateLimitService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String apiKey = extractApiKey(request);
        
        // If no API key present, continue with other authentication methods
        if (apiKey == null) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            Optional<ApiKey> apiKeyOpt = validateApiKey(apiKey);
            
            if (apiKeyOpt.isEmpty()) {
                sendUnauthorizedResponse(response, "Invalid API key");
                return;
            }
            
            ApiKey validApiKey = apiKeyOpt.get();
            
            // Check rate limiting
            if (!rateLimitService.isAllowed(apiKey, validApiKey.getRateLimitPerMinute())) {
                sendRateLimitResponse(response);
                return;
            }
            
            // Update last used timestamp
            validApiKey.setLastUsed(LocalDateTime.now());
            apiKeyRepository.save(validApiKey);
            
            // Set authentication context
            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_API_" + validApiKey.getKeyType().name())
            );
            
            UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken("api-user-" + validApiKey.getKeyId(), null, authorities);
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
        } catch (Exception e) {
            log.error("API key authentication error: {}", e.getMessage());
            sendUnauthorizedResponse(response, "Authentication error");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractApiKey(HttpServletRequest request) {
        // Check X-API-Key header
        String apiKey = request.getHeader("X-API-Key");
        if (apiKey != null) {
            return apiKey;
        }
        
        // Check Authorization header with ApiKey scheme
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("ApiKey ")) {
            return authHeader.substring(7);
        }
        
        return null;
    }
    
    private Optional<ApiKey> validateApiKey(String apiKey) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return Optional.empty();
        }
        
        Optional<ApiKey> keyOpt = apiKeyRepository.findByKeyId(apiKey);
        
        if (keyOpt.isEmpty()) {
            return Optional.empty();
        }
        
        ApiKey key = keyOpt.get();
        
        // Check if key is active
        if (!key.isActive()) {
            log.warn("Inactive API key used: {}", apiKey);
            return Optional.empty();
        }
        
        // Check if key is expired
        if (key.isExpired()) {
            log.warn("Expired API key used: {}", apiKey);
            return Optional.empty();
        }
        
        return Optional.of(key);
    }
    
    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"error\":\"%s\"}", message));
    }
    
    private void sendRateLimitResponse(HttpServletResponse response) throws IOException {
        response.setStatus(429); // Too Many Requests
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
    }
}