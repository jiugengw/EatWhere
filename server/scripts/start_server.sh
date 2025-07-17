#!/bin/bash

# Navigate to application directory
cd /home/ec2-user/EatWhere/server

echo "Starting EatWhere server..."

# Load environment variables if .env file exists
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Start the application using PM2
pm2 start npm --name "EatWhere/server" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (run once)
pm2 startup

echo "EatWhere server started successfully"
