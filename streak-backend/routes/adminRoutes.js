const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth'); // Ensure only admins can access these routes

// Admin routes for loan management
router.get('/loans', isAdmin, adminController.getLoanApplications);
router.put('/loans/:id/approve', isAdmin, adminController.approveLoanApplication);
router.put('/loans/:id/reject', isAdmin, adminController.rejectLoanApplication);

// Admin routes for user management
router.get('/users', isAdmin, adminController.getUsers);

// Admin routes for platform stats
router.get('/transactions', isAdmin, adminController.getPlatformStats);

module.exports = router;
