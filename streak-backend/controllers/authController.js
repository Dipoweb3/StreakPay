const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  const { fullName, email, password, employer, salary } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({
    fullName,
    email,
    password,
    employer,
    salary,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.getProfile = async (req, res) => {
  const user = req.user;
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.logoutUser = async (req, res) => {
  res.status(200).json({ message: 'Logout handled on client side (token deleted)' });
};
