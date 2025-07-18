#!/bin/bash

# Navigate to application directory
cd /home/ec2-user/EatWhere/server

echo "Starting EatWhere Docker container..."

# Create logs directory if it doesn't exist
mkdir -p /home/ec2-user/logs

# Start the Docker container
docker run -d \
  --name eatwhere-server \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file .env \
  -v /home/ec2-user/logs:/app/logs \
  eatwhere-server:latest

echo "EatWhere Docker container started successfully"
