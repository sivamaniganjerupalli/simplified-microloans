// Modern Loan Request Form - Updated with glassmorphic UI
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ProgressBar from "../../components/progress/ProgressBar";

const TOTAL_STEPS = 5;
const STEP_LABELS = [
  "Identity",
  "Verify",
  "Loan Details",
  "Uploads",
  "Review",
];

const LoanRequestForm = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    surname: "",
    dob: "",
    email: "",
    phone: "",
    aadhaar: "",
    location: "Detecting...",
    loanAmountINR: "",
    loanAmountETH: "",
    reason: "",
    repayTime: "",
    businessType: "",
    walletAddress: "",
    termsAccepted: false,
  });

  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [businessImage, setBusinessImage] = useState(null);

  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpVerified, setTotpVerified] = useState(false);

  const [loadingEmailOtp, setLoadingEmailOtp] = useState(false);
  const [loadingVerifyEmail, setLoadingVerifyEmail] = useState(false);
  const [loadingSetupTOTP, setLoadingSetupTOTP] = useState(false);
  const [loadingVerifyTOTP, setLoadingVerifyTOTP] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ETH price state
  const [ethPriceINR, setEthPriceINR] = useState(null);
  const [ethPriceLoading, setEthPriceLoading] = useState(false);
  const [ethPriceError, setEthPriceError] = useState("");

  // Detect location on mount
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setFormData((prev) => ({
        ...prev,
        location: "Geolocation not supported",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            location: data.display_name || `Lat: ${latitude}, Lon: ${longitude}`,
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${latitude}, Lon: ${longitude}`,
          }));
        }
      },
      () => {
        setFormData((prev) => ({
          ...prev,
          location: "Unable to detect location",
        }));
      }
    );
  }, []);

  // Fetch ETH price in INR (used in Step 3)
  useEffect(() => {
    const fetchEthPrice = async () => {
      setEthPriceLoading(true);
      setEthPriceError("");
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
        );
        const data = await res.json();
        if (data?.ethereum?.inr) {
          setEthPriceINR(data.ethereum.inr);
        } else {
          setEthPriceError("Unable to fetch ETH price.");
        }
      } catch (err) {
        console.error("ETH price fetch error:", err);
        setEthPriceError("Failed to load ETH price.");
      } finally {
        setEthPriceLoading(false);
      }
    };

    // Fetch once when component mounts
    fetchEthPrice();
  }, []);

  // Recalculate ETH amount when INR changes or ETH price changes
  useEffect(() => {
    if (!formData.loanAmountINR || !ethPriceINR) {
      setFormData((prev) => ({ ...prev, loanAmountETH: "" }));
      return;
    }
    const inrValue = parseFloat(formData.loanAmountINR);
    if (isNaN(inrValue) || inrValue <= 0) {
      setFormData((prev) => ({ ...prev, loanAmountETH: "" }));
      return;
    }
    const ethValue = inrValue / ethPriceINR;
    setFormData((prev) => ({
      ...prev,
      loanAmountETH: ethValue.toFixed(6),
    }));
  }, [formData.loanAmountINR, ethPriceINR]);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Restrict INR field to numbers only
    if (name === "loanAmountINR") {
      newValue = newValue.replace(/[^\d.]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setFormData((prev) => ({
        ...prev,
        walletAddress: accounts[0],
      }));
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet.");
    }
  };

  // Email OTP
  const sendEmailOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first.");
      return;
    }

    setLoadingEmailOtp(true);
    try {
      await axios.post(`${API_BASE_URL}/otp/send`, {
        email: formData.email,
      });
      alert("OTP sent to your email.");
    } catch (err) {
      console.error("Email OTP send error:", err.response?.data || err.message);
      alert("Failed to send Email OTP");
    } finally {
      setLoadingEmailOtp(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp.trim()) {
      alert("Enter the email OTP you received.");
      return;
    }

    setLoadingVerifyEmail(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/otp/verify`, {
        email: formData.email,
        otp: emailOtp,
      });

      if (res.data.success) {
        setEmailVerified(true);
        alert("Email verified successfully!");
      } else {
        alert("Invalid Email OTP");
      }
    } catch (err) {
      console.error("Email OTP verify error:", err.response?.data || err.message);
      alert("Email OTP verification failed");
    } finally {
      setLoadingVerifyEmail(false);
    }
  };

  // TOTP
  const setupTOTP = async () => {
    if (!formData.email) {
      alert("Please enter and verify your email first.");
      return;
    }

    setLoadingSetupTOTP(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/totp/setup`, {
        email: formData.email,
      });
      setQrCodeUrl(res.data.qrCode);
      alert("Scan the QR with Google Authenticator app.");
    } catch (err) {
      console.error("TOTP setup error:", err.response?.data || err.message);
      alert("Failed to generate QR Code");
    } finally {
      setLoadingSetupTOTP(false);
    }
  };

  const verifyTOTPCode = async () => {
    if (!totpCode.trim()) {
      alert("Enter the 6-digit TOTP from your authenticator app.");
      return;
    }

    setLoadingVerifyTOTP(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/totp/verify`, {
        email: String(formData.email || "").trim().toLowerCase(),
        token: String(totpCode || "").replace(/\s+/g, "").trim(),
      });

      if (res.data.success) {
        setTotpVerified(true);
        alert("TOTP verified successfully!");
      } else {
        alert("Invalid TOTP code");
      }
    } catch (err) {
      console.error("TOTP verify error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid TOTP code");
    } finally {
      setLoadingVerifyTOTP(false);
    }
  };

  // Step navigation validation
  const canGoNext = () => {
    if (currentStep === 1) {
      const { fullName, surname, dob, aadhaar, phone, email } = formData;
      return (
        fullName.trim() &&
        surname.trim() &&
        dob &&
        aadhaar.trim() &&
        phone.trim() &&
        email.trim()
      );
    }
    if (currentStep === 2) {
      return emailVerified && totpVerified;
    }
    if (currentStep === 3) {
      const { loanAmountINR, loanAmountETH, reason, repayTime, businessType } =
        formData;
      return (
        loanAmountINR &&
        parseFloat(loanAmountINR) > 0 &&
        loanAmountETH &&
        reason.trim() &&
        repayTime.trim() &&
        businessType.trim()
      );
    }
    if (currentStep === 4) {
      return (
        formData.walletAddress &&
        formData.location &&
        aadhaarImage &&
        businessImage
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) {
      alert("Please complete all required fields in this step.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in.");
      return;
    }

    const submission = new FormData();

    const fieldsToSend = [
      "fullName",
      "surname",
      "dob",
      "email",
      "phone",
      "aadhaar",
      "location",
      "walletAddress",
      "loanAmountINR",
      "loanAmountETH", // send ETH amount as well
      "reason",
      "repayTime",
      "businessType",
      "termsAccepted",
    ];

    fieldsToSend.forEach((key) => {
      submission.append(key, formData[key]);
    });

    if (aadhaarImage) submission.append("aadhaarImage", aadhaarImage);
    if (businessImage) submission.append("businessImage", businessImage);

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/loan/apply`, submission, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Loan application submitted successfully!");
      navigate("/vendor/loans");
    } catch (err) {
      console.error("Loan submit error:", err.response?.data || err.message);
      alert("Failed to apply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Step JSX ---

  const renderStep1 = () => (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 md:p-6">
      <h2 className="text-base font-bold text-slate-900">
        Step 1 Â· Personal & Identity Details
      </h2>
      <p className="text-sm text-slate-600">
        Enter your legal details exactly as shown on your Aadhaar card.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="fullName"
          name="fullName"
          label="Full Name (as per Aadhaar)"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <Input
          id="surname"
          name="surname"
          label="Surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <Input
          id="dob"
          name="dob"
          label="Date of Birth"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <Input
          id="aadhaar"
          name="aadhaar"
          label="Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          required
        />
        <Input
          id="phone"
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
    </section>
  );

  const renderStep2 = () => (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 md:p-6">
      <h2 className="text-base font-bold text-slate-900">
        Step 2 Â· Contact & Security Verification
      </h2>
      <p className="text-sm text-slate-600">
        Complete both checks to protect your account and loan application.
      </p>

      {/* Email + OTP */}
      <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-700">
            Email Verification (OTP)
          </p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
              emailVerified
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-yellow-50 text-yellow-700 border border-yellow-100"
            }`}
          >
            {emailVerified ? "Email Verified" : "Pending"}
          </span>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Button
            type="button"
            label={loadingEmailOtp ? "Sending OTP..." : "Send Email OTP"}
            onClick={sendEmailOtp}
            disabled={emailVerified || loadingEmailOtp}
            className="md:w-auto w-full"
          />
          <Input
            id="emailOtp"
            label="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            className="md:flex-1"
          />
          <Button
            type="button"
            label={loadingVerifyEmail ? "Verifying..." : "Verify Email"}
            onClick={verifyEmailOtp}
            disabled={emailVerified || loadingVerifyEmail}
            className="md:w-auto w-full"
          />
        </div>
      </div>

      {/* TOTP */}
      <div className="space-y-3 border border-slate-100 rounded-xl p-4 bg-slate-50/60">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Google Authenticator (TOTP)
            </p>
            <p className="text-xs text-slate-500">
              Extra layer of security for your loan application.
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
              totpVerified
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {totpVerified ? "TOTP Verified" : "Pending"}
          </span>
        </div>

        {qrCodeUrl ? (
          <div className="mt-2 space-y-2">
            <p className="text-[11px] text-slate-600">
              Scan this QR code using Google Authenticator or any TOTP app.
            </p>
            <img
              src={qrCodeUrl}
              alt="TOTP QR"
              className="w-40 h-40 rounded-lg border border-slate-200"
            />
            <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
              <Input
                id="totpCode"
                label="Enter 6-digit TOTP"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="md:flex-1"
              />
              <Button
                label={loadingVerifyTOTP ? "Verifying..." : "Verify TOTP"}
                type="button"
                onClick={verifyTOTPCode}
                disabled={totpVerified || loadingVerifyTOTP}
                className="md:w-auto w-full"
              />
            </div>
          </div>
        ) : (
          <Button
            label={
              loadingSetupTOTP ? "Generating QR..." : "Enable Google Authenticator"
            }
            type="button"
            onClick={setupTOTP}
            disabled={loadingSetupTOTP}
            className="mt-1"
          />
        )}
      </div>
    </section>
  );

  const renderStep3 = () => (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 md:p-6">
      <h2 className="text-base font-bold text-slate-900">
        Step 3 Â· Loan Details (â‚¹ â†’ ETH)
      </h2>
      <p className="text-sm text-slate-600">
        Add your loan request details. ETH value is auto-calculated from live INR price.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="loanAmountINR"
          name="loanAmountINR"
          label="Loan Amount (â‚¹ - Rupees)"
          value={formData.loanAmountINR}
          onChange={handleChange}
          required
        />

        <div>
          <Input
            id="loanAmountETH"
            name="loanAmountETH"
            label="Equivalent in ETH (auto-calculated)"
            value={formData.loanAmountETH}
            readOnly
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Based on live ETH price in INR.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-500 rounded-xl border border-slate-100 bg-white p-3">
        {ethPriceLoading && <p>Loading current ETH price in INRâ€¦</p>}
        {ethPriceError && <p className="text-red-600">{ethPriceError}</p>}
        {ethPriceINR && !ethPriceLoading && !ethPriceError && (
          <p>
            Current 1 ETH â‰ˆ â‚¹{" "}
            <span className="font-semibold">
              {ethPriceINR.toLocaleString()}
            </span>
          </p>
        )}
      </div>

      <Input
        id="repayTime"
        name="repayTime"
        label="Repay Time (in weeks)"
        value={formData.repayTime}
        onChange={handleChange}
        required
      />

      <Input
        id="reason"
        name="reason"
        label="Reason for Loan"
        value={formData.reason}
        onChange={handleChange}
        required
      />

      <Input
        id="businessType"
        name="businessType"
        label="Business Type"
        value={formData.businessType}
        onChange={handleChange}
        required
      />
    </section>
  );

  const renderStep4 = () => (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 md:p-6">
      <h2 className="text-base font-bold text-slate-900">
        Step 4 Â· Wallet, Location & Uploads
      </h2>
      <p className="text-sm text-slate-600">
        Connect your wallet and upload clear document photos for faster approval.
      </p>

      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <Input
            id="walletAddress"
            name="walletAddress"
            label="Wallet Address"
            value={formData.walletAddress}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          type="button"
          label="Connect Wallet"
          onClick={connectWallet}
          className="md:w-auto w-full"
        />
      </div>

      <Input
        id="location"
        name="location"
        label="Location"
        value={formData.location}
        onChange={handleChange}
        readOnly
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block mb-1 font-semibold text-slate-700 text-sm">
            Aadhaar Photo
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/60">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAadhaarImage(e.target.files[0])}
              required
              className="text-xs"
            />
            <p className="mt-2 text-xs text-slate-500">
              Upload a clear photo or scan of your Aadhaar card.
            </p>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-slate-700 text-sm">
            Business Photo
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/60">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBusinessImage(e.target.files[0])}
              required
              className="text-xs"
            />
            <p className="mt-2 text-xs text-slate-500">
              Upload a photo of your stall/shop or business location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderStep5 = () => (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 md:p-6">
      <h2 className="text-base font-bold text-slate-900">
        Step 5 Â· Review & Submit
      </h2>

      <p className="text-sm text-slate-600">
        Please review your details before submitting your loan application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-800 text-sm">Personal</h3>
          <p>
            <strong>Name:</strong> {formData.fullName} {formData.surname}
          </p>
          <p>
            <strong>DOB:</strong> {formData.dob}
          </p>
          <p>
            <strong>Aadhaar:</strong> {formData.aadhaar}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-slate-800 text-sm">Contact</h3>
          <p>
            <strong>Email:</strong> {formData.email}{" "}
            {emailVerified ? (
              <span className="ml-1 text-emerald-600">(Verified)</span>
            ) : (
              <span className="ml-1 text-red-500">(Not Verified)</span>
            )}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
          <p>
            <strong>Location:</strong> {formData.location}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-slate-800 text-sm">Loan</h3>
          <p>
            <strong>Amount:</strong> â‚¹ {formData.loanAmountINR}{" "}
            {formData.loanAmountETH && (
              <span>(~ {formData.loanAmountETH} ETH)</span>
            )}
          </p>
          <p>
            <strong>Repay Time:</strong> {formData.repayTime} weeks
          </p>
          <p>
            <strong>Reason:</strong> {formData.reason}
          </p>
          <p>
            <strong>Business Type:</strong> {formData.businessType}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-slate-800 text-sm">
            Wallet & Status
          </h3>
          <p>
            <strong>Wallet:</strong>{" "}
            {formData.walletAddress || "Not connected"}
          </p>
          <p>
            <strong>Email OTP:</strong>{" "}
            {emailVerified ? "Verified" : "Not Verified"}
          </p>
          <p>
            <strong>TOTP:</strong> {totpVerified ? "Verified" : "Not Verified"}
          </p>
        </div>
      </div>

      <section className="space-y-2 mt-2 rounded-xl border border-slate-100 bg-white p-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <label className="text-sm font-semibold text-slate-800">
              I accept the <strong>Terms and Conditions</strong>:
            </label>
            <ul className="text-xs list-disc pl-5 mt-1 text-gray-600 space-y-1">
              <li>Loan amount must be used strictly for business purposes.</li>
              <li>Repayment must be completed within the selected time.</li>
              <li>Late repayment may incur penalties or legal action.</li>
              <li>
                Providing false Aadhaar or business information will lead to
                rejection.
              </li>
              <li>
                By applying, you consent to verification through official means.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Apply for Microloan</h1>
              <p className="text-white/85 text-sm mt-1">Simple 5-step form. Fill details, verify, and submit safely.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 pb-12">
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl px-6 py-8 md:px-10 md:py-10">

        {/* Progress only (no StepIndicator) */}
        <div className="space-y-3 mb-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex flex-wrap gap-2">
            {STEP_LABELS.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isDone = currentStep > stepNumber;

              return (
                <div
                  key={label}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isActive
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {stepNumber}. {label}
                </div>
              );
            })}
          </div>
          <ProgressBar step={currentStep} totalSteps={TOTAL_STEPS} />
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
            {currentStep > 1 && (
              <p className="text-xs font-medium text-gray-500">
                {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              label="Back"
              onClick={handleBack}
              className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
              disabled={currentStep === 1}
            />

            {currentStep < TOTAL_STEPS && (
              <Button
                type="button"
                label="Next"
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              />
            )}

            {currentStep === TOTAL_STEPS && (
              <Button
                type="submit"
                label={submitting ? "Submitting..." : "Submit Application"}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || !formData.termsAccepted}
              />
            )}
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoanRequestForm;

