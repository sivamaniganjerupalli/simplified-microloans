// src/components/common/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">DhanSetu</Link>
      </h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
