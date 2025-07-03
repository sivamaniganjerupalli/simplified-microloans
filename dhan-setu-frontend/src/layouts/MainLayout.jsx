// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet /> {/* <-- This renders the child route content */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
