package com.aircraft.monitoring.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Aircraft sensor data model representing all critical aircraft systems.
 * 
 * This class contains sensor readings for:
 * - Engine systems (RPM, temperature, oil pressure)
 * - Fuel system (level, consumption, pressure)
 * - Hydraulic system (pressure, temperature, fluid level)
 * - Flight data (altitude, airspeed, ground speed)
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AircraftData {
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    // Engine System Data
    private double engineRPM;
    private double engineTemperature;
    private double oilPressure;
    private double oilTemperature;
    
    // Fuel System Data
    private double fuelLevel;
    private double fuelConsumption;
    private double fuelPressure;
    private double fuelTemperature;
    
    // Hydraulic System Data
    private double hydraulicPressure;
    private double hydraulicTemperature;
    private double hydraulicFluidLevel;
    
    // Flight Data
    private double altitude;
    private double airspeed;
    private double groundSpeed;
    private double machNumber;
    private double verticalSpeed;
    
    // Additional Systems
    private double cabinPressure;
    private double cabinTemperature;
    private double batteryVoltage;
    private double generatorOutput;
    
    // Anomaly Detection Flags
    private boolean engineAnomaly;
    private boolean fuelAnomaly;
    private boolean hydraulicAnomaly;
    private boolean altitudeAnomaly;
    private boolean airspeedAnomaly;
    
    /**
     * Creates a new AircraftData instance with current timestamp
     */
    public AircraftData(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    /**
     * Checks if any critical system has anomalies
     * @return true if any anomaly is detected
     */
    public boolean hasAnyAnomaly() {
        return engineAnomaly || fuelAnomaly || hydraulicAnomaly || 
               altitudeAnomaly || airspeedAnomaly;
    }
    
    /**
     * Gets the overall system status
     * @return "NORMAL" if no anomalies, "WARNING" if any anomaly detected
     */
    public String getSystemStatus() {
        return hasAnyAnomaly() ? "WARNING" : "NORMAL";
    }
} 