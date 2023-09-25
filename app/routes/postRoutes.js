const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Publicly accessible route to get all posts
router.get('/getAll', postController.getAll);
router.get('/get/:post_id', postController.getOne);

router.post(
  '/create',
  authMiddleware.authenticate,
  authMiddleware.requireCreator,
  postController.create
);
router.patch(
  '/update',
  authMiddleware.authenticate,
  authMiddleware.requireCreator,
  postController.update
);
router.delete(
  '/delete',
  authMiddleware.authenticate,
  authMiddleware.requireCreator,
  postController.delete
);
module.exports = router;
