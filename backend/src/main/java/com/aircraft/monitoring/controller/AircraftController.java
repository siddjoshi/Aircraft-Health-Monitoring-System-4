package com.aircraft.monitoring.controller;

import com.aircraft.monitoring.model.AircraftData;
import com.aircraft.monitoring.service.DataSimulationService;
import com.aircraft.monitoring.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

/**
 * REST API controller for aircraft monitoring system.
 * 
 * This controller provides endpoints for:
 * - Getting current aircraft data
 * - Triggering anomaly simulations
 * - System status information
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/aircraft")
@CrossOrigin(origins = "*") // Allow all origins for demo purposes
@Slf4j
public class AircraftController {
    
    @Autowired
    private DataSimulationService dataSimulationService;
    
    @Autowired
    private WebSocketService webSocketService;
    
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
    public ResponseEntity<Map<String, String>> sendAlert(@RequestBody Map<String, String> alertRequest) {
        String alertType = alertRequest.get("type");
        String message = alertRequest.get("message");
        String severity = alertRequest.getOrDefault("severity", "INFO");
        
        webSocketService.broadcastAlert(alertType, message, severity);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Alert sent successfully");
        response.put("status", "success");
        
        log.info("Custom alert sent: {} - {}", alertType, message);
        return ResponseEntity.ok(response);
    }
} 