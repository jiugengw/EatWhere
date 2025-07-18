#!/bin/bash

echo "Validating EatWhere Docker container deployment..."

# Wait a moment for the container to fully start
sleep 10

# Check if the container is running
if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "eatwhere-server.*Up"; then
    echo "✅ Docker container is running"
else
    echo "❌ Docker container is not running"
    echo "Container logs:"
    docker logs eatwhere-server --tail 20
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
        echo "Container logs:"
        docker logs eatwhere-server --tail 20
        exit 1
    fi
fi

echo "✅ EatWhere Docker container deployment validation successful"
