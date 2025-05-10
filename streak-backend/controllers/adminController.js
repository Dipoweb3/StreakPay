const Loan = require('../models/LoanApplication');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Assuming you have a Transaction model

// Get all loan applications
exports.getLoanApplications = async (req, res) => {
  try {
    const loans = await Loan.find(); // Retrieve all loan applications
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving loan applications', error: err });
  }
};

// Approve a loan application
exports.approveLoanApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: 'Loan application not found' });

    loan.status = 'approved';
    loan.approvedBy = req.user._id; // Assuming req.user is the logged-in admin

    await loan.save();
    res.status(200).json({ message: 'Loan approved', loan });
  } catch (err) {
    res.status(500).json({ message: 'Error approving loan', error: err });
  }
};

// Reject a loan application
exports.rejectLoanApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: 'Loan application not found' });

    loan.status = 'rejected';
    loan.rejectedBy = req.user._id; // Assuming req.user is the logged-in admin

    await loan.save();
    res.status(200).json({ message: 'Loan rejected', loan });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting loan', error: err });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err });
  }
};

// Get platform statistics (example for transactions, users, and loans)
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLoans = await Loan.countDocuments({ status: 'approved' });
    const totalTransactions = await Transaction.countDocuments();

    const stats = {
      totalUsers,
      totalLoans,
      totalTransactions
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving platform stats', error: err });
  }
};
