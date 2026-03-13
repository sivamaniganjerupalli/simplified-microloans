import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Wallet, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const Register = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    aadhaarNumber: "",
    walletAddress: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const connectWallet = async () => {
    setWalletError("");
    if (typeof window.ethereum === "undefined") {
      setWalletError("MetaMask is not installed. Please install it from metamask.io");
      return;
    }
    try {
      setWalletConnecting(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setFormData((prev) => ({ ...prev, walletAddress: accounts[0] }));
      setError("");
    } catch (err) {
      if (err.code === 4001) {
        setWalletError("Connection rejected. Please approve the MetaMask request.");
      } else {
        setWalletError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setWalletConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setFormData((prev) => ({ ...prev, walletAddress: "" }));
    setWalletError("");
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      const nextAddress = accounts && accounts.length > 0 ? accounts[0] : "";
      setFormData((prev) => ({ ...prev, walletAddress: nextAddress }));

      if (!nextAddress) {
        setWalletError("Wallet disconnected. Please connect MetaMask again.");
      } else {
        setWalletError("");
      }
    };

    // Keep UI in sync if user is already connected before opening this page.
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch(() => {});

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!role) {
      setError("Please select a role");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.fullname?.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email?.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.phone?.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.password?.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.aadhaarNumber?.trim()) {
      setError("Aadhaar number is required");
      return false;
    }
    if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return false;
    }
    if (!formData.walletAddress?.trim()) {
      setError("Wallet address is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    try {
      setLoading(true);
      const endpoint =
        role === "lender"
          ? `${API_BASE_URL}/lender/register`
          : `${API_BASE_URL}/vendor/register`;

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        navigate("/verify-otp", {
          state: {
            email: formData.email,
            autoSendOtp: true,
            registrationSuccess: "Registration successful! Please verify your email.",
          },
        });
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      const duplicateField = err.response?.data?.duplicateField;
      const fallbackByField = {
        email: "Email already registered. Please use another email or login.",
        phone: "Phone number already registered. Please use another phone number or login.",
        aadhaarNumber: "Aadhaar number already registered. Please use another Aadhaar number or login.",
      };
      const errorMsg =
        err.response?.data?.message ||
        (duplicateField ? fallbackByField[duplicateField] : null) ||
        "Registration error";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                DhanSetu
              </h1>
              <p className="text-xs text-gray-500">Create Your Account</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    s === step
                      ? "bg-blue-600 text-white scale-110"
                      : s < step
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      s < step ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Who are you?</h3>
                  <p className="text-gray-600">Choose your role to get started</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: "vendor",
                      title: "Street Vendor",
                      desc: "I want to grow my business",
                      icon: "📱",
                    },
                    {
                      value: "lender",
                      title: "Lender / Investor",
                      desc: "I want to provide funds",
                      icon: "💰",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`p-6 rounded-2xl border-2 transition-all text-center ${
                        role === option.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <p className="font-bold text-gray-900">{option.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Details</h3>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit phone number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Security & Wallet */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Security & Wallet</h3>
                  <p className="text-gray-600">Complete your registration</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    placeholder="12-digit Aadhaar number"
                    maxLength="12"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ethereum Wallet Address
                  </label>

                  {!formData.walletAddress ? (
                    /* ── Not connected ── */
                    <button
                      type="button"
                      onClick={connectWallet}
                      disabled={walletConnecting}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5
                                 rounded-xl border-2 border-dashed border-orange-300
                                 bg-orange-50 hover:bg-orange-100 hover:border-orange-400
                                 text-orange-700 font-semibold text-sm
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 transition-all duration-200 group"
                    >
                      {walletConnecting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Connecting…
                        </>
                      ) : (
                        <>
                          {/* MetaMask fox icon as SVG */}
                          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.958 1L19.47 10.847l2.439-5.72L32.958 1z" fill="#E2761B" stroke="#E2761B" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.031 1l13.37 9.938-2.32-5.811L2.031 1zM28.178 23.534l-3.589 5.498 7.677 2.112 2.202-7.49-6.29-.12zM.554 23.654l2.19 7.49 7.666-2.112-3.578-5.498-6.278.12z" fill="#E4761B" stroke="#E4761B" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.049 14.426l-2.143 3.24 7.63.337-.265-8.204-5.222 4.627zM24.94 14.426l-5.293-4.72-.175 8.297 7.619-.337-2.151-3.24zM10.41 29.032l4.576-2.231-3.946-3.077-.63 5.308zM20.003 26.801l4.588 2.231-.642-5.308-3.946 3.077z" fill="#E4761B" stroke="#E4761B" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Connect MetaMask Wallet
                        </>
                      )}
                    </button>
                  ) : (
                    /* ── Connected ── */
                    <div className="rounded-xl border-2 border-green-400 overflow-hidden" style={{ backgroundColor: "#f0fdf4" }}>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-300" style={{ backgroundColor: "#dcfce7" }}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs font-bold" style={{ color: "#15803d" }}>Wallet Connected</span>
                        </div>
                        <button
                          type="button"
                          onClick={disconnectWallet}
                          className="text-xs font-medium transition-colors hover:text-red-600"
                          style={{ color: "#16a34a" }}
                        >
                          Disconnect
                        </button>
                      </div>
                      <div className="px-4 py-3 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M32.958 1L19.47 10.847l2.439-5.72L32.958 1z" fill="#E2761B" stroke="#E2761B" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.031 1l13.37 9.938-2.32-5.811L2.031 1zM28.178 23.534l-3.589 5.498 7.677 2.112 2.202-7.49-6.29-.12zM.554 23.654l2.19 7.49 7.666-2.112-3.578-5.498-6.278.12z" fill="#E4761B" stroke="#E4761B" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-sm font-mono truncate" style={{ color: "#1f2937" }}>
                          {formData.walletAddress.slice(0, 6)}&hellip;{formData.walletAddress.slice(-4)}
                        </span>
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                      </div>
                    </div>
                  )}

                  {/* Wallet-specific error */}
                  {walletError && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-red-600">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{walletError}</span>
                    </div>
                  )}

                  {/* MetaMask not installed hint */}
                  {typeof window !== "undefined" && typeof window.ethereum === "undefined" && (
                    <p className="mt-2 text-xs text-gray-500">
                      Don't have MetaMask?{" "}
                      <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Install it here
                      </a>
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>

            {/* Link to Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">🔒 Your data is encrypted with bank-level security</p>
          <p className="text-sm text-gray-600">✅ RBI Compliant Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
