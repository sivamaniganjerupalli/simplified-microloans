// src/components/progress/StepIndicator.jsx
import React from "react";

const StepIndicator = ({ step }) => {
  const stepTitles = {
    1: "Basic Info",
    2: "Aadhar Verification",
    3: "Phone Verification",
    4: "Wallet Connection",
    5: "Completed",
  };

  return (
    <div className="text-center text-sm text-gray-600 mb-2">
      Step {step}: {stepTitles[step] || "Progressing..."}
    </div>
  );
};

export default StepIndicator;
