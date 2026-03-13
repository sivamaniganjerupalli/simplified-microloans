import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  ArrowUpRight,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  PlusCircle
} from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchDashboard = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    if (!userId || !token) {
      setError("You are not logged in. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/vendor/dashboard/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data || {};
      const transactions = (data.transactions || []).map((tx) => ({
        ...tx,
        date: tx.date ? new Date(tx.date).toLocaleDateString("en-IN") : new Date(tx.createdAt).toLocaleDateString("en-IN"),
        amount: Number(tx.amount) || 0,
      }));

      setDashboardData({ 
        ...data, 
        transactions,
        vendorName: data.vendorName || localStorage.getItem("vendorName") || "Vendor"
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Your Dashboard
            </h3>
            <p className="text-sm text-gray-500">Preparing your financial overview...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingLoans = (dashboardData?.loanRequests || 0) - (dashboardData?.activeLoans || 0);
  const repaymentDue = dashboardData?.nextRepaymentDue && dashboardData.nextRepaymentDue !== "N/A"
    ? `Due: ${dashboardData.nextRepaymentDue}`
    : "No active loans";

  const stats = [
    {
      label: "Wallet Balance",
      value: `${dashboardData?.walletBalance || "0.000"} ETH`,
      change: "Live balance",
      trend: "neutral",
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/10"
    },
    {
      label: "Total Loans",
      value: dashboardData?.loanRequests || "0",
      change: `${pendingLoans} pending`,
      trend: pendingLoans > 0 ? "up" : "neutral",
      icon: CreditCard,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/10"
    },
    {
      label: "Active Loans",
      value: dashboardData?.activeLoans || "0",
      change: repaymentDue,
      trend: (dashboardData?.activeLoans || 0) > 0 ? "up" : "neutral",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/20 to-teal-500/10"
    },
    {
      label: "Total Repaid",
      value: `${dashboardData?.totalRepaid || "0.000"} ETH`,
      change: (dashboardData?.totalRepaid && parseFloat(dashboardData.totalRepaid) > 0) ? "Repaid on chain" : "No repayments yet",
      trend: (dashboardData?.totalRepaid && parseFloat(dashboardData.totalRepaid) > 0) ? "up" : "neutral",
      icon: CheckCircle,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/10"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Animated Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white/90">Live Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Welcome, {dashboardData?.vendorName || "Vendor"}!
              </h1>
              <p className="text-white/80 text-base sm:text-lg">Track your loans and manage your finances</p>
            </div>
            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-0 pb-12">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/90 backdrop-blur-xl border border-red-200 shadow-lg animate-slide-down">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
              <button onClick={() => setError("")} className="text-red-600 hover:text-red-800 transition-colors">
                âœ•
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid with Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 hover:border-gray-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/vendor/request-loan")}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-left hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-between text-white">
                    <div className="space-y-1">
                      <p className="font-semibold">Request New Loan</p>
                      <p className="text-xs text-white/80">Get funds in 24 hours</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/loans")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">View All Loans</p>
                      <p className="text-xs text-gray-600">Track your applications</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/transactions")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Transaction History</p>
                      <p className="text-xs text-gray-600">Review your payments</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/easy")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Easy Help</p>
                      <p className="text-xs text-gray-600">Big buttons with voice guidance</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/planner")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Repayment Planner</p>
                      <p className="text-xs text-gray-600">Check weekly payment before loan</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/checklist")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Daily Checklist</p>
                      <p className="text-xs text-gray-600">Simple tasks for every day</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/reminders")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Reminder Center</p>
                      <p className="text-xs text-gray-600">Set daily repayment reminders</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/expense-tracker")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Expense Tracker</p>
                      <p className="text-xs text-gray-600">Track daily cost and net profit</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/vendor/sales-booster")}
                  className="w-full group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-left border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Sales Booster</p>
                      <p className="text-xs text-gray-600">Get smart tips from sales pattern</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Next Repayment */}
            {dashboardData?.nextRepaymentDue && dashboardData.nextRepaymentDue !== "N/A" && (
              <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-6 shadow-xl text-white hover:shadow-2xl transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/90">Next Repayment Due</p>
                    <p className="text-2xl font-bold mt-1">{dashboardData.nextRepaymentDue}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/vendor/transactions")}
                  className="w-full mt-4 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all text-sm font-medium hover:scale-105 transform duration-300"
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Recent Transactions
            </h3>
            
            {!dashboardData?.transactions?.length ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-1">Start by requesting a loan</p>
                <button
                  onClick={() => navigate("/vendor/request-loan")}
                  className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all hover:scale-105"
                >
                  Request Loan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.transactions.slice(0, 5).map((tx, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-transparent border border-gray-200/50 hover:border-gray-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ${
                      tx.type === "Repayment" 
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                        : tx.type === "Loan Credit"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-500"
                    }`}>
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{tx.type}</p>
                      <p className="text-sm text-gray-500">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{tx.amount.toFixed(4)} ETH</p>
                      <p className={`text-xs font-medium ${
                        tx.type === "Repayment" ? "text-blue-600" : "text-emerald-600"
                      }`}>
                        {tx.type === "Repayment" ? "Paid" : "Received"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {dashboardData?.transactions?.length > 5 && (
              <button
                onClick={() => navigate("/vendor/transactions")}
                className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-sm font-medium text-gray-700 hover:scale-105 transform duration-300"
              >
                View All Transactions â†’
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Animations to globals */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VendorDashboard;

