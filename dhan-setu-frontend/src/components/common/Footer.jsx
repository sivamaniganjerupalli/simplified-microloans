// src/components/common/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
      © {new Date().getFullYear()} DhanSetu. All rights reserved.
    </footer>
  );
};

export default Footer;
