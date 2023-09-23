const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  validateRegistrationInput,
} = require('../middleware/inputCheckerMiddleWare');

// Registration route
router.post('/register', validateRegistrationInput, authController.register);

// Login route
router.post('/login', authController.login);

module.exports = router;
