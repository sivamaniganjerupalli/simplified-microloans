// simplified-microloans/backend/utils/oracleHelper.js

const axios = require('axios');
const contract = require('./blockchain');

// Simulated function to fetch daily sales and update the contract
const updateSalesDataToBlockchain = async (vendorAddress, simulatedSalesAmount) => {
  try {
    const tx = await contract.recordSales(vendorAddress, simulatedSalesAmount);
    await tx.wait(); // Wait for transaction confirmation
    console.log(`Sales updated: ${vendorAddress} - ₹${simulatedSalesAmount}`);
  } catch (err) {
    console.error('Oracle update error:', err);
  }
};

module.exports = {
  updateSalesDataToBlockchain,
};
