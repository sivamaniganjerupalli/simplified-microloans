import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  DollarSign,
  Wallet,
  RefreshCw,
  CheckCircle,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  Calculator,
  Radar
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Alert from "../../components/common/Alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../../utils/constants";

const LenderDashboard = () => {
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
        `${API_BASE_URL}/lender/dashboard/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const transactions = (res.data.transactions || []).map((tx) => ({
        ...tx,
        date: tx.date ? new Date(tx.date).toLocaleDateString("en-IN") : new Date(tx.createdAt).toLocaleDateString("en-IN"),
        amount: Number(tx.amount) || 0,
      }));

      setDashboardData({
        ...res.data,
        transactions,
        lenderName: res.data.lenderName || localStorage.getItem("lenderName") || "Lender"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Your Dashboard
            </h3>
            <p className="text-sm text-gray-500">Preparing your portfolio overview...</p>
          </div>
        </div>
      </div>
    );
  }

  const monthlyData = dashboardData?.monthlyPerformance || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      {/* Animated Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white/90">Active Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Welcome, {dashboardData?.lenderName || "Lender"}!
              </h1>
              <p className="text-white/80 text-base sm:text-lg">Monitor your investments and returns</p>
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
          <Alert type="error" message={error} onClose={() => setError("")} className="mb-6" />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Wallet Balance"
            value={dashboardData?.walletBalance || "0.000 ETH"}
            icon={Wallet}
            color="blue"
          />
          <StatCard
            title="Loans Funded"
            value={dashboardData?.loansFunded || "0"}
            subtitle={`${dashboardData?.activeLoans || 0} active`}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Active Vendors"
            value={dashboardData?.activeVendors || "0"}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Total Received"
            value={`${dashboardData?.totalReceived || "0.000"} ETH`}
            subtitle="Repayments received"
            icon={DollarSign}
            color="amber"
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Lending Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Line type="monotone" dataKey="loans" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 4 }} />
                <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={3} dot={{ fill: '#9333ea', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            {monthlyData.length === 0 && (
              <p className="mt-3 text-sm text-gray-500">No lending activity available yet.</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  {
                    title: "View All Loans",
                    subtitle: "Manage your funding pipeline",
                    path: "/lender/loans",
                    className: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white",
                    icon: TrendingUp,
                  },
                  {
                    title: "Risk Analyzer",
                    subtitle: "Run pre-approval stress checks",
                    path: "/lender/risk-analyzer",
                    className: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Yield Planner",
                    subtitle: "Forecast expected earnings",
                    path: "/lender/yield-planner",
                    className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
                    icon: Calculator,
                  },
                  {
                    title: "Opportunity Radar",
                    subtitle: "Scan top scoring deals",
                    path: "/lender/opportunity-radar",
                    className: "bg-gradient-to-r from-slate-800 to-slate-700 text-white",
                    icon: Radar,
                  },
                ].map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.title}
                      onClick={() => navigate(action.path)}
                      className={`w-full group relative overflow-hidden rounded-2xl p-4 text-left hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${action.className}`}
                    >
                      <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{action.title}</p>
                          <p className="text-xs text-white/85">{action.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <ActionIcon className="w-5 h-5" />
                          <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Expected Repayment */}
            {dashboardData?.nextExpectedRepayment && dashboardData.nextExpectedRepayment !== "N/A" && (
              <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 p-6 shadow-xl text-white">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xl">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/90">Next Repayment Expected</p>
                    <p className="text-2xl font-bold mt-1">{dashboardData.nextExpectedRepayment}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
          {dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
            <Table
              columns={[
                { key: 'type', label: 'Type', sortable: true },
                { key: 'date', label: 'Date', sortable: true },
                { 
                  key: 'amount', 
                  label: 'Amount', 
                  sortable: true,
                  render: (value) => `${value?.toFixed(4) || '0.000'} ETH`
                },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (value) => <Badge variant={value === 'Completed' ? 'success' : 'warning'}>{value || 'Pending'}</Badge>
                },
              ]}
              data={dashboardData.transactions.slice(0, 10)}
              striped
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm mt-1">Start lending to see your transaction history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LenderDashboard;
