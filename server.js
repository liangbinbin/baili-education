const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('./config/app');
const responseMiddleware = require('./middleware/response');
const { errorHandler } = require('./middleware/errorHandler');
const { sanitizeInput, requestLogger } = require('./middleware/security');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');
const classRoutes = require('./routes/class');
const homeworkRoutes = require('./routes/homework');
const checkinRoutes = require('./routes/checkin');
const pointsRoutes = require('./routes/points');
const batchRoutes = require('./routes/batch');

const mongoose = require('mongoose');
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

app.use(requestLogger);
app.use(sanitizeInput);
app.use(responseMiddleware);

app.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/health/ready', async (req, res) => {
  const checks = {
    mongodb: false
  };

  if (config.dbMode === 'mongodb') {
    checks.mongodb = mongoose.connection.readyState === 1;
  } else {
    checks.mongodb = true;
  }

  const isReady = Object.values(checks).every(v => v);

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  });
});

app.get('/api/health', (req, res) => {
  res.success({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', apiLimiter);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/class', classRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/batch', batchRoutes);

const isStandaloneMode = process.env.STANDALONE_MODE !== 'false';
if (isStandaloneMode) {
  app.use(express.static(path.join(__dirname, 'frontend', 'student')));
  app.use('/teacher', express.static(path.join(__dirname, 'frontend', 'teacher')));
  
  app.get('/student/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'student', 'index.html'));
  });
  
  app.get('/teacher/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'teacher', 'index.html'));
  });
} else {
  app.use((req, res, next) => {
    res.error(404, 'ROUTE_NOT_FOUND', '请求的接口不存在');
  });
}

app.use(errorHandler);

const startServer = async () => {
  try {
    if (config.dbMode === 'mongodb') {
      const { connectDB } = require('./config/database');
      await connectDB();
    } else {
      console.log('✅ 使用内存数据库模式');
      require('./utils/memoryDB');
      const { initTestData } = require('./middleware/initData');
      await initTestData();
    }

    const server = app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🎓 百里教育管理系统 - 后端服务                    ║
║                                                   ║
║   Server running on port ${config.port}              ║
║   Environment: ${config.env}                         ║
║   Database: ${config.dbMode.toUpperCase()}            ║
║   API Base: http://localhost:${config.port}/api       ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        try {
          if (config.dbMode === 'mongodb' && mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
          }
          console.log('Graceful shutdown completed');
          process.exit(0);
        } catch (err) {
          console.error('Error during graceful shutdown:', err);
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
