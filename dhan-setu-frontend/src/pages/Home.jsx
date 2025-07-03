// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

// Images
import home1 from "../assets/images/home1.png"; // Main image
import home2 from "../assets/images/home2.png";
import home3 from "../assets/images/home3.png";
import home4 from "../assets/images/home4.png";
import home5 from "../assets/images/home5.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-white px-4 py-10">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-6xl mx-auto">
          {/* Left Text */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Dhan Setu</h1>
            <p className="text-gray-700 mb-6 text-lg">
              Dhan Setu is a blockchain-powered platform that simplifies microloan access for street vendors and small-scale entrepreneurs. 
              By bridging the financial gap between underbanked vendors and responsible lenders, we foster economic inclusion and trust.
              <br /><br />
              Vendors can apply for loans seamlessly using Aadhaar and mobile verification, while lenders enjoy real-time transparency and security through blockchain technology.
              <br /><br />
              Our mission is to empower India's informal economy by providing a digital-first, secure, and fair lending ecosystem — making financial empowerment not just a dream, but a reality for every hardworking vendor.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>

          {/* Right Main Image */}
          <div className="flex-1">
            <img src={home1} alt="Main" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
          </div>
        </section>
          {/* Features Section - Enhanced Vertical */}
<section className="mt-20 max-w-5xl mx-auto px-4">
  <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">How Dhan Setu Empowers</h2>
  <div className="flex flex-col gap-10">
    
    {/* Feature 1 */}
    <div className="flex items-start gap-6 p-8 bg-gray-100 rounded-2xl shadow-md">
      <img src={home2} alt="Vendor-Friendly" className="w-20 h-20 object-contain" />
      <div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">Vendor-Friendly</h3>
        <p className="text-gray-700 text-base leading-relaxed">
          Street vendors often lack access to traditional banking systems. Dhan Setu changes that by enabling them to apply for loans easily using Aadhaar and mobile number verification. The user-friendly interface is designed with low-tech users in mind, ensuring that anyone can apply for credit without hassle.
        </p>
      </div>
    </div>

    {/* Feature 2 */}
    <div className="flex items-start gap-6 p-8 bg-gray-100 rounded-2xl shadow-md">
      <img src={home3} alt="Instant Loan Access" className="w-20 h-20 object-contain" />
      <div>
        <h3 className="text-2xl font-bold text-blue-700 mb-2">Instant Loan Access</h3>
        <p className="text-gray-700 text-base leading-relaxed">
          Once a vendor applies, verified lenders can review and approve loan requests instantly. The backend is powered by smart contracts and blockchain integration, making the approval process seamless, fast, and error-free.
        </p>
      </div>
    </div>

    {/* Feature 3 */}
    <div className="flex items-start gap-6 p-8 bg-gray-100 rounded-2xl shadow-md">
      <img src={home4} alt="Blockchain Secured" className="w-20 h-20 object-contain" />
      <div>
        <h3 className="text-2xl font-bold text-yellow-600 mb-2">Blockchain Secured</h3>
        <p className="text-gray-700 text-base leading-relaxed">
          All transactions and loan records are stored on the blockchain, ensuring transparency and immutability. This builds trust between lenders and borrowers, eliminates fraud, and offers an auditable system for every transaction that takes place.
        </p>
      </div>
    </div>

    {/* Feature 4 */}
    <div className="flex items-start gap-6 p-8 bg-gray-100 rounded-2xl shadow-md">
      <img src={home5} alt="Microloan Simplicity" className="w-20 h-20 object-contain" />
      <div>
        <h3 className="text-2xl font-bold text-purple-700 mb-2">Microloan Simplicity</h3>
        <p className="text-gray-700 text-base leading-relaxed">
          Even a small amount like ₹500 or ₹1000 can be a game-changer for a vendor. Dhan Setu simplifies this process, breaking down barriers by enabling microloan approval, tracking, and repayment — all within a single secure digital platform.
        </p>
      </div>
    </div>

  </div>
</section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
