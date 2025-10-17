# PM2 Production Deployment Guide

This project is configured to run with PM2 (Process Manager 2) for production deployment.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install PM2 Globally
```bash
npm install -g pm2
```

### 3. Start with PM2

#### Production
```bash
npm run pm2:start
# or
pm2 start ecosystem.config.js --env production
```

#### Development (with file watching)
```bash
npm run pm2:dev
# or
pm2 start ecosystem.config.js --env development
```

#### Staging
```bash
npm run pm2:staging
# or
pm2 start ecosystem.config.js --env staging
```

## PM2 Commands

### Application Management
```bash
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# Reload application (0-downtime restart)
npm run pm2:reload

# Delete application from PM2
npm run pm2:delete
```

### Monitoring
```bash
# Show process status
npm run pm2:status
# or
pm2 status

# Show logs
npm run pm2:logs
# or
pm2 logs

# Real-time monitoring
npm run pm2:monit
# or
pm2 monit

# Show detailed process info
pm2 show pxweb-api-server
```

### Advanced Commands
```bash
# Restart specific process
pm2 restart pxweb-api-server

# Reload specific process (0-downtime)
pm2 reload pxweb-api-server

# Stop specific process
pm2 stop pxweb-api-server

# View logs for specific process
pm2 logs pxweb-api-server

# Flush logs
pm2 flush

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

## Configuration

The PM2 configuration is defined in `ecosystem.config.js`:

### Environments
- **Production**: PORT=3000, NODE_ENV=production
- **Development**: PORT=3000, NODE_ENV=development (with file watching)
- **Staging**: PORT=3001, NODE_ENV=staging

### Logging
Logs are stored in the `logs/` directory:
- `logs/combined.log` - Combined output and error logs
- `logs/out.log` - Standard output logs
- `logs/error.log` - Error logs

### Process Management
- **Max Memory**: 1GB (restarts if exceeded)
- **Min Uptime**: 10 seconds
- **Max Restarts**: 10 attempts
- **Restart Delay**: 4 seconds

## System Startup

To make PM2 start automatically on system boot:

1. Save current process list:
```bash
pm2 save
```

2. Generate and configure startup script:
```bash
pm2 startup
```

3. Follow the instructions provided by PM2

## Cluster Mode

To run multiple instances (cluster mode), modify `ecosystem.config.js`:

```javascript
{
  instances: 'max', // or specific number like 4
  exec_mode: 'cluster'
}
```

## Environment Variables

You can set environment variables in the ecosystem config or create `.env` files:

### Production (.env.production)
```
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
PXWEB_BASE_URL=https://pc-axis.geostat.ge/PXWeb/api/v1/ka/Database
```

### Development (.env.development)
```
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
DEBUG=*
```

## Deployment

The project includes deployment configuration for production and staging environments. Update the deployment section in `ecosystem.config.js` with your server details.

### Deploy to Production
```bash
pm2 deploy ecosystem.config.js production
```

### Deploy to Staging
```bash
pm2 deploy ecosystem.config.js staging
```

## Monitoring & Health Checks

### Built-in Health Check
The application includes health check endpoints:
- `GET /health` - Basic health check
- `GET /health/status` - Detailed system status

### PM2 Web Interface
Install PM2 web dashboard:
```bash
npm install -g pm2-web
pm2-web
```

### PM2 Plus (Optional)
For advanced monitoring, you can connect to PM2 Plus:
```bash
pm2 plus
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   pm2 kill
   pm2 start ecosystem.config.js
   ```

2. **Memory issues**
   - Check `max_memory_restart` in ecosystem.config.js
   - Monitor with `pm2 monit`

3. **Process not starting**
   ```bash
   pm2 logs pxweb-api-server
   ```

4. **File watching not working**
   - Ensure `watch: true` in development environment
   - Check `ignore_watch` patterns

### Logs Location
- Application logs: `logs/` directory
- PM2 logs: `~/.pm2/logs/`

### Reset PM2
If you need to completely reset PM2:
```bash
pm2 kill
pm2 cleardump
pm2 start ecosystem.config.js
```

## Performance Tuning

### Memory Usage
Monitor memory usage and adjust `max_memory_restart`:
```bash
pm2 show pxweb-api-server
```

### CPU Usage
Use cluster mode for CPU-intensive operations:
```javascript
{
  instances: 'max',
  exec_mode: 'cluster'
}
```

### Auto-scaling
Enable auto-scaling based on CPU usage:
```javascript
{
  max_memory_restart: '1G',
  instances: 2,
  exec_mode: 'cluster',
  // Auto scale between 2-8 instances based on CPU
  min_instances: 2,
  max_instances: 8,
  // Scale up when CPU > 80%
  scale_cpu: 80,
  // Scale down when CPU < 20%
  scale_memory: 80
}
```