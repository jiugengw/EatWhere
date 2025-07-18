#!/bin/bash

# Navigate to application directory
cd /home/ec2-user/EatWhere/server

echo "Building Docker image..."

# Build the Docker image
docker build -t eatwhere-server:latest .

# Clean up old images (keep only latest and one previous)
docker image prune -f

echo "Docker image built successfully"
