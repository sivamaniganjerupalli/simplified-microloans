// src/components/common/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Loader;
