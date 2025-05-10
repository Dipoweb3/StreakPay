const Loan = require('../models/LoanApplication');
const User = require('../models/User');
const rules = require('../utils/rules');
const blockchain = require('../utils/blockchain'); // ⬅️ Import blockchain module

exports.applyLoan = async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  if (!rules.isEligibleLoanAmount(user.salary, amount)) {
    return res.status(400).json({
      message: `Requested loan exceeds 30% of your salary (₦${user.salary * rules.MAX_LOAN_PERCENT})`,
    });
  }

  const { totalAmount, interestAmount } = rules.calculateRepayment(amount);
  const schedule = rules.generateRepaymentSchedule(totalAmount);
  const dueDate = schedule[schedule.length - 1].date;

  let txHash;
  try {
    // ⬅️ Record loan on blockchain
    txHash = await blockchain.recordLoan(user.walletAddress, amount, interestAmount, Math.floor(new Date(dueDate).getTime() / 1000));
  } catch (err) {
    return res.status(500).json({ message: 'Blockchain loan recording failed', error: err.message });
  }

  const loan = await Loan.create({
    userId: user._id,
    amount,
    repaymentPlan: {
      totalAmount,
      interest: interestAmount,
      dueDate,
      schedule,
      blockchainReceipt: txHash // ⬅️ store tx hash as receipt
    },
    status: 'approved',
    approvedBy: null,
  });

  res.status(201).json({ loan, blockchainReceipt: txHash });
};

exports.getLoanStatus = async (req, res) => {
  const loan = await Loan.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

  if (!loan) return res.status(404).json({ message: 'No loan found' });

  res.json(loan);
};

exports.getLoanHistory = async (req, res) => {
  const loans = await Loan.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(loans);
};

exports.repayLoan = async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  const loan = await Loan.findOne({ userId: user._id, status: 'approved' });

  if (!loan) return res.status(404).json({ message: 'No active loan to repay' });

  loan.repayments.push({ amountPaid: amount, date: new Date() });

  const totalPaid = loan.repayments.reduce((sum, r) => sum + r.amountPaid, 0);

  if (totalPaid >= loan.repaymentPlan.totalAmount) {
    loan.status = 'repaid';

    try {
      // ⬅️ Mark repayment on blockchain
      const loanIndex = 0; // Adjust if you have multiple loans per user
      const txHash = await blockchain.markRepaid(user.walletAddress, loanIndex);
      loan.repaymentPlan.repaidReceipt = txHash; // Optional: Store receipt
    } catch (err) {
      return res.status(500).json({ message: 'Blockchain repayment failed', error: err.message });
    }
  }

  await loan.save();
  res.json({ message: 'Repayment recorded', loan });
};
