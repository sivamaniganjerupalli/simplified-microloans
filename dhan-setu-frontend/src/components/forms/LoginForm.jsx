// src/components/forms/LoginForm.jsx
import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="email" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input id="password" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" label="Login" />
    </form>
  );
};

export default LoginForm;
