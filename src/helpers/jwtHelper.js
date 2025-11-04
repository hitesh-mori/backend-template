const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const generateAccessToken = (payload, expiresIn = config.JWT_EXPIRE) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (payload, expiresIn = config.REFRESH_TOKEN_EXPIRE) => {
  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') throw new Error('Token has expired');
    if (error.name === 'JsonWebTokenError') throw new Error('Invalid token');
    throw new Error('Token verification failed');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') throw new Error('Refresh token has expired');
    if (error.name === 'JsonWebTokenError') throw new Error('Invalid refresh token');
    throw new Error('Refresh token verification failed');
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

const generateTokens = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  generateTokens,
};
