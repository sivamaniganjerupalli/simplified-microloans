const Loan = require("../models/Loan");
const Vendor = require("../models/Vendor");
const Transaction = require("../models/Transaction");

exports.applyLoan = async (req, res) => {
  try {
    const {
      fullName,
      surname,
      dob,
      email,
      phone,
      aadhaar,
      location,
      loanAmount,
      loanAmountETH,
      loanAmountINR,
      reason,
      repayTime,
      businessType,
      termsAccepted,
      walletAddress,
    } = req.body;

    const aadhaarImage = req.files?.aadhaarImage?.[0]?.filename;
    const businessImage = req.files?.businessImage?.[0]?.filename;

    if (!aadhaarImage || !businessImage) {
      return res.status(400).json({
        success: false,
        message: "Missing Aadhaar or Business image",
      });
    }

    const vendorId = req.user?.id;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const normalizedLoanAmount = loanAmountETH || loanAmount || "0";

    const loan = await Loan.create({
      vendorId,
      fullName,
      surname,
      dob,
      email,
      phone,
      aadhaar,
      location,
      walletAddress: walletAddress || vendor.walletAddress,
      loanAmount: normalizedLoanAmount,
      reason,
      repayTime,
      businessType,
      termsAccepted: String(termsAccepted) === "true" || termsAccepted === true,
      aadhaarImage,
      businessImage,
      status: "Pending",
      repaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      message: "Loan application submitted successfully",
      loan: {
        ...loan.toObject(),
        loanAmountINR: loanAmountINR || null,
        loanAmountETH: normalizedLoanAmount,
      },
    });
  } catch (err) {
    console.error("Apply loan error:", {
      message: err.message,
      vendorId: req.user?.id,
      bodyKeys: Object.keys(req.body || {}),
      hasFiles: !!req.files,
      fileKeys: Object.keys(req.files || {}),
    });
    return res.status(500).json({
      success: false,
      message: "Loan application failed",
      error: err.message,
    });
  }
};

exports.repayLoan = async (req, res) => {
  const { loanId, transactionHash } = req.body;
  const vendorId = req.user?.id;

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (loan.repaid) {
      return res.status(400).json({ success: false, message: "Loan already repaid" });
    }

    if (loan.vendorId.toString() !== vendorId) {
      return res.status(403).json({ success: false, message: "Unauthorized repayment attempt" });
    }

    loan.repaid = true;
    loan.status = "Repaid";
    loan.repaymentDate = new Date();
    if (transactionHash) {
      loan.transactionHash = transactionHash;
    }
    await loan.save();

    if (loan.lenderId) {
      await Transaction.create({
        lenderId: loan.lenderId,
        borrowerId: vendorId,
        amount: parseFloat(loan.loanAmount) || 0,
        type: "Repayment",
        purpose: `Repayment for loan ${loan._id}`,
        hash: transactionHash || `manual-${loan._id}-${Date.now()}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Loan marked as repaid",
      loan,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.approveLoan = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (loan.status === "Approved") {
      return res.status(400).json({ success: false, message: "Loan already approved" });
    }

    loan.status = "Approved";
    loan.approvedAt = new Date();
    await loan.save();

    return res.json({ success: true, message: "Loan approved", loan });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLoansByVendor = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const loans = await Loan.find({ vendorId }).sort({ createdAt: -1 });
    return res.json({ success: true, loans });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });

    const mappedLoans = loans.map((loan) => ({
      ...loan.toObject(),
      aadhaarImageUrl: `${req.protocol}://${req.get("host")}/uploads/${loan.aadhaarImage}`,
      businessImageUrl: `${req.protocol}://${req.get("host")}/uploads/${loan.businessImage}`,
    }));

    return res.json({ success: true, loans: mappedLoans });
  } catch (err) {
    console.error("Error fetching all loans:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
