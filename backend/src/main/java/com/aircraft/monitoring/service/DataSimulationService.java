package com.aircraft.monitoring.service;

import com.aircraft.monitoring.model.AircraftData;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * Service responsible for simulating aircraft sensor data.
 * 
 * This service generates realistic aircraft sensor readings for demonstration
 * purposes, including occasional anomalies to test the monitoring system.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
@Service
@Slf4j
public class DataSimulationService {
    
    @Autowired
    private AnomalyDetectionService anomalyDetectionService;
    
    @Autowired
    private WebSocketService webSocketService;
    
    private final Random random = new Random();
    private AircraftData currentData;
    
    // Simulation state
    private double currentAltitude = 35000.0;
    private double currentAirspeed = 450.0;
    private double currentFuelLevel = 85.0;
    private double currentEngineRPM = 2200.0;
    private double currentHydraulicPressure = 2800.0;
    
    // Anomaly simulation flags
    private boolean simulateEngineAnomaly = false;
    private boolean simulateFuelAnomaly = false;
    private boolean simulateHydraulicAnomaly = false;
    private int anomalyCounter = 0;
    
    /**
     * Generates new aircraft sensor data every 2 seconds
     */
    @Scheduled(fixedRate = 2000)
    public void generateAircraftData() {
        currentData = new AircraftData(LocalDateTime.now());
        
        // Generate engine data
        generateEngineData();
        
        // Generate fuel system data
        generateFuelData();
        
        // Generate hydraulic system data
        generateHydraulicData();
        
        // Generate flight data
        generateFlightData();
        
        // Generate additional systems data
        generateAdditionalData();
        
        // Detect anomalies
        currentData = anomalyDetectionService.detectAnomalies(currentData);
        
        // Send to WebSocket clients
        webSocketService.broadcastAircraftData(currentData);
        
        log.debug("Generated aircraft data: {}", currentData.getTimestamp());
    }
    
    /**
     * Generates realistic engine system data
     */
    private void generateEngineData() {
        // Engine RPM with slight variations
        double rpmVariation = random.nextDouble() * 200 - 100;
        currentEngineRPM = Math.max(1800, Math.min(2600, currentEngineRPM + rpmVariation));
        currentData.setEngineRPM(currentEngineRPM);
        
        // Engine temperature (correlated with RPM)
        double tempBase = 120.0 + (currentEngineRPM - 2000) * 0.05;
        double tempVariation = random.nextDouble() * 20 - 10;
        currentData.setEngineTemperature(tempBase + tempVariation);
        
        // Oil pressure (correlated with RPM)
        double oilPressureBase = 40.0 + (currentEngineRPM - 2000) * 0.02;
        double oilPressureVariation = random.nextDouble() * 10 - 5;
        currentData.setOilPressure(oilPressureBase + oilPressureVariation);
        
        // Oil temperature
        double oilTempBase = 80.0 + (currentEngineRPM - 2000) * 0.01;
        double oilTempVariation = random.nextDouble() * 15 - 7.5;
        currentData.setOilTemperature(oilTempBase + oilTempVariation);
        
        // Simulate engine anomaly occasionally
        if (simulateEngineAnomaly && anomalyCounter++ > 10) {
            currentData.setEngineTemperature(220.0); // Overheating
            simulateEngineAnomaly = false;
            anomalyCounter = 0;
        }
    }
    
    /**
     * Generates realistic fuel system data
     */
    private void generateFuelData() {
        // Fuel level decreases over time
        currentFuelLevel -= random.nextDouble() * 0.5;
        currentData.setFuelLevel(Math.max(0, currentFuelLevel));
        
        // Fuel consumption (correlated with engine RPM)
        double consumptionBase = 200.0 + (currentEngineRPM - 2000) * 0.1;
        double consumptionVariation = random.nextDouble() * 50 - 25;
        currentData.setFuelConsumption(consumptionBase + consumptionVariation);
        
        // Fuel pressure
        double fuelPressureBase = 25.0 + random.nextDouble() * 10;
        currentData.setFuelPressure(fuelPressureBase);
        
        // Fuel temperature
        double fuelTempBase = 15.0 + random.nextDouble() * 10;
        currentData.setFuelTemperature(fuelTempBase);
        
        // Simulate fuel anomaly occasionally
        if (simulateFuelAnomaly && anomalyCounter++ > 15) {
            currentData.setFuelLevel(15.0); // Low fuel
            simulateFuelAnomaly = false;
            anomalyCounter = 0;
        }
    }
    
    /**
     * Generates realistic hydraulic system data
     */
    private void generateHydraulicData() {
        // Hydraulic pressure with slight variations
        double pressureVariation = random.nextDouble() * 200 - 100;
        currentHydraulicPressure = Math.max(2500, Math.min(3200, currentHydraulicPressure + pressureVariation));
        currentData.setHydraulicPressure(currentHydraulicPressure);
        
        // Hydraulic temperature
        double hydraulicTempBase = 45.0 + random.nextDouble() * 20;
        currentData.setHydraulicTemperature(hydraulicTempBase);
        
        // Hydraulic fluid level
        double fluidLevelBase = 90.0 + random.nextDouble() * 10;
        currentData.setHydraulicFluidLevel(fluidLevelBase);
        
        // Simulate hydraulic anomaly occasionally
        if (simulateHydraulicAnomaly && anomalyCounter++ > 20) {
            currentData.setHydraulicPressure(1800.0); // Low pressure
            simulateHydraulicAnomaly = false;
            anomalyCounter = 0;
        }
    }
    
    /**
     * Generates realistic flight data
     */
    private void generateFlightData() {
        // Altitude with slight variations
        double altitudeVariation = random.nextDouble() * 200 - 100;
        currentAltitude = Math.max(30000, Math.min(40000, currentAltitude + altitudeVariation));
        currentData.setAltitude(currentAltitude);
        
        // Airspeed with slight variations
        double airspeedVariation = random.nextDouble() * 20 - 10;
        currentAirspeed = Math.max(400, Math.min(500, currentAirspeed + airspeedVariation));
        currentData.setAirspeed(currentAirspeed);
        
        // Ground speed (slightly different from airspeed due to wind)
        double groundSpeedVariation = random.nextDouble() * 30 - 15;
        currentData.setGroundSpeed(currentAirspeed + groundSpeedVariation);
        
        // Mach number (calculated from airspeed and altitude)
        double machNumber = currentAirspeed / (661.5 + currentAltitude * 0.001);
        currentData.setMachNumber(machNumber);
        
        // Vertical speed
        double verticalSpeed = random.nextDouble() * 1000 - 500;
        currentData.setVerticalSpeed(verticalSpeed);
    }
    
    /**
     * Generates additional systems data
     */
    private void generateAdditionalData() {
        // Cabin pressure
        double cabinPressureBase = 11.0 + random.nextDouble() * 2;
        currentData.setCabinPressure(cabinPressureBase);
        
        // Cabin temperature
        double cabinTempBase = 22.0 + random.nextDouble() * 4;
        currentData.setCabinTemperature(cabinTempBase);
        
        // Battery voltage
        double batteryVoltageBase = 28.0 + random.nextDouble() * 2;
        currentData.setBatteryVoltage(batteryVoltageBase);
        
        // Generator output
        double generatorOutputBase = 115.0 + random.nextDouble() * 10;
        currentData.setGeneratorOutput(generatorOutputBase);
    }
    
    /**
     * Triggers simulation of engine anomaly
     */
    public void simulateEngineAnomaly() {
        simulateEngineAnomaly = true;
        anomalyCounter = 0;
        log.info("Engine anomaly simulation triggered");
    }
    
    /**
     * Triggers simulation of fuel anomaly
     */
    public void simulateFuelAnomaly() {
        simulateFuelAnomaly = true;
        anomalyCounter = 0;
        log.info("Fuel anomaly simulation triggered");
    }
    
    /**
     * Triggers simulation of hydraulic anomaly
     */
    public void simulateHydraulicAnomaly() {
        simulateHydraulicAnomaly = true;
        anomalyCounter = 0;
        log.info("Hydraulic anomaly simulation triggered");
    }
    
    /**
     * Gets the current aircraft data
     */
    public AircraftData getCurrentData() {
        return currentData;
    }
} 