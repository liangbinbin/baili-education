module.exports = {
  apps: [
    {
      name: 'baili-backend',
      script: './backend/server.js',
      cwd: '/workspace',
      instances: process.env.NODE_ENV === 'production' ? 2 : 1,
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGODB_URI: 'mongodb://localhost:27017/baili_education'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      autorestart: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 8000,
      kill_timeout: 5000,
      wait_ready: true,
      instance_var: 'INSTANCE_ID',
      shutdown_with_message: true,
      source_map_support: true,
      exp_backoff_restart_delay: 100,
      kill_retry_time: 100
    }
  ]
};
