import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoanRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    surname: "",
    dob: "",
    email: "",
    phone: "",
    aadhaar: "",
    location: "Detecting...",
    loanAmount: "",
    reason: "",
    repayTime: "",
    businessType: "",
    walletAddress: "",
    termsAccepted: false,
  });

  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [businessImage, setBusinessImage] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpVerified, setTotpVerified] = useState(false);

  useEffect(() => {
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
        setFormData((prev) => ({ ...prev, location: "Unable to detect" }));
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setFormData((prev) => ({
        ...prev,
        walletAddress: accounts[0],
      }));
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet.");
    }
  };

  const sendEmailOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/otp/send", { email: formData.email });
      alert("OTP sent to your email");
    } catch (err) {
      console.error("Email OTP send error:", err.response?.data || err.message);
      alert("Failed to send Email OTP");
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify", {
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
    }
  };

  const setupTOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/totp/setup", {
        email: formData.email,
      });
      setQrCodeUrl(res.data.qrCode);
      alert("Scan the QR in Google Authenticator app.");
    } catch (err) {
      alert("Failed to generate QR Code");
    }
  };

  const verifyTOTPCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/totp/verify", {
        email: formData.email,
        token: totpCode,
      });
      setTotpVerified(true);
      alert("TOTP verified successfully!");
    } catch {
      alert("Invalid TOTP code");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.termsAccepted) return alert("Accept terms and conditions.");
  if (!emailVerified) return alert("Verify your email");
  if (!totpVerified) return alert("Verify Google Authenticator code");

  const token = localStorage.getItem("token");
  if (!token) return alert("User not logged in.");

  const submission = new FormData();

  // Only add fields that are required for submission (exclude lenderId completely)
  const fieldsToSend = [
    "fullName", "surname", "dob", "email", "phone", "aadhaar",
    "location", "walletAddress", "loanAmount", "reason", "repayTime",
    "businessType", "termsAccepted"
  ];

  fieldsToSend.forEach((key) => {
    submission.append(key, formData[key]);
  });

  if (aadhaarImage) submission.append("aadhaarImage", aadhaarImage);
  if (businessImage) submission.append("businessImage", businessImage);

  try {
    await axios.post("http://localhost:5000/api/loan/apply", submission, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Loan application submitted successfully!");
    navigate("/Vendor/Loans");
  } catch (err) {
    console.error("Loan submit error:", err.response?.data || err.message);
    alert("Failed to apply. Please try again.");
  }
};


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Apply for Loan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name (as per Aadhaar)" name="fullName" value={formData.fullName} onChange={handleChange} required />
        <Input label="Surname" name="surname" value={formData.surname} onChange={handleChange} required />
        <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />

        <div className="flex gap-2 items-center">
          <Button type="button" label="Send Email OTP" onClick={sendEmailOtp} disabled={emailVerified} />
          <input type="text" placeholder="Enter Email OTP" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} />
          <Button type="button" label="Verify Email" onClick={verifyEmailOtp} disabled={emailVerified} />
        </div>

        {qrCodeUrl ? (
          <div className="mt-4">
            <p className="text-sm mb-2">Scan this QR code with Google Authenticator:</p>
            <img src={qrCodeUrl} alt="TOTP QR" className="w-48" />
            <div className="flex items-center mt-2 gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit TOTP"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <Button label="Verify TOTP" type="button" onClick={verifyTOTPCode} disabled={totpVerified} />
            </div>
          </div>
        ) : (
          <Button label="Enable Google Authenticator" type="button" onClick={setupTOTP} />
        )}

        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
        <Input label="Aadhaar Number" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required />

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Wallet Address"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="button" label="Connect Wallet" onClick={connectWallet} />
        </div>

        <Input label="Location" name="location" value={formData.location} onChange={handleChange} readOnly />
        <Input label="Loan Amount (ETH)" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required />
        <Input label="Reason for Loan" name="reason" value={formData.reason} onChange={handleChange} required />
        <Input label="Repay Time (in 1 week)" name="repayTime" value={formData.repayTime} onChange={handleChange} required />
        <Input label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} required />

        <div>
          <label className="block mb-1 font-medium">Upload Aadhaar Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setAadhaarImage(e.target.files[0])} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Business Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setBusinessImage(e.target.files[0])} required />
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mt-1" />
          <div>
            <label className="text-sm">I accept the <strong>Terms and Conditions</strong>:</label>
            <ul className="text-xs list-disc pl-5 mt-1 text-gray-600">
              <li>Loan amount must be used strictly for business purposes.</li>
              <li>Repayment must be completed within the selected time.</li>
              <li>Late repayment may incur penalties or legal action.</li>
              <li>Providing false Aadhaar or business info will lead to rejection.</li>
              <li>By applying, you allow verification through official means.</li>
            </ul>
          </div>
        </div>

        <Button
          type="submit"
          label="Apply Loan"
          disabled={!emailVerified || !totpVerified || !formData.termsAccepted}
        />
      </form>
    </div>
  );
};

export default LoanRequestForm;
