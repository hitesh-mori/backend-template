const Joi = require('joi');
const { USER_TYPES } = require('../config/constants');

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).max(50).required(),
  userType: Joi.string().valid(...Object.values(USER_TYPES)).required(),
  phone: Joi.string().trim().pattern(/^[0-9]{10,15}$/).allow(null, '').optional(),
  profilePicture: Joi.string().uri().allow(null, '').optional(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().optional(),
  phone: Joi.string().trim().pattern(/^[0-9]{10,15}$/).allow(null, '').optional(),
  profilePicture: Joi.string().uri().allow(null, '').optional(),
}).min(1);

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: error.details.map((d) => d.message),
        },
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  signupSchema,
  signinSchema,
  refreshTokenSchema,
  updateProfileSchema,
  validateRequest,
};
