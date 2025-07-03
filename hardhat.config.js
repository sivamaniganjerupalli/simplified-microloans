// simplified-microloans/hardhat.config.js

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",

  networks: {
    localhost: {
      url: process.env.GANACHE_RPC_URL || "http://127.0.0.1:7545", // Ganache default
      accounts: [process.env.PRIVATE_KEY],
    },
  },

  paths: {
    artifacts: "./artifacts",       // Compiled contracts
    sources: "./contracts",         // Source .sol files
    tests: "./test",                // Test files
    cache: "./cache",               // Compiler cache
  },
};
