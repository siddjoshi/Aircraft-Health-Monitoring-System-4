package com.aircraft.monitoring.controller;

import com.aircraft.monitoring.dto.AlertRequest;
import com.aircraft.monitoring.model.AircraftData;
import com.aircraft.monitoring.service.DataSimulationService;
import com.aircraft.monitoring.service.SanitizationService;
import com.aircraft.monitoring.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

/**
 * REST API controller for aircraft monitoring system.
 * 
 * This controller provides endpoints for:
 * - Getting current aircraft data
 * - Triggering anomaly simulations
 * - System status information
 * 
 * @author Aircraft Monitoring Team
 * @version 2.0.0
 */
@RestController
@RequestMapping("/api/aircraft")
@Slf4j
public class AircraftController {
    
    @Autowired
    private DataSimulationService dataSimulationService;
    
    @Autowired
    private WebSocketService webSocketService;
    
    @Autowired
    private SanitizationService sanitizationService;
    
    /**
     * Gets the current aircraft sensor data
     * 
     * @return Current aircraft data
     */
    @GetMapping("/data")
    public ResponseEntity<AircraftData> getCurrentData() {
        AircraftData data = dataSimulationService.getCurrentData();
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    
    /**
     * Gets system status information
     * 
     * @return System status including connected clients and data generation status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        
        AircraftData currentData = dataSimulationService.getCurrentData();
        status.put("connectedClients", webSocketService.getConnectedClientsCount());
        status.put("dataGenerationActive", currentData != null);
        status.put("lastUpdate", currentData != null ? currentData.getTimestamp() : null);
        status.put("systemStatus", currentData != null ? currentData.getSystemStatus() : "UNKNOWN");
        
        return ResponseEntity.ok(status);
    }
    
    /**
     * Triggers an engine anomaly simulation
     * 
     * @return Success response
     */
    @PostMapping("/simulate/engine-anomaly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<Map<String, String>> simulateEngineAnomaly() {
        dataSimulationService.simulateEngineAnomaly();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Engine anomaly simulation triggered");
        response.put("status", "success");
        
        // Broadcast alert
        webSocketService.broadcastAlert("ENGINE", "Engine temperature anomaly detected", "WARNING");
        
        log.info("Engine anomaly simulation triggered via API");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Triggers a fuel anomaly simulation
     * 
     * @return Success response
     */
    @PostMapping("/simulate/fuel-anomaly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<Map<String, String>> simulateFuelAnomaly() {
        dataSimulationService.simulateFuelAnomaly();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Fuel anomaly simulation triggered");
        response.put("status", "success");
        
        // Broadcast alert
        webSocketService.broadcastAlert("FUEL", "Low fuel level detected", "WARNING");
        
        log.info("Fuel anomaly simulation triggered via API");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Triggers a hydraulic anomaly simulation
     * 
     * @return Success response
     */
    @PostMapping("/simulate/hydraulic-anomaly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<Map<String, String>> simulateHydraulicAnomaly() {
        dataSimulationService.simulateHydraulicAnomaly();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hydraulic anomaly simulation triggered");
        response.put("status", "success");
        
        // Broadcast alert
        webSocketService.broadcastAlert("HYDRAULIC", "Low hydraulic pressure detected", "WARNING");
        
        log.info("Hydraulic anomaly simulation triggered via API");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Gets system health information
     * 
     * @return System health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        
        AircraftData currentData = dataSimulationService.getCurrentData();
        
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        health.put("connectedClients", webSocketService.getConnectedClientsCount());
        health.put("dataAvailable", currentData != null);
        
        if (currentData != null) {
            health.put("systemStatus", currentData.getSystemStatus());
            health.put("anomalies", currentData.hasAnyAnomaly());
        }
        
        return ResponseEntity.ok(health);
    }
    
    /**
     * Sends a custom alert to all connected clients
     * 
     * @param alertRequest The alert request containing type, message, and severity
     * @return Success response
     */
    @PostMapping("/alert")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<Map<String, String>> sendAlert(@Valid @RequestBody AlertRequest alertRequest) {
        // Sanitize the message before broadcasting
        String sanitizedMessage = sanitizationService.sanitizeAlertMessage(alertRequest.getMessage());
        String sanitizedType = sanitizationService.sanitizeText(alertRequest.getType());
        String sanitizedSeverity = sanitizationService.sanitizeText(alertRequest.getSeverity());
        
        webSocketService.broadcastAlert(sanitizedType, sanitizedMessage, sanitizedSeverity);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Alert sent successfully");
        response.put("status", "success");
        
        log.info("Custom alert sent: {} - {}", sanitizedType, sanitizedMessage);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Gets historical aircraft data for the specified time range
     * 
     * @param timeRangeMinutes The time range in minutes (default: 30, max: 30)
     * @return Historical aircraft data for the specified time range
     */
    @GetMapping("/historical")
    public ResponseEntity<List<AircraftData>> getHistoricalData(
            @RequestParam(value = "timeRange", defaultValue = "30") 
            @Min(value = 1, message = "Time range must be at least 1 minute")
            @Max(value = 30, message = "Time range cannot exceed 30 minutes")
            int timeRangeMinutes) {
        
        List<AircraftData> historicalData = dataSimulationService.getHistoricalData(timeRangeMinutes);
        
        log.debug("Retrieved {} historical data points for {} minutes", 
                 historicalData.size(), timeRangeMinutes);
        
        return ResponseEntity.ok(historicalData);
    }
} 