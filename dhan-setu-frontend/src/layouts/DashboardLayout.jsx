// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `block px-2 py-2 rounded hover:bg-blue-200 ${
      isActive ? "bg-blue-300 font-bold" : "text-blue-800"
    }`;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-100 shadow-md p-4 flex flex-col justify-between">
        <nav className="space-y-2">
          {role === "vendor" && (
            <>
              <NavLink to="/vendor" end className={linkStyle}>Dashboard</NavLink>
              <NavLink to="/vendor/loans" className={linkStyle}>Loans</NavLink>
              <NavLink to="/vendor/transactions" className={linkStyle}>Transactions</NavLink>
              <NavLink to="/vendor/settings" className={linkStyle}>Settings</NavLink>
              <NavLink to="/vendor/profile" className={linkStyle}>Profile</NavLink>
              <NavLink to="/vendor/help" className={linkStyle}>Help</NavLink>
            </>
          )}

          {role === "lender" && (
            <>
              <NavLink to="/lender" end className={linkStyle}>Dashboard</NavLink>
              <NavLink to="/lender/loans" className={linkStyle}>Loan Requests</NavLink>
              <NavLink to="/lender/transactions" className={linkStyle}>Transactions</NavLink>
              <NavLink to="/lender/settings" className={linkStyle}>Settings</NavLink>
              <NavLink to="/lender/profile" className={linkStyle}>Profile</NavLink>
              <NavLink to="/lender/help" className={linkStyle}>Help</NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="p-6 flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
