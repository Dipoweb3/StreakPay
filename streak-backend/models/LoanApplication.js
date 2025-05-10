const mongoose = require('mongoose');

// Repayment schema (this will be used inside the loan schema)
const repaymentSchema = new mongoose.Schema({
  amountPaid: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Main Loan application schema
const loanApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'repaid', 'default'], 
    default: 'pending' 
  },
  repaymentPlan: {
    totalAmount: { type: Number, required: true },
    interest: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    schedule: [{
      date: { type: Date, required: true },
      amount: { type: Number, required: true }
    }]
  },
  repayments: [repaymentSchema], // Array to track repayments
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
