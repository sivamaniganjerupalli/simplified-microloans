const mongoose = require("mongoose");

const lenderSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    surname: { type: String },
    email: { type: String, required: true, unique: true },
    aadhaarNumber: { type: String, unique: true }, 
    phone: { type: String },
    walletAddress: { type: String },
    profileImage: { type: String },
    password: { type: String, required: true },
    walletBalance: { type: String, default: "0.00" },
    role: { type: String, default: "lender" },
    language: { type: String, default: "English" },
    theme: { type: String, default: "light" },
    notifyByEmail: { type: Boolean, default: true },
    notifyBySMS: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Lender = mongoose.models.Lender || mongoose.model("Lender", lenderSchema);

module.exports = Lender;
