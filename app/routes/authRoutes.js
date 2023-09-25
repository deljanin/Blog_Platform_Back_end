const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  validateRegistrationInput,
  validateEmail,
  sendVerificationCode,
} = require('../middleware/inputCheckerMiddleWare');

// Check email before register
router.post(
  '/send-verification-code',
  validateEmail,
  authController.sendVerificationCode
);
router.post('/verify-email', validateEmail, authController.verifyEmail);

// Registration route
router.post('/register', validateRegistrationInput, authController.register);

// Login route
router.post('/login', authController.login);

module.exports = router;
