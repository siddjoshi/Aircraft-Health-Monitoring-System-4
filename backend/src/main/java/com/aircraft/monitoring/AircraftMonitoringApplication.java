package com.aircraft.monitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot application class for the Aircraft Health Monitoring System.
 * 
 * This application provides:
 * - Real-time aircraft sensor data processing
 * - Anomaly detection for critical systems
 * - WebSocket communication for live updates
 * - REST API endpoints for data access
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableScheduling
public class AircraftMonitoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(AircraftMonitoringApplication.class, args);
        System.out.println("🚁 Aircraft Health Monitoring System Started!");
        System.out.println("📊 Dashboard available at: http://localhost:8080");
        System.out.println("🔌 WebSocket endpoint: ws://localhost:8080/websocket");
    }
} 