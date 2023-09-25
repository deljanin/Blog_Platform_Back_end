const Post = require('../models/post');

exports.getAll = async (req, res) => {
  const blog_id = req.params.blog_id;

  try {
    const posts = await Post.findAllPosts(blog_id);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'There are no posts' });
    }

    res.status(200).json({ message: 'All posts about this topic', posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const postId = req.params.post_id;

    const post = await Post.findOneById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post retrieved successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, blog_id } = req.body;
    const user_id = req.user.id;

    // Create the post
    const newPost = await Post.createPost({
      title,
      content,
      blog_id,
      user_id,
    });

    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { postId, title, content } = req.body;

    const updatedPost = await Post.updatePost(postId, { title, content });

    res
      .status(200)
      .json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a post
exports.delete = async (req, res) => {
  try {
    const { postId } = req.body;

    const deletedPost = await Post.deletePost(postId);

    res
      .status(200)
      .json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
