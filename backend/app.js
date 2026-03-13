const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path'); // ✅ REQUIRED for path.join()

const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middlewares
const normalizeOrigin = (value) =>
  String(value || '')
    .trim()
    .replace(/\/+$/, '');

const parseOriginList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

const allowedOrigins = new Set([
  ...parseOriginList(process.env.FRONTEND_URL),
  ...parseOriginList(process.env.FRONTEND_URLS),
  normalizeOrigin('http://localhost:3000'),
  normalizeOrigin('http://localhost:3001'),
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.has(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Route Imports
const lenderDashboardRoutes = require('./routes/lenderDashboardRoutes');
const authRoutes = require('./routes/authRoutes');

// Route Middlewares
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/loan', require('./routes/loanRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/totp', require('./routes/totpRoutes'));
app.use('/api/lender', lenderDashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reminders', require('./routes/reminderRoutes'));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
