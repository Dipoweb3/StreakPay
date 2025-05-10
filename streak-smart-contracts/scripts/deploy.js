// scripts/deploy.js

const hre = require("hardhat");

async function main() {
    // Get the ContractFactory for StreakToken and LoanVault
    const StreakToken = await hre.ethers.getContractFactory("StreakToken");
    const LoanVault = await hre.ethers.getContractFactory("LoanVault");

    // Deploy StreakToken contract
    console.log("Deploying StreakToken...");
    const streakToken = await StreakToken.deploy();
    await streakToken.deployed();
    console.log("StreakToken deployed to:", streakToken.address);

    // Deploy LoanVault contract, passing the StreakToken address
    console.log("Deploying LoanVault...");
    const loanVault = await LoanVault.deploy(streakToken.address);
    await loanVault.deployed();
    console.log("LoanVault deployed to:", loanVault.address);

    // Optionally, you can assign ownership of the LoanVault contract to an admin wallet
    // await loanVault.transferOwnership(adminAddress); // If required

    console.log("Deployment completed!");
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
