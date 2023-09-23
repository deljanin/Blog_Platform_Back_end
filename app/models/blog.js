const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const Blog = sequelize.define('Blog', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  // Add other columns as needed
});

module.exports = Blog;
