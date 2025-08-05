package com.aircraft.monitoring.service;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting service using bucket4j
 */
@Service
@Slf4j
public class RateLimitService {
    
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    /**
     * Check if request is allowed for the given key with default rate limit
     */
    public boolean isAllowed(String key) {
        return isAllowed(key, 100); // Default 100 requests per minute
    }
    
    /**
     * Check if request is allowed for the given key with custom rate limit
     */
    public boolean isAllowed(String key, int requestsPerMinute) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket(requestsPerMinute));
        
        boolean allowed = bucket.tryConsume(1);
        
        if (!allowed) {
            log.warn("Rate limit exceeded for key: {}", key);
        }
        
        return allowed;
    }
    
    /**
     * Create a new bucket with the specified rate limit
     */
    private Bucket createBucket(int requestsPerMinute) {
        Bandwidth limit = Bandwidth.classic(requestsPerMinute, Refill.intervally(requestsPerMinute, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    /**
     * Reset rate limit for a specific key
     */
    public void resetRateLimit(String key) {
        buckets.remove(key);
        log.info("Rate limit reset for key: {}", key);
    }
    
    /**
     * Get remaining tokens for a key
     */
    public long getRemainingTokens(String key, int requestsPerMinute) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket(requestsPerMinute));
        return bucket.getAvailableTokens();
    }
}