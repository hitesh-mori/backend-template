const { verifyAccessToken } = require('../helpers/jwtHelper');
const { unauthorizedResponse } = require('../utils/response');
const { ERROR_MESSAGES, JWT_CONFIG } = require('../config/constants');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers[JWT_CONFIG.ACCESS_TOKEN_HEADER.toLowerCase()];
    if (!authHeader) return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
    if (!authHeader.startsWith(`${JWT_CONFIG.TOKEN_PREFIX} `)) {
      return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_TOKEN);
    }

    const token = authHeader.substring(JWT_CONFIG.TOKEN_PREFIX.length + 1);
    if (!token) return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_TOKEN);

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return unauthorizedResponse(res, error.message);
    }

    const user = await User.findById(decoded.userId);
    if (!user) return unauthorizedResponse(res, ERROR_MESSAGES.USER_NOT_FOUND);
    if (!user.isActive) return unauthorizedResponse(res, 'Account is deactivated');

    req.user = { userId: decoded.userId, userType: decoded.userType };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }
};

const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
    if (!allowedTypes.includes(req.user.userType)) {
      return unauthorizedResponse(res, 'You do not have permission to access this resource');
    }
    next();
  };
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers[JWT_CONFIG.ACCESS_TOKEN_HEADER.toLowerCase()];
    if (!authHeader || !authHeader.startsWith(`${JWT_CONFIG.TOKEN_PREFIX} `)) return next();

    const token = authHeader.substring(JWT_CONFIG.TOKEN_PREFIX.length + 1);
    if (!token) return next();

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = { userId: decoded.userId, userType: decoded.userType };
      }
    } catch (error) {
      console.log('Optional auth - Invalid token:', error.message);
    }
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

module.exports = { authenticate, authorize, optionalAuthenticate };
