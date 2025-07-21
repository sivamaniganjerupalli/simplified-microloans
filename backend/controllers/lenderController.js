const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const Lender = require("../models/Lender");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { ethers } = require("ethers");
const { encryptKYC } = require("../utils/kycEncryption");

const provider = new ethers.JsonRpcProvider(process.env.GANACHE_RPC_URL); // or any valid endpoin

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Setup multer for image upload (storing files in 'uploads' directory)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the upload folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image"); // "image" is the key used to upload the file

// POST /api/lender/register
// POST /api/lender/register

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
      password, // plain text as requested
      language,
      theme,
      notifyByEmail,
      notifyBySMS,
    } = req.body;
    
      

    // Validation
    if (!fullname || !email || !password || !aadhaarNumber || !walletAddress) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Check if user already exists
    const existingUser = await Lender.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Lender already registered with this email." });
    }

    // Encrypt Aadhaar Number for KYC
    const encryptedKYC = encryptKYC(aadhaarNumber);

    // Save new Lender
    const newLender = new Lender({
      fullname,
      surname,
      email,
      aadhaarNumber, // store original Aadhaar too
      phone,
      walletAddress,
      encryptedKYC,
      profileImage,
      password, // plain text, as requested
      language,
      theme,
      notifyByEmail,
      notifyBySMS,
    });

    await newLender.save();

    // Generate token
    const token = jwt.sign({ userId: newLender._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Lender registered successfully.",
      token,
      lender: {
        id: newLender._id,
        fullname: newLender.fullname,
        email: newLender.email,
        walletAddress: newLender.walletAddress,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during lender registration." });
  }
};
// POST /api/lender/login
const loginLender = async (req, res) => {
  try {
    const { email, password } = req.body;

    const lender = await Lender.findOne({ email });
    if (!lender) {
      return res.status(404).json({
        success: false,
        message: "Lender not found. Please register.",
      });
    }

    // Compare the entered password with the stored raw password
    if (lender.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Create a token for the lender
    const token = jwt.sign(
      { id: lender._id, role: lender.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userId: lender._id,
      role: lender.role,
    });
  } catch (error) {
    console.error("Error in loginLender:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// GET /api/lender/dashboard/:lenderId
// GET /api/lender/dashboard/:lenderId
// @route   GET /api/lender/dashboard/:lenderId
const getLenderDashboard = async (req, res) => {
  const { lenderId } = req.params;

  try {
    if (!lenderId) {
      return res.status(400).json({ message: "Lender ID is required." });
    }

    const lender = await Lender.findById(lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found." });
    }

    // ✅ Get Wallet Balance using ethers
    let walletBalance = "0.0000";
    try {
      const balance = await provider.getBalance(lender.walletAddress);
      walletBalance = ethers.formatEther(balance); // Convert from wei to ETH
    } catch (err) {
      console.warn("Wallet balance fetch failed:", err.message);
    }

    // 🟡 Calculate total loans funded
    const fundedLoans = await Loan.find({ lenderId, status: "Approved" });

    const loansFunded = fundedLoans.reduce((sum, loan) => {
      const amt = parseFloat(loan.loanAmount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const activeVendorsSet = new Set(fundedLoans.map(loan => loan.vendorId?.toString()));

    // 🟢 Last funded loan
    const lastFundedLoan = await Loan.findOne({ lenderId, status: "Approved" })
      .sort({ approvedAt: -1 })
      .lean();

    const lastLoanAmount = parseFloat(lastFundedLoan?.loanAmount) || 0;
    const lastLoanDate = lastFundedLoan?.approvedAt
      ? new Date(lastFundedLoan.approvedAt).toLocaleDateString("en-IN")
      : "N/A";

    // 🔵 Transactions and total received
    const txns = await Transaction.find({ lenderId }).sort({ createdAt: -1 });

    const totalReceived = txns
      .filter(tx => tx.type === "Repayment")
      .reduce((sum, tx) => {
        const amt = parseFloat(tx.amount);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0);

    const transactions = txns.map(tx => ({
      date: tx.createdAt
        ? new Date(tx.createdAt).toLocaleDateString("en-IN")
        : "N/A",
      amount: parseFloat(tx.amount) || 0,
      type: tx.type || "Unknown",
    }));

    // ✅ Final response
    res.status(200).json({
      walletBalance: parseFloat(walletBalance).toFixed(4), // 👈 shows like 0.0000
      walletAddress: lender.walletAddress || "N/A", // 👈 Add this line
      loansFunded: loansFunded.toFixed(4),
      activeVendors: activeVendorsSet.size,
      lastFundedLoan: {
        amount: lastLoanAmount,
        date: lastLoanDate,
      },
      nextExpectedRepayment: "N/A", // Optional: due-date logic
      totalReceived: totalReceived.toFixed(4),
      transactions,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch lender dashboard" });
  }
};


// POST /api/lender/upload-photo/:lenderId
const uploadPhoto = async (req, res) => {
  const { lenderId } = req.params;

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    // Construct the URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update the lender's profile image URL in the database
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
    console.error("Upload Error:", err.message);
    return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
  }
};

const updateLenderSettings = async (req, res) => {
  const { lenderId } = req.params;
  const {
    password,
    phone,
    language,
    theme,
    notifyByEmail,
    notifyBySMS,
  } = req.body;

  try {
    const lender = await Lender.findById(lenderId);

    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }

    if (password) lender.password = password; // In production, hash this
    if (phone) lender.phone = phone;
    if (language) lender.language = language;
    if (theme) lender.theme = theme;
    if (typeof notifyByEmail !== "undefined") lender.notifyByEmail = notifyByEmail;
    if (typeof notifyBySMS !== "undefined") lender.notifyBySMS = notifyBySMS;

    await lender.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: lender, // ✅ Send updated lender
    });
  } catch (error) {
    console.error("Error updating settings:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};


// GET /api/lender/transactions/:lenderId
const getLenderTransactions = async (req, res) => {
  try {
    const { lenderId } = req.params;

    if (!lenderId) {
      return res.status(400).json({
        success: false,
        message: "Lender ID is required",
      });
    }

    const transactions = await Transaction.find({ lenderId })
      .sort({ createdAt: -1 })
      .populate("borrowerId", "fullname email")
      .populate("lenderId", "fullname email");

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error("Error fetching lender transactions:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message,
    });
  }
};
// Record a transaction (if calling manually after Metamask transfer)
const recordTransaction = async (req, res) => {
  try {
    const { lenderId, borrowerId, amount, type, purpose } = req.body;

    const transaction = new Transaction({
      lenderId,
      borrowerId,
      amount,
      type,
      purpose,
    });

    await transaction.save();

    res.status(201).json({ success: true, message: "Transaction recorded successfully", transaction });
  } catch (err) {
    console.error("Error creating transaction:", err.message);
    res.status(500).json({ success: false, message: "Failed to record transaction" });
  }
};

// GET /api/lender/loans/:lenderId
const getLenderLoans = async (req, res) => {
  try {
    const lenderId = req.params.lenderId;

    // Find loans for the lender or with "Pending" status
    const loans = await Loan.find({
      $or: [
        { lenderId: lenderId },
        { status: "Pending" } // Optional: show unassigned pending loans
      ]
    });

    res.status(200).json({
      success: true,
      loans,
    });
  } catch (error) {
    console.error("Error fetching loans:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to load loans",
    });
  }
};

// GET /api/lender/all-loans
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 }).populate("lenderId vendorId", "fullname email");

    res.status(200).json({
      success: true,
      loans,
    });
  } catch (error) {
    console.error("Error fetching all loans:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all loans",
    });
  }
};

// POST /api/lender/approve-loan/:loanId
const approveLoan = async (req, res) => {
  try {
    console.log("🔁 Approving loan...");
    console.log("req.user:", req.user);

    const loanId = req.params.loanId;
    const lenderId = req.user?.id;

    if (!lenderId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Lender ID missing" });
    }

    const { txHash } = req.body;
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

    // Update loan
    loan.status = "Approved";
    loan.approvedAt = new Date();
    loan.lenderId = lenderId;
    loan.transactionHash = txHash;
    loan.amount = parseFloat(loan.loanAmount); // Optional if already set

    await loan.save();
    console.log("✅ Loan approved & updated.");

    // DEBUG: Log transaction data before saving
    console.log("📦 Creating transaction:", {
      lenderId,
      borrowerId: loan.vendorId,
      amount: loan.amount,
      type: "Loan Disbursement",
      purpose: loan.reason,
      hash: txHash,
    });

    // Save transaction
    const transaction = new Transaction({
      lenderId,
      borrowerId: loan.vendorId,
      amount: loan.amount,
      type: "Loan Disbursement",
      purpose: loan.reason,
      hash: txHash,
    });

    try {
      await transaction.save();
      console.log("✅ Transaction saved to DB.");
    } catch (transactionErr) {
      console.error("❌ Failed to save transaction:", transactionErr.message);
      return res.status(500).json({
        success: false,
        message: "Loan approved, but failed to save transaction.",
        error: transactionErr.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Loan approved and transaction recorded",
    });
  } catch (err) {
    console.error("❌ Approval error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to approve loan",
      error: err.message,
    });
  }
};


// POST /api/lender/reject-loan/:loanId
const rejectLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (loan.status === "Rejected" || loan.status === "Approved") {
      return res.status(400).json({ success: false, message: `Loan is already ${loan.status.toLowerCase()}` });
    }

    await Loan.updateOne(
        { _id: loanId },
        { $set: { status: "Rejected" } }
    );

    res.status(200).json({ success: true, message: "Loan rejected successfully" });
  } catch (err) {
    console.error("Error rejecting loan:", err.message);
    res.status(500).json({ success: false, message: "Failed to reject loan", error: err.message });
  }
};
// GET /api/lender/profile/:lenderId
const getLenderById = async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found" });
    }
    res.status(200).json({ success: true, data: lender });
  } catch (error) {
    console.error("Error fetching lender:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
