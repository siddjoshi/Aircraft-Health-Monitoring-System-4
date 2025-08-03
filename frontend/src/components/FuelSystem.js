import React from 'react';
import { Fuel, Gauge, Thermometer, TrendingDown } from 'lucide-react';

/**
 * Fuel System component for displaying fuel-related sensor data
 * 
 * This component shows fuel level, consumption, pressure, and temperature
 * with visual indicators for anomalies and status.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const FuelSystem = ({ data, hasAnomaly }) => {
  const getStatusColor = (value, min, max, criticalMin = null) => {
    if (criticalMin && value < criticalMin) return 'text-aviation-red';
    if (value < min || value > max) return 'text-aviation-yellow';
    return 'text-aviation-green';
  };

  const getStatusClass = (value, min, max, criticalMin = null) => {
    if (criticalMin && value < criticalMin) return 'status-critical';
    if (value < min || value > max) return 'status-warning';
    return 'status-normal';
  };

  return (
    <div className={`bg-card-bg border border-border-color rounded-lg p-6 ${
      hasAnomaly ? 'border-aviation-red shadow-lg shadow-aviation-red/20' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Fuel className="w-5 h-5 mr-2 text-aviation-blue" />
          Fuel System
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          hasAnomaly 
            ? 'bg-aviation-red text-white' 
            : 'bg-aviation-green text-white'
        }`}>
          {hasAnomaly ? 'ANOMALY' : 'NORMAL'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Fuel Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Fuel Level</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.fuelLevel, 20, 100, 20)
            }`}>
              {data.fuelLevel?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">%</div>
          </div>
        </div>

        {/* Fuel Consumption */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Consumption</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.fuelConsumption, 0, 1000, 1000)
            }`}>
              {data.fuelConsumption?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">GPH</div>
          </div>
        </div>

        {/* Fuel Pressure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Fuel Pressure</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.fuelPressure, 10, 50)
            }`}>
              {data.fuelPressure?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">PSI</div>
          </div>
        </div>

        {/* Fuel Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Fuel Temp</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.fuelTemperature, 0, 50)
            }`}>
              {data.fuelTemperature?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">°C</div>
          </div>
        </div>
      </div>

      {/* Fuel Level Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Fuel Level</span>
          <span>{data.fuelLevel?.toFixed(1) || 0}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              data.fuelLevel < 20 
                ? 'bg-aviation-red' 
                : data.fuelLevel < 30 
                ? 'bg-aviation-yellow' 
                : 'bg-aviation-green'
            }`}
            style={{ width: `${data.fuelLevel || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.fuelLevel, 20, 100, 20)
            }`}></div>
            <span className="text-gray-400">Level</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.fuelConsumption, 0, 1000, 1000)
            }`}></div>
            <span className="text-gray-400">Consumption</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.fuelPressure, 10, 50)
            }`}></div>
            <span className="text-gray-400">Pressure</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.fuelTemperature, 0, 50)
            }`}></div>
            <span className="text-gray-400">Temperature</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelSystem; 