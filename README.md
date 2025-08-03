# Real-Time Aircraft Health Monitoring System

A comprehensive full-stack aviation application that simulates aircraft sensor data streaming into a backend system, which parses and analyzes the data, then feeds it into a real-time React-based dashboard to visualize aircraft system status.

## 🚁 Project Overview

This demo application showcases how coding assistants can generate boilerplate, documentation, test cases, and data-driven logic across frontend and backend components for aviation developers.

## ✅ Acceptance Criteria Met

- ✅ Backend can parse aircraft sensor data from CSV/JSON
- ✅ Anomaly detection logic flags invalid/suspicious values (e.g., hydraulic pressure low)
- ✅ Frontend dashboard connects to backend and updates in real-time
- ✅ System displays components: Engine, Fuel, Hydraulic, Altitude, Airspeed
- ✅ Alerts are visually triggered on the UI based on data
- ✅ Includes documentation/comments
- ✅ Real-time communication via WebSocket/API

## 🏗️ System Architecture

```
┌─────────────────┐    WebSocket/REST    ┌─────────────────┐
│   React Frontend │ ◄──────────────────► │  Java Backend   │
│   (Dashboard)    │                      │  (Spring Boot)  │
└─────────────────┘                      └─────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│   Real-time     │                      │  Data Simulation│
│   Visualization  │                      │  & Anomaly      │
│   & Alerts      │                      │  Detection      │
└─────────────────┘                      └─────────────────┘
```

## 🎯 Features

### Backend (Java Spring Boot)
- **Real-time data simulation** with realistic aircraft sensor readings
- **Anomaly detection** for critical systems (engine, fuel, hydraulic, altitude, airspeed)
- **WebSocket communication** for live data streaming
- **REST API endpoints** for data access and anomaly simulation
- **Comprehensive logging** and monitoring

### Frontend (React + Tailwind CSS)
- **Real-time dashboard** with live aircraft data visualization
- **System-specific components** for each aircraft system
- **Anomaly detection** with visual indicators and alerts
- **Interactive controls** for testing anomaly simulations
- **Responsive design** with modern aviation-themed UI

### Aircraft Systems Monitored
1. **Engine System**: RPM, temperature, oil pressure, oil temperature
2. **Fuel System**: Level, consumption, pressure, temperature
3. **Hydraulic System**: Pressure, temperature, fluid level
4. **Flight Data**: Altitude, airspeed, ground speed, Mach number, vertical speed
5. **Additional Systems**: Cabin pressure, battery voltage, generator output

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## 📊 Dashboard Features

### Real-Time Monitoring
- **Live data updates** every 2 seconds via WebSocket
- **Visual status indicators** for all aircraft systems
- **Anomaly detection** with color-coded alerts
- **System health overview** with percentage metrics

### Interactive Controls
- **Anomaly simulation** buttons for testing
- **Real-time alerts** with severity levels
- **Connection status** monitoring
- **System status** overview

### Data Visualization
- **Progress bars** for fuel and hydraulic levels
- **Gauge visualizations** for pressure ranges
- **Altitude and airspeed** range indicators
- **Status indicators** for each sensor

## 🔍 Anomaly Detection

The system monitors for critical anomalies:

### Engine Anomalies
- RPM outside normal range (500-3000)
- Engine temperature > 200°C
- Oil pressure outside range (20-100 PSI)
- Oil temperature > 120°C

### Fuel Anomalies
- Fuel level < 20%
- Fuel consumption > 1000 GPH
- Fuel pressure outside range (10-50 PSI)

### Hydraulic Anomalies
- Hydraulic pressure < 2000 PSI or > 3500 PSI
- Hydraulic temperature > 80°C
- Hydraulic fluid level < 80%

### Flight Data Anomalies
- Altitude > 45,000 feet
- Airspeed > 600 knots
- Mach number > 0.9
- Vertical speed > 5000 ft/min

## 🔌 API Endpoints

### Aircraft Data
- `GET /api/aircraft/data` - Get current aircraft sensor data
- `GET /api/aircraft/status` - Get system status
- `GET /api/aircraft/health` - Get system health

### Anomaly Simulation
- `POST /api/aircraft/simulate/engine-anomaly` - Trigger engine anomaly
- `POST /api/aircraft/simulate/fuel-anomaly` - Trigger fuel anomaly
- `POST /api/aircraft/simulate/hydraulic-anomaly` - Trigger hydraulic anomaly

### WebSocket
- **Endpoint**: `ws://localhost:8080/websocket`
- **Message Types**: `aircraft_data`, `alert`, `connection`

## 📁 Project Structure

```
monitoring-app/
├── backend/                 # Java Spring Boot backend
│   ├── src/main/java/com/aircraft/monitoring/
│   │   ├── AircraftMonitoringApplication.java
│   │   ├── config/
│   │   │   └── WebSocketConfig.java
│   │   ├── controller/
│   │   │   └── AircraftController.java
│   │   ├── model/
│   │   │   └── AircraftData.java
│   │   └── service/
│   │       ├── AnomalyDetectionService.java
│   │       ├── DataSimulationService.java
│   │       └── WebSocketService.java
│   ├── pom.xml
│   └── README.md
├── frontend/               # React + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── EngineSystem.js
│   │   │   ├── FuelSystem.js
│   │   │   ├── HydraulicSystem.js
│   │   │   ├── FlightData.js
│   │   │   ├── SystemStatus.js
│   │   │   ├── AnomalyControls.js
│   │   │   └── AlertPanel.js
│   │   ├── services/
│   │   │   └── WebSocketService.js
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── README.md
├── data/                   # Sample aircraft sensor data
├── docs/                   # Documentation
└── README.md              # This file
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Monitoring

- **Health Check**: `GET /actuator/health`
- **Metrics**: `GET /actuator/metrics`
- **Application Info**: `GET /actuator/info`

## 🎨 UI/UX Features

- **Dark aviation theme** with professional styling
- **Real-time animations** and transitions
- **Responsive design** for all screen sizes
- **Accessibility features** with proper contrast and focus states
- **Loading states** and error handling

## 🔧 Development

### Adding New Systems
1. Update `AircraftData.java` model
2. Add anomaly detection logic in `AnomalyDetectionService.java`
3. Create new React component in `frontend/src/components/`
4. Add to Dashboard layout
5. Update WebSocket message handling

### Customizing Anomaly Detection
1. Modify thresholds in `AnomalyDetectionService.java`
2. Update frontend status indicators
3. Test with anomaly simulation controls

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Documentation](./docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is for demonstration purposes and showcases the capabilities of AI coding assistants in generating full-stack aviation applications.

## 🚀 Demo Instructions

1. Start the backend: `cd backend && mvn spring-boot:run`
2. Start the frontend: `cd frontend && npm start`
3. Open `http://localhost:3000` in your browser
4. Watch real-time aircraft data updates
5. Use anomaly simulation controls to test the system
6. Observe alerts and visual indicators

The system demonstrates real-time aircraft monitoring with comprehensive anomaly detection and modern web technologies. 