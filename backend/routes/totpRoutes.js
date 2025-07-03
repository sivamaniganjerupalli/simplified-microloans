const express = require("express");
const router = express.Router();
const { generateTOTPSecret, verifyTOTP } = require("../utils/totpService");

// Generate QR Code
router.post("/setup", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const { qrCodeURL } = await generateTOTPSecret(email);
    res.json({ success: true, qrCode: qrCodeURL });
  } catch (err) {
    res.status(500).json({ success: false, message: "QR generation failed" });
  }
});

// Verify TOTP
router.post("/verify", (req, res) => {
  const { email, token } = req.body;

  const valid = verifyTOTP(email, token);
  if (!valid) {
    return res.status(400).json({ success: false, message: "Invalid code" });
  }

  res.json({ success: true, message: "TOTP verified" });
});

module.exports = router;
