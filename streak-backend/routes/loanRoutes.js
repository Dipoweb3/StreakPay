const express = require('express');
const router = express.Router();
const { applyLoan, getLoanStatus, getLoanHistory, repayLoan } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyLoan);
router.get('/status', protect, getLoanStatus);
router.get('/history', protect, getLoanHistory);
router.post('/repay', protect, repayLoan);

module.exports = router;
