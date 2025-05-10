const { ethers } = require('ethers');

// Replace with your deployed contract address and ABI
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI = require('./LoanContractABI.json'); // Your smart contract ABI

const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Backend signer (admin wallet)
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

module.exports = {
  async recordLoanOnChain(userAddress, amount, interest, dueDate) {
    const tx = await contract.recordLoan(userAddress, amount, interest, dueDate);
    await tx.wait();
    return tx.hash; // Use this as a receipt
  },

  async verifyRepayment(userAddress, amount) {
    return await contract.verifyRepayment(userAddress, amount);
  }
};
