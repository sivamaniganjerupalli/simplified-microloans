// src/components/common/Button.jsx
import React from 'react';

const Button = ({ label, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
