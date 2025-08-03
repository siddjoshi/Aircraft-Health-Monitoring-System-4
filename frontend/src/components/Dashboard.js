import React from 'react';
import EngineSystem from './EngineSystem';
import FuelSystem from './FuelSystem';
import HydraulicSystem from './HydraulicSystem';
import FlightData from './FlightData';
import SystemStatus from './SystemStatus';
import AnomalyControls from './AnomalyControls';

/**
 * Main Dashboard component for aircraft health monitoring
 * 
 * This component displays all aircraft systems in a grid layout
 * with real-time data updates and anomaly detection.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const Dashboard = ({ aircraftData, connectionStatus }) => {
  if (!aircraftData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">
            {connectionStatus === 'connected' 
              ? 'Waiting for aircraft data...' 
              : 'Connecting to aircraft monitoring system...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <SystemStatus aircraftData={aircraftData} />
      
      {/* Anomaly Simulation Controls */}
      <AnomalyControls />
      
      {/* Aircraft Systems Grid */}
      <div className="data-grid">
        {/* Engine System */}
        <div className="card-hover">
          <EngineSystem 
            data={aircraftData}
            hasAnomaly={aircraftData.engineAnomaly}
          />
        </div>
        
        {/* Fuel System */}
        <div className="card-hover">
          <FuelSystem 
            data={aircraftData}
            hasAnomaly={aircraftData.fuelAnomaly}
          />
        </div>
        
        {/* Hydraulic System */}
        <div className="card-hover">
          <HydraulicSystem 
            data={aircraftData}
            hasAnomaly={aircraftData.hydraulicAnomaly}
          />
        </div>
        
        {/* Flight Data */}
        <div className="card-hover">
          <FlightData 
            data={aircraftData}
            hasAnomaly={aircraftData.altitudeAnomaly || aircraftData.airspeedAnomaly}
          />
        </div>
      </div>
      
      {/* Additional Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cabin Systems */}
        <div className="bg-card-bg border border-border-color rounded-lg p-6 card-hover">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Cabin Systems
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Cabin Pressure</p>
              <p className="text-xl font-mono font-semibold text-white">
                {aircraftData.cabinPressure?.toFixed(1) || 'N/A'} PSI
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Cabin Temperature</p>
              <p className="text-xl font-mono font-semibold text-white">
                {aircraftData.cabinTemperature?.toFixed(1) || 'N/A'}°C
              </p>
            </div>
          </div>
        </div>
        
        {/* Electrical Systems */}
        <div className="bg-card-bg border border-border-color rounded-lg p-6 card-hover">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Electrical Systems
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Battery Voltage</p>
              <p className="text-xl font-mono font-semibold text-white">
                {aircraftData.batteryVoltage?.toFixed(1) || 'N/A'} V
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Generator Output</p>
              <p className="text-xl font-mono font-semibold text-white">
                {aircraftData.generatorOutput?.toFixed(1) || 'N/A'} V
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Timestamp */}
      <div className="text-center text-sm text-gray-400">
        Last Updated: {new Date(aircraftData.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Dashboard; 