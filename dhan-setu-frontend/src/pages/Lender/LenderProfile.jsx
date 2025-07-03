import React, { useEffect, useState } from "react";
import axios from "axios";

const LenderProfile = () => {
  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [lender, setLender] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLender = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lender/profile/${lenderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.data) {
          setLender(res.data.data);
          setPreviewImage(res.data.data.profileImage || "/default-avatar.png");
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Failed to load lender", err);
        setError("Unable to load profile. Please try again.");
      }
    };

    if (lenderId && token) {
      fetchLender();
    } else {
      setError("Missing authentication. Please login again.");
    }
  }, [lenderId, token]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `http://localhost:5000/api/lender/upload-photo/${lenderId}`,
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
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (error) {
    return <p className="text-red-500 p-4 text-center">{error}</p>;
  }

  if (!lender) {
    return <p className="p-4 text-center">Loading profile...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
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
        <p><strong>Name:</strong> {lender.fullname} {lender.surname}</p>
        <p><strong>Email:</strong> {lender.email}</p>
        <p><strong>Phone:</strong> {lender.phone || "Not provided"}</p>
        <p><strong>Wallet Address:</strong> {lender.walletAddress}</p>
        <p><strong>Country:</strong> {lender.country || "India"}</p>
        <p><strong>Role:</strong> {lender.role}</p>
        <p><strong>Joined:</strong> {new Date(lender.createdAt).toDateString()}</p>
      </div>
    </div>
  );
};

export default LenderProfile;
