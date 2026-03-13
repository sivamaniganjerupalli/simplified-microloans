const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ethers } = require("ethers");

const Vendor = require("../models/Vendor");
const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const { encryptKYC } = require("../utils/kycEncryption");

const provider = new ethers.JsonRpcProvider(
  process.env.GANACHE_RPC_URL || "http://127.0.0.1:8545"
);

const JWT_SECRET = process.env.JWT_SECRET || "dummy_secret";

const isHashedPassword = (value = "") => value.startsWith("$2a$") || value.startsWith("$2b$");

const comparePassword = async (plain, stored) => {
  if (!stored) return false;
  if (isHashedPassword(stored)) return bcrypt.compare(plain, stored);
  return plain === stored;
};

const hashPassword = async (plain) => bcrypt.hash(plain, 10);

exports.registerVendor = async (req, res) => {
  console.log("📥 Registration request received:", req.body);
  
  const {
    fullname,
    surname,
    email,
    phone,
    password,
    role,
    aadhaarNumber,
    walletAddress,
  } = req.body;

  try {
    // Trim whitespace from string fields
    const trimmedFullname = fullname?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();
    const trimmedAadhaar = aadhaarNumber?.trim();
    
    console.log("🔍 After trimming:", {
      fullname: trimmedFullname,
      email: trimmedEmail,
      phone: trimmedPhone,
      aadhaar: trimmedAadhaar,
      walletAddress,
      hasPassword: !!password,
    });

    // Validate required fields
    if (!trimmedFullname || !trimmedEmail || !trimmedAadhaar || !walletAddress || !password || !trimmedPhone) {
      const missingFields = {
        fullname: !trimmedFullname,
        email: !trimmedEmail,
        phone: !trimmedPhone,
        aadhaarNumber: !trimmedAadhaar,
        walletAddress: !walletAddress,
        password: !password,
      };
      console.log("❌ Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: "Required fields are missing or empty.",
        missing: missingFields,
      });
    }

    // Validate phone format (Indian mobile: 10 digits, starts with 6-9)
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      console.log("❌ Invalid phone format:", trimmedPhone);
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must be a valid Indian mobile number (10 digits, starting with 6-9).",
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      console.log("❌ Invalid email format:", trimmedEmail);
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    console.log("✅ All validations passed, checking for duplicates...");

    // Check for existing vendor
    const existingVendor = await Vendor.findOne({
      $or: [
        { email: trimmedEmail },
        { aadhaarNumber: trimmedAadhaar },
        { phone: trimmedPhone },
      ],
    });

    if (existingVendor) {
      console.log("❌ Duplicate found:", {
        email: existingVendor.email === trimmedEmail,
        phone: existingVendor.phone === trimmedPhone,
        aadhaar: existingVendor.aadhaarNumber === trimmedAadhaar,
      });
      
      // DEVELOPMENT MODE: Allow re-registration (update existing user)
      // Remove this in production!
      if (process.env.NODE_ENV === 'development' || process.env.ALLOW_TEST_REREGISTER === 'true') {
        console.log("⚠️ DEV MODE: Updating existing vendor instead of creating new one");
        
        const encryptedKYC = encryptKYC(trimmedAadhaar);
        const hashedPassword = await hashPassword(password);
        
        existingVendor.fullname = trimmedFullname;
        existingVendor.surname = surname?.trim() || "";
        existingVendor.email = trimmedEmail;
        existingVendor.phone = trimmedPhone;
        existingVendor.password = hashedPassword;
        existingVendor.aadhaarNumber = trimmedAadhaar;
        existingVendor.encryptedKYC = encryptedKYC;
        existingVendor.walletAddress = walletAddress;
        
        await existingVendor.save();
        
        console.log("✅ Vendor updated successfully:", existingVendor._id);
        
        return res.status(200).json({
          success: true,
          message: "Account updated successfully (test mode)",
          vendor: {
            _id: existingVendor._id,
            fullname: existingVendor.fullname,
            surname: existingVendor.surname,
            email: existingVendor.email,
            phone: existingVendor.phone,
            role: existingVendor.role,
            walletAddress: existingVendor.walletAddress,
            createdAt: existingVendor.createdAt,
          },
        });
      }
      
      return res.status(400).json({
        success: false,
        message: "You have already registered. Please login.",
        duplicateField: existingVendor.email === trimmedEmail ? 'email' 
                      : existingVendor.phone === trimmedPhone ? 'phone'
                      : 'aadhaarNumber',
      });
    }

    console.log("✅ No duplicates, creating vendor...");

    const encryptedKYC = encryptKYC(trimmedAadhaar);
    const hashedPassword = await hashPassword(password);

    const vendor = await Vendor.create({
      fullname: trimmedFullname,
      surname: surname?.trim() || "",
      email: trimmedEmail,
      phone: trimmedPhone,
      password: hashedPassword,
      role: role || "vendor",
      aadhaarNumber: trimmedAadhaar,
      encryptedKYC,
      walletAddress,
    });

    console.log("✅ Vendor created successfully:", vendor._id);

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendor: {
        _id: vendor._id,
        fullname: vendor.fullname,
        surname: vendor.surname,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        walletAddress: vendor.walletAddress,
        createdAt: vendor.createdAt,
      },
    });
  } catch (err) {
    console.error("Vendor registration error:", err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.keys(err.errors).map(
        (field) => `${field}: ${err.errors[field].message}`
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field} is already registered.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.loginVendor = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    if (role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Role mismatch. Please choose Vendor.",
      });
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "You are not registered. Please register first.",
      });
    }

    const isPasswordValid = await comparePassword(password, vendor.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: vendor._id, role: vendor.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: vendor.role,
      userId: vendor._id.toString(),
    });
  } catch (err) {
    console.error("Vendor login error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId).select("-password -encryptedKYC");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    return res.status(200).json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

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

    const loans = await Loan.find({ vendorId }).sort({ createdAt: -1 }).lean();

    const loanRequests = loans.length;
    const activeLoans = loans.filter((loan) => loan.status === "Approved" && !loan.repaid).length;
    const lastLoanApproved = loans.find((loan) => loan.status === "Approved");

    const totalRepaid = loans
      .filter((loan) => loan.repaid)
      .reduce((sum, loan) => sum + (parseFloat(loan.loanAmount) || 0), 0);

    const transactions = loans.map((loan) => ({
      _id: loan._id,
      date: loan.createdAt ? new Date(loan.createdAt).toISOString().split("T")[0] : "N/A",
      type: loan.repaid
        ? "Repayment"
        : loan.status === "Approved"
        ? "Loan Credit"
        : "Loan Request",
      amount: parseFloat(loan.loanAmount) || 0,
      txHash: loan.transactionHash || "",
    }));

    return res.status(200).json({
      success: true,
      vendorName: vendor.fullname || "Vendor",
      walletBalance: parseFloat(walletBalance).toFixed(3),
      loanRequests,
      activeLoans,
      lastLoanApproved: lastLoanApproved
        ? {
            amount: parseFloat(lastLoanApproved.loanAmount) || 0,
            date: lastLoanApproved.createdAt
              ? new Date(lastLoanApproved.createdAt).toISOString().split("T")[0]
              : "N/A",
          }
        : { amount: 0, date: "N/A" },
      nextRepaymentDue: lastLoanApproved?.repaymentDue
        ? new Date(lastLoanApproved.repaymentDue).toISOString().split("T")[0]
        : "N/A",
      totalRepaid: totalRepaid.toFixed(3),
      transactions,
    });
  } catch (err) {
    console.error("Vendor dashboard error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  const { vendorId } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

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
    console.error("Vendor photo upload error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
};

exports.updateVendorSettings = async (req, res) => {
  const { vendorId } = req.params;
  const {
    phone,
    walletAddress,
    newPassword,
    enable2FA,
    notifyByEmail,
    notifyBySMS,
    language,
    theme,
  } = req.body;

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    if (phone !== undefined) vendor.phone = phone;
    if (walletAddress !== undefined) vendor.walletAddress = walletAddress;
    if (enable2FA !== undefined) vendor.enable2FA = enable2FA;
    if (notifyByEmail !== undefined) vendor.notifyByEmail = notifyByEmail;
    if (notifyBySMS !== undefined) vendor.notifyBySMS = notifyBySMS;
    if (language !== undefined) vendor.language = language;
    if (theme !== undefined) vendor.theme = theme;

    if (newPassword) {
      vendor.password = await hashPassword(newPassword);
    }

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated",
      vendor: {
        _id: vendor._id,
        fullname: vendor.fullname,
        email: vendor.email,
        phone: vendor.phone,
        walletAddress: vendor.walletAddress,
        profileImage: vendor.profileImage,
        enable2FA: vendor.enable2FA,
        notifyByEmail: vendor.notifyByEmail,
        notifyBySMS: vendor.notifyBySMS,
        language: vendor.language,
        theme: vendor.theme,
      },
    });
  } catch (err) {
    console.error("Vendor settings update error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

// Get vendor loans (for modern UI)
exports.getVendorLoans = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const loans = await Loan.find({ vendorId })
      .populate("lenderId", "fullname surname")
      .sort({ createdAt: -1 })
      .lean();

    if (!loans) {
      return res.status(404).json({ success: false, message: "No loans found" });
    }

    // Map loans to match frontend expectations
    const mappedLoans = loans.map((loan) => ({
      _id: loan._id,
      lenderName: loan.lenderId 
        ? `${loan.lenderId.fullname} ${loan.lenderId.surname}`.trim() 
        : "Unknown Lender",
      amount: parseFloat(loan.loanAmount) || 0,
      purpose: loan.purpose || "N/A",
      status: loan.status,
      interestRate: parseFloat(loan.interestRate) || 0,
      repaid: loan.repaid || false,
      createdAt: loan.createdAt,
      approvedAt: loan.approvedAt,
    }));

    return res.status(200).json({
      success: true,
      loans: mappedLoans,
    });
  } catch (err) {
    console.error("Get vendor loans error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve loans",
      error: err.message,
    });
  }
};

// Update vendor profile (for modern UI)
exports.updateVendorProfile = async (req, res) => {
  const { vendorId } = req.params;
  const { name, businessName, businessAddress, phone, email, aadharNumber } = req.body;

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Only allow updating certain fields
    if (name !== undefined) vendor.fullname = name;
    if (businessName !== undefined) vendor.businessName = businessName;
    if (businessAddress !== undefined) vendor.businessAddress = businessAddress;
    
    // Phone, email, and aadhar are read-only for security
    // If they're sent, just ignore them

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      vendor: {
        _id: vendor._id,
        name: vendor.fullname,
        email: vendor.email,
        phone: vendor.phone,
        businessName: vendor.businessName,
        businessAddress: vendor.businessAddress,
        aadharNumber: vendor.aadhaarNumber,
      },
    });
  } catch (err) {
    console.error("Update vendor profile error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

exports.recordRepayment = async (req, res) => {
  const { amount, transactionHash, date } = req.body;
  const vendorId = req.user?.id;

  if (!vendorId || !amount || !transactionHash) {
    return res.status(400).json({
      success: false,
      message: "Missing required repayment fields",
    });
  }

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const loan = await Loan.findOne({
      vendorId,
      repaid: false,
      status: { $in: ["Approved", "approved"] },
    }).sort({ createdAt: -1 });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "No active loan found to repay",
      });
    }

    // Use findByIdAndUpdate to avoid full schema validation
    const updatedLoan = await Loan.findByIdAndUpdate(
      loan._id,
      {
        repaid: true,
        status: "Repaid",
        transactionHash: transactionHash,
        repaymentDate: date ? new Date(date) : new Date(),
      },
      { new: true, runValidators: false } // Skip validators to avoid walletAddress validation
    );

    if (updatedLoan && updatedLoan.lenderId) {
      await Transaction.create({
        lenderId: updatedLoan.lenderId,
        borrowerId: vendorId,
        amount: parseFloat(amount) || parseFloat(updatedLoan.loanAmount) || 0,
        type: "Repayment",
        purpose: `Repayment for loan ${updatedLoan._id}`,
        hash: transactionHash,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Repayment recorded successfully.",
      loan: updatedLoan,
    });
  } catch (err) {
    console.error("Repayment record error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to record repayment.",
      error: err.message,
    });
  }
};
