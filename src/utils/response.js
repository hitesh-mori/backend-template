const { STATUS_CODES } = require('../config/constants');

const successResponse = (res, data = null, message = 'Success', statusCode = STATUS_CODES.OK) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const errorResponse = (res, message = 'Error occurred', statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, details = null) => {
  const response = { success: false, error: { message } };
  if (details) response.error.details = details;
  return res.status(statusCode).json(response);
};

const validationErrorResponse = (res, errors) => {
  return res.status(STATUS_CODES.BAD_REQUEST).json({
    success: false,
    error: { message: 'Validation error', details: Array.isArray(errors) ? errors : [errors] },
  });
};

const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, error: { message } });
};

const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(STATUS_CODES.NOT_FOUND).json({ success: false, error: { message } });
};

const conflictResponse = (res, message = 'Resource already exists') => {
  return res.status(STATUS_CODES.CONFLICT).json({ success: false, error: { message } });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
};
