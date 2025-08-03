import React from 'react';
import { Gauge, Thermometer, Droplets, Activity } from 'lucide-react';

/**
 * Hydraulic System component for displaying hydraulic-related sensor data
 * 
 * This component shows hydraulic pressure, temperature, and fluid level
 * with visual indicators for anomalies and status.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const HydraulicSystem = ({ data, hasAnomaly }) => {
  const getStatusColor = (value, min, max, criticalMin = null, criticalMax = null) => {
    if (criticalMin && value < criticalMin) return 'text-aviation-red';
    if (criticalMax && value > criticalMax) return 'text-aviation-red';
    if (value < min || value > max) return 'text-aviation-yellow';
    return 'text-aviation-green';
  };

  const getStatusClass = (value, min, max, criticalMin = null, criticalMax = null) => {
    if (criticalMin && value < criticalMin) return 'status-critical';
    if (criticalMax && value > criticalMax) return 'status-critical';
    if (value < min || value > max) return 'status-warning';
    return 'status-normal';
  };

  return (
    <div className={`bg-card-bg border border-border-color rounded-lg p-6 ${
      hasAnomaly ? 'border-aviation-red shadow-lg shadow-aviation-red/20' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-aviation-blue" />
          Hydraulic System
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
        {/* Hydraulic Pressure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Hydraulic Pressure</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.hydraulicPressure, 2000, 3500, 2000, 3500)
            }`}>
              {data.hydraulicPressure?.toFixed(0) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">PSI</div>
          </div>
        </div>

        {/* Hydraulic Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Hydraulic Temp</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.hydraulicTemperature, 0, 80, null, 80)
            }`}>
              {data.hydraulicTemperature?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">°C</div>
          </div>
        </div>

        {/* Hydraulic Fluid Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Fluid Level</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.hydraulicFluidLevel, 80, 100, 80)
            }`}>
              {data.hydraulicFluidLevel?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">%</div>
          </div>
        </div>
      </div>

      {/* Pressure Gauge Visualization */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Pressure Range</span>
          <span>{data.hydraulicPressure?.toFixed(0) || 0} PSI</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 relative">
          {/* Normal range indicator */}
          <div className="absolute inset-0 bg-aviation-green rounded-full" style={{ 
            left: '57%', 
            right: '16%',
            height: '100%'
          }}></div>
          {/* Current pressure indicator */}
          <div 
            className={`absolute top-0 h-3 rounded-full transition-all duration-300 ${
              data.hydraulicPressure < 2000 
                ? 'bg-aviation-red' 
                : data.hydraulicPressure > 3500 
                ? 'bg-aviation-red'
                : data.hydraulicPressure < 2500 || data.hydraulicPressure > 3000
                ? 'bg-aviation-yellow'
                : 'bg-aviation-green'
            }`}
            style={{ 
              width: '2px',
              left: `${Math.min(Math.max(((data.hydraulicPressure - 1500) / 2500) * 100, 0), 100)}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1500</span>
          <span>2000</span>
          <span>2500</span>
          <span>3000</span>
          <span>3500</span>
          <span>4000</span>
        </div>
      </div>

      {/* Fluid Level Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Fluid Level</span>
          <span>{data.hydraulicFluidLevel?.toFixed(1) || 0}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              data.hydraulicFluidLevel < 80 
                ? 'bg-aviation-red' 
                : data.hydraulicFluidLevel < 90 
                ? 'bg-aviation-yellow' 
                : 'bg-aviation-green'
            }`}
            style={{ width: `${data.hydraulicFluidLevel || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.hydraulicPressure, 2000, 3500, 2000, 3500)
            }`}></div>
            <span className="text-gray-400">Pressure</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.hydraulicTemperature, 0, 80, null, 80)
            }`}></div>
            <span className="text-gray-400">Temperature</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.hydraulicFluidLevel, 80, 100, 80)
            }`}></div>
            <span className="text-gray-400">Fluid Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydraulicSystem; 