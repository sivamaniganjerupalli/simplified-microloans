const Loan = require('../models/Loan');

// Apply for loan
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
      reason,
      repayTime,
      businessType,
      termsAccepted,
    } = req.body;

    const aadhaarImage = req.files?.aadhaarImage?.[0]?.filename;
    const businessImage = req.files?.businessImage?.[0]?.filename;

    if (!aadhaarImage || !businessImage) {
      return res.status(400).json({ success: false, message: 'Missing Aadhaar or Business image' });
    }

    const vendorId = req.user?.id;

    // Retrieve vendor from DB to get walletAddress
    const Vendor = require('../models/Vendor');
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const loan = new Loan({
      vendorId,
      fullName,
      surname,
      dob,
      email,
      phone,
      aadhaar,
      location,
      walletAddress: vendor.walletAddress, // ✅ Include wallet address
      loanAmount,
      reason,
      repayTime,
      businessType,
      termsAccepted,
      aadhaarImage,
      businessImage,
      status: 'Pending',
      repaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await loan.save();
    res.status(201).json({ success: true, loan });

  } catch (err) {
    console.error('Apply Loan Error:', err.message);
    res.status(500).json({ success: false, message: 'Loan application failed', error: err.message });
  }
};

// Repay loan
exports.repayLoan = async (req, res) => {
  const { loanId } = req.body;
  const vendorId = req.user?.id;

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    if (loan.repaid) {
      return res.status(400).json({ success: false, message: 'Loan already repaid' });
    }

    if (loan.vendorId.toString() !== vendorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized repayment attempt' });
    }

    loan.repaid = true;
    loan.status = 'Repaid';
    loan.repaymentDate = new Date();
    await loan.save();

    res.status(200).json({ success: true, message: 'Loan marked as repaid', loan });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Approve loan
exports.approveLoan = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    if (loan.status === 'Approved') {
      return res.status(400).json({ success: false, message: 'Loan already approved' });
    }

    loan.status = 'Approved';
    loan.approvedAt = new Date();
    await loan.save();

    res.json({ success: true, message: 'Loan approved', loan });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all loans by vendor
exports.getLoansByVendor = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const loans = await Loan.find({ vendorId }).sort({ createdAt: -1 });
    res.json({ success: true, loans });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });

    const mappedLoans = loans.map(loan => ({
      ...loan.toObject(),
      aadhaarImageUrl: `${req.protocol}://${req.get('host')}/uploads/${loan.aadhaarImage}`,
      businessImageUrl: `${req.protocol}://${req.get('host')}/uploads/${loan.businessImage}`,
    }));

    res.json({ success: true, loans: mappedLoans });

  } catch (err) {
    console.error('Error fetching all loans:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};