// src/pages/lender/LenderTransactions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownLeft, ArrowUpRight, BadgeIndianRupee, Search, Filter, Activity } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

/* -------------------------- Helper: direction mapping -------------------------- */

/**
 * Normalize a transaction to "credit" / "debit" / "unknown"
 * based on type and/or purpose.
 */
const getTxDirection = (tx) => {
  const rawType = (tx.type || "").toLowerCase();
  const rawPurpose = (tx.purpose || "").toLowerCase();
  const raw = `${rawType} ${rawPurpose}`;

  // Treat repayment/credit/refund as money in
  if (
    raw.includes("credit") ||
    raw.includes("repay") ||
    raw.includes("repayment") ||
    raw.includes("refund") ||
    raw.includes("interest")
  ) {
    return "credit";
  }

  // Treat loan, disbursement, payout as money out
  if (
    raw.includes("debit") ||
    raw.includes("loan") ||
    raw.includes("disbursement") ||
    raw.includes("payout") ||
    raw.includes("withdrawal") ||
    raw.includes("funding")
  ) {
    return "debit";
  }

  return "unknown";
};

/* -------------------------- Small UI Components -------------------------- */

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="w-12 h-12 border-4 border-cyan-300/40 border-t-cyan-300 rounded-full animate-spin shadow-lg" />
    <p className="text-base text-slate-200 font-medium">Loading transactions...</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="max-w-md mx-auto text-center py-16">
    <p className="text-base text-rose-300 font-semibold">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg transition-all hover:scale-105"
      >
        Retry
      </button>
    )}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <p className="text-xl font-bold text-slate-100">
      No transactions yet
    </p>
    <p className="text-slate-300 text-center max-w-md">
      Once you start funding loans and receiving repayments, your complete transaction history will appear here.
    </p>
  </div>
);

const StatCard = ({ label, value, subLabel, variant }) => {
  const base =
    "rounded-2xl px-4 py-4 shadow-lg border text-xs flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:scale-105";
  const variants = {
    total: `${base} bg-gradient-to-br from-slate-900/70 to-slate-800/60 border-cyan-300/20`,
    credit: `${base} bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-300/30`,
    debit: `${base} bg-gradient-to-br from-rose-500/20 to-orange-500/10 border-rose-300/30`,
  };

  return (
    <div className={variants[variant] || base}>
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-300">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-100 mt-1">
        {value}
      </p>
      {subLabel && (
        <p className="text-[10px] text-slate-400 mt-1">{subLabel}</p>
      )}
    </div>
  );
};

const TypeBadge = ({ tx }) => {
  const direction = getTxDirection(tx);
  const base =
    "inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold";
  const label = tx.type || tx.purpose || "N/A";

  if (direction === "credit") {
    return (
      <span
        className={`${base} bg-emerald-500/15 text-emerald-300 border border-emerald-300/30`}
      >
        In · {label}
      </span>
    );
  }
  if (direction === "debit") {
    return (
      <span
        className={`${base} bg-rose-500/15 text-rose-300 border border-rose-300/30`}
      >
        Out · {label}
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-slate-500/15 text-slate-300 border border-slate-300/30`}
    >
      {label}
    </span>
  );
};

const FilterBar = ({
  typeFilter,
  setTypeFilter,
  searchTerm,
  setSearchTerm,
}) => {
  const options = ["All", "Credit", "Debit"];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 p-4 bg-slate-900/50 rounded-2xl border border-cyan-300/20 shadow-sm">
      {/* Type filter buttons */}
      <div className="inline-flex rounded-full bg-slate-950/60 p-1 text-xs border border-cyan-300/20">
        {options.map((opt) => {
          const active = typeFilter === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setTypeFilter(opt)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="w-full md:w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/40 pl-9 pr-4 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Main Page ------------------------------ */

const LenderTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const BASE_URL = API_BASE_URL;

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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${BASE_URL}/lender/transactions/${lenderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const txs = response.data.transactions || [];

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

  useEffect(() => {
    if (lenderId && token) {
      fetchTransactions();
    } else {
      setError("Unauthorized access.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenderId, token]);

  // Derived stats using direction, not raw type string
  const totalCount = transactions.length;
  const totalCredit = transactions
    .filter((t) => getTxDirection(t) === "credit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalDebit = transactions
    .filter((t) => getTxDirection(t) === "debit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Filter + search using direction
  const filteredTransactions = transactions.filter((tx) => {
    const direction = getTxDirection(tx); // "credit"/"debit"/"unknown"

    const matchesType =
      typeFilter === "All" ||
      direction === typeFilter.toLowerCase(); // now works even if type="loan disbursement"

    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesType;

    const haystack = `${tx.purpose || ""} ${(tx.amount || "").toString()} ${
      tx.type || ""
    }`
      .toLowerCase()
      .trim();

    return matchesType && haystack.includes(term);
  });

  return (
    <div className="w-full min-h-screen">
      <section className="max-w-6xl mx-auto px-4 md:px-0 py-4 md:py-8 space-y-6">
        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-[#0e3141] to-[#1a2f52] px-6 py-8">
          <div className="absolute -top-16 -right-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <p className="text-xs font-semibold text-cyan-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Lender Finance
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Transaction History
          </h1>
          <p className="text-base text-slate-200 mt-1">
            Complete record of all credits and debits linked to your lending activity
          </p>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Transactions"
            value={totalCount}
            subLabel="Overall activity"
            variant="total"
          />
          <StatCard
            label="Total Received"
            value={`${totalCredit.toFixed(3)} ETH`}
            subLabel="Repayments incoming"
            variant="credit"
          />
          <StatCard
            label="Total Disbursed"
            value={`${totalDebit.toFixed(3)} ETH`}
            subLabel="Loans funded"
            variant="debit"
          />
          <div className="hidden md:block rounded-2xl px-4 py-3 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-[11px] text-slate-700 shadow-lg">
            <p className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Legend
            </p>
            <p className="text-blue-700 flex items-center gap-1"><ArrowDownLeft className="w-3 h-3" /> Incoming (credit)</p>
            <p className="text-red-700 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Outgoing (debit)</p>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Content card */}
        <div className="bg-slate-900/55 backdrop-blur-xl rounded-3xl border border-cyan-300/20 shadow-xl overflow-hidden">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchTransactions} />
          ) : transactions.length === 0 ? (
            <EmptyState />
          ) : filteredTransactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-slate-700">No matches found</p>
              <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-950/60 border-b border-cyan-300/20">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-100">Date</th>
                    <th className="px-6 py-4 font-bold text-slate-100">Amount</th>
                    <th className="px-6 py-4 font-bold text-slate-100">Type</th>
                    <th className="px-6 py-4 font-bold text-slate-100">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((tx, idx) => {
                    const direction = getTxDirection(tx);
                    const amountNumber = Number(tx.amount || 0);
                    const sign =
                      direction === "credit"
                        ? "+"
                        : direction === "debit"
                        ? "-"
                        : "";
                    const colorClass =
                      direction === "credit"
                        ? "text-blue-700 font-bold"
                        : direction === "debit"
                        ? "text-red-700 font-bold"
                        : "text-slate-700";
                    const rowBg = idx % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/35";

                    return (
                      <tr
                        key={tx._id}
                        className={`${rowBg} hover:bg-cyan-900/25 transition-all duration-200 border-0`}
                      >
                        <td className="px-6 py-4 text-slate-300 whitespace-nowrap font-medium">
                          {formatDate(tx.date || tx.createdAt)}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-lg ${colorClass} flex items-center gap-2`}
                        >
                          <BadgeIndianRupee className="w-4 h-4" />
                          {sign}{amountNumber.toFixed(4)} ETH
                        </td>
                        <td className="px-6 py-4">
                          <TypeBadge tx={tx} />
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {tx.purpose || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LenderTransactions;
