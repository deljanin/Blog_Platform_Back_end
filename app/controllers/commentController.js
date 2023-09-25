const Comment = require('../models/comment');

exports.getAllComments = async (req, res) => {
  const post_id = req.params.post_id;
  try {
    const comments = await Comment.getAllComments(post_id);
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { post_id, content } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated user

    // Create the comment
    const comment = await Comment.createComment(content, post_id, userId);

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
