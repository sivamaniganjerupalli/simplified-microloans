// src/pages/lender/LenderProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
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
  CreditCard,
} from "lucide-react";

const BASE_URL = API_BASE_URL;

/* -------------------------- Professional UI Components -------------------------- */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-slate-700 font-medium">Loading profile...</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
    <div className="max-w-md w-full bg-white border border-red-300 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-semibold text-slate-900">Error</h3>
      </div>
      <p className="text-slate-700">{message}</p>
    </div>
  </div>
);

const ProfileHeader = ({ lender }) => {
  const joinedDate = lender?.createdAt
    ? new Date(lender.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      
      <div className="relative z-10 px-8 py-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">Lender Profile</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {lender?.fullname} {lender?.surname}
            </h1>
            <p className="text-blue-100">Member since {joinedDate}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <p className="text-white font-semibold text-sm">{lender?.role || "Lender"}</p>
            </div>
            {lender?.walletAddress && (
              <div className="flex items-center gap-2 text-emerald-200 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      label: "Loan Requests", 
      icon: FileText, 
      path: "/lender/loans",
      color: "from-blue-600 to-blue-700"
    },
    { 
      label: "Transactions", 
      icon: Activity, 
      path: "/lender/transactions",
      color: "from-purple-600 to-purple-700"
    },
    { 
      label: "Settings", 
      icon: Settings, 
      path: "/lender/settings",
      color: "from-slate-600 to-slate-700"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all hover:scale-105`}
          >
            <IconComponent className="w-5 h-5" />
            <span className="font-semibold">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const AvatarSection = ({ previewImage, uploading, handleImageChange, inlineError }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative">
      <div className="h-40 w-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
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

    {uploading && (
      <p className="text-sm text-blue-600 font-medium">Uploading...</p>
    )}
    
    {inlineError && (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <p className="text-sm text-red-700">{inlineError}</p>
      </div>
    )}
  </div>
);

const InfoCard = ({ icon: Icon, label, value, fullWidth = false }) => (
  <div className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
    <p className="text-base font-semibold text-slate-900 break-all ml-13">
      {value || <span className="text-slate-400 italic">Not provided</span>}
    </p>
  </div>
);

const StatsCard = ({ label, value, icon: Icon }) => (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const SecuritySection = () => (
  <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Security Best Practices
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Never share your wallet seed phrase or private keys with anyone</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Use a strong, unique password for your account</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Verify loan details and wallet addresses before approving</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Enable two-factor authentication for enhanced security</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

/* ------------------------------ Main Component ------------------------------ */

const LenderProfile = () => {
  const navigate = useNavigate();
  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [lender, setLender] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLender = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/lender/profile/${lenderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.data) {
          const data = res.data.data;
          setLender(data);
          setPreviewImage(data.profileImage || null);
          setError("");
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Failed to load lender", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
          return;
        }
        setError("Unable to load profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    if (lenderId && token) {
      fetchLender();
    } else {
      setError("Authentication required. Please log in.");
      setLoading(false);
    }
  }, [lenderId, token, navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      setError("");
      const res = await axios.post(
        `${BASE_URL}/lender/upload-photo/${lenderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data && res.data.imageUrl) {
        setPreviewImage(res.data.imageUrl);
      } else {
        throw new Error("Image URL not returned");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !lender) {
    return <ErrorState message={error} />;
  }

  if (!lender) {
    return null;
  }

  const joinedDate = lender.createdAt
    ? new Date(lender.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <ProfileHeader lender={lender} />

        {/* Quick Action Buttons */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <AvatarSection
                previewImage={previewImage}
                uploading={uploading}
                handleImageChange={handleImageChange}
                inlineError={error && lender ? error : ""}
              />
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
              <StatsCard 
                label="Account Status" 
                value="Active" 
                icon={CheckCircle}
              />
              <StatsCard 
                label="Verification" 
                value="Verified" 
                icon={Shield}
              />
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard 
                  icon={User} 
                  label="Full Name" 
                  value={`${lender.fullname} ${lender.surname || ''}`} 
                />
                <InfoCard 
                  icon={Mail} 
                  label="Email Address" 
                  value={lender.email} 
                />
                <InfoCard 
                  icon={Phone} 
                  label="Phone Number" 
                  value={lender.phone} 
                />
                <InfoCard 
                  icon={MapPin} 
                  label="Country" 
                  value={lender.country || "India"} 
                />
                <InfoCard 
                  icon={Calendar} 
                  label="Member Since" 
                  value={joinedDate} 
                  fullWidth 
                />
              </div>
            </div>

            {/* Wallet Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Wallet Information
              </h2>
              
              <div className="space-y-4">
                {lender.walletAddress ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-slate-700">Connected Wallet</p>
                    </div>
                    <p className="font-mono text-sm text-slate-900 break-all bg-white px-4 py-3 rounded-lg border border-blue-200">
                      {lender.walletAddress}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Wallet verified and active</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 mb-1">No Wallet Connected</p>
                        <p className="text-sm text-amber-700">
                          Please connect your wallet to receive loan repayments and manage your funds.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Section */}
            <SecuritySection />
          </div>
        </div>

        {/* Support Notice */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-slate-600">
            Need to update your information?{" "}
            <a 
              href="mailto:support@dhansetu.io" 
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LenderProfile;
