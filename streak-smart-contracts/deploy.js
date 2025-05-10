const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const StreakToken = await hre.ethers.getContractFactory("StreakToken");
  const streak = await StreakToken.deploy();
  await streak.waitForDeployment();
  const tokenAddress = await streak.getAddress();
  console.log("StreakToken deployed to:", tokenAddress);

  const LoanVault = await hre.ethers.getContractFactory("LoanVault");
  const vault = await LoanVault.deploy(tokenAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("LoanVault deployed to:", vaultAddress);

  // Transfer 800,000 STREAK to the vault
  const transferAmount = hre.ethers.parseEther("800000");
  const tx = await streak.transfer(vaultAddress, transferAmount);
  await tx.wait();
  console.log("Transferred 800,000 STREAK to the vault");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
