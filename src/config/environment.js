require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon-db',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  ARGON2_MEMORY_COST: parseInt(process.env.ARGON2_MEMORY_COST) || 65536,
  ARGON2_TIME_COST: parseInt(process.env.ARGON2_TIME_COST) || 3,
  ARGON2_PARALLELISM: parseInt(process.env.ARGON2_PARALLELISM) || 4,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  SESSION_EXPIRE: parseInt(process.env.SESSION_EXPIRE) || 86400000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  API_PREFIX: process.env.API_PREFIX || '/api',
  IP: process.env.IP || '127.0.0.1'
};

if (config.NODE_ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'SESSION_SECRET'];
  const missing = required.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.error(`Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = config;
