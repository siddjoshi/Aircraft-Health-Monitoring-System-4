import React, { useState } from 'react';
import { AlertTriangle, Zap, Fuel, Activity, Play, Square } from 'lucide-react';

/**
 * Anomaly Controls component for triggering test anomalies
 * 
 * This component provides buttons to simulate various aircraft anomalies
 * for testing the monitoring system and alert mechanisms.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const AnomalyControls = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastTriggered, setLastTriggered] = useState(null);

  const triggerAnomaly = async (type) => {
    setIsLoading(true);
    setLastTriggered(type);
    
    try {
      const response = await fetch(`/api/aircraft/simulate/${type}-anomaly`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log(`${type} anomaly simulation triggered successfully`);
      } else {
        console.error(`Failed to trigger ${type} anomaly simulation`);
      }
    } catch (error) {
      console.error('Error triggering anomaly simulation:', error);
    } finally {
      setIsLoading(false);
      // Reset last triggered after 3 seconds
      setTimeout(() => setLastTriggered(null), 3000);
    }
  };

  const anomalies = [
    {
      type: 'engine',
      name: 'Engine Anomaly',
      description: 'Simulate engine overheating',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-aviation-yellow hover:bg-aviation-yellow/80'
    },
    {
      type: 'fuel',
      name: 'Fuel Anomaly',
      description: 'Simulate low fuel level',
      icon: <Fuel className="w-5 h-5" />,
      color: 'bg-aviation-blue hover:bg-aviation-blue/80'
    },
    {
      type: 'hydraulic',
      name: 'Hydraulic Anomaly',
      description: 'Simulate low hydraulic pressure',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-aviation-red hover:bg-aviation-red/80'
    }
  ];

  return (
    <div className="bg-card-bg border border-border-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-aviation-yellow" />
          Anomaly Simulation Controls
        </h3>
        <div className="text-xs text-gray-400">
          For testing purposes only
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {anomalies.map((anomaly) => (
          <div key={anomaly.type} className="border border-border-color rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-aviation-yellow mr-2">
                  {anomaly.icon}
                </div>
                <h4 className="font-semibold text-white">{anomaly.name}</h4>
              </div>
              {lastTriggered === anomaly.type && (
                <div className="w-2 h-2 bg-aviation-green rounded-full animate-pulse"></div>
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              {anomaly.description}
            </p>
            
            <button
              onClick={() => triggerAnomaly(anomaly.type)}
              disabled={isLoading}
              className={`w-full ${anomaly.color} text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isLoading && lastTriggered === anomaly.type ? (
                <>
                  <Square className="w-4 h-4 mr-2 animate-spin" />
                  Triggering...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Trigger {anomaly.name}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Warning Message */}
      <div className="mt-4 p-3 bg-aviation-yellow/10 border border-aviation-yellow/30 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 text-aviation-yellow mr-2" />
          <span className="text-sm text-aviation-yellow">
            These controls simulate real aircraft anomalies for testing purposes. 
            Use only in a controlled environment.
          </span>
        </div>
      </div>

      {/* Status Message */}
      {lastTriggered && (
        <div className="mt-4 p-3 bg-aviation-green/10 border border-aviation-green/30 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-aviation-green rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-aviation-green">
              {lastTriggered.charAt(0).toUpperCase() + lastTriggered.slice(1)} anomaly simulation triggered successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomalyControls; 