#!/bin/bash

# Stop the application server
echo "Stopping EatWhere server..."

# Check if PM2 process exists and stop it
if pm2 list | grep -q "EatWhere/server"; then
    echo "Stopping PM2 process..."
    pm2 stop EatWhere/server
    pm2 delete EatWhere/server
else
    echo "No PM2 process found, checking for direct node process..."
    
    # Kill any node process running on port 8080
    PORT_PID=$(lsof -ti:8080)
    if [ ! -z "$PORT_PID" ]; then
        echo "Killing process on port 8080: $PORT_PID"
        kill -9 $PORT_PID
    fi
fi

echo "Server stopped"
