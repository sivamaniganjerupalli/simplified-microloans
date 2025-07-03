import React, { useEffect, useState } from "react";
import axios from "axios";

const LenderTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/lender/transactions/${lenderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const txs = response.data.transactions || [];

        // Log any transactions with missing or invalid date
        txs.forEach((tx) => {
          if (!tx.date && !tx.createdAt) {
            console.warn("Missing valid date for transaction:", tx);
          }
        });

        setTransactions(txs);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    if (lenderId && token) {
      fetchTransactions();
    } else {
      setError("Unauthorized access.");
      setLoading(false);
    }
  }, [lenderId, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <p className="p-4 text-center">Loading transactions...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No transactions found.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{formatDate(tx.date || tx.createdAt)}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {tx.amount} ETH
                  </td>
                  <td className="px-4 py-2 capitalize">{tx.type}</td>
                  <td className="px-4 py-2">{tx.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LenderTransactions;
