const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const totpSecrets = new Map(); // email => secret

exports.generateTOTPSecret = async (email) => {
  const secret = speakeasy.generateSecret({ name: `Dhan Setu (${email})` });
  totpSecrets.set(email, secret.base32);
  const qrCodeURL = await qrcode.toDataURL(secret.otpauth_url);
  return { qrCodeURL, secret: secret.base32 };
};

exports.verifyTOTP = (email, token) => {
  const secret = totpSecrets.get(email);
  if (!secret) return false;

  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
};
