import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Eye, EyeOff } from 'lucide-react';

/**
 * TrendCharts component for displaying historical aircraft data trends
 * 
 * This component visualizes historical data for key aircraft metrics including
 * Engine RPM, Engine Temperature, Fuel Level, Hydraulic Pressure, Altitude, and Airspeed.
 * 
 * @author Aircraft Monitoring Team
 * @version 1.0.0
 */
const TrendCharts = ({ webSocketService }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState(30); // Default to 30 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Visibility toggles for different metrics
  const [visibleMetrics, setVisibleMetrics] = useState({
    engineRPM: true,
    engineTemperature: true,
    fuelLevel: true,
    hydraulicPressure: true,
    altitude: true,
    airspeed: true
  });

  // Color scheme for different metrics
  const metricColors = {
    engineRPM: '#10b981', // Green
    engineTemperature: '#f59e0b', // Amber
    fuelLevel: '#3b82f6', // Blue
    hydraulicPressure: '#8b5cf6', // Purple
    altitude: '#ef4444', // Red
    airspeed: '#06b6d4' // Cyan
  };

  // Metric configurations
  const metrics = [
    { key: 'engineRPM', label: 'Engine RPM', unit: 'RPM', color: metricColors.engineRPM },
    { key: 'engineTemperature', label: 'Engine Temperature', unit: '°C', color: metricColors.engineTemperature },
    { key: 'fuelLevel', label: 'Fuel Level', unit: '%', color: metricColors.fuelLevel },
    { key: 'hydraulicPressure', label: 'Hydraulic Pressure', unit: 'PSI', color: metricColors.hydraulicPressure },
    { key: 'altitude', label: 'Altitude', unit: 'ft', color: metricColors.altitude },
    { key: 'airspeed', label: 'Airspeed', unit: 'knots', color: metricColors.airspeed }
  ];

  // Request historical data
  const requestHistoricalData = async (newTimeRange = timeRange) => {
    if (!webSocketService || !webSocketService.isConnected()) {
      setError('WebSocket not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the new WebSocket service method
      webSocketService.requestHistoricalData(newTimeRange);
    } catch (err) {
      setError('Failed to request historical data');
      setLoading(false);
    }
  };

  // Handle historical data response
  useEffect(() => {
    if (!webSocketService) return;

    // Set up historical data callback
    webSocketService.onHistoricalData((message) => {
      if (message.type === 'historical_data') {
        const processedData = message.data.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp).getTime(),
          timeLabel: new Date(item.timestamp).toLocaleTimeString()
        }));
        setHistoricalData(processedData);
        setLoading(false);
      } else if (message.type === 'error') {
        setError(message.message || 'Failed to retrieve historical data');
        setLoading(false);
      }
    });

    // Request initial data
    if (webSocketService.isConnected()) {
      requestHistoricalData();
    }

    return () => {
      // Clean up callback
      webSocketService.onHistoricalData(null);
    };
  }, [webSocketService, timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    requestHistoricalData(newTimeRange);
  };

  // Toggle metric visibility
  const toggleMetric = (metricKey) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey]
    }));
  };

  // Format tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-bg border border-border-color rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-2">
            {new Date(label).toLocaleString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card-bg border border-border-color rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 lg:mb-0 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
          Historical Trends
        </h3>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Time Range:</span>
          </div>
          <div className="flex space-x-2">
            {[5, 15, 30].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}m
              </button>
            ))}
          </div>
          <button
            onClick={() => requestHistoricalData()}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                visibleMetrics[metric.key]
                  ? 'bg-opacity-20 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: visibleMetrics[metric.key] ? metric.color + '33' : undefined,
                borderColor: metric.color,
                borderWidth: '1px'
              }}
            >
              {visibleMetrics[metric.key] ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
          <span className="ml-3 text-gray-400">Loading historical data...</span>
        </div>
      )}

      {/* Charts */}
      {!loading && !error && historicalData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engine Metrics Chart */}
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Engine Metrics</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {visibleMetrics.engineRPM && (
                  <Line
                    type="monotone"
                    dataKey="engineRPM"
                    stroke={metricColors.engineRPM}
                    strokeWidth={2}
                    dot={false}
                    name="Engine RPM"
                  />
                )}
                {visibleMetrics.engineTemperature && (
                  <Line
                    type="monotone"
                    dataKey="engineTemperature"
                    stroke={metricColors.engineTemperature}
                    strokeWidth={2}
                    dot={false}
                    name="Engine Temperature (°C)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fuel & Hydraulic Chart */}
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Fuel & Hydraulic Systems</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {visibleMetrics.fuelLevel && (
                  <Line
                    type="monotone"
                    dataKey="fuelLevel"
                    stroke={metricColors.fuelLevel}
                    strokeWidth={2}
                    dot={false}
                    name="Fuel Level (%)"
                  />
                )}
                {visibleMetrics.hydraulicPressure && (
                  <Line
                    type="monotone"
                    dataKey="hydraulicPressure"
                    stroke={metricColors.hydraulicPressure}
                    strokeWidth={2}
                    dot={false}
                    name="Hydraulic Pressure (PSI)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Flight Data Chart */}
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 lg:col-span-2">
            <h4 className="text-sm font-medium text-gray-300 mb-4">Flight Data</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {visibleMetrics.altitude && (
                  <Line
                    type="monotone"
                    dataKey="altitude"
                    stroke={metricColors.altitude}
                    strokeWidth={2}
                    dot={false}
                    name="Altitude (ft)"
                  />
                )}
                {visibleMetrics.airspeed && (
                  <Line
                    type="monotone"
                    dataKey="airspeed"
                    stroke={metricColors.airspeed}
                    strokeWidth={2}
                    dot={false}
                    name="Airspeed (knots)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && historicalData.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No historical data available</p>
            <p className="text-gray-500 text-sm">Data will appear as it's collected</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendCharts;