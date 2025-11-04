const express = require('express');
const router = express.Router();
const { signup, signin, logout, refreshToken, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRequest, signupSchema, signinSchema, refreshTokenSchema } = require('../utils/validators');

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/signin', validateRequest(signinSchema), signin);
router.post('/logout', authenticate, logout);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);
router.get('/profile', authenticate, getProfile);

module.exports = router;
