#!/bin/bash

echo "Validating EatWhere server deployment..."

# Wait a moment for the server to fully start
sleep 10

# Check if the process is running
if pm2 list | grep -q "EatWhere/server.*online"; then
    echo "✅ PM2 process is running"
else
    echo "❌ PM2 process is not running"
    exit 1
fi

# Check if the server is responding on port 8080
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Server is responding on port 8080"
else
    echo "⚠️  Health check endpoint not available, checking if port is listening..."
    if netstat -tuln | grep -q ":8080 "; then
        echo "✅ Server is listening on port 8080"
    else
        echo "❌ Server is not listening on port 8080"
        exit 1
    fi
fi

echo "✅ EatWhere server deployment validation successful"
