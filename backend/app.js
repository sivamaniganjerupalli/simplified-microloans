const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route Imports
const lenderDashboardRoutes = require('./routes/lenderDashboardRoutes');

// Route Middlewares
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/loan', require('./routes/loanRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/totp', require('./routes/totpRoutes'));
app.use('/api/lender', lenderDashboardRoutes); // ✅ Register this
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
