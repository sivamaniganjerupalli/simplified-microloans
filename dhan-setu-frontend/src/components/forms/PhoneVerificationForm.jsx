// src/components/forms/PhoneVerificationForm.jsx
import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const PhoneVerificationForm = ({ onVerify }) => {
  const [phone, setPhone] = useState("");

  const handleVerify = () => {
    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }
    onVerify(phone);
  };

  return (
    <div>
      <Input
        id="phone"
        label="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button label="Verify Phone" onClick={handleVerify} />
    </div>
  );
};

export default PhoneVerificationForm;
