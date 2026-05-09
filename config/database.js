const mongoose = require('mongoose');
const config = require('./app');

const isProduction = process.env.NODE_ENV === 'production';

const getConnectionOptions = () => ({
  maxPoolSize: parseInt(process.env.MONGO_POOL_SIZE) || 10,
  minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE) || 2,
  serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGO_SOCKET_TIMEOUT) || 45000,
  family: 4,
  retryWrites: true,
  w: 'majority',
  directConnection: process.env.MONGO_DIRECT_CONNECTION === 'true',
  replicaSet: process.env.MONGO_REPLICA_SET || undefined,
  authSource: process.env.MONGO_AUTH_SOURCE || undefined
});

const connectDB = async () => {
  try {
    const options = getConnectionOptions();
    
    console.log(`Connecting to MongoDB...`);
    console.log(`Pool size: ${options.maxPoolSize}, Timeout: ${options.serverSelectionTimeoutMS}ms`);
    
    const conn = await mongoose.connect(config.mongodb.uri, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`⚠️ MongoDB disconnected`);
    });

    mongoose.connection.on('reconnected', () => {
      console.log(`✅ MongoDB reconnected`);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDB };
