const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');  // Import the middleware

const router = express.Router();

// Public route: No authentication required
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// Protected route: Requires authentication (logged-in user)
router.get('/protected', protect, (req, res) => {
  res.json({ message: `Hello, ${req.user.name}` });
});

// Admin-only route: Requires authentication and admin role
router.get('/admin', protect, isAdmin, (req, res) => {
  res.json({ message: 'Admin content' });
});

module.exports = router;
