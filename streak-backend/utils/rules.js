// Lending Rules Configuration
const MAX_LOAN_PERCENT = 0.3;     // 30% of salary
const INTEREST_RATE = 0.03;       // 3% flat
const MAX_REPAYMENT_DAYS = 30;    // 30-day repayment cycle

/**
 * Check if the loan amount is within the allowed limit.
 * @param {Number} salary - User's monthly salary
 * @param {Number} requestedAmount - Amount user is applying for
 * @returns {Boolean}
 */
const isEligibleLoanAmount = (salary, requestedAmount) => {
  return requestedAmount <= salary * MAX_LOAN_PERCENT;
};

/**
 * Calculate the total repayment with interest.
 * @param {Number} principal - Loan amount
 * @returns {Object} - { totalAmount, interestAmount }
 */
const calculateRepayment = (principal) => {
  const interest = principal * INTEREST_RATE;
  return {
    totalAmount: Math.round(principal + interest),
    interestAmount: Math.round(interest),
  };
};

/**
 * Generate a repayment schedule (e.g., bi-weekly).
 * @param {Number} totalAmount - Amount to repay
 * @param {Number} segments - Number of repayments (default: 2)
 */
const generateRepaymentSchedule = (totalAmount, segments = 2) => {
  const now = new Date();
  const schedule = [];

  for (let i = 1; i <= segments; i++) {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + (i * (MAX_REPAYMENT_DAYS / segments)));

    schedule.push({
      date: dueDate,
      amount: Math.round(totalAmount / segments),
    });
  }

  return schedule;
};

module.exports = {
  isEligibleLoanAmount,
  calculateRepayment,
  generateRepaymentSchedule,
  MAX_LOAN_PERCENT,
  INTEREST_RATE,
  MAX_REPAYMENT_DAYS,
};
