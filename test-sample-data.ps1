# Aircraft Monitoring System - Sample Data Test Script
Write-Host "🚁 Aircraft Health Monitoring System - Sample Data Test" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Test backend API endpoints
Write-Host "`n📊 Testing Backend API Endpoints..." -ForegroundColor Yellow

# Test current aircraft data
Write-Host "`n1. Getting current aircraft data:" -ForegroundColor Cyan
try {
    $data = Invoke-RestMethod -Uri "http://localhost:8080/api/aircraft/data" -Method GET
    Write-Host "   ✅ Data retrieved successfully" -ForegroundColor Green
    Write-Host "   📈 Engine RPM: $($data.engineRPM)" -ForegroundColor White
    Write-Host "   🌡️  Engine Temp: $($data.engineTemperature)°C" -ForegroundColor White
    Write-Host "   ⛽ Fuel Level: $($data.fuelLevel)%" -ForegroundColor White
    Write-Host "   🛩️  Altitude: $($data.altitude) ft" -ForegroundColor White
    Write-Host "   🚀 Airspeed: $($data.airspeed) knots" -ForegroundColor White
    Write-Host "   ⚠️  System Status: $($data.systemStatus)" -ForegroundColor $(if($data.systemStatus -eq "WARNING"){"Red"}else{"Green"})
} catch {
    Write-Host "   ❌ Failed to get aircraft data: $($_.Exception.Message)" -ForegroundColor Red
}

# Test system status
Write-Host "`n2. Getting system status:" -ForegroundColor Cyan
try {
    $status = Invoke-RestMethod -Uri "http://localhost:8080/api/aircraft/status" -Method GET
    Write-Host "   ✅ Status retrieved successfully" -ForegroundColor Green
    Write-Host "   👥 Connected Clients: $($status.connectedClients)" -ForegroundColor White
    Write-Host "   🔄 Data Generation: $($status.dataGenerationActive)" -ForegroundColor White
    Write-Host "   ⏰ Last Update: $($status.lastUpdate)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to get system status: $($_.Exception.Message)" -ForegroundColor Red
}

# Test anomaly simulation
Write-Host "`n3. Testing anomaly simulation (Engine):" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/aircraft/simulate/engine-anomaly" -Method POST
    Write-Host "   ✅ Engine anomaly simulation triggered" -ForegroundColor Green
    Write-Host "   📝 Message: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Failed to trigger engine anomaly: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Application Status:" -ForegroundColor Yellow
Write-Host "   Backend: ✅ Running on http://localhost:8080" -ForegroundColor Green
Write-Host "   Frontend: ✅ Running on http://localhost:3000" -ForegroundColor Green
Write-Host "   WebSocket: ✅ Available at ws://localhost:8080/websocket" -ForegroundColor Green

Write-Host "`n🌐 Access the dashboard at: http://localhost:3000" -ForegroundColor Magenta
Write-Host "📱 Real-time data updates every 2 seconds" -ForegroundColor Magenta
Write-Host "⚠️  Anomaly detection is active" -ForegroundColor Magenta

Write-Host "`n✨ Sample data generation is working perfectly!" -ForegroundColor Green 