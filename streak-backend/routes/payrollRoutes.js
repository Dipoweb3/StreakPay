const express = require('express');
const router = express.Router();
const { uploadPayroll, getEmployees } = require('../controllers/payrollController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/upload-payroll', protect, upload.single('file'), uploadPayroll);
router.get('/employees', protect, getEmployees);

module.exports = router;
