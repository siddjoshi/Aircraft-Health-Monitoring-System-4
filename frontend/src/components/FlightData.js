import React from 'react';
import { Plane, Gauge, TrendingUp, Zap } from 'lucide-react';

/**
 * Flight Data component for displaying flight-related sensor data
 * 
 * This component shows altitude, airspeed, ground speed, Mach number,
 * and vertical speed with visual indicators for anomalies and status.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const FlightData = ({ data, hasAnomaly }) => {
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
          <Plane className="w-5 h-5 mr-2 text-aviation-blue" />
          Flight Data
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
        {/* Altitude */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Altitude</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.altitude, 0, 45000, 45000)
            }`}>
              {data.altitude?.toFixed(0) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">ft</div>
          </div>
        </div>

        {/* Airspeed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Airspeed</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.airspeed, 0, 600, 600)
            }`}>
              {data.airspeed?.toFixed(0) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">knots</div>
          </div>
        </div>

        {/* Ground Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Plane className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Ground Speed</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-semibold text-white">
              {data.groundSpeed?.toFixed(0) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">knots</div>
          </div>
        </div>

        {/* Mach Number */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Mach Number</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(data.machNumber, 0, 0.9, 0.9)
            }`}>
              {data.machNumber?.toFixed(3) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Mach</div>
          </div>
        </div>

        {/* Vertical Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Vertical Speed</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-semibold ${
              getStatusColor(Math.abs(data.verticalSpeed), 0, 5000, 5000)
            }`}>
              {data.verticalSpeed?.toFixed(0) || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">ft/min</div>
          </div>
        </div>
      </div>

      {/* Altitude Visualization */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Altitude Range</span>
          <span>{data.altitude?.toFixed(0) || 0} ft</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 relative">
          {/* Normal range indicator */}
          <div className="absolute inset-0 bg-aviation-green rounded-full" style={{ 
            left: '0%', 
            right: '10%',
            height: '100%'
          }}></div>
          {/* Current altitude indicator */}
          <div 
            className={`absolute top-0 h-3 rounded-full transition-all duration-300 ${
              data.altitude > 45000 
                ? 'bg-aviation-red' 
                : data.altitude > 40000 
                ? 'bg-aviation-yellow'
                : 'bg-aviation-green'
            }`}
            style={{ 
              width: '2px',
              left: `${Math.min(Math.max((data.altitude / 50000) * 100, 0), 100)}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>10k</span>
          <span>20k</span>
          <span>30k</span>
          <span>40k</span>
          <span>50k</span>
        </div>
      </div>

      {/* Airspeed Visualization */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Airspeed Range</span>
          <span>{data.airspeed?.toFixed(0) || 0} knots</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              data.airspeed > 600 
                ? 'bg-aviation-red' 
                : data.airspeed > 500 
                ? 'bg-aviation-yellow' 
                : 'bg-aviation-green'
            }`}
            style={{ width: `${Math.min((data.airspeed / 700) * 100, 100) || 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>200</span>
          <span>400</span>
          <span>600</span>
          <span>700</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.altitude, 0, 45000, 45000)
            }`}></div>
            <span className="text-gray-400">Altitude</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.airspeed, 0, 600, 600)
            }`}></div>
            <span className="text-gray-400">Airspeed</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(data.machNumber, 0, 0.9, 0.9)
            }`}></div>
            <span className="text-gray-400">Mach</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              getStatusClass(Math.abs(data.verticalSpeed), 0, 5000, 5000)
            }`}></div>
            <span className="text-gray-400">V/S</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightData; 