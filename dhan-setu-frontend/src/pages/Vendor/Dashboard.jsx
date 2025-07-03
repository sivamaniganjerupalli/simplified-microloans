import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/common/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!userId || !token) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/vendor/dashboard/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(res.data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to fetch dashboard data.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId, token]);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!dashboardData) return null;

  const {
    walletBalance = 0,
    loanRequests = 0,
    activeLoans = 0,
    lastLoanApproved = { amount: 0, date: "N/A" },
    nextRepaymentDue = "N/A",
    totalRepaid = 0,
    transactions = [],
  } = dashboardData;

  const stats = [
    { title: "Wallet Balance", content: `${walletBalance} ETH`, color: "bg-blue-100" },
    { title: "Loan Requests", content: loanRequests.toString(), color: "bg-yellow-100" },
    { title: "Active Loans", content: activeLoans.toString(), color: "bg-green-100" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, Vendor</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} title={stat.title} content={stat.content} color={stat.color} />
        ))}
      </div>

        {/* Loan Summary */}
         <div className="mt-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Loan Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
              <h3 className="text-sm text-gray-500 mb-1">Last Loan Approved</h3>
              <p className="text-lg font-medium text-gray-800">
                {lastLoanApproved.amount} ETH
              </p>
              <p className="text-sm text-gray-400">on {lastLoanApproved.date}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
              <h3 className="text-sm text-gray-500 mb-1">Next Repayment Due</h3>
               <p className="text-lg font-medium text-gray-800">{nextRepaymentDue}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
              <h3 className="text-sm text-gray-500 mb-1">Total Repaid</h3>
               <p className="text-lg font-medium text-gray-800">{totalRepaid} ETH</p>
            </div>
          </div>
        </div>


      {/* Chart Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Loan & Repayment History</h2>
        {transactions.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit=" ETH" />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600">No transactions yet.</p>
        )}
      </div>

      {/* Recent Transactions Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.type}</td>
                  <td className="px-4 py-2">{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default VendorDashboard;
