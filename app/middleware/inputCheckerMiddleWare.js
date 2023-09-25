const { check } = require('express-validator');
const badWords = require('bad-words');

const customFilter = new badWords();

const validateEmail = check('email')
  .exists()
  .withMessage('Email undefined')
  .isEmail()
  .withMessage('Invalid email format');

// Custom validation function to check for profanity and hate speech
const checkComment = check('content')
  .exists()
  .withMessage('Comment text undefined')
  .custom((value) => {
    if (customFilter.isProfane(value)) {
      return false;
    } else return true;
  })
  .withMessage('Profanity is not allowed');

// Validation middleware
const validateRegistrationInput = [
  validateEmail,
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character (#)')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letters')
    .matches(/[a-z]/)
    .withMessage('Password must contain lowercase letters')
    .matches(/[0-9]/)
    .withMessage('Password must contain numbers'),
  check('username')
    .custom((value) => {
      if (customFilter.isProfane(value)) {
        return false;
      } else return true;
    })
    .withMessage('Profanity is not allowed'),
];

module.exports = {
  validateRegistrationInput,
  validateEmail,
  checkComment,
};
