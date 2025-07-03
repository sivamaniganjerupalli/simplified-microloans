const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const Vendor = require("../models/Vendor");
const Loan = require("../models/Loan");
const { encryptKYC } = require("../utils/kycEncryption");

// ✅ Ethers.js provider (Infura)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

/**
 * @route   POST /api/vendor/register
 */
exports.registerVendor = async (req, res) => {
  const { fullname, surname, email, phone, password, role, aadhaarNumber, walletAddress } = req.body;

  try {
    if (!fullname || !email || !aadhaarNumber || !walletAddress || !password) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const existingVendor = await Vendor.findOne({ $or: [{ email }, { aadhaarNumber }] });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "You have already registered. Please login." });
    }

    const encryptedKYC = encryptKYC(String(aadhaarNumber));

    const vendor = new Vendor({
      fullname,
      surname,
      email,
      phone,
      password,
      role: role || 'vendor',
      aadhaarNumber,
      encryptedKYC,
      walletAddress,
    });

    await vendor.save();

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendor,
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @route   POST /api/vendor/login
 */
exports.loginVendor = async (req, res) => {
  const { email, password, role, apiKey } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Email, password and role are required" });
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "You are not registered. Please register first." });
    }

    if (vendor.role !== role) {
      return res.status(403).json({ success: false, message: "Role mismatch. Please choose the correct role." });
    }

    if (role === "lender" && apiKey !== process.env.API_KEY) {
      return res.status(403).json({ success: false, message: "Invalid API key for lender login" });
    }

    if (vendor.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.JWT_SECRET || "dummy_secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: vendor.role,
      userId: vendor._id.toString(),
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @route   GET /api/vendor/:vendorId
 */
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId).select("-password -encryptedKYC");
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    return res.status(200).json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @route   GET /api/vendor/dashboard/:vendorId
 */
exports.getVendorDashboard = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    let walletBalance = "0.000";
    try {
      const balance = await provider.getBalance(vendor.walletAddress);
      walletBalance = ethers.formatEther(balance);
    } catch (err) {
      console.warn("Wallet balance fetch failed:", err.message);
    }

    const loans = await Loan.find({ vendorId }).sort({ createdAt: -1 });

    const loanRequests = loans.length;
    const activeLoans = loans.filter(l => l.status === 'Approved' && !l.repaid).length;

    const lastLoanApproved = loans.find(l => l.status === 'Approved');
    const totalRepaid = loans.filter(l => l.repaid).reduce((sum, l) => sum + (parseFloat(l.loanAmount) || 0), 0);

    const transactions = loans.map(loan => ({
      id: loan._id,
      date: loan.createdAt?.toISOString().split('T')[0] || "N/A",
      type: loan.repaid
        ? "Repayment"
        : loan.status === "Approved"
        ? "Loan Credit"
        : "Loan Request",
      amount: parseFloat(loan.loanAmount) || 0,
    }));

    res.status(200).json({
      walletBalance: parseFloat(walletBalance).toFixed(3),
      loanRequests,
      activeLoans,
      lastLoanApproved: lastLoanApproved
        ? {
            amount: parseFloat(lastLoanApproved.loanAmount),
            date: lastLoanApproved.createdAt?.toISOString().split('T')[0],
          }
        : { amount: 0, date: "N/A" },
      nextRepaymentDue: lastLoanApproved?.repaymentDue?.toISOString().split('T')[0] || "N/A",
      totalRepaid: totalRepaid.toFixed(3),
      transactions,
    });
  } catch (err) {
    console.error("Dashboard Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @route   POST /api/vendor/:vendorId/upload-photo
 */
exports.uploadProfilePhoto = async (req, res) => {
  const { vendorId } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo updated",
      imageUrl,
    });
  } catch (err) {
    console.error("Upload Error:", err.message);
    return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
  }
};

/**
 * @route   PUT /api/vendor/:vendorId/update
 */
exports.updateVendorSettings = async (req, res) => {
  const { vendorId } = req.params;
  const {
    phone, walletAddress, newPassword,
    enable2FA, notifyByEmail, notifyBySMS,
    language, theme,
  } = req.body;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    vendor.phone = phone ?? vendor.phone;
    vendor.walletAddress = walletAddress ?? vendor.walletAddress;
    vendor.enable2FA = enable2FA ?? vendor.enable2FA;
    vendor.notifyByEmail = notifyByEmail ?? vendor.notifyByEmail;
    vendor.notifyBySMS = notifyBySMS ?? vendor.notifyBySMS;
    vendor.language = language ?? vendor.language;
    vendor.theme = theme ?? vendor.theme;

    if (newPassword) vendor.password = newPassword;

    await vendor.save();

    res.status(200).json({ success: true, message: "Settings updated" });
  } catch (err) {
    console.error("Settings Update Error:", err.message);
    return res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

/**
 * @route   POST /api/vendor/repay
 */
exports.recordRepayment = async (req, res) => {
  const { vendorId, amount, transactionHash, date } = req.body;

  if (!vendorId || !amount || !transactionHash || !date) {
    return res.status(400).json({ success: false, message: "Missing required repayment fields" });
  }

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const loan = await Loan.findOne({
      vendorId,
      repaid: false,
      status: "Approved",
    }).sort({ createdAt: -1 });

    if (!loan) {
      return res.status(404).json({ success: false, message: "No active loan found to repay" });
    }

    loan.repaid = true;
    loan.status = "Repaid";
    loan.transactionHash = transactionHash;
    loan.repaymentDate = new Date(date);
    await loan.save();

    return res.status(200).json({ success: true, message: "Repayment recorded successfully." });
  } catch (err) {
    console.error("Repayment Record Error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to record repayment." });
  }
};
