const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const inputCheckerMiddleware = require('../middleware/inputCheckerMiddleWare');

router.get('/getAll', commentController.getAllComments);

router.post(
  '/create',
  authMiddleware.authenticate,
  inputCheckerMiddleware.checkComment,
  commentController.createComment
);

module.exports = router;
