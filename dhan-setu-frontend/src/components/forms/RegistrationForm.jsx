import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";

const RegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    surname: "",
    email: "",
    aadhaarNumber: "",  // ✅ Corrected field name
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    walletAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Debug log (optional):
    console.log("Submitting Form Data:", formData);

    onSubmit(formData);
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setFormData((prev) => ({ ...prev, walletAddress }));
        alert(`Wallet connected: ${walletAddress}`);
      }
    } catch (err) {
      console.error("MetaMask connection failed", err);
      alert("Failed to connect wallet.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="fullname" label="Full Name" value={formData.fullname} onChange={handleChange} />
        <Input id="surname" label="Surname" value={formData.surname} onChange={handleChange} />
        <Input id="email" type="email" label="Email" value={formData.email} onChange={handleChange} />
        
        {/* ✅ Corrected Aadhaar field ID */}
        <Input id="aadhaarNumber" label="Aadhaar Number" value={formData.aadhaarNumber} onChange={handleChange} />

        <Input id="phone" label="Phone" value={formData.phone} onChange={handleChange} />
        <Input id="password" type="password" label="Password" value={formData.password} onChange={handleChange} />
        <Input id="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-grow">
            <Input
              id="walletAddress"
              label="Wallet Address"
              value={formData.walletAddress}
              onChange={handleChange}
              disabled
            />
          </div>
          <Button type="button" label="Connect Wallet" onClick={handleConnectWallet} />
        </div>

        <Select
          id="role"
          label="Register As"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: "vendor", label: "Vendor" },
            { value: "lender", label: "Lender" },
          ]}
        />

        <Button type="submit" label="Register" />
      </form>
    </div>
  );
};

export default RegistrationForm;
