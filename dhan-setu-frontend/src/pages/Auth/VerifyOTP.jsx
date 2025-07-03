// src/pages/Auth/VerifyOTP.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await axios.post("http://localhost:5000/api/otp/send", { email });

      if (response.data.success) {
        setOtpSent(true);
        setSuccessMsg("OTP sent to " + email);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await axios.post("http://localhost:5000/api/otp/verify", {
        email,
        otp,
      });

      if (response.data.success) {
        setSuccessMsg("You are successfully registered. Please login.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(response.data.message || "OTP verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-6 shadow bg-white rounded">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Verify Your Email with OTP
        </h2>

        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!location.state?.email}
          />

          {!otpSent ? (
            <Button type="submit" label={loading ? "Sending OTP..." : "Send OTP"} />
          ) : (
            <>
              <Input
                label="Enter OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button type="submit" label={loading ? "Verifying..." : "Verify OTP"} />
            </>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}

          {successMsg && (
            <p className="text-green-600 text-sm text-center mt-2">{successMsg}</p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default VerifyOTP;
