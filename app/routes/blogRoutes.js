const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

// Publicly accessible route to get all blogs
router.get('/getAll', blogController.getAll);

router.post(
  '/create',
  authMiddleware.authenticate,
  authMiddleware.requireCreator,
  blogController.createBlog
);
router.patch(
  '/update/:blogId',
  authMiddleware.authenticate,
  authMiddleware.requireCreator,
  blogController.updateBlog
);
router.delete(
  '/delete/:blogId',
  authMiddleware.authenticate,
  authMiddleware.requireCreator,
  blogController.deleteBlog
);
module.exports = router;
