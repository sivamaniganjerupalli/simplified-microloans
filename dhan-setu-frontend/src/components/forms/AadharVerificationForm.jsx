// src/components/forms/AadharVerificationForm.jsx
import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const AadharVerificationForm = ({ onVerify }) => {
  const [aadhar, setAadhar] = useState("");

  const handleVerify = () => {
    if (!/^\d{12}$/.test(aadhar)) {
      alert("Aadhar must be 12 digits.");
      return;
    }
    onVerify(aadhar);
  };

  return (
    <div>
      <Input
        id="aadhar"
        label="Enter Aadhar"
        value={aadhar}
        onChange={(e) => setAadhar(e.target.value)}
      />
      <Button label="Verify Aadhar" onClick={handleVerify} />
    </div>
  );
};

export default AadharVerificationForm;
