// src/pages/Vendor/VendorSettings.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
import { 
  Settings, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageSquare,
  Smartphone,
  Moon,
  Sun,
  Globe,
  Save,
  RefreshCw,
  DollarSign,
  Key
} from "lucide-react";

const VendorSettings = () => {
  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("notifications");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    loanUpdates: true,
    repaymentReminders: true,
    marketingEmails: false,

    // Preferences
    darkMode: false,
    language: "en",
    currency: "ETH",

    // Security
    twoFactorAuth: false,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load real vendor settings on mount
  useEffect(() => {
    if (!vendorId || !token) return;
    axios.get(`${API_BASE_URL}/vendor/profile/${vendorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const v = res.data?.vendor;
      if (!v) return;
      setSettings((prev) => ({
        ...prev,
        emailNotifications: v.notifyByEmail ?? true,
        smsNotifications: v.notifyBySMS ?? false,
        twoFactorAuth: v.enable2FA ?? false,
        language: v.language || "en",
        darkMode: v.theme === "dark",
      }));
    }).catch(() => {});
  }, [vendorId, token]);

  const handleSave = async (tab) => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = {};

      if (tab === "Notification") {
        payload.notifyByEmail = settings.emailNotifications;
        payload.notifyBySMS = settings.smsNotifications;
      } else if (tab === "Security") {
        payload.enable2FA = settings.twoFactorAuth;
        if (settings.newPassword) {
          if (settings.newPassword !== settings.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            setSaving(false);
            return;
          }
          payload.newPassword = settings.newPassword;
        }
      } else if (tab === "Preferences") {
        payload.language = settings.language;
        payload.theme = settings.darkMode ? "dark" : "light";
      }

      await axios.put(
        `${API_BASE_URL}/vendor/${vendorId}/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: `${tab} settings saved successfully!` });
      if (tab === "Security") {
        setSettings((prev) => ({ ...prev, oldPassword: "", newPassword: "", confirmPassword: "" }));
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || `Failed to save ${tab} settings.` });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div className="min-h-screen vendor-settings-page">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Settings</h1>
              <p className="text-white/80 text-lg">Manage your account preferences and security</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 pb-12">
        {/* Message Banner */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl backdrop-blur-xl border shadow-lg animate-slide-down ${
            message.type === "success" 
              ? "bg-emerald-50/90 border-emerald-200" 
              : "bg-red-50/90 border-red-200"
          }`}>
            <div className="flex items-start gap-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm font-medium flex-1 ${
                message.type === "success" ? "text-emerald-900" : "text-red-900"
              }`}>
                {message.text}
              </p>
              <button 
                onClick={() => setMessage({ type: "", text: "" })}
                className={message.type === "success" ? "text-emerald-600 hover:text-emerald-800" : "text-red-600 hover:text-red-800"}
              >
                âœ•
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full group flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                      : "settings-tab-inactive hover:shadow-md hover:scale-102"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? "" : "group-hover:text-indigo-600"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 p-8 shadow-xl settings-panel">
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-600">Choose how you want to be notified</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "emailNotifications", icon: Mail, label: "Email Notifications", desc: "Receive notifications via email" },
                    { key: "smsNotifications", icon: MessageSquare, label: "SMS Notifications", desc: "Get updates via text message" },
                    { key: "loanUpdates", icon: Bell, label: "Loan Updates", desc: "Notifications about your loan applications" },
                    { key: "repaymentReminders", icon: Smartphone, label: "Repayment Reminders", desc: "Reminders for upcoming payments" },
                    { key: "marketingEmails", icon: Mail, label: "Marketing Emails", desc: "Newsletter and promotional content" },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <div key={key} className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{label}</p>
                          <p className="text-sm text-gray-600">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                          settings[key] 
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg" 
                            : "bg-gray-300"
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                          settings[key] ? "right-1" : "left-1"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSave("Notification")}
                  disabled={saving}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Notification Settings
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-600">Manage your account security</p>
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500 shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                        settings.twoFactorAuth 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg" 
                          : "bg-gray-300"
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                        settings.twoFactorAuth ? "right-1" : "left-1"
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-600" />
                    Change Password
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          value={settings.oldPassword}
                          onChange={(e) => setSettings({ ...settings, oldPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 pr-12 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={settings.newPassword}
                          onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 pr-12 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={settings.confirmPassword}
                        onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSave("Security")}
                  disabled={saving}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Security Settings
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">App Preferences</h2>
                    <p className="text-sm text-gray-600">Customize your experience</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Dark Mode */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                          {settings.darkMode ? <Moon className="w-5 h-5 text-purple-600" /> : <Sun className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Dark Mode</p>
                          <p className="text-sm text-gray-600">Toggle dark mode theme</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                          settings.darkMode 
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" 
                            : "bg-gray-300"
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                          settings.darkMode ? "right-1" : "left-1"
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Language</p>
                        <p className="text-sm text-gray-600">Select your preferred language</p>
                      </div>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="te">Telugu</option>
                      <option value="ta">Tamil</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Currency Display</p>
                        <p className="text-sm text-gray-600">Choose default currency</p>
                      </div>
                    </div>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    >
                      <option value="ETH">ETH (Ethereum)</option>
                      <option value="INR">INR (Indian Rupee)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleSave("Preferences")}
                  disabled={saving}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Preferences
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        .vendor-settings-page .settings-tab-inactive {
          background: rgba(15, 23, 42, 0.6) !important;
          border: 1px solid rgba(148, 163, 184, 0.4) !important;
          color: #e2e8f0 !important;
        }

        .vendor-settings-page .settings-tab-inactive:hover {
          color: #ffffff !important;
          border-color: rgba(129, 140, 248, 0.65) !important;
        }

        .vendor-settings-page .settings-panel .text-gray-900 {
          color: #ffffff !important;
        }

        .vendor-settings-page .settings-panel .text-gray-700,
        .vendor-settings-page .settings-panel .text-gray-600 {
          color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
};

export default VendorSettings;

