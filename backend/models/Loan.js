const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false },

  fullName: { type: String, required: true },
  surname: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaar: { type: String, required: true },

  location: { type: String, required: true },
  walletAddress: { type: String, required: true },
  loanAmount: { type: String, required: true },
  reason: { type: String, required: true },
  repayTime: { type: String, required: true },

  businessType: { type: String, required: true },
  termsAccepted: { type: Boolean, default: false },

  aadhaarImage: { type: String, required: true },
  businessImage: { type: String, required: true },

  amount: { type: Number },
  interestRate: { type: Number },

  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Repaid'], default: 'Pending' },

  repaymentDue: { type: Date },
  repaid: { type: Boolean, default: false },
  repaymentDate: { type: Date },
  approvedAt: { type: Date },

  transactionHash: { type: String } // MetaMask transaction hash
}, {
  timestamps: true
});

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
