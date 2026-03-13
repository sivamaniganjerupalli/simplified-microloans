const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ethers } = require("ethers");

const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const Lender = require("../models/Lender");
const { encryptKYC } = require("../utils/kycEncryption");
const { sendLenderApiKeyEmail } = require("../utils/emailService");

const provider = new ethers.JsonRpcProvider(
  process.env.GANACHE_RPC_URL || "http://127.0.0.1:8545"
);
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const isHashedPassword = (value = "") => value.startsWith("$2a$") || value.startsWith("$2b$");

const comparePassword = async (plain, stored) => {
  if (!stored) return false;
  if (isHashedPassword(stored)) return bcrypt.compare(plain, stored);
  return plain === stored;
};

const hashPassword = async (plain) => bcrypt.hash(plain, 10);

const getLenderLoginApiKey = () => process.env.LENDER_API_KEY || process.env.API_KEY || "";

const queueLenderApiKeyEmail = (email, fullName, lenderApiKey, label = 'registration') => {
  if (!lenderApiKey) {
    console.warn('Lender API key email skipped: LENDER_API_KEY/API_KEY is not configured.');
    return;
  }

  setImmediate(async () => {
    const emailResult = await sendLenderApiKeyEmail(email, fullName, lenderApiKey);
    if (!emailResult.success) {
      console.warn(`Lender API key email failed (${label}):`, emailResult.error);
    }
  });
};

const registerLender = async (req, res) => {
  try {
    const {
      fullname,
      surname,
      email,
      aadhaarNumber,
      phone,
      walletAddress,
      profileImage,
      password,
      role,
      language,
      theme,
      notifyByEmail,
      notifyBySMS,
    } = req.body;

    // Trim whitespace from string fields
    const trimmedFullname = fullname?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();
    const trimmedAadhaar = aadhaarNumber?.trim();

    if (!trimmedFullname || !trimmedEmail || !trimmedAadhaar || !walletAddress || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing or empty.",
        missing: {
          fullname: !trimmedFullname,
          email: !trimmedEmail,
          aadhaarNumber: !trimmedAadhaar,
          walletAddress: !walletAddress,
          password: !password,
        },
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate phone format if provided
    if (trimmedPhone && !/^[6-9]\d{9}$/.test(trimmedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must be a valid Indian mobile number (10 digits, starting with 6-9).",
      });
    }

    const existingLender = await Lender.findOne({
      $or: [
        { email: trimmedEmail },
        { aadhaarNumber: trimmedAadhaar },
        ...(trimmedPhone ? [{ phone: trimmedPhone }] : []),
      ],
    });

    if (existingLender) {
      if (process.env.NODE_ENV === "development" || process.env.ALLOW_TEST_REREGISTER === "true") {
        const encryptedKYC = encryptKYC(trimmedAadhaar);
        const hashedPassword = await hashPassword(password);

        existingLender.fullname = trimmedFullname;
        existingLender.surname = surname?.trim() || "";
        existingLender.email = trimmedEmail;
        existingLender.aadhaarNumber = trimmedAadhaar;
        existingLender.phone = trimmedPhone || null;
        existingLender.walletAddress = walletAddress;
        existingLender.encryptedKYC = encryptedKYC;
        existingLender.profileImage = profileImage || existingLender.profileImage;
        existingLender.password = hashedPassword;
        existingLender.role = role || "lender";
        existingLender.language = language || existingLender.language;
        existingLender.theme = theme || existingLender.theme;
        if (typeof notifyByEmail === "boolean") existingLender.notifyByEmail = notifyByEmail;
        if (typeof notifyBySMS === "boolean") existingLender.notifyBySMS = notifyBySMS;

        await existingLender.save();

        const lenderApiKey = getLenderLoginApiKey();
        queueLenderApiKeyEmail(
          existingLender.email,
          existingLender.fullname,
          lenderApiKey,
          'test mode'
        );

        return res.status(200).json({
          success: true,
          message: "Account updated successfully (test mode)",
          data: {
            _id: existingLender._id,
            fullname: existingLender.fullname,
            email: existingLender.email,
            role: existingLender.role,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: "Email or Aadhaar already registered.",
        duplicateField: existingLender.email === trimmedEmail ? "email"
          : existingLender.phone === trimmedPhone ? "phone"
          : "aadhaarNumber",
      });
    }

    const encryptedKYC = encryptKYC(trimmedAadhaar);
    const hashedPassword = await hashPassword(password);

    const lender = await Lender.create({
      fullname: trimmedFullname,
      surname: surname?.trim() || "",
      email: trimmedEmail,
      aadhaarNumber: trimmedAadhaar,
      phone: trimmedPhone || null,
      walletAddress,
      encryptedKYC,
      profileImage,
      password: hashedPassword,
      role: role || "lender",
      language,
      theme,
      notifyByEmail,
      notifyBySMS,
    });

    const lenderApiKey = getLenderLoginApiKey();
    queueLenderApiKeyEmail(lender.email, lender.fullname, lenderApiKey);

    return res.status(201).json({
      success: true,
      message: "Lender registered successfully",
      data: {
        _id: lender._id,
        fullname: lender.fullname,
        email: lender.email,
        role: lender.role,
      },
    });
  } catch (error) {
    console.error("registerLender error:", error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.keys(error.errors).map(
        (field) => `${field}: ${error.errors[field].message}`
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} is already registered.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const loginLender = async (req, res) => {
  try {
    const { email, password, role, apiKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (role && role !== "lender") {
      return res.status(403).json({ success: false, message: "Role mismatch. Please choose Lender." });
    }

    const lenderApiKey = getLenderLoginApiKey();
    const incomingApiKey = typeof apiKey === "string" ? apiKey.trim() : "";
    if (lenderApiKey && incomingApiKey !== lenderApiKey.trim()) {
      return res.status(403).json({
        success: false,
        message: "Invalid API Key",
      });
    }

    const lender = await Lender.findOne({ email });

    if (!lender) {
      return res.status(404).json({
        success: false,
        message: "Lender not found. Please register.",
      });
    }

    const isPasswordValid = await comparePassword(password, lender.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Update lastLogin timestamp (use updateOne to bypass schema validation)
    await Lender.updateOne(
      { _id: lender._id },
      { $set: { lastLogin: new Date() } }
    );

    const token = jwt.sign({ id: lender._id, role: lender.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userId: lender._id,
      role: lender.role,
    });
  } catch (error) {
    console.error("loginLender error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

const getLenderDashboard = async (req, res) => {
  const { lenderId } = req.params;

  try {
    if (!lenderId) {
      return res.status(400).json({ success: false, message: "Lender ID is required." });
    }

    const lender = await Lender.findById(lenderId);

    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found." });
    }

    let walletBalanceEth = "0.0000";

    try {
      const balance = await provider.getBalance(lender.walletAddress);
      walletBalanceEth = ethers.formatEther(balance);
    } catch (err) {
      console.warn("Wallet balance fetch failed:", err.message);
    }

    const fundedLoans = await Loan.find({ lenderId, status: "Approved" }).lean();

    const loansFunded = fundedLoans.length;
    const totalFundedAmount = fundedLoans.reduce(
      (sum, loan) => sum + (parseFloat(loan.loanAmount) || 0),
      0
    );

    const activeVendorsSet = new Set(
      fundedLoans.map((loan) => loan.vendorId?.toString()).filter(Boolean)
    );

    const lastFundedLoan = [...fundedLoans].sort(
      (a, b) => new Date(b.approvedAt || b.updatedAt) - new Date(a.approvedAt || a.updatedAt)
    )[0];

    const txns = await Transaction.find({ lenderId }).sort({ createdAt: -1 }).lean();

    const totalReceived = txns
      .filter((tx) => tx.type === "Repayment")
      .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

    const transactions = txns.map((tx) => ({
      _id: tx._id,
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-IN") : "N/A",
      createdAt: tx.createdAt,
      amount: parseFloat(tx.amount) || 0,
      type: tx.type || "Unknown",
      purpose: tx.purpose || "",
      hash: tx.hash || "",
    }));

    return res.status(200).json({
      success: true,
      lenderName: lender.fullname || "Lender",
      walletBalance: `${parseFloat(walletBalanceEth).toFixed(4)} ETH`,
      loansFunded,
      totalFundedAmount: Number(totalFundedAmount.toFixed(4)),
      activeVendors: activeVendorsSet.size,
      lastFundedLoan: lastFundedLoan
        ? {
            amount: parseFloat(lastFundedLoan.loanAmount) || 0,
            date: lastFundedLoan.approvedAt
              ? new Date(lastFundedLoan.approvedAt).toLocaleDateString("en-IN")
              : "N/A",
          }
        : { amount: 0, date: "N/A" },
      nextExpectedRepayment: "N/A",
      totalReceived: Number(totalReceived.toFixed(4)),
      transactions,
    });
  } catch (err) {
    console.error("getLenderDashboard error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lender dashboard",
      error: err.message,
    });
  }
};

const uploadPhoto = async (req, res) => {
  const { lenderId } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const lender = await Lender.findByIdAndUpdate(
      lenderId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo updated",
      imageUrl,
    });
  } catch (err) {
    console.error("uploadPhoto error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
};

const updateLenderSettings = async (req, res) => {
  const { lenderId } = req.params;
  const { password, oldPassword, phone, language, theme, notifyByEmail, notifyBySMS } = req.body;

  try {
    const lender = await Lender.findById(lenderId);

    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    // If updating password, validate old password first
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is required to set a new password",
        });
      }

      const isOldPasswordValid = await comparePassword(oldPassword, lender.password);
      if (!isOldPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      // Password must be at least 8 characters
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters long",
        });
      }

      lender.password = await hashPassword(password);
    }

    if (phone !== undefined) lender.phone = phone;
    if (language !== undefined) lender.language = language;
    if (theme !== undefined) lender.theme = theme;
    if (notifyByEmail !== undefined) lender.notifyByEmail = notifyByEmail;
    if (notifyBySMS !== undefined) lender.notifyBySMS = notifyBySMS;

    await lender.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: lender,
    });
  } catch (error) {
    console.error("updateLenderSettings error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

const getLenderTransactions = async (req, res) => {
  try {
    const { lenderId } = req.params;

    if (!lenderId) {
      return res.status(400).json({ success: false, message: "Lender ID is required" });
    }

    const transactions = await Transaction.find({ lenderId })
      .sort({ createdAt: -1 })
      .populate("borrowerId", "fullname email")
      .populate("lenderId", "fullname email");

    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    console.error("getLenderTransactions error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message,
    });
  }
};

const recordTransaction = async (req, res) => {
  try {
    const { lenderId, borrowerId, amount, type, purpose, hash } = req.body;

    if (!lenderId || !borrowerId || !amount || !type || !hash) {
      return res.status(400).json({ success: false, message: "Missing required transaction fields" });
    }

    const transaction = await Transaction.create({
      lenderId,
      borrowerId,
      amount,
      type,
      purpose,
      hash,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      transaction,
    });
  } catch (err) {
    console.error("recordTransaction error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to record transaction",
      error: err.message,
    });
  }
};

const getLenderLoans = async (req, res) => {
  try {
    const lenderId = req.params.lenderId;

    const loans = await Loan.find({
      $or: [{ lenderId }, { status: "Pending" }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, loans });
  } catch (error) {
    console.error("getLenderLoans error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to load loans" });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .sort({ createdAt: -1 })
      .populate("lenderId vendorId", "fullname email");

    return res.status(200).json({ success: true, loans });
  } catch (error) {
    console.error("getAllLoans error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch all loans" });
  }
};

const approveLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const lenderId = req.user?.id;
    const { txHash } = req.body;

    if (!lenderId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Lender ID missing" });
    }

    if (!txHash) {
      return res.status(400).json({ success: false, message: "Transaction hash required" });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (loan.status === "Approved") {
      return res.status(400).json({ success: false, message: "Loan already approved" });
    }

    loan.status = "Approved";
    loan.approvedAt = new Date();
    loan.lenderId = lenderId;
    loan.transactionHash = txHash;
    await loan.save();

    await Transaction.create({
      lenderId,
      borrowerId: loan.vendorId,
      amount: parseFloat(loan.loanAmount) || 0,
      type: "Loan Disbursement",
      purpose: loan.reason,
      hash: txHash,
    });

    return res.status(200).json({
      success: true,
      message: "Loan approved and transaction recorded",
    });
  } catch (err) {
    console.error("approveLoan error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to approve loan",
      error: err.message,
    });
  }
};

const rejectLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (loan.status === "Rejected" || loan.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: `Loan is already ${loan.status.toLowerCase()}`,
      });
    }

    loan.status = "Rejected";
    await loan.save();

    return res.status(200).json({ success: true, message: "Loan rejected successfully" });
  } catch (err) {
    console.error("rejectLoan error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to reject loan",
      error: err.message,
    });
  }
};

const getLenderById = async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId).select("-password -encryptedKYC");

    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    return res.status(200).json({ success: true, data: lender });
  } catch (error) {
    console.error("getLenderById error:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  registerLender,
  loginLender,
  getLenderDashboard,
  uploadPhoto,
  updateLenderSettings,
  getLenderTransactions,
  recordTransaction,
  getLenderLoans,
  approveLoan,
  getAllLoans,
  rejectLoan,
  getLenderById,
};
