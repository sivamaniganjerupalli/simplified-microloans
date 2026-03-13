const { sendEmail } = require('./emailService');

const otpStore = new Map(); // In-memory store
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const EMAIL_TIMEOUT_MS = 15000;
const OTP_EMAIL_RETRIES = Number(process.env.OTP_EMAIL_RETRIES || 2);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const withTimeout = (promise, timeoutMs, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);

const isRetryableEmailError = (error) => {
  const msg = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toUpperCase();
  return (
    msg.includes('timeout') ||
    msg.includes('connection') ||
    code === 'ETIMEDOUT' ||
    code === 'ESOCKET' ||
    code === 'ECONNECTION'
  );
};

const sendOtpEmailWithRetry = async (normalizedEmail, otp) => {
  let lastError;
  const attempts = Math.max(1, OTP_EMAIL_RETRIES + 1);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await withTimeout(
        sendEmail({
          from: process.env.EMAIL_FROM || process.env.OTP_EMAIL || process.env.EMAIL_USER,
          to: normalizedEmail,
          subject: 'Your OTP Code',
          text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
          html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
        }),
        EMAIL_TIMEOUT_MS,
        'Connection timeout'
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !isRetryableEmailError(error)) {
        throw lastError;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }

  throw lastError || new Error('Failed to send OTP email');
};

exports.sendOTP = async (email, options = {}) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error('Email is required');
  }

  const otp = generateOTP();
  const skipEmail = Boolean(options.skipEmail);
  if (!skipEmail) {
    await sendOtpEmailWithRetry(normalizedEmail, otp);
  }

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
