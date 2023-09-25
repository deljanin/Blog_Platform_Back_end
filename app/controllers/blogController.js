const Blog = require('../models/blog');

// Create a new blog post
exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.findAllBlogs();
    if (blogs === undefined) {
      return res.status(404).json({ message: 'There are no blogs' });
    }
    // console.log(blogs);
    res.status(200).json({ message: 'All blogs', blogs: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Create the blog post
    const newBlog = await blogModel.createBlog(title, description, userId);

    res
      .status(201)
      .json({ message: 'Blog post created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const updatedFields = req.body;

  try {
    const updatedBlog = await blogModel.updateBlogById(blogId, updatedFields);
    res.status(200).json({ updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    if (error.message === 'No valid fields to update') {
      res.status(400).json({ message: error.message });
    } else if (error.message === 'Blog not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.blogId;

  try {
    await blogModel.deleteBlogById(blogId);
    res.status(204).send(); // Successful deletion, no content to send
  } catch (error) {
    console.error('Error deleting blog:', error);
    if (error.message === 'Blog not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
