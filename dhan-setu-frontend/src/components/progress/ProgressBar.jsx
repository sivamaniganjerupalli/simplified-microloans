// src/components/progress/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ step }) => {
  const stepWidth = {
    1: "w-1/5",
    2: "w-2/5",
    3: "w-3/5",
    4: "w-4/5",
    5: "w-full",
  };

  const widthClass = stepWidth[step] || "w-1/5";

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
      <div
        className={`h-4 bg-green-500 rounded-full transition-all duration-500 ${widthClass}`}
      ></div>
    </div>
  );
};

export default ProgressBar;
