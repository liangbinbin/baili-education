require('dotenv').config();

const isTestMode = process.env.DB_MODE === 'memory';

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
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
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
