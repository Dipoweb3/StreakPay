// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface to interact with Streak token
interface IStreakToken is IERC20 {
    function releaseLockedTokens() external;
    function availableForLoans() external view returns (uint256);
}

contract LoanVault is Ownable {
    IStreakToken public streakToken;
    uint256 public totalLoansIssued;
    uint256 public availableForLoans;

    // Mapping to track loans per borrower
    mapping(address => uint256) public loans;

    event LoanIssued(address borrower, uint256 amount);
    event LoanRepaid(address borrower, uint256 amount);
    event BuybackExecuted(uint256 amountSpent);
    event WithdrawalExecuted(address borrower, uint256 amount);

    // Constructor to initialize contract with Streak token
    constructor(address _streakToken) {
        streakToken = IStreakToken(_streakToken);
        availableForLoans = streakToken.availableForLoans(); // Initial available loan amount
    }

    // Function to issue a loan to a borrower in cNGN equivalent
    function issueLoan(address borrower, uint256 cNGNAmount) external onlyOwner {
        uint256 streakAmount = convertToStreak(cNGNAmount); // Convert cNGN to equivalent STREAK
        require(availableForLoans >= streakAmount, "Not enough available tokens for loan");

        loans[borrower] += cNGNAmount;  // Track the loan in cNGN
        availableForLoans -= streakAmount;  // Decrease available for loans in the vault
        emit LoanIssued(borrower, cNGNAmount);
    }

    // Convert cNGN to STREAK tokens (simplified for this example, may need real price data)
    function convertToStreak(uint256 cNGNAmount) public pure returns (uint256) {
        // Conversion logic here, assuming a 1:1 ratio for simplicity
        // In practice, you would integrate with an oracle or pricing service for accurate conversion
        return cNGNAmount;  // 1:1 Conversion for demonstration (adjust as needed)
    }

    // Function to handle loan repayment and trigger buybacks
    function repayLoan(uint256 cNGNAmount) external {
        require(loans[msg.sender] >= cNGNAmount, "Repayment exceeds loan balance");

        loans[msg.sender] -= cNGNAmount;
        uint256 streakAmount = convertToStreak(cNGNAmount);

        streakToken.transferFrom(msg.sender, address(this), streakAmount); // Transfer STREAK back to vault
        emit LoanRepaid(msg.sender, cNGNAmount);
        executeBuyback(streakAmount);
    }

    // Internal function to execute buybacks (simplified, to be extended with DEX swap logic)
    function executeBuyback(uint256 streakAmount) internal {
        // Placeholder: Implement buyback logic (e.g., via Uniswap or other DEX)
        emit BuybackExecuted(streakAmount);
    }

    // Withdraw function for users to convert their STREAK to cNGN and off-ramp
    function withdraw(uint256 cNGNAmount) external {
        require(loans[msg.sender] >= cNGNAmount, "Insufficient loan balance for withdrawal");

        loans[msg.sender] -= cNGNAmount;

        // Convert cNGN to STREAK tokens
        uint256 streakAmount = convertToStreak(cNGNAmount);
        streakToken.transfer(msg.sender, streakAmount);  // Transfer STREAK tokens to the borrower

        emit WithdrawalExecuted(msg.sender, cNGNAmount);
        // Offramp logic is off-chain, via cNGN partner services
    }

    // Admin function to release locked tokens (if applicable)
    function releaseLockedTokens() external onlyOwner {
        streakToken.releaseLockedTokens();
    }

    // Get current loan status for a user
    function getLoanBalance(address borrower) external view returns (uint256) {
        return loans[borrower];
    }

    // Update availableForLoans when more tokens are released into the vault
    function updateAvailableForLoans() external {
        availableForLoans = streakToken.availableForLoans();
    }
}
