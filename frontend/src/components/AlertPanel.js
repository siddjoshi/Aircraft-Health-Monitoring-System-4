import React from 'react';
import { AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Alert Panel component for displaying real-time alerts and notifications
 * 
 * This component shows alerts from the aircraft monitoring system
 * with different severity levels and automatic dismissal.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const AlertPanel = ({ alerts }) => {
  const getAlertIcon = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-aviation-red" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-aviation-yellow" />;
      default:
        return <Info className="w-5 h-5 text-aviation-blue" />;
    }
  };

  const getAlertStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'alert-critical';
      case 'WARNING':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-aviation-red';
      case 'WARNING':
        return 'text-aviation-yellow';
      default:
        return 'text-aviation-blue';
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${getAlertStyle(alert.severity)} rounded-lg p-4 shadow-lg alert-slide-in border-l-4`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {getAlertIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${getAlertColor(alert.severity)}`}>
                    {alert.alertType || 'System Alert'}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white text-sm mt-1">
                  {alert.message}
                </p>
                {alert.severity && (
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity.toUpperCase() === 'CRITICAL' 
                        ? 'bg-aviation-red text-white' 
                        : alert.severity.toUpperCase() === 'WARNING'
                        ? 'bg-aviation-yellow text-white'
                        : 'bg-aviation-blue text-white'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertPanel; 