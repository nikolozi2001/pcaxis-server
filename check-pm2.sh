#!/bin/bash

# PM2 Status and Health Check Script

echo "🔍 PM2 Status and Health Check"
echo "================================"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed globally"
    echo "   Run: npm install -g pm2"
    exit 1
fi

echo "✅ PM2 is installed"

# Show PM2 status
echo ""
echo "📊 PM2 Process Status:"
echo "----------------------"
pm2 status

# Check if our app is running
if pm2 show pxweb-api-server &> /dev/null; then
    echo ""
    echo "✅ pxweb-api-server is running"
    
    # Get app info
    echo ""
    echo "📈 Process Details:"
    echo "-------------------"
    pm2 show pxweb-api-server
    
    # Test health endpoint
    echo ""
    echo "🩺 Health Check:"
    echo "----------------"
    
    # Check if curl is available
    if command -v curl &> /dev/null; then
        echo "Testing health endpoint..."
        if curl -s http://localhost:3000/health > /dev/null; then
            echo "✅ Health endpoint is responding"
            curl -s http://localhost:3000/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/health
        else
            echo "❌ Health endpoint is not responding"
        fi
    else
        echo "ℹ️  Install curl to test health endpoint automatically"
        echo "   You can manually test: http://localhost:3000/health"
    fi
    
else
    echo ""
    echo "❌ pxweb-api-server is not running"
    echo "   Run: npm run pm2:start"
fi

# Show recent logs if app exists
if pm2 show pxweb-api-server &> /dev/null; then
    echo ""
    echo "📋 Recent Logs (last 15 lines):"
    echo "--------------------------------"
    pm2 logs pxweb-api-server --lines 15 --nostream
fi

echo ""
echo "🔧 Useful Commands:"
echo "-------------------"
echo "  npm run pm2:start   - Start the application"
echo "  npm run pm2:stop    - Stop the application"
echo "  npm run pm2:restart - Restart the application"
echo "  npm run pm2:logs    - View logs"
echo "  npm run pm2:monit   - Monitor processes"
echo "  npm run pm2:status  - Show status"