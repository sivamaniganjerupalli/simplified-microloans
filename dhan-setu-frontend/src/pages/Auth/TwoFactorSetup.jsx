// src/pages/Auth/TwoFactorSetup.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Wallet, Loader, Shield, Copy, CheckCircle, Smartphone, Key } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";
import authBg from "../../assets/images/auth-bg.jpg";

/**
 * Two-Factor Authentication Setup Page
 * Allows users to enable TOTP-based 2FA for enhanced security
 */
const TwoFactorSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enable, 2: Scan QR, 3: Verify
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/auth/2fa/generate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    if (value && index < 5) {
      document.getElementById(`2fa-${index + 1}`)?.focus();
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    const code = verificationCode.join("");
    
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/auth/2fa/verify`,
        { code, secret },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setBackupCodes(response.data.backupCodes || []);
        setStep(3);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigate("/vendor"); // or /lender based on role
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E]/82 via-blue-950/80 to-purple-950/82" />
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl relative z-10">
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
                <p className="text-sm text-gray-500">Two-Factor Authentication</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Secure Your Account</h2>
              <p className="text-lg text-gray-600">
                Add an extra layer of security to protect your account and transactions.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: "🔐", title: "Enhanced Security", desc: "Protect against unauthorized access" },
                { icon: "📱", title: "Authenticator App", desc: "Works with Google/Microsoft Authenticator" },
                { icon: "🔑", title: "Backup Codes", desc: "Emergency access if you lose your device" },
                { icon: "✅", title: "Industry Standard", desc: "Time-based one-time passwords (TOTP)" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Setup Steps */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
              {/* Step 1: Enable 2FA */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Enable 2FA</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
                    </p>

                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-2">
                      <p className="text-sm font-semibold text-blue-900">You'll need:</p>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          <span>A smartphone</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          <span>An authenticator app (Google Authenticator, Microsoft Authenticator, etc.)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleEnable2FA}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      "Enable Two-Factor Authentication"
                    )}
                  </button>

                  <Link
                    to="/vendor"
                    className="block text-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Skip for now
                  </Link>
                </div>
              )}

              {/* Step 2: Scan QR Code */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Scan QR Code</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      Open your authenticator app and scan this QR code:
                    </p>

                    {/* QR Code Display */}
                    <div className="flex justify-center p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                      {qrCode ? (
                        <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-300 animate-pulse rounded-xl" />
                      )}
                    </div>

                    {/* Manual Entry Option */}
                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Can't scan? Enter this code manually:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono text-gray-900">
                          {secret}
                        </code>
                        <button
                          onClick={handleCopySecret}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleVerify2FA} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Enter the 6-digit code from your app
                        </label>
                        <div className="flex gap-2 justify-center">
                          {verificationCode.map((digit, index) => (
                            <input
                              key={index}
                              id={`2fa-${index}`}
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleCodeChange(e.target.value, index)}
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

                      <button
                        type="submit"
                        disabled={loading || verificationCode.join("").length !== 6}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Continue"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Step 3: Backup Codes */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">2FA Enabled!</h3>
                  </div>

                  <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl space-y-3">
                    <p className="font-semibold text-green-900">✅ Success!</p>
                    <p className="text-sm text-green-800">
                      Two-factor authentication has been enabled for your account.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-gray-900">Save Your Backup Codes</p>
                    <p className="text-sm text-gray-600">
                      Store these codes in a safe place. You can use them to access your account if you lose your phone.
                    </p>

                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                      <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, i) => (
                          <code key={i} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono text-gray-900">
                            {code}
                          </code>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const codes = backupCodes.join("\n");
                          navigator.clipboard.writeText(codes);
                        }}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy All
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Print
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">🔒 Your security is our priority</p>
              <p className="text-sm text-gray-500">✅ Industry-standard TOTP authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
