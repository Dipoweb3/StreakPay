const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (ensure the user is authenticated)
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {  // Assuming 'role' is a property of the user model
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = { protect, isAdmin };
