const mongoose = require('mongoose');

let isConnected = false;
let lastError = null;

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    lastError = 'MONGO_URI is not set in environment variables';
    console.error(`[db] ${lastError}`);
    return;
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    lastError = null;
    console.log('[db] MongoDB connected');
  } catch (err) {
    isConnected = false;
    lastError = err.message;
    console.error('[db] MongoDB connection failed:', err.message);
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[db] MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[db] MongoDB reconnected');
  });
}

/**
 * Returns real, current DB status for the health check endpoint.
 * Never reports "connected" unless mongoose actually says so.
 */
function getDBStatus() {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    connected: mongoose.connection.readyState === 1,
    state: readyStateMap[mongoose.connection.readyState] || 'unknown',
    error: mongoose.connection.readyState === 1 ? null : lastError,
  };
}

module.exports = { connectDB, getDBStatus };
