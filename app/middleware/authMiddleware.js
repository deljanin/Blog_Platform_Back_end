const jwt = require('jsonwebtoken');
const Config = require('../configs/config');
const User = require('../models/user'); // Replace with your user model

exports.requireAdmin = async (req, res, next) => {
  const { email } = req.user;

  try {
    const user = await User.findByEmail(email); // Retrieve the user's role from the database
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next(); // User is an admin, proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error checking admin authorization:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.requireCreator = async (req, res, next) => {
  const { email } = req.user;

  try {
    const user = await User.findByEmail(email); // Retrieve the user's role from the database
    if (!user || user.role !== 'creator') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next(); // User is an admin, proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error checking creator authorization:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to authenticate user with JWT token
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, Config.secretKey);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
