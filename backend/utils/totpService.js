const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const TwoFactorAuth = require("../models/TwoFactorAuth");
const Vendor = require("../models/Vendor");
const Lender = require("../models/Lender");

const findUserByEmail = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  const vendor = await Vendor.findOne({ email: normalizedEmail }).select("_id").lean();
  if (vendor) return { userId: vendor._id, userModel: "Vendor", email: normalizedEmail };

  const lender = await Lender.findOne({ email: normalizedEmail }).select("_id").lean();
  if (lender) return { userId: lender._id, userModel: "Lender", email: normalizedEmail };

  return null;
};

exports.generateTOTPSecret = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found for the provided email.");
  }

  const secret = speakeasy.generateSecret({ name: `Dhan Setu (${email})` });

  await TwoFactorAuth.findOneAndUpdate(
    { userId: user.userId, userModel: user.userModel },
    {
      secret: secret.base32,
      verified: false,
      enabled: false,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  const qrCodeURL = await qrcode.toDataURL(secret.otpauth_url);
  return { qrCodeURL, secret: secret.base32 };
};

exports.verifyTOTP = async (email, token) => {
  const user = await findUserByEmail(email);
  if (!user) return false;

  const twoFactor = await TwoFactorAuth.findOne({
    userId: user.userId,
    userModel: user.userModel,
  });

  const secret = twoFactor?.secret;
  if (!secret) return false;

  const normalizedToken = String(token || "").replace(/\s+/g, "").trim();
  if (!/^\d{6}$/.test(normalizedToken)) return false;

  const valid = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: normalizedToken,
    window: 1,
  });

  if (valid) {
    twoFactor.verified = true;
    twoFactor.enabled = true;
    await twoFactor.save();
  }

  return valid;
};
