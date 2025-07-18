#!/bin/bash

# Stop and remove the Docker container
echo "Stopping EatWhere Docker container..."

# Stop the container if it's running
if docker ps -q -f name=eatwhere-server; then
    echo "Stopping running container..."
    docker stop eatwhere-server
fi

# Remove the container if it exists
if docker ps -aq -f name=eatwhere-server; then
    echo "Removing existing container..."
    docker rm eatwhere-server
fi

echo "Container stopped and removed"
