const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../helpers/jwtHelper');
const { successResponse, errorResponse, conflictResponse, unauthorizedResponse } = require('../utils/response');
const { STATUS_CODES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');

const signup = async (req, res) => {
  try {
    const { name, email, password, userType, phone, profilePicture } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return conflictResponse(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

    const user = await User.create({ name, email, password, userType, phone, profilePicture });
    const { accessToken, refreshToken } = generateTokens({ userId: user._id, userType: user.userType });

    user.refreshToken = refreshToken;
    await user.save();

    return successResponse(
      res,
      { user: user.toSafeObject(), accessToken, refreshToken },
      SUCCESS_MESSAGES.SIGNUP_SUCCESS,
      STATUS_CODES.CREATED
    );
  } catch (error) {
    console.error('Signup error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmailWithPassword(email);
    if (!user) return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
    if (!user.isActive) return unauthorizedResponse(res, 'Account is deactivated');

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);

    const { accessToken, refreshToken } = generateTokens({ userId: user._id, userType: user.userType });

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return successResponse(
      res,
      { user: user.toSafeObject(), accessToken, refreshToken },
      SUCCESS_MESSAGES.SIGNIN_SUCCESS,
      STATUS_CODES.OK
    );
  } catch (error) {
    console.error('Signin error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return successResponse(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS, STATUS_CODES.OK);
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return unauthorizedResponse(res, 'Refresh token is required');

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return unauthorizedResponse(res, error.message);
    }

    const user = await User.findByIdWithRefreshToken(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_TOKEN);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id,
      userType: user.userType,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return successResponse(
      res,
      { accessToken, refreshToken: newRefreshToken },
      SUCCESS_MESSAGES.TOKEN_REFRESHED,
      STATUS_CODES.OK
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return errorResponse(res, ERROR_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    return successResponse(res, { user: user.toSafeObject() }, SUCCESS_MESSAGES.PROFILE_FETCHED, STATUS_CODES.OK);
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { signup, signin, logout, refreshToken, getProfile };
