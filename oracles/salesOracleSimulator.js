// simplified-microloans/oracles/salesOracleSimulator.js

const cron = require('node-cron');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Vendor = require('../backend/models/Vendor');
const { updateSalesDataToBlockchain } = require('../backend/utils/oracleHelper');

// Load .env
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Oracle connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to simulate and push sales data
const simulateAndPushSales = async () => {
  try {
    const vendors = await Vendor.find();

    for (const vendor of vendors) {
      // Simulate sales between ₹100 to ₹1000
      const simulatedSales = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

      console.log(`Updating sales for ${vendor.walletAddress}: ₹${simulatedSales}`);

      // Push to blockchain
      await updateSalesDataToBlockchain(vendor.walletAddress, simulatedSales);
    }

  } catch (err) {
    console.error('Error in sales simulation:', err.message);
  }
};

// Schedule job to run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔁 Running daily Oracle job...');
  await simulateAndPushSales();
});

// Run immediately on startup (for testing)
simulateAndPushSales();
