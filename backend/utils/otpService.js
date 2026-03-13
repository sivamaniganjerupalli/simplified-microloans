const { createTransporter } = require('./emailService');

const otpStore = new Map(); // In-memory store
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const EMAIL_TIMEOUT_MS = 15000;

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const withTimeout = (promise, timeoutMs, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);

exports.sendOTP = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error('Email is required');
  }

  const otp = generateOTP();
  const transporter = createTransporter();

  await withTimeout(
    transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.OTP_EMAIL || process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    }),
    EMAIL_TIMEOUT_MS,
    'OTP email request timed out. Please try again.'
  );

  otpStore.set(normalizedEmail, { otp, expires: Date.now() + OTP_EXPIRY_MS });

  return otp;
};

exports.verifyOTP = (email, inputOtp) => {
  const normalizedEmail = normalizeEmail(email);
  const data = otpStore.get(normalizedEmail);
  if (!data) return false;
  if (Date.now() > data.expires) {
    otpStore.delete(normalizedEmail);
    return false;
  }

  const isValid = data.otp === inputOtp;
  if (isValid) {
    otpStore.delete(normalizedEmail);
  }

  return isValid;
};
