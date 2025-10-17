module.exports = {
  apps: [
    {
      // Main application
      name: 'pxweb-api-server',
      script: './index.js',
      instances: 1, // You can use 'max' for cluster mode or specific number
      exec_mode: 'fork', // 'cluster' for cluster mode
      watch: false, // Set to true for development
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0',
        watch: true,
        ignore_watch: ['node_modules', 'logs', '.git']
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Advanced features
      source_map_support: true,
      instance_var: 'INSTANCE_ID',
      
      // Auto restart on file changes (development only)
      watch_options: {
        followSymlinks: false,
        usePolling: true,
        interval: 1000
      }
    }
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-production-server.com'],
      ref: 'origin/master',
      repo: 'https://github.com/nikolozi2001/pcaxis-server.git',
      path: '/var/www/pxweb-api',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    },
    staging: {
      user: 'deploy',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'https://github.com/nikolozi2001/pcaxis-server.git',
      path: '/var/www/pxweb-api-staging',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};