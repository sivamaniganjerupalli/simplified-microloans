// src/pages/Lender/LenderPortfolio.jsx
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, PieChart, BarChart3, Activity, Wallet, Target } from "lucide-react";
import { PieChart as RechartsPI, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { API_BASE_URL } from "../../utils/constants";

const LenderPortfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId || !token) {
        setPortfolioData(null);
        setError("Please login to view portfolio");
        return;
      }
      const res = await axios.get(
        `${API_BASE_URL}/lender/portfolio/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPortfolioData(res.data?.success ? res.data : null);
      setError("");
    } catch (err) {
      setError("Failed to load portfolio data");
      console.error(err);
      setPortfolioData(null);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const emptyPortfolio = {
    walletBalance: "0.0000 ETH",
    totalInvested: "0.0000 ETH",
    totalReturns: "0.0000 ETH",
    returnPercentage: "0.00%",
    activeLoans: 0,
    completedLoans: 0,
    distribution: [
      { name: "Small Loans (< 5 ETH)", value: 0 },
      { name: "Medium Loans (5-10 ETH)", value: 0 },
      { name: "Large Loans (> 10 ETH)", value: 0 },
    ],
    monthlyPerformance: [],
  };

  const colors = ["#2563eb", "#9333ea", "#7c3aed"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const data = portfolioData || emptyPortfolio;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {error && (
          <div className="rounded-2xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Portfolio Overview</p>
          <h1 className="text-4xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600">Comprehensive analysis of your lending portfolio and returns</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wallet, label: "Wallet Balance", value: data.walletBalance, color: "blue" },
            { icon: Target, label: "Total Invested", value: data.totalInvested, color: "purple" },
            { icon: TrendingUp, label: "Total Returns", value: data.totalReturns, color: "emerald" },
            { icon: Activity, label: "Return %", value: data.returnPercentage, color: "amber" },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  metric.color === 'emerald' ? 'bg-emerald-100' :
                  'bg-amber-100'
                }`}>
                  <metric.icon className={`w-6 h-6 ${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    metric.color === 'emerald' ? 'text-emerald-600' :
                    'text-amber-600'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution Pie Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Loan Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPI>
                <Pie
                  data={data.distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </RechartsPI>
            </ResponsiveContainer>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Monthly Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="returns" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="invested" stroke="#9333ea" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
            {(!data.monthlyPerformance || data.monthlyPerformance.length === 0) && (
              <p className="text-sm text-gray-500 mt-2">No investment activity yet.</p>
            )}
          </div>
        </div>

        {/* Loan Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Loans</p>
                <p className="text-4xl font-bold mt-2">{data.activeLoans}</p>
              </div>
              <Activity className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed Loans</p>
                <p className="text-4xl font-bold mt-2">{data.completedLoans}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LenderPortfolio;
