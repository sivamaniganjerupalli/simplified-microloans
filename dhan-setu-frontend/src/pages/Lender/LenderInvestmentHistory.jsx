// src/pages/Lender/LenderInvestmentHistory.jsx
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, Calendar, ArrowUpRight, Filter, Search, Coins, Wallet, BadgeCheck, Layers3 } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const LenderInvestmentHistory = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchInvestmentHistory = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId || !token) {
        setError("Please login to view investment history.");
        setInvestments([]);
        return;
      }
      const res = await axios.get(
        `${API_BASE_URL}/lender/${userId}/investments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvestments(res.data.investments || []);
      setError("");
    } catch (err) {
      setInvestments([]);
      setError(err.response?.data?.message || "Failed to load investment history");
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchInvestmentHistory();
  }, [fetchInvestmentHistory]);

  const filteredInvestments = investments.filter((inv) => {
    const matchesStatus = filter === "all" || inv.status.toLowerCase() === filter;
    const matchesSearch = inv.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalInvested: investments.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0),
    totalReturns: investments.reduce((sum, inv) => sum + (parseFloat(inv.returns) || 0), 0),
    activeLoans: investments.filter(inv => inv.status === "Active").length,
    completedLoans: investments.filter(inv => inv.status === "Repaid").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-300/35 border-t-cyan-300 rounded-full animate-spin mx-auto" />
          <p className="text-slate-300">Loading investment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {error && (
          <div className="rounded-2xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-[#0d2f48] to-[#25335a] p-8">
          <div className="absolute -top-16 -right-12 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
          <p className="text-xs font-semibold text-cyan-200 uppercase tracking-wide">Investment Tracking</p>
          <h1 className="text-4xl font-bold text-white mt-2">Investment History</h1>
          <p className="text-slate-200 mt-1">Complete record of all your loans and realized returns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Invested", value: `${stats.totalInvested.toFixed(3)} ETH`, icon: Wallet },
            { label: "Total Returns", value: `${stats.totalReturns.toFixed(3)} ETH`, icon: Coins },
            { label: "Active Loans", value: stats.activeLoans, icon: Layers3 },
            { label: "Completed", value: stats.completedLoans, icon: BadgeCheck },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
            <div
              key={i}
              className="bg-slate-900/55 rounded-2xl p-6 shadow-lg border border-cyan-300/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-100 mt-2">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-300/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-cyan-300" />
                </div>
              </div>
            </div>
          );})}
        </div>

        {/* Filters */}
        <div className="bg-slate-900/55 rounded-2xl p-6 shadow-lg border border-cyan-300/20 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search by vendor name
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-xl border border-cyan-300/20 focus:border-cyan-400 focus:outline-none bg-slate-950/40 text-slate-100"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-cyan-300/20 focus:border-cyan-400 focus:outline-none bg-slate-950/40 text-slate-100"
              >
                <option value="all">All Loans</option>
                <option value="active">Active</option>
                <option value="repaid">Repaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Investment Table */}
        <div className="bg-slate-900/55 rounded-2xl shadow-lg border border-cyan-300/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/60 border-b border-cyan-300/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-100">Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-100">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-100">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-100">Returns</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-100">ROI</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-300/10">
                {filteredInvestments.map((inv, i) => (
                  <tr
                    key={i}
                    className="hover:bg-cyan-900/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {inv.vendor.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-100">{inv.vendor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-200">{inv.amount} ETH</td>
                    <td className="px-6 py-4 text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <ArrowUpRight className="w-4 h-4" />
                        +{inv.returns} ETH
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-300" />
                        <span className="font-semibold text-cyan-300">{inv.roi}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        inv.status === "Repaid"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-300/25"
                          : "bg-amber-500/20 text-amber-300 border border-amber-300/25"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvestments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-300 font-medium">No investments found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LenderInvestmentHistory;
