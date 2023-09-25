const Like = require('../models/like');

exports.getLikes = async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const likesCount = await Like.getLikes(post_id);

    res.status(200).json({ likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createLike = async (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id;

  try {
    await Like.createLike(post_id, user_id);

    res.status(201).json({ message: 'Like created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
