const User = require('../models/user');

// Find user by email
exports.findUserByEmail = async (req, res) => {
  const { user_email } = req.params;

  try {
    const user = await User.findByEmail(user_email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error finding user by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Find user by ID
exports.findUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOneById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error finding user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Flag a user by ID
exports.flagUserById = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const user = await User.findOneById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Flag the user (you can implement this logic as per your requirements)
    await User.flagUser(userId);

    res.status(200).json({ message: 'User flagged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Flag a user by email
exports.flagUserByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;

    const user = await User.findOneByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Flag the user (you can implement this logic as per your requirements)
    await User.flagUserByEmail(userEmail);

    res.status(200).json({ message: 'User flagged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    await UserModel.deleteUserById(user_id);
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
