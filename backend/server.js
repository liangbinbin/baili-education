const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
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

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger);
app.use(sanitizeInput);
app.use(responseMiddleware);

app.get('/api/health', (req, res) => {
  res.success({ status: 'ok', timestamp: new Date().toISOString() });
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

app.use((req, res, next) => {
  res.error(404, 'ROUTE_NOT_FOUND', '请求的接口不存在');
});

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
    
    app.listen(config.port, () => {
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
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
