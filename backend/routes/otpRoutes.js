const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../utils/otpService');
const Vendor = require('../models/Vendor');
const Lender = require('../models/lender'); // <-- Import Lender model
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Send OTP
router.post('/send', async (req, res) => {
  const { email } = req.body;
  try {
    await sendOTP(email);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;
  const isValid = verifyOTP(email, otp);

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  try {
    // Try finding the user in both Vendor and Lender collections
    let user = await Vendor.findOne({ email });

    if (!user) {
      user = await Lender.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      success: true,
      message: 'OTP verified successfully',
      role: user.role,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
