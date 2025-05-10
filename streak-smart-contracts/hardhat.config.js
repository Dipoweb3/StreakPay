require("@nomiclabs/hardhat-ethers");                // ethers plugin
require("dotenv").config();                          // load .env

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.19" },                        // support any 0.8.19 files
      {
        version: "0.8.20",                          // support OZ and Streak.sol
        settings: {
          optimizer: { enabled: true, runs: 200 }   // gas optimization
        }
      }
    ],
    overrides: {
      "contracts/Streak.sol": { version: "0.8.20" } // force Streak.sol → 0.8.20
    }
  },
  networks: {
    base: {
      url: process.env.BASE_RPC_URL,                // Base RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`]    // deployer key
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY           // optional verification
  }
};
