package com.aircraft.monitoring.repository;

import com.aircraft.monitoring.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for ApiKey entity
 */
@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    
    Optional<ApiKey> findByKeyId(String keyId);
    
    List<ApiKey> findByActiveTrue();
    
    List<ApiKey> findByCreatedBy(Long createdBy);
    
    List<ApiKey> findByExpiresAtBefore(LocalDateTime dateTime);
    
    boolean existsByKeyId(String keyId);
}