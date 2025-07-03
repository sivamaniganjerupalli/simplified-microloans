const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    lenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lender",
      required: true,
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Loan Disbursement", "Repayment"],
      required: true,
    },
    purpose: {
      type: String,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
