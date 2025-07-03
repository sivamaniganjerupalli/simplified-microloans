// src/components/forms/WalletConnectButton.jsx
import React from "react";
import Button from "../common/Button";

const WalletConnectButton = ({ onConnect }) => {
  const handleClick = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        onConnect(accounts[0]);
      } catch (err) {
        console.error("Wallet connection error:", err);
        alert("Wallet connection failed.");
      }
    } else {
      alert("MetaMask not found. Install it from https://metamask.io/");
    }
  };

  return <Button label="Connect Wallet" onClick={handleClick} />;
};

export default WalletConnectButton;
