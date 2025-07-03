// backend/models/Vendor.js

const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  surname: { type: String },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v); // Indian mobile number format
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },

  password: {
    type: String,
    default: null, // If using OTP-only login
  },

  role: {
    type: String,
    enum: ['vendor', 'lender'],
    default: 'vendor',
  },

  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
  },

  encryptedKYC: { type: String, required: true },
  walletAddress: { type: String, required: true },

  // ✅ User Settings
  profileImage: { type: String, default: "" },
  enable2FA: { type: Boolean, default: false },
  notifyByEmail: { type: Boolean, default: true },
  notifyBySMS: { type: Boolean, default: false },
  language: { type: String, default: "en" }, // en, te, hi etc.
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Vendor', vendorSchema);
