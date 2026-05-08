require('dotenv').config();

const isTestMode = process.env.DB_MODE === 'memory';
const isProduction = process.env.NODE_ENV === 'production';

const jwtSecret = process.env.JWT_SECRET;
if (isProduction && (!jwtSecret || jwtSecret === 'dev-secret-change-in-production')) {
  throw new Error('生产环境必须设置 JWT_SECRET 环境变量，且不能使用默认值');
}

const corsOrigin = process.env.CORS_ORIGIN || (isProduction ? null : '*');
if (isProduction && corsOrigin === '*') {
  console.warn('⚠️ 警告: 生产环境建议设置具体的 CORS_ORIGIN 而非 "*"');
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  dbMode: isTestMode ? 'memory' : 'mongodb',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/baili_education',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  jwt: {
    secret: jwtSecret || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  cors: {
    origin: corsOrigin,
    credentials: true
  },

  file: {
    maxSize: parseInt(process.env.FILE_MAX_SIZE) || 10 * 1024 * 1024
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  points: {
    default: {
      homework: 10,
      checkin: 5,
      share: 10
    }
  }
};
