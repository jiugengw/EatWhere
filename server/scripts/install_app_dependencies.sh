#!/bin/bash

# Navigate to application directory
cd /home/ec2-user/EatWhere/server

echo "Installing application dependencies..."

# Install Node.js dependencies
npm ci --only=production

echo "Application dependencies installed successfully"
