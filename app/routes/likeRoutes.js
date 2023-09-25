const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

// Get likes count for a post
router.get('/:post_id', likesController.getLikes);
// Create a like for a post
router.post('/create', authMiddleware.authenticate, likesController.createLike);

module.exports = router;
