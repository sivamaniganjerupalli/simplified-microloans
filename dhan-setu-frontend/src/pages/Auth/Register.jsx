import React from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../../components/forms/RegistrationForm";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
  try {
    const { role, ...rest } = formData;
    const endpoint = role === "lender" 
      ? "http://localhost:5000/api/lender/register"
      : "http://localhost:5000/api/vendor/register";

    const response = await axios.post(endpoint, rest);

    if (response.data.success) {
      alert("Registration successful! Please verify your email.");
      navigate("/verify-otp", { state: { email: rest.email } });
    } else {
      alert(response.data.message || "Registration failed");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Error during registration");
  }
};


  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Register as Vendor or Lender
          </h2>
          <RegistrationForm onSubmit={handleRegister} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
