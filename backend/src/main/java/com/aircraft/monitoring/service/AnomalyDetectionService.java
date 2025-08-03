package com.aircraft.monitoring.service;

import com.aircraft.monitoring.model.AircraftData;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

/**
 * Service responsible for detecting anomalies in aircraft sensor data.
 * 
 * This service analyzes sensor readings and flags suspicious or invalid values
 * for critical aircraft systems including engine, fuel, hydraulic, altitude, and airspeed.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
@Service
@Slf4j
public class AnomalyDetectionService {
    
    // Engine System Thresholds
    private static final double MIN_ENGINE_RPM = 500.0;
    private static final double MAX_ENGINE_RPM = 3000.0;
    private static final double MAX_ENGINE_TEMPERATURE = 200.0; // Celsius
    private static final double MIN_OIL_PRESSURE = 20.0; // PSI
    private static final double MAX_OIL_PRESSUURE = 100.0; // PSI
    private static final double MAX_OIL_TEMPERATURE = 120.0; // Celsius
    
    // Fuel System Thresholds
    private static final double MIN_FUEL_LEVEL = 20.0; // Percentage
    private static final double MAX_FUEL_CONSUMPTION = 1000.0; // Gallons per hour
    private static final double MIN_FUEL_PRESSURE = 10.0; // PSI
    private static final double MAX_FUEL_PRESSURE = 50.0; // PSI
    
    // Hydraulic System Thresholds
    private static final double MIN_HYDRAULIC_PRESSURE = 2000.0; // PSI
    private static final double MAX_HYDRAULIC_PRESSURE = 3500.0; // PSI
    private static final double MAX_HYDRAULIC_TEMPERATURE = 80.0; // Celsius
    private static final double MIN_HYDRAULIC_FLUID_LEVEL = 80.0; // Percentage
    
    // Flight Data Thresholds
    private static final double MAX_ALTITUDE = 45000.0; // Feet
    private static final double MAX_AIRSPEED = 600.0; // Knots
    private static final double MAX_MACH_NUMBER = 0.9;
    private static final double MAX_VERTICAL_SPEED = 5000.0; // Feet per minute
    
    /**
     * Analyzes aircraft data and detects anomalies in all critical systems
     * 
     * @param data The aircraft sensor data to analyze
     * @return Updated AircraftData with anomaly flags set
     */
    public AircraftData detectAnomalies(AircraftData data) {
        log.debug("Analyzing aircraft data for anomalies: {}", data.getTimestamp());
        
        // Detect engine anomalies
        data.setEngineAnomaly(detectEngineAnomalies(data));
        
        // Detect fuel system anomalies
        data.setFuelAnomaly(detectFuelAnomalies(data));
        
        // Detect hydraulic system anomalies
        data.setHydraulicAnomaly(detectHydraulicAnomalies(data));
        
        // Detect altitude anomalies
        data.setAltitudeAnomaly(detectAltitudeAnomalies(data));
        
        // Detect airspeed anomalies
        data.setAirspeedAnomaly(detectAirspeedAnomalies(data));
        
        if (data.hasAnyAnomaly()) {
            log.warn("Anomalies detected in aircraft data: {}", data.getSystemStatus());
        }
        
        return data;
    }
    
    /**
     * Detects anomalies in engine systems
     */
    private boolean detectEngineAnomalies(AircraftData data) {
        boolean anomaly = false;
        
        // Check engine RPM
        if (data.getEngineRPM() < MIN_ENGINE_RPM || data.getEngineRPM() > MAX_ENGINE_RPM) {
            log.warn("Engine RPM anomaly: {} (normal range: {}-{})", 
                    data.getEngineRPM(), MIN_ENGINE_RPM, MAX_ENGINE_RPM);
            anomaly = true;
        }
        
        // Check engine temperature
        if (data.getEngineTemperature() > MAX_ENGINE_TEMPERATURE) {
            log.warn("Engine temperature anomaly: {}°C (max: {}°C)", 
                    data.getEngineTemperature(), MAX_ENGINE_TEMPERATURE);
            anomaly = true;
        }
        
        // Check oil pressure
        if (data.getOilPressure() < MIN_OIL_PRESSURE || data.getOilPressure() > MAX_OIL_PRESSUURE) {
            log.warn("Oil pressure anomaly: {} PSI (normal range: {}-{} PSI)", 
                    data.getOilPressure(), MIN_OIL_PRESSURE, MAX_OIL_PRESSUURE);
            anomaly = true;
        }
        
        // Check oil temperature
        if (data.getOilTemperature() > MAX_OIL_TEMPERATURE) {
            log.warn("Oil temperature anomaly: {}°C (max: {}°C)", 
                    data.getOilTemperature(), MAX_OIL_TEMPERATURE);
            anomaly = true;
        }
        
        return anomaly;
    }
    
    /**
     * Detects anomalies in fuel system
     */
    private boolean detectFuelAnomalies(AircraftData data) {
        boolean anomaly = false;
        
        // Check fuel level
        if (data.getFuelLevel() < MIN_FUEL_LEVEL) {
            log.warn("Low fuel level: {}% (min: {}%)", data.getFuelLevel(), MIN_FUEL_LEVEL);
            anomaly = true;
        }
        
        // Check fuel consumption
        if (data.getFuelConsumption() > MAX_FUEL_CONSUMPTION) {
            log.warn("High fuel consumption: {} GPH (max: {} GPH)", 
                    data.getFuelConsumption(), MAX_FUEL_CONSUMPTION);
            anomaly = true;
        }
        
        // Check fuel pressure
        if (data.getFuelPressure() < MIN_FUEL_PRESSURE || data.getFuelPressure() > MAX_FUEL_PRESSURE) {
            log.warn("Fuel pressure anomaly: {} PSI (normal range: {}-{} PSI)", 
                    data.getFuelPressure(), MIN_FUEL_PRESSURE, MAX_FUEL_PRESSURE);
            anomaly = true;
        }
        
        return anomaly;
    }
    
    /**
     * Detects anomalies in hydraulic system
     */
    private boolean detectHydraulicAnomalies(AircraftData data) {
        boolean anomaly = false;
        
        // Check hydraulic pressure
        if (data.getHydraulicPressure() < MIN_HYDRAULIC_PRESSURE || 
            data.getHydraulicPressure() > MAX_HYDRAULIC_PRESSURE) {
            log.warn("Hydraulic pressure anomaly: {} PSI (normal range: {}-{} PSI)", 
                    data.getHydraulicPressure(), MIN_HYDRAULIC_PRESSURE, MAX_HYDRAULIC_PRESSURE);
            anomaly = true;
        }
        
        // Check hydraulic temperature
        if (data.getHydraulicTemperature() > MAX_HYDRAULIC_TEMPERATURE) {
            log.warn("Hydraulic temperature anomaly: {}°C (max: {}°C)", 
                    data.getHydraulicTemperature(), MAX_HYDRAULIC_TEMPERATURE);
            anomaly = true;
        }
        
        // Check hydraulic fluid level
        if (data.getHydraulicFluidLevel() < MIN_HYDRAULIC_FLUID_LEVEL) {
            log.warn("Low hydraulic fluid level: {}% (min: {}%)", 
                    data.getHydraulicFluidLevel(), MIN_HYDRAULIC_FLUID_LEVEL);
            anomaly = true;
        }
        
        return anomaly;
    }
    
    /**
     * Detects anomalies in altitude data
     */
    private boolean detectAltitudeAnomalies(AircraftData data) {
        boolean anomaly = false;
        
        // Check maximum altitude
        if (data.getAltitude() > MAX_ALTITUDE) {
            log.warn("Altitude anomaly: {} feet (max: {} feet)", 
                    data.getAltitude(), MAX_ALTITUDE);
            anomaly = true;
        }
        
        // Check vertical speed
        if (Math.abs(data.getVerticalSpeed()) > MAX_VERTICAL_SPEED) {
            log.warn("Vertical speed anomaly: {} ft/min (max: {} ft/min)", 
                    data.getVerticalSpeed(), MAX_VERTICAL_SPEED);
            anomaly = true;
        }
        
        return anomaly;
    }
    
    /**
     * Detects anomalies in airspeed data
     */
    private boolean detectAirspeedAnomalies(AircraftData data) {
        boolean anomaly = false;
        
        // Check maximum airspeed
        if (data.getAirspeed() > MAX_AIRSPEED) {
            log.warn("Airspeed anomaly: {} knots (max: {} knots)", 
                    data.getAirspeed(), MAX_AIRSPEED);
            anomaly = true;
        }
        
        // Check Mach number
        if (data.getMachNumber() > MAX_MACH_NUMBER) {
            log.warn("Mach number anomaly: {} (max: {})", 
                    data.getMachNumber(), MAX_MACH_NUMBER);
            anomaly = true;
        }
        
        return anomaly;
    }
} 