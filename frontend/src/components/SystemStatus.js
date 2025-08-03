import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

/**
 * System Status component for displaying overall aircraft system status
 * 
 * This component shows a summary of all aircraft systems with their
 * current status and any detected anomalies.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const SystemStatus = ({ aircraftData }) => {
  const systems = [
    {
      name: 'Engine',
      status: aircraftData.engineAnomaly ? 'anomaly' : 'normal',
      icon: '⚙️',
      description: 'Engine RPM, temperature, oil pressure'
    },
    {
      name: 'Fuel',
      status: aircraftData.fuelAnomaly ? 'anomaly' : 'normal',
      icon: '⛽',
      description: 'Fuel level, consumption, pressure'
    },
    {
      name: 'Hydraulic',
      status: aircraftData.hydraulicAnomaly ? 'anomaly' : 'normal',
      icon: '🔧',
      description: 'Hydraulic pressure, temperature, fluid level'
    },
    {
      name: 'Flight',
      status: (aircraftData.altitudeAnomaly || aircraftData.airspeedAnomaly) ? 'anomaly' : 'normal',
      icon: '✈️',
      description: 'Altitude, airspeed, Mach number'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-aviation-green" />;
      case 'anomaly':
        return <XCircle className="w-5 h-5 text-aviation-red" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-aviation-yellow" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-aviation-green text-white';
      case 'anomaly':
        return 'bg-aviation-red text-white';
      default:
        return 'bg-aviation-yellow text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal':
        return 'NORMAL';
      case 'anomaly':
        return 'ANOMALY';
      default:
        return 'WARNING';
    }
  };

  const totalSystems = systems.length;
  const normalSystems = systems.filter(s => s.status === 'normal').length;
  const anomalySystems = systems.filter(s => s.status === 'anomaly').length;

  return (
    <div className="bg-card-bg border border-border-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Activity className="w-6 h-6 mr-2 text-aviation-blue" />
          System Status Overview
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          (aircraftData.engineAnomaly || aircraftData.fuelAnomaly || aircraftData.hydraulicAnomaly || aircraftData.altitudeAnomaly || aircraftData.airspeedAnomaly)
            ? 'bg-aviation-red text-white' 
            : 'bg-aviation-green text-white'
        }`}>
          {(aircraftData.engineAnomaly || aircraftData.fuelAnomaly || aircraftData.hydraulicAnomaly || aircraftData.altitudeAnomaly || aircraftData.airspeedAnomaly) ? 'WARNING' : 'NORMAL'}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalSystems}</div>
          <div className="text-sm text-gray-400">Total Systems</div>
        </div>
        <div className="bg-aviation-green/20 border border-aviation-green rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-aviation-green">{normalSystems}</div>
          <div className="text-sm text-gray-400">Normal</div>
        </div>
        <div className="bg-aviation-red/20 border border-aviation-red rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-aviation-red">{anomalySystems}</div>
          <div className="text-sm text-gray-400">Anomalies</div>
        </div>
        <div className="bg-aviation-blue/20 border border-aviation-blue rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-aviation-blue">
            {((normalSystems / totalSystems) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-400">Health</div>
        </div>
      </div>

      {/* System Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              system.status === 'anomaly' 
                ? 'border-aviation-red bg-aviation-red/10' 
                : 'border-border-color bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{system.icon}</span>
                <div>
                  <h3 className="font-semibold text-white">{system.name}</h3>
                  <p className="text-xs text-gray-400">{system.description}</p>
                </div>
              </div>
              {getStatusIcon(system.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getStatusColor(system.status)
              }`}>
                {getStatusText(system.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="mt-6 pt-4 border-t border-border-color">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Last System Check</span>
          <span>{new Date(aircraftData.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus; 