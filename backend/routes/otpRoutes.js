const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../utils/otpService');
const Vendor = require('../models/Vendor');
const Lender = require('../models/Lender'); // <-- Import Lender model
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const OTP_BYPASS_ON_EMAIL_FAILURE = process.env.OTP_BYPASS_ON_EMAIL_FAILURE === 'true';
const OTP_RETURN_CODE_IN_RESPONSE = process.env.OTP_RETURN_CODE_IN_RESPONSE === 'true';

// Send OTP
router.post('/send', async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  try {
    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    await sendOTP(normalizedEmail);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    const message = err.message || 'Failed to send OTP';
    const lower = String(message).toLowerCase();

    if (OTP_BYPASS_ON_EMAIL_FAILURE) {
      try {
        const fallbackOtp = await sendOTP(normalizedEmail, { skipEmail: true });
        const response = {
          success: true,
          bypassedEmail: true,
          message: 'OTP generated in fallback mode because email delivery failed.',
        };
        if (OTP_RETURN_CODE_IN_RESPONSE) {
          response.otp = fallbackOtp;
        }
        return res.status(200).json(response);
      } catch (fallbackError) {
        console.error('OTP fallback failed:', fallbackError.message);
      }
    }

    const status =
      lower.includes('missing smtp credentials') ||
      lower.includes('timed out') ||
      lower.includes('timeout') ||
      lower.includes('connection')
        ? 503
        : 500;

    console.error('OTP send error:', message);
    res.status(status).json({ success: false, message, error: message });
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
