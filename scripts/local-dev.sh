#!/bin/bash

# Local development setup with Docker Compose
# This script builds and runs the application locally for testing

set -e

echo "🏗️  Building and starting Aircraft Health Monitoring System locally..."

# Build and start services
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."

# Wait for backend to be healthy
echo "🔍 Waiting for backend to be ready..."
timeout=120
counter=0
while ! curl -s http://localhost:8080/actuator/health > /dev/null; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Backend failed to start within $timeout seconds"
        docker-compose logs backend
        exit 1
    fi
    echo "Waiting for backend... ($counter/$timeout seconds)"
    sleep 5
    counter=$((counter + 5))
done

echo "✅ Backend is ready!"

# Wait for frontend to be ready
echo "🔍 Waiting for frontend to be ready..."
timeout=60
counter=0
while ! curl -s http://localhost:3000 > /dev/null; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Frontend failed to start within $timeout seconds"
        docker-compose logs frontend
        exit 1
    fi
    echo "Waiting for frontend... ($counter/$timeout seconds)"
    sleep 5
    counter=$((counter + 5))
done

echo "✅ Frontend is ready!"

echo ""
echo "🎉 Application is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
echo "📊 Health Check: http://localhost:8080/actuator/health"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"