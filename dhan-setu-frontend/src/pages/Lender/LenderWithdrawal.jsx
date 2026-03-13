// src/pages/Lender/LenderWithdrawal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Wallet, CheckCircle, AlertCircle, ArrowRight, DollarSign } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const LenderWithdrawal = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.0000 ETH");
  const [availableToWithdraw, setAvailableToWithdraw] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        if (!userId || !token) return;
        const res = await axios.get(`${API_BASE_URL}/lender/portfolio/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success) {
          setWalletBalance(res.data.walletBalance || "0.0000 ETH");
          setAvailableToWithdraw(Number(res.data.availableToWithdraw || 0));
          if (res.data.walletAddress) {
            setWalletAddress(res.data.walletAddress);
          }
        }
      } catch (err) {
        console.error("Failed to load withdrawal summary:", err.message);
      }
    };

    fetchPortfolio();
  }, [token, userId]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!walletAddress) {
      setError("Please enter a wallet address");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/lender/${userId}/withdrawal`,
        {
          amount: parseFloat(withdrawalAmount),
          destinationWallet: walletAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setTransactionHash(res.data.transactionHash);
      setAvailableToWithdraw(Number(res.data.availableToWithdraw || 0));
      setWithdrawalAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Manage Funds</p>
          <h1 className="text-4xl font-bold text-gray-900">Withdraw Funds</h1>
          <p className="text-gray-600">Transfer your earnings to your wallet</p>
          <p className="text-sm text-gray-700">Wallet Balance: <span className="font-semibold">{walletBalance}</span></p>
          <p className="text-sm text-gray-700">Available to Withdraw: <span className="font-semibold">{availableToWithdraw.toFixed(4)} ETH</span></p>
        </div>

        {/* Success State */}
        {success && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-3xl p-8 mb-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-emerald-200">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-900">Withdrawal Initiated!</h3>
                <p className="text-emerald-800 mt-1">Your withdrawal request has been processed.</p>
                {transactionHash && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="text-xs text-emerald-700 font-medium">Transaction Hash:</p>
                    <p className="text-xs text-gray-600 break-all font-mono">{transactionHash}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50">
          <form onSubmit={handleWithdrawal} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Withdrawal Amount (ETH)
                </div>
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount in ETH"
                step="0.001"
                min="0"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none bg-gray-50 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Wallet Address Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  Destination Wallet Address
                </div>
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:outline-none bg-gray-50 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Make sure this is a valid Ethereum wallet address</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Fee Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-900"><span className="font-semibold">Network Fee:</span> Standard ETH gas fees apply</p>
              <p className="text-sm text-blue-800 mt-2">Processing time: 5-30 minutes depending on network congestion</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Withdrawal Submitted
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Withdraw Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200/50">
          <h3 className="font-bold text-gray-900 mb-4">Before You Withdraw</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Ensure you have sufficient balance available for withdrawal</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Double-check the wallet address - transactions cannot be reversed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Network fees will be deducted automatically</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LenderWithdrawal;
