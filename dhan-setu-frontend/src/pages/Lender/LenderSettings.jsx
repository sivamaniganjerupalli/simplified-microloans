import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const LenderSettings = () => {
  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [lender, setLender] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchLender = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/lender/profile/${lenderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLender(response.data.data);
        setPhone(response.data.data.phone || "");
        setLanguage(response.data.data.language || "English");
        setTheme(response.data.data.theme || "light");
        setEmailNotifications(response.data.data.notifyByEmail);
        setSmsNotifications(response.data.data.notifyBySMS);
      } catch (error) {
        console.error("Error fetching lender details", error);
        setError("Failed to load lender details.");
      }
    };

    if (lenderId && token) fetchLender();
  }, [lenderId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!newPassword && !phone && !language && !theme) {
      setError("At least one field should be updated.");
      return;
    }

    try {
      const updatedData = {
        password: newPassword,
        phone,
        language,
        theme,
        notifyByEmail: emailNotifications,
        notifyBySMS: smsNotifications,
      };

      const response = await axios.put(
        `http://localhost:5000/api/lender/update/${lenderId}`, 
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedLender = response.data.data;
        setSuccessMessage("Your settings have been updated.");
        // Reset form fields on success
        setLender(updatedLender);
        setPhone(updatedLender.phone || "");
        setNewPassword("");
        setConfirmPassword("");
        setPhone(response.data.data.phone || "");
      }
    } catch (err) {
      console.error("Error updating settings", err);
      setError("Failed to update settings.");
    }
  };

  if (error) {
    return <p className="text-red-500 p-4 text-center">{error}</p>;
  }

  if (successMessage) {
    return <p className="text-green-500 p-4 text-center">{successMessage}</p>;
  }

  if (!lender) {
    return <p className="p-4 text-center">Loading lender details...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
      <div className="bg-white shadow p-4 rounded space-y-4">
        {/* Lender Details (non-editable) */}
        <div className="space-y-2">
          <Input label="Email" value={lender.email} disabled />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Language Preference */}
        <div className="space-y-2">
          <label className="text-gray-700">Language Preference</label>
          <select
            className="w-full p-2 border rounded-md"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </div>

        {/* Theme Preference */}
        <div className="space-y-2">
          <label className="text-gray-700">Theme Preference</label>
          <select
            className="w-full p-2 border rounded-md"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Email Notifications */}
        <div className="space-y-2">
          <label className="text-gray-700">Email Notifications</label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            className="mr-2"
          />
          Enable Email Notifications
        </div>

        {/* SMS Notifications */}
        <div className="space-y-2">
          <label className="text-gray-700">SMS Notifications</label>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={() => setSmsNotifications(!smsNotifications)}
            className="mr-2"
          />
          Enable SMS Notifications
        </div>

        {/* Update Button */}
        <Button label="Update Settings" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default LenderSettings;
