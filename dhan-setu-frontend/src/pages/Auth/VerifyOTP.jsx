import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Wallet, Loader, CheckCircle, Clock, Mail } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";
import authBg from "../../assets/images/auth-bg.jpg";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState((location.state?.email || "").trim().toLowerCase());
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(location.state?.registrationSuccess || "");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const sendOtpRequest = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccessMsg((current) => current || "");
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/otp/send`,
        { email: normalizedEmail }
      );

      if (response.data.success) {
        setEmail(normalizedEmail);
        setOtpSent(true);
        const fallbackNote = response.data.bypassedEmail
          ? " (email fallback mode enabled)"
          : "";
        const otpPreview = response.data.otp
          ? ` OTP: ${response.data.otp}`
          : "";
        setSuccessMsg("OTP has been sent to " + normalizedEmail + fallbackNote + otpPreview);
        setTimeLeft(120); // 2 minutes
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong while sending OTP"
      );
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    await sendOtpRequest();
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/otp/verify`,
        {
          email: normalizedEmail,
          otp: otpCode,
        }
      );

      if (response.data.success) {
        setSuccessMsg("✅ Email verified! Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

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
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E]/82 via-blue-950/80 to-purple-950/82" />
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="hidden lg:block space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                  DhanSetu
                </h1>
                <p className="text-sm text-gray-500">Email Verification</p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">Verify Your Email</h2>
              <p className="text-lg text-gray-600">
                We've sent a One-Time Password (OTP) to your email address. Enter it below to complete your registration.
              </p>

              <div className="space-y-4">
                {[
                  { icon: "📧", title: "Secure", desc: "6-digit code verification" },
                  { icon: "⏱️", title: "Quick", desc: "Takes less than a minute" },
                  { icon: "🔐", title: "Safe", desc: "Your email will be verified" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Email Verification</h3>
                    <p className="text-sm text-gray-500">One more step to complete</p>
                  </div>
                </div>
              </div>

              <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-6">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors disabled:bg-gray-100"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        If the prefilled email is wrong, update it here before sending OTP.
                      </p>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-700">
                        <strong>OTP sent to:</strong> {email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Enter 6-Digit Code
                      </label>
                      <div className="flex gap-2 justify-center mb-4">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                          />
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    {successMsg && (
                      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {successMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.join("").length !== 6}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Verify & Continue
                        </>
                      )}
                    </button>

                    {/* Resend OTP */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Didn't receive the code?
                      </p>
                      {timeLeft > 0 ? (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Resend in {timeLeft}s</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={loading}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                )}
              </form>

              <p className="mt-6 text-xs text-center text-gray-500">
                Check your spam or promotions folder if you don't see the email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
