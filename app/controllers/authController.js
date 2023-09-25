const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Config = require('../configs/config');
const User = require('../models/user');
const Verification = require('../models/verification');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const secretKey = Config.secretKey;

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'deljanin741@gmail.com', // Your Gmail email address
    pass: Config.emailKey, // Your Gmail password or an "App Password" if you have 2FA enabled
  },
});

exports.sendVerificationCode = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser !== undefined) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    const existingCode = await Verification.findVerificationCode(email);
    if (existingCode !== undefined) {
      return res.status(400).json({ message: 'Email code already sent' });
    }
    const verificationCode = crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase();

    // Email data
    const mailOptions = {
      from: 'deljanin741@gmail.com',
      to: email,
      subject: "Email verification code for Deljanin's blogging platfrom",
      text: `Hello, 
          This is your email verification code:
          <b>${verificationCode}</b>
          Have a nice day!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ message: 'Error sending verification code' });
        console.error('Error sending email: ' + error);
      } else {
        console.log(
          'Verification code sent to: ' +
            email +
            '\nThe response: ' +
            info.response
        );
      }
    });
    Verification.createVerificationCode(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser !== undefined) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const existingVerification = await Verification.findVerificationCode(email);
    const existingCode = existingVerification.verification_code;
    console.log(existingCode);
    if (existingCode === code) {
      Verification.setEmailVerified(email);
      res.status(200).json({ message: 'Email verified' });
    } else {
      return res
        .status(400)
        .json({ message: 'Registration code does not exist or is invalid' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Registration controller
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser !== undefined) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    const verifiedEmail = await Verification.findVerifiedEmail(email);
    if (verifiedEmail === undefined) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    //Manually set role to viwer
    role = 'viewer';
    await User.createUser(username, email, hashedPassword, role);

    Verification.deleteVerifiedEmail(email);
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
      return res
        .status(401)
        .json({ message: 'No account associated to this email' });
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, generate a JWT token and return it
    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey,
        {
          expiresIn: '1h', // You can adjust the token expiration as needed
        }
      );
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
