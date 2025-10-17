#!/bin/bash

# PM2 Production Startup Script
# This script sets up PM2 for production deployment

echo "🚀 Starting PXWeb API Server with PM2..."

# Ensure logs directory exists
mkdir -p logs

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi

# Delete any existing processes
pm2 delete ecosystem.config.js 2>/dev/null || true

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Set up PM2 to start on system boot (run once)
# pm2 startup

echo "✅ PXWeb API Server started successfully!"
echo ""
echo "📊 Useful PM2 commands:"
echo "  pm2 status          - Show process status"
echo "  pm2 logs            - Show logs"
echo "  pm2 monit           - Monitor processes"
echo "  pm2 restart all     - Restart all processes"
echo "  pm2 reload all      - Reload all processes (0-downtime)"
echo "  pm2 stop all        - Stop all processes"
echo ""
echo "🌐 Server should be running at:"
echo "  http://localhost:3000"
echo "  http://192.168.1.27:3000"