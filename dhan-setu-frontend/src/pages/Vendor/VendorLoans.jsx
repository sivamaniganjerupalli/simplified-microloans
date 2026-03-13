// Modern Vendor Loans - Save as src/pages/Vendor/VendorLoans_NEW.jsx
// After testing, rename to VendorLoans.jsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  DollarSign,
  CalendarDays
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/constants";

const VendorLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const statusColors = {
    Approved: { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle },
    Pending: { bg: "bg-gradient-to-br from-amber-50 to-orange-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
    Rejected: { bg: "bg-gradient-to-br from-red-50 to-pink-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
    Repaid: { bg: "bg-gradient-to-br from-blue-50 to-cyan-50", text: "text-blue-700", border: "border-blue-200", icon: CheckCircle },
  };

  const fetchLoans = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    if (!userId || !token) {
      setError("You are not logged in. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/vendor/loans/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("ðŸš€ Loans fetched:", res.data.loans);
      setLoans(res.data.loans || []);
      setError("");
    } catch (err) {
      console.error("âŒ Error fetching loans:", err);
      setError(err.response?.data?.message || "Failed to fetch loans");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mappedLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        const matchesSearch =
          loan.lenderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || loan.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .map((loan) => ({
        ...loan,
        requestedDate: new Date(loan.createdAt).toLocaleDateString("en-IN"),
        approvedDate: loan.approvedAt
          ? new Date(loan.approvedAt).toLocaleDateString("en-IN")
          : "N/A",
      }));
  }, [loans, searchTerm, statusFilter]);

  const stats = [
    { label: "Total Loans", value: loans.length, gradient: "from-blue-500 to-cyan-500" },
    { label: "Approved", value: loans.filter(l => l.status === "Approved").length, gradient: "from-emerald-500 to-teal-500" },
    { label: "Pending", value: loans.filter(l => l.status === "Pending").length, gradient: "from-amber-500 to-orange-500" },
    { label: "Repaid", value: loans.filter(l => l.repaid).length, gradient: "from-purple-500 to-pink-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Loading Loans...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Loans</h1>
              </div>
              <p className="text-white/80 text-lg">Track and manage your loan applications</p>
            </div>
            <button
              onClick={() => fetchLoans(true)}
              disabled={refreshing}
              className="p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-0 pb-12">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/90 backdrop-blur-xl border border-red-200 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-900 flex-1">{error}</p>
              <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">âœ•</button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-500`} />
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-900/10 to-slate-900/0" />
              <div className="relative space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700">{stat.label}</p>
                <p className="text-4xl leading-none font-extrabold text-slate-950 tracking-tight drop-shadow-sm">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by lender name or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Approved", "Pending", "Rejected", "Repaid"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-white/90 backdrop-blur-xl border border-gray-200 text-gray-700 hover:border-indigo-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loans Grid */}
        {mappedLoans.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No loans found</p>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "All" 
                ? "Try adjusting your filters" 
                : "Start by requesting your first loan"}
            </p>
            <button
              onClick={() => navigate("/vendor/request-loan")}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-2xl transition-all hover:scale-105"
            >
              Request New Loan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mappedLoans.map((loan, idx) => {
              const statusConfig = statusColors[loan.status] || statusColors.Pending;
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={loan._id}
                  className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-0 right-0 m-4 px-4 py-2 rounded-2xl ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} backdrop-blur-xl flex items-center gap-2 font-semibold text-sm shadow-lg`}>
                    <StatusIcon className="w-4 h-4" />
                    {loan.status}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Lender Info */}
                    <div className="pr-24">
                      <p className="text-sm text-gray-500 mb-1">Lender</p>
                      <p className="text-xl font-bold text-gray-900">{loan.lenderName || "Unknown"}</p>
                    </div>

                    {/* Amount */}
                    <div className="flex items-baseline gap-2">
                      <DollarSign className="w-6 h-6 text-indigo-600" />
                      <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {loan.amount}
                      </span>
                      <span className="text-xl text-gray-500">ETH</span>
                    </div>

                    {/* Purpose */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent border border-gray-200/50">
                      <p className="text-sm text-gray-500 mb-1">Purpose</p>
                      <p className="text-gray-900 font-medium">{loan.purpose || "N/A"}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <CalendarDays className="w-4 h-4" />
                          <span>Requested</span>
                        </div>
                        <p className="text-gray-900 font-semibold">{loan.requestedDate}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Approved</span>
                        </div>
                        <p className="text-gray-900 font-semibold">{loan.approvedDate}</p>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
                      <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        <span className="text-lg font-bold text-indigo-600">{loan.interestRate}%</span>
                      </div>
                    </div>

                    {/* Repayment Status */}
                    {loan.repaid && (
                      <div className="flex items-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">Fully Repaid</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VendorLoans;

