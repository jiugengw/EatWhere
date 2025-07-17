#!/bin/bash

# Install system dependencies
echo "Installing system dependencies..."

# Update package manager
yum update -y

# Install Node.js and npm (using NodeSource repository for latest LTS)
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 globally for process management
npm install -g pm2

# Install other system dependencies if needed
yum install -y git

echo "System dependencies installed successfully"
