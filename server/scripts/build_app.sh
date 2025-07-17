#!/bin/bash

# Navigate to application directory
cd /home/ec2-user/EatWhere/server

echo "Building the application..."

# Install dev dependencies for building
npm ci

# Build TypeScript to JavaScript
npm run build

# Remove dev dependencies to save space
npm ci --only=production

echo "Application built successfully"
