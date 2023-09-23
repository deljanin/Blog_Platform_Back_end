const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const secretKey = config.secretKey;

// Registration controller
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    console.log(username);
    console.log(email);
    console.log(password);

    // Check if the email is already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser !== undefined) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    //Manually set role to viwer
    role = 'viewer';
    const newUser = await User.create(username, email, hashedPassword, role);
    if (email !== newUser.email) {
      res.status(500).json({ message: 'User creation failed' });
    }
    // Respond with a success message
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findByEmail(email);

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, generate a JWT token and return it
    if (passwordMatch) {
      const token = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: '1h', // You can adjust the token expiration as needed
      });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
