const USER_TYPES = {
  TYPE1: 'type1',
  TYPE2: 'type2',
  TYPE3: 'type3',
};

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  VALIDATION_ERROR: 'Validation error',
  MISSING_FIELDS: 'Required fields are missing',
  INVALID_USER_TYPE: 'Invalid user type',
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
};

const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'User registered successfully',
  SIGNIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  PROFILE_FETCHED: 'Profile fetched successfully',
};

const JWT_CONFIG = {
  ACCESS_TOKEN_HEADER: 'Authorization',
  REFRESH_TOKEN_HEADER: 'x-refresh-token',
  TOKEN_PREFIX: 'Bearer',
};

module.exports = {
  USER_TYPES,
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  JWT_CONFIG,
};
