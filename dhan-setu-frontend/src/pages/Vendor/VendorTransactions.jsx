import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";

const VendorTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!vendorId || !token) throw new Error("User not logged in.");

        const res = await axios.get(
          `http://localhost:5000/api/vendor/dashboard/${vendorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const transactions = res.data.transactions || [];

        const txs = transactions
          .filter((tx) => tx.amount !== undefined)
          .map((tx) => {
            const amount = parseFloat(tx.amount);
            return {
              amount: !isNaN(amount) ? amount : null,
              date: tx.date || "—",
              type: tx.type || "—",
            };
          });

        setTransactions(txs);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [vendorId, token]);

  const handleRepay = async (transaction) => {
    const confirm = window.confirm(
      `Do you want to repay ${transaction.amount} ETH for the transaction on ${transaction.date}?`
    );
    if (!confirm) return;

    try {
      if (!window.ethereum) {
        toast.error("MetaMask not found. Please install it.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const amount = transaction.amount;
      if (!amount || isNaN(amount) || amount <= 0) {
        toast.error("Invalid transaction amount");
        return;
      }

      const tx = await signer.sendTransaction({
        to: "0xe7Fe68d35Bd922f9f9795e5B29c498a71f0C01b3", // ✅ Replace with actual recipient
        value: ethers.parseEther(amount.toString()),
      });

      toast.info("Transaction submitted...");
      await tx.wait();

      toast.success("Repayment successful!");

      // ✅ Send repayment info to backend
      const response = await axios.post(
        "http://localhost:5000/api/vendor/repay",
        {
          vendorId,
          amount,
          transactionHash: tx.hash,
          date: new Date().toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Repayment recorded in backend.");

        // Update local state to show as repaid
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.date === transaction.date ? { ...tx, type: "Repayment" } : tx
          )
        );
      } else {
        toast.warn("Repayment sent but failed to update backend.");
      }
    } catch (err) {
      console.error("Repayment Error:", err);
      toast.error("Repayment failed. See console for details.");
    }
  };

  const handleManualRepay = () => {
    const dummyTx = {
      amount: 0.1,
      date: new Date().toISOString().split("T")[0],
      type: "Loan Credit",
    };
    handleRepay(dummyTx);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleManualRepay}
        >
          Repay Loan
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount (ETH)</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">
                    {typeof tx.amount === "number" && !isNaN(tx.amount)
                      ? `${tx.amount.toFixed(3)} ETH`
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{tx.type}</td>
                  <td className="px-4 py-2">
                    {tx.type === "Loan Credit" &&
                    typeof tx.amount === "number" &&
                    !isNaN(tx.amount) ? (
                      <button
                        className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                        onClick={() => handleRepay(tx)}
                      >
                        Repay
                      </button>
                    ) : tx.type === "Loan Request" ? (
                      <span className="text-sm text-yellow-600">
                        Awaiting Approval
                      </span>
                    ) : tx.type === "Repayment" ? (
                      <span className="text-sm text-green-600">Paid</span>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorTransactions;
