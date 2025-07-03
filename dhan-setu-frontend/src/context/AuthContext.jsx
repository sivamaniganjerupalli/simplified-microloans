// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error("Wallet connection error", error);
      }
    } else {
      alert("Install MetaMask to connect your wallet.");
    }
  };

  return (
    <AuthContext.Provider value={{ walletAddress, connectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};
