const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const Comment = sequelize.define('Comment', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  // Add other columns as needed
});

module.exports = Comment;
