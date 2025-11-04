const { errorResponse } = require('../utils/response');
const { STATUS_CODES, ERROR_MESSAGES } = require('../config/constants');

const errorHandler = (err, req, res, next) => {
  console.error('Error Handler Caught:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return errorResponse(res, ERROR_MESSAGES.VALIDATION_ERROR, STATUS_CODES.BAD_REQUEST, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, STATUS_CODES.CONFLICT);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid ID format', STATUS_CODES.BAD_REQUEST);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, ERROR_MESSAGES.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, ERROR_MESSAGES.TOKEN_EXPIRED, STATUS_CODES.UNAUTHORIZED);
  }

  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;
  return errorResponse(res, message, statusCode);
};

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route ${req.method} ${req.url} not found`, STATUS_CODES.NOT_FOUND);
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { errorHandler, notFoundHandler, asyncHandler };
