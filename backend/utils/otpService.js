const nodemailer = require('nodemailer');
const crypto = require('crypto');

const otpStore = new Map(); // In-memory store

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_PASS, // Use App Password
  },
});

exports.sendOTP = async (email) => {
  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

  await transporter.sendMail({
    from: process.env.OTP_EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`, // ✅ Corrected
  });

  return otp;
};

exports.verifyOTP = (email, inputOtp) => {
  const data = otpStore.get(email);
  if (!data) return false;
  if (Date.now() > data.expires) return false;

  return data.otp === inputOtp;
};
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Error:", err.message);
  } else {
    console.log("✅ SMTP is ready to send emails.");
  }
});
