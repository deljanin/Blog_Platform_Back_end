const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Find user by ID
router.get(
  '/find/:user_id',
  authMiddleware.authenticate,
  authMiddleware.checkAdminAuthorization,
  userController.findUserById
);

// Find user by email
router.get(
  '/find/email/:user_email',
  authMiddleware.authenticate,
  authMiddleware.checkAdminAuthorization,
  userController.findUserByEmail
);

// Flag a user by ID
router.patch(
  '/flag/:user_id',
  authMiddleware.authenticate,
  authMiddleware.checkAdminAuthorization,
  userController.flagUserById
);

// Flag a user by email
router.patch(
  '/flagByEmail/:email',
  authMiddleware.authenticate,
  authMiddleware.checkAdminAuthorization,
  userController.flagUserByEmail
);

router.delete(
  '/delete/:user_id',
  authMiddleware.authenticate,
  userController.deleteUserById
);

module.exports = router;
