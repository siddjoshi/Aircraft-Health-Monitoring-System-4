import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import WebSocketService from './services/WebSocketService';
import AlertPanel from './components/AlertPanel';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * Main App component for the Aircraft Health Monitoring Dashboard
 * 
 * This component manages the overall application state and WebSocket connection
 * for real-time aircraft data updates.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
function App() {
  const [aircraftData, setAircraftData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [webSocketService] = useState(() => new WebSocketService());

  useEffect(() => {
    let pollingInterval = null;

    // REST API polling fallback
    const startRestApiPolling = () => {
      console.log('Starting REST API polling...');
      setConnectionStatus('polling');
      
      const pollData = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/aircraft/data');
          if (response.ok) {
            const data = await response.json();
            setAircraftData(data);
            setConnectionStatus('connected');
          } else {
            console.error('Failed to fetch data:', response.statusText);
            setConnectionStatus('error');
          }
        } catch (error) {
          console.error('Error polling data:', error);
          setConnectionStatus('error');
        }
      };
      
      // Poll immediately and then every 2 seconds
      pollData();
      pollingInterval = setInterval(pollData, 2000);
    };

    // Start REST API polling immediately
    startRestApiPolling();

    // Initialize WebSocket connection in parallel
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        
        // Set up event listeners
        webSocketService.onAircraftData((data) => {
          setAircraftData(data);
          // If WebSocket starts working, we can stop polling
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
            console.log('WebSocket active, stopped REST polling');
          }
        });
        
        webSocketService.onAlert((alert) => {
          setAlerts(prev => [...prev, { ...alert, id: Date.now() }]);
        });
        
        webSocketService.onConnectionStatus((status) => {
          setConnectionStatus(status);
        });
        
      } catch (error) {
        console.error('WebSocket failed, continuing with REST API:', error);
      }
    };

    // Try WebSocket connection
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [webSocketService]);

  // Remove old alerts after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts(prev => prev.filter(alert => 
        Date.now() - alert.id < 10000
      ));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ThemeProvider>
      <AppContent 
        aircraftData={aircraftData}
        alerts={alerts}
        connectionStatus={connectionStatus}
      />
    </ThemeProvider>
  );
}

/**
 * Inner App component that uses theme context
 */
const AppContent = ({ aircraftData, alerts, connectionStatus }) => {
  return (
    <div className="App min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg text-text-primary-light dark:text-white transition-colors duration-200">
      {/* Header */}
      <header className="bg-card-bg-light dark:bg-card-bg border-b border-border-color-light dark:border-border-color transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-aviation-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✈</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary-light dark:text-white">
                  Aircraft Health Monitoring System
                </h1>
                <p className="text-sm text-text-secondary-light dark:text-gray-400">
                  Real-Time Aviation Dashboard
                </p>
              </div>
            </div>
            
            {/* Theme Toggle and Connection Status */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' 
                  ? 'bg-aviation-green text-white' 
                  : connectionStatus === 'polling'
                  ? 'bg-aviation-yellow text-white'
                  : connectionStatus === 'connecting'
                  ? 'bg-aviation-yellow text-white'
                  : 'bg-aviation-red text-white'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' 
                    ? 'bg-white animate-pulse' 
                    : connectionStatus === 'connecting' || connectionStatus === 'polling'
                    ? 'bg-white animate-bounce-slow'
                    : 'bg-white'
                }`}></div>
                <span className="capitalize">{connectionStatus === 'polling' ? 'REST API' : connectionStatus}</span>
              </div>
              
              <div className="text-sm text-text-secondary-light dark:text-gray-400">
                {aircraftData ? (
                  <span>Last Update: {new Date(aircraftData.timestamp).toLocaleTimeString()}</span>
                ) : (
                  <span>No data available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Dashboard 
          aircraftData={aircraftData} 
          connectionStatus={connectionStatus}
        />
      </main>

      {/* Alert Panel */}
      <AlertPanel alerts={alerts} />
    </div>
  );
};

export default App; 