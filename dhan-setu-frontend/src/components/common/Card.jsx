import React from "react";

const Card = ({ title, content, color = "bg-white" }) => {
  return (
    <div className={`rounded-xl shadow p-4 ${color}`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">{content}</p>
    </div>
  );
};

export default Card;
