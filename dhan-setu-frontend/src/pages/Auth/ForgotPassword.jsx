// src/pages/Auth/ForgotPassword.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Wallet, Loader, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";
import authBg from "../../assets/images/auth-bg.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email }
      );

      if (response.data.success) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(response.data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Unable to process request. Please try again later."
      );
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content - Info */}
          <div className="hidden lg:block space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                  DhanSetu
                </h1>
                <p className="text-sm text-gray-500">Password Recovery</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Forgot Your Password?</h2>
              <p className="text-lg text-gray-600">
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: "📧", title: "Email Verification", desc: "We'll send a reset link to your email" },
                { icon: "🔐", title: "Secure Process", desc: "Your account security is our priority" },
                { icon: "⚡", title: "Quick Reset", desc: "Get back to your account in minutes" }
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

          {/* Right Content - Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
              {/* Back Link */}
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Enter the email associated with your account
                </p>
              </div>

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                      </>
                    )}
                  </button>

                  {/* Links */}
                  <div className="pt-4 border-t border-gray-200 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Sign in
                      </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
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
                        Check Your Email
                      </h4>
                      <p className="text-sm text-green-700">
                        We've sent password reset instructions to your email address.
                        Please check your inbox and follow the link to reset your password.
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>The reset link will expire in 1 hour</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Check your spam folder if you don't see the email</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Contact support if you continue to have issues</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link 
                      to="/login"
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
                    >
                      Back to Login
                    </Link>
                    <button
                      onClick={() => setSuccess(false)}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Resend Email
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">🔒 Secured by 256-bit Encryption</p>
              <p className="text-sm text-gray-500">✅ Your data is safe with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
