// src/components/common/Select.jsx
import React from 'react';

const Select = ({ label, id, options = [], value, onChange, className = "", ...rest }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block mb-1 font-medium text-gray-700">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 ${className}`}
        {...rest}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
