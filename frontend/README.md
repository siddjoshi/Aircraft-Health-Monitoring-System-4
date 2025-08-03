# Aircraft Health Monitoring System - Frontend

React-based frontend for the Real-Time Aircraft Health Monitoring System.

## Features

- ✅ Real-time aircraft data visualization
- ✅ WebSocket connection for live updates
- ✅ Anomaly detection and alerting
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Interactive anomaly simulation controls
- ✅ System status overview

## System Components

### Core Components

1. **Dashboard**: Main dashboard layout and system overview
2. **EngineSystem**: Engine RPM, temperature, oil pressure monitoring
3. **FuelSystem**: Fuel level, consumption, pressure monitoring
4. **HydraulicSystem**: Hydraulic pressure, temperature, fluid level monitoring
5. **FlightData**: Altitude, airspeed, Mach number monitoring
6. **SystemStatus**: Overall system health and status summary
7. **AnomalyControls**: Test controls for triggering anomalies
8. **AlertPanel**: Real-time alert notifications

### Aircraft Systems Monitored

- **Engine**: RPM, temperature, oil pressure, oil temperature
- **Fuel**: Level, consumption, pressure, temperature
- **Hydraulic**: Pressure, temperature, fluid level
- **Flight Data**: Altitude, airspeed, ground speed, Mach number, vertical speed
- **Additional**: Cabin pressure, battery voltage, generator output

## Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Running the Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will start on `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js              # Main dashboard layout
│   ├── EngineSystem.js           # Engine monitoring component
│   ├── FuelSystem.js             # Fuel system monitoring
│   ├── HydraulicSystem.js        # Hydraulic system monitoring
│   ├── FlightData.js             # Flight data monitoring
│   ├── SystemStatus.js           # System status overview
│   ├── AnomalyControls.js        # Anomaly simulation controls
│   └── AlertPanel.js             # Alert notifications
├── services/
│   └── WebSocketService.js       # WebSocket communication
├── App.js                        # Main application component
├── App.css                       # Global styles
└── index.js                      # Application entry point
```

## WebSocket Communication

The frontend connects to the backend via WebSocket for real-time updates:

- **Connection**: `ws://localhost:8080/websocket`
- **Message Types**:
  - `aircraft_data`: Real-time sensor data
  - `alert`: System alerts and warnings
  - `connection`: Connection status messages

## Component Documentation

### Dashboard

Main dashboard component that orchestrates all system displays.

**Props:**
- `aircraftData`: Current aircraft sensor data
- `connectionStatus`: WebSocket connection status

### EngineSystem

Displays engine-related sensor data with anomaly detection.

**Props:**
- `data`: Aircraft sensor data object
- `hasAnomaly`: Boolean indicating engine anomaly

**Features:**
- Real-time RPM, temperature, oil pressure monitoring
- Visual status indicators
- Anomaly detection with color coding

### FuelSystem

Displays fuel system data with level visualization.

**Props:**
- `data`: Aircraft sensor data object
- `hasAnomaly`: Boolean indicating fuel anomaly

**Features:**
- Fuel level progress bar
- Consumption rate monitoring
- Pressure and temperature tracking

### HydraulicSystem

Displays hydraulic system data with pressure gauge visualization.

**Props:**
- `data`: Aircraft sensor data object
- `hasAnomaly`: Boolean indicating hydraulic anomaly

**Features:**
- Pressure range visualization
- Fluid level progress bar
- Temperature monitoring

### FlightData

Displays flight-related data with altitude and airspeed visualizations.

**Props:**
- `data`: Aircraft sensor data object
- `hasAnomaly`: Boolean indicating flight data anomaly

**Features:**
- Altitude range visualization
- Airspeed progress bar
- Mach number and vertical speed monitoring

### SystemStatus

Provides an overview of all aircraft systems.

**Props:**
- `aircraftData`: Current aircraft sensor data

**Features:**
- System health summary
- Anomaly count
- Overall system status

### AnomalyControls

Provides test controls for triggering anomaly simulations.

**Features:**
- Engine anomaly simulation
- Fuel anomaly simulation
- Hydraulic anomaly simulation
- Real-time feedback

### AlertPanel

Displays real-time alerts and notifications.

**Props:**
- `alerts`: Array of alert objects

**Features:**
- Multiple severity levels (INFO, WARNING, CRITICAL)
- Automatic dismissal
- Slide-in animations

## Styling

The application uses Tailwind CSS with custom aviation-themed colors:

- `aviation-blue`: Primary brand color
- `aviation-red`: Critical alerts and anomalies
- `aviation-green`: Normal status and success
- `aviation-yellow`: Warnings and cautions
- `aviation-gray`: Neutral elements

## Development

### Adding New Components

1. Create component file in `src/components/`
2. Import required icons from `lucide-react`
3. Add component to Dashboard layout
4. Update WebSocket service if needed

### Customizing Styles

1. Modify `tailwind.config.js` for theme changes
2. Update `App.css` for custom animations
3. Use aviation color palette for consistency

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## API Integration

The frontend communicates with the backend via:

- **REST API**: For anomaly simulation triggers
- **WebSocket**: For real-time data updates
- **Proxy**: Configured to forward requests to `http://localhost:8080`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Real-time updates every 2 seconds
- Optimized re-renders with React hooks
- Efficient WebSocket message handling
- Responsive design for all screen sizes 