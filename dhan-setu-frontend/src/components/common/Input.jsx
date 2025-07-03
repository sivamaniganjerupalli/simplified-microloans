// src/components/common/Input.jsx
import React from 'react';

const Input = ({ label, id, type = "text", value, onChange, placeholder, className = "", ...rest }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block mb-1 font-medium text-gray-700">{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
