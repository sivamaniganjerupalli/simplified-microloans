import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Wallet,
  MapPin,
  Calendar,
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  Activity,
  Settings,
  Store,
  Save,
  RefreshCw,
} from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const BASE_URL = API_BASE_URL;

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-slate-300 font-medium">Loading profile...</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white/10 border border-red-400/40 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="w-6 h-6 text-red-400" />
        <h3 className="text-lg font-semibold text-white">Error</h3>
      </div>
      <p className="text-slate-300">{message}</p>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, label, value, fullWidth = false }) => (
  <div className={`rounded-xl p-5 border border-white/15 bg-white/5 ${fullWidth ? "md:col-span-2" : ""}`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/25 to-purple-500/25 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-300" />
      </div>
      <p className="text-sm font-medium text-slate-300">{label}</p>
    </div>
    <p className="text-base font-semibold text-white break-all ml-13">
      {value || <span className="text-slate-400 italic">Not provided</span>}
    </p>
  </div>
);

const StatsCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl p-5 border border-white/15 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <Icon className="w-5 h-5 text-blue-300" />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const VendorProfile = () => {
  const navigate = useNavigate();
  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    businessAddress: "",
  });

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/vendor/profile/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.vendor) {
        throw new Error("Invalid response structure");
      }

      const data = res.data.vendor;
      setVendor(data);
      setPreviewImage(data.profileImage || null);
      setForm({
        name: data.fullname || "",
        businessName: data.businessName || "",
        businessAddress: data.businessAddress || "",
      });
      setError("");
    } catch (err) {
      console.error("Vendor fetch failed", err);
      setError(err.response?.data?.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!vendorId || !token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }
    fetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, token]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      setError("");
      const res = await axios.post(`${BASE_URL}/vendor/${vendorId}/upload-photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.imageUrl) {
        setPreviewImage(res.data.imageUrl);
      } else {
        throw new Error("Image URL not returned");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      setError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      await axios.put(
        `${BASE_URL}/vendor/profile/${vendorId}`,
        {
          name: form.name,
          businessName: form.businessName,
          businessAddress: form.businessAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditing(false);
      await fetchVendor();
    } catch (err) {
      console.error("Profile save failed", err);
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error && !vendor) return <ErrorState message={error} />;
  if (!vendor) return null;

  const joinedDate = vendor.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />

          <div className="relative z-10 px-8 py-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100 text-sm font-medium">Vendor Profile</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{vendor.fullname || "Vendor"}</h1>
                <p className="text-blue-100">Member since {joinedDate}</p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                <p className="text-white font-semibold text-sm">{vendor.role || "Vendor"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/vendor/loans")}
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            <span className="font-semibold">My Loans</span>
          </button>
          <button
            onClick={() => navigate("/vendor/transactions")}
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <Activity className="w-5 h-5" />
            <span className="font-semibold">Transactions</span>
          </button>
          <button
            onClick={() => navigate("/vendor/settings")}
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:shadow-lg transition-all hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Settings</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/35 bg-red-500/15 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl p-6 border border-white/15 bg-white/5">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-40 w-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Upload className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploading && <p className="text-sm text-blue-300 font-medium">Uploading...</p>}
              </div>
            </div>

            <div className="space-y-4">
              <StatsCard label="Account Status" value={vendor.createdAt ? "Active" : "Inactive"} icon={CheckCircle} />
              <StatsCard label="KYC Verification" value={vendor.aadhaarNumber ? "Verified" : "Pending"} icon={Shield} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6 border border-white/15 bg-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-300" />
                  Personal Information
                </h2>

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 rounded-lg border border-white/20 text-slate-100 hover:bg-white/10"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          name: vendor.fullname || "",
                          businessName: vendor.businessName || "",
                          businessAddress: vendor.businessAddress || "",
                        });
                      }}
                      className="px-4 py-2 rounded-lg border border-white/20 text-slate-100 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-95 inline-flex items-center gap-2"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editing ? (
                  <>
                    <div className="rounded-xl p-4 border border-white/15 bg-white/5">
                      <label className="text-sm text-slate-300">Full Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="mt-2 w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white"
                      />
                    </div>
                    <InfoCard icon={Mail} label="Email Address" value={vendor.email} />
                    <InfoCard icon={Phone} label="Phone Number" value={vendor.phone} />
                    <div className="rounded-xl p-4 border border-white/15 bg-white/5">
                      <label className="text-sm text-slate-300">Business Name</label>
                      <input
                        value={form.businessName}
                        onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
                        className="mt-2 w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white"
                      />
                    </div>
                    <div className="rounded-xl p-4 border border-white/15 bg-white/5 md:col-span-2">
                      <label className="text-sm text-slate-300">Business Address</label>
                      <input
                        value={form.businessAddress}
                        onChange={(e) => setForm((prev) => ({ ...prev, businessAddress: e.target.value }))}
                        className="mt-2 w-full rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-white"
                      />
                    </div>
                    <InfoCard icon={Calendar} label="Member Since" value={joinedDate} fullWidth />
                  </>
                ) : (
                  <>
                    <InfoCard icon={User} label="Full Name" value={vendor.fullname} />
                    <InfoCard icon={Mail} label="Email Address" value={vendor.email} />
                    <InfoCard icon={Phone} label="Phone Number" value={vendor.phone} />
                    <InfoCard icon={MapPin} label="Business Address" value={vendor.businessAddress} />
                    <InfoCard icon={Calendar} label="Member Since" value={joinedDate} fullWidth />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-6 border border-white/15 bg-white/5">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-300" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={Store} label="Business Name" value={vendor.businessName} />
                <InfoCard icon={Shield} label="Aadhaar Number" value={vendor.aadhaarNumber} />
                <InfoCard icon={Wallet} label="Wallet Address" value={vendor.walletAddress} fullWidth />
              </div>
            </div>

            <div className="rounded-2xl p-6 border border-white/15 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Security Best Practices</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Never share OTP, passwords, or wallet seed phrase with anyone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Keep your phone number active for account and repayment alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Always verify transaction details before repayment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
