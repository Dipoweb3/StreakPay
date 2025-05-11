const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Create new employer (Authenticated users only)
router.post('/', protect, employerController.createEmployer);

// Get employers created by this user (Authenticated)
router.get('/', protect, employerController.getMyEmployers);

// Get all employers (Admin only)
router.get('/all', protect, isAdmin, employerController.getAllEmployers);

module.exports = router;
