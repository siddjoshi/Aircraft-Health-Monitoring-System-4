import React from 'react';
import { Gauge, Zap, Thermometer, Droplets } from 'lucide-react';

/**
 * Engine System component for displaying engine-related sensor data
 * 
 * This component shows engine RPM, temperature, oil pressure, and oil temperature
 * with visual indicators for anomalies and status.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const EngineSystem = ({ data, hasAnomaly }) => {
  const getStatusColor = (value, min, max, criticalMax = null) => {
    if (criticalMax && value > criticalMax) return 'text-aviation-red';
    if (value < min || value > max) return 'text-aviation-yellow';
    return 'text-aviation-green';
  };

  const getStatusClass = (value, min, max, criticalMax = null) => {
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
          <Zap className="w-5 h-5 mr-2 text-aviation-yellow" />
          Engine System
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
        {/* Engine RPM */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Engine RPM</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.engineRPM, 500, 3000)
            }`}>
              {data.engineRPM?.toFixed(0) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">RPM</div>
          </div>
        </div>

        {/* Engine Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Engine Temp</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.engineTemperature, 0, 200, 200)
            }`}>
              {data.engineTemperature?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">°C</div>
          </div>
        </div>

        {/* Oil Pressure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Oil Pressure</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.oilPressure, 20, 100)
            }`}>
              {data.oilPressure?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">PSI</div>
          </div>
        </div>

        {/* Oil Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Oil Temp</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.oilTemperature, 0, 120, 120)
            }`}>
              {data.oilTemperature?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">°C</div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.engineRPM, 500, 3000)
            }`}></div>
            <span className="text-gray-400">RPM</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.engineTemperature, 0, 200, 200)
            }`}></div>
            <span className="text-gray-400">Temp</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.oilPressure, 20, 100)
            }`}></div>
            <span className="text-gray-400">Oil Press</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.oilTemperature, 0, 120, 120)
            }`}></div>
            <span className="text-gray-400">Oil Temp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineSystem; 