import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    // Watch for localStorage changes (even across tabs)
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div className="text-xl font-bold text-blue-600">DhanSetu</div>

      <div className="flex space-x-4 items-center">
        {role === "vendor" && (
          <>
            <NavLink to="/vendor" className="text-gray-700">Dashboard</NavLink>
            <NavLink to="/vendor/loans" className="text-gray-700">Loans</NavLink>
            <NavLink to="/vendor/settings" className="text-gray-700">Settings</NavLink>
          </>
        )}

        {role === "lender" && (
          <>
            <NavLink to="/lender" className="text-gray-700">Dashboard</NavLink>
            <NavLink to="/lender/loans" className="text-gray-700">Loans</NavLink>
            <NavLink to="/lender/settings" className="text-gray-700">Settings</NavLink>
          </>
        )}

        {!role && (
          <>
            <NavLink to="/" className="text-gray-700">Home</NavLink>
            <NavLink to="/register" className="text-gray-700">Register</NavLink>
            <NavLink to="/login" className="text-gray-700">Login</NavLink>
          </>
        )}

                {role && (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
