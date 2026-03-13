// src/pages/Auth/ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Wallet, Loader, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";
import authBg from "../../assets/images/auth-bg.jpg";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (resetToken) {
      setToken(resetToken);
      validateToken(resetToken);
    } else {
      setTokenValid(false);
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const validateToken = async (resetToken) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/validate-reset-token`,
        { token: resetToken }
      );
      setTokenValid(response.data.valid);
      if (!response.data.valid) {
        setError("This reset link has expired or is invalid");
      }
    } catch (err) {
      setTokenValid(false);
      setError("Invalid or expired reset token");
    }
  };

  const validatePassword = () => {
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/(?=.*\d)/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        {
          token,
          password,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "", width: "0%" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (strength <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

  if (!tokenValid) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E]/82 via-blue-950/80 to-purple-950/82" />
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h3>
              <p className="text-gray-600">{error}</p>
            </div>
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Request New Link
              </Link>
              <Link
                to="/login"
                className="block w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-500">Set New Password</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Create Strong Password</h2>
              <p className="text-lg text-gray-600">
                Choose a password that's secure and easy for you to remember.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: "🔐", title: "Minimum 8 Characters", desc: "Use a combination of letters and numbers" },
                { icon: "🔤", title: "Mixed Case", desc: "Include both uppercase and lowercase" },
                { icon: "🔢", title: "Add Numbers", desc: "Make it harder to guess" },
                { icon: "✨", title: "Special Characters", desc: "Use symbols for extra security" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Enter your new password below
                </p>
              </div>

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-green-900 mb-2">
                        Password Reset Successful!
                      </h4>
                      <p className="text-sm text-green-700">
                        Your password has been successfully reset. You can now log in with your new password.
                      </p>
                      <p className="text-xs text-green-600 mt-3">
                        Redirecting to login page in 3 seconds...
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">🔒 Passwords are encrypted using bcrypt</p>
              <p className="text-sm text-gray-500">✅ Your account is secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
