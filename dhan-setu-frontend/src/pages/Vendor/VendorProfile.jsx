// src/pages/vendor/VendorProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorProfile = () => {
  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [vendor, setVendor] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/vendor/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendor(res.data.vendor);
        setPreviewImage(res.data.vendor.profileImage || null);
      } catch (err) {
        console.error("Failed to load vendor", err);
      }
    };

    if (vendorId && token) fetchVendor();
  }, [vendorId, token]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `http://localhost:5000/api/vendor/${vendorId}/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPreviewImage(res.data.imageUrl);
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  if (!vendor) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Image Preview */}
        <img
          src={previewImage || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />

        {/* Upload Button */}
        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          {uploading ? "Uploading..." : "Update Photo"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      {/* Profile Info */}
      <div className="space-y-3 text-gray-700 mt-6">
        <p><strong>Name:</strong> {vendor.fullname} {vendor.surname}</p>
        <p><strong>Email:</strong> {vendor.email}</p>
        <p><strong>Phone:</strong> {vendor.phone || "Not provided"}</p>
        <p><strong>Wallet Address:</strong> {vendor.walletAddress}</p>
        <p><strong>Aadhaar Number:</strong> {vendor.aadhaarNumber}</p>
        <p><strong>Role:</strong> {vendor.role}</p>
        <p><strong>Joined:</strong> {new Date(vendor.createdAt).toDateString()}</p>
      </div>
    </div>
  );
};

export default VendorProfile;
