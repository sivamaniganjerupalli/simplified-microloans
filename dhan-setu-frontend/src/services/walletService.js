export const connectWallet = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed.");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (err) {
    console.error("Wallet connection failed:", err);
    throw err;
  }
};
