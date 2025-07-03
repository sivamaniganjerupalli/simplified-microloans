// src/pages/Auth/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    apiKey: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password, role, apiKey } = formData;

    if (!email || !password || !role) {
      setError("Email, password and role are required");
      return;
    }

    const expectedApiKey = process.env.REACT_APP_LENDER_API_KEY;

    if (role === "lender" && apiKey.trim() !== expectedApiKey) {
      setError("Invalid API Key");
      return;
    }

    const endpoint =
      role === "lender"
        ? "http://localhost:5000/api/lender/login"
        : "http://localhost:5000/api/vendor/login";

    const payload = { email, password, role };
    if (role === "lender") {
      payload.apiKey = apiKey;
    }

    try {
      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        const { token, role, userId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);

        if (role === "vendor") navigate("/vendor");
        else if (role === "lender") navigate("/lender");
        else navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? "You are not registered. Please register first."
          : "Login error");
      setError(errMsg);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded">
          <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Select
              id="role"
              label="Login As"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Role" },
                { value: "vendor", label: "Vendor" },
                { value: "lender", label: "Lender" },
              ]}
              required
            />

            <Input
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {formData.role === "lender" && (
              <Input
                id="apiKey"
                label="API Key"
                type="text"
                value={formData.apiKey}
                onChange={handleChange}
                required
              />
            )}

            <Button type="submit" label="Login" />

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
