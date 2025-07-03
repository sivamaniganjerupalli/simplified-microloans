// simplified-microloans/scripts/deploy.js

const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Compiling and Deploying LoanContract...");

  // Get the contract factory
  const LoanContractFactory = await hre.ethers.getContractFactory("LoanContract");

  // Deploy the contract
  const contract = await LoanContractFactory.deploy();

  // Wait for the contract to be mined
  await contract.waitForDeployment(); // ✅ Works with recent versions of Hardhat

  // Get the contract address
  const contractAddress = await contract.getAddress(); // ✅ New API for ethers v6+

  console.log(`✅ Contract deployed to address: ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  });
