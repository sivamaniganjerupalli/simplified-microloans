import React, { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import axios from "axios";

const VendorSettings = () => {
  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    walletAddress: "",
    aadhaarNumber: "",
    newPassword: "",
    confirmPassword: "",
    enable2FA: false,
    notifyByEmail: true,
    notifyBySMS: false,
    language: "en",
    theme: "light",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile details
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/vendor/${vendorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vendor = res.data.vendor;
        setFormData((prev) => ({
          ...prev,
          email: vendor.email,
          phone: vendor.phone || "",
          walletAddress: vendor.walletAddress || "",
          aadhaarNumber: vendor.aadhaarNumber || "",
          enable2FA: vendor.enable2FA || false,
          notifyByEmail: vendor.notifyByEmail ?? true,
          notifyBySMS: vendor.notifyBySMS ?? false,
          language: vendor.language || "en",
          theme: vendor.theme || "light",
        }));
      } catch (err) {
        setError("Failed to fetch profile data");
      }
    };

    fetchData();
  }, [vendorId, token]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const updateData = { ...formData };
      delete updateData.confirmPassword;

      if (!updateData.newPassword) delete updateData.newPassword;

      if (profileImage) {
        const imgForm = new FormData();
        imgForm.append("profileImage", profileImage);
        await axios.post(`http://localhost:5000/api/vendor/${vendorId}/upload-profile`, imgForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await axios.put(`http://localhost:5000/api/vendor/${vendorId}/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Settings updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <Input id="email" label="Email" value={formData.email} onChange={handleChange} />
        <Input id="phone" label="Phone" value={formData.phone} onChange={handleChange} />
        <Input id="walletAddress" label="Wallet Address" value={formData.walletAddress} onChange={handleChange} />
        <Input id="aadhaarNumber" label="Aadhaar Number" value={formData.aadhaarNumber} onChange={handleChange} />
        <Input id="newPassword" label="New Password" type="password" value={formData.newPassword} onChange={handleChange} />
        <Input id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} />

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && <img src={previewImage} className="mt-2 w-20 h-20 rounded-full" alt="Preview" />}
        </div>
        <h1 className="text-2xl font-bold">Account preferences</h1>

        {/* Enable 2FA */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="enable2FA" checked={formData.enable2FA} onChange={handleChange} />
          <label htmlFor="enable2FA">Enable Two-Factor Authentication (2FA)</label>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-2">
          <p className="font-medium">Notification Preferences:</p>
          <div className="flex space-x-4">
            <label>
              <input type="checkbox" id="notifyByEmail" checked={formData.notifyByEmail} onChange={handleChange} />
              <span className="ml-2">Email</span>
            </label>
            <label>
              <input type="checkbox" id="notifyBySMS" checked={formData.notifyBySMS} onChange={handleChange} />
              <span className="ml-2">SMS</span>
            </label>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium">Preferred Language</label>
          <select id="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
            <option value="en">English</option>
            <option value="te">Telugu</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium">Theme</label>
          <select id="theme" value={formData.theme} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <Button label={loading ? "Updating..." : "Update Settings"} onClick={handleUpdate} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </div>
    </div>
  );
};

export default VendorSettings;
