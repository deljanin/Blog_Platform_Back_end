const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const Post = sequelize.define('Post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
  },
  // Add other columns as needed
});

module.exports = Post;
