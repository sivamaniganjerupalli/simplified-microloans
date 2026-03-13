// Modern Vendor Transactions - Updated with glassmorphic UI
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { CreditCard, AlertCircle, CheckCircle, FileText } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../utils/constants";

/* ------------------------ Small UI Components (local) ------------------------ */

const LoadingState = () => (
  <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
      <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
    </div>
    <div className="space-y-2 mt-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="h-10 w-full bg-slate-50 rounded-lg animate-pulse"
        />
      ))}
    </div>
    <p className="mt-3 text-xs text-slate-400">
      Loading your recent transactions...
    </p>
  </div>
);

const EmptyState = ({ onRepay }) => (
  <div className="mt-4 bg-white rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center text-center gap-3">
    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
      <FileText className="h-5 w-5" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-slate-800">
        No transactions yet
      </p>
      <p className="text-xs text-slate-500 max-w-sm">
        Once you receive a loan or make repayments, your history will appear
        here. You can still test the flow with a sample repayment.
      </p>
    </div>
    <button
      onClick={onRepay}
      className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm"
    >
      Try Sample Repayment
    </button>
  </div>
);

const StatusPill = ({ type }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium";
  if (type === "Loan Credit") {
    return (
      <span
        className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100`}
      >
        Loan Credit
      </span>
    );
  }
  if (type === "Loan Request") {
    return (
      <span
        className={`${base} bg-amber-50 text-amber-700 border border-amber-100`}
      >
        Loan Request
      </span>
    );
  }
  if (type === "Repayment") {
    return (
      <span
        className={`${base} bg-blue-50 text-blue-700 border border-blue-100`}
      >
        Repayment
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-slate-50 text-slate-600 border border-slate-100`}
    >
      {type || "--"}
    </span>
  );
};

const AmountCell = ({ amount, showINR, rate }) => {
  if (typeof amount !== "number" || isNaN(amount)) return <span>--</span>;

  const inrValue = showINR && rate ? amount * rate : null;

  return (
    <div className="flex flex-col">
      <span className="font-mono text-sm text-slate-800">
        {amount.toFixed(4)}{" "}
        <span className="text-[11px] text-slate-500">ETH</span>
      </span>
      {inrValue && (
        <span className="text-[11px] text-slate-500">
          approx {" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(inrValue)}
        </span>
      )}
    </div>
  );
};

/* ----------------------------- Main Component ----------------------------- */

const VendorTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterRange, setFilterRange] = useState("all"); // all | 7d | month
  const [showINR, setShowINR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [ethToInr, setEthToInr] = useState(null);
  const [activeLoanInfo, setActiveLoanInfo] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!vendorId || !token) throw new Error("User not logged in.");

        const res = await axios.get(
          `${API_BASE_URL}/vendor/dashboard/${vendorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const txsFromApi = res.data.transactions || [];

        const txs = txsFromApi
          .filter((tx) => tx.amount !== undefined)
          .map((tx) => {
            const amount = parseFloat(tx.amount);
            return {
              id: tx._id || `${tx.date}-${tx.type}-${tx.amount}`,
              amount: !isNaN(amount) ? amount : null,
              date: tx.date || "--",
              type: tx.type || "--",
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

    // Fetch live ETH/INR rate from CoinGecko
    const fetchEthRate = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
        );
        const data = await res.json();
        if (data?.ethereum?.inr) setEthToInr(data.ethereum.inr);
      } catch {
        setEthToInr(250000); // fallback if CoinGecko unavailable
      }
    };

    // Fetch active loan info to get lender wallet address for repayment
    const fetchActiveLoan = async () => {
      if (!vendorId || !token) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/vendor/${vendorId}/active-loan-info`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.success) setActiveLoanInfo(res.data);
      } catch {
        // No active loan — that's fine
      }
    };

    fetchTransactions();
    fetchEthRate();
    fetchActiveLoan();
  }, [vendorId, token]);

  // Helper function to wait with exponential backoff
  const waitWithBackoff = (attempt) => {
    const baseDelay = 1000; // 1 second
    const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  // Helper function to send transaction with retry logic
  const sendTransactionWithRetry = async (signer, to, value, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Add a check to avoid consecutive rapid requests
        if (attempt > 0) {
          await waitWithBackoff(attempt - 1);
        }

        const tx = await signer.sendTransaction({
          to,
          value,
          gasLimit: 21000, // Standard ETH transfer gas limit
        });

        return tx;
      } catch (err) {
        const errorCode = err.code || "";
        const errorMessage = err.message || "";
        const isRateLimitError =
          errorCode === "-32002" ||
          errorMessage.includes("too many requests") ||
          errorMessage.includes("rate limit") ||
          errorMessage.includes("RPC endpoint returned too many errors");

        if (isRateLimitError && attempt < maxRetries - 1) {
          console.warn(
            `RPC rate limit encountered. Retrying in ${Math.pow(2, attempt)} seconds... (Attempt ${attempt + 1}/${maxRetries})`
          );
          toast.info(
            `Network busy. Retrying in ${Math.pow(2, attempt)} seconds...`
          );
          continue;
        }

        throw err; // Throw error if not a rate limit error or max retries reached
      }
    }
  };

  const handleRepay = async (transaction) => {
    const lenderWallet = activeLoanInfo?.lenderWalletAddress;
    if (!lenderWallet) {
      toast.error("No active approved loan found, or lender wallet not available.");
      return;
    }

    const confirm = window.confirm(
      `Do you want to repay ${transaction.amount} ETH for the transaction on ${transaction.date}?`
    );
    if (!confirm) return;

    setLoading(true);
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

      toast.info("Preparing transaction...");

      // Send transaction with retry logic
      const tx = await sendTransactionWithRetry(
        signer,
        lenderWallet,
        ethers.parseEther(amount.toString()),
        3 // Max 3 retries
      );

      toast.info("Transaction submitted to blockchain...");

      // Wait for transaction to be confirmed
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction failed to confirm");
      }

      toast.info("Blockchain confirmed. Recording in backend...");

      // Send repayment info to backend
      const response = await axios.post(
        `${API_BASE_URL}/vendor/repay`,
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

      // Only show success if backend also succeeded
      if (!response.data.success) {
        throw new Error(response.data.message || "Backend failed to record repayment");
      }

      toast.success("Repayment recorded successfully!");
      setSuccess("Repayment successful on blockchain and recorded in backend.");

      // Update local state to show as repaid
      setTransactions((prev) =>
        prev.map((t) =>
          t.date === transaction.date && t.amount === transaction.amount
            ? { ...t, type: "Repayment" }
            : t
        )
      );
    } catch (err) {
      console.error("Repayment Error:", err);

      const errorCode = err.code || "";
      const errorMessage = err.message || "";

      // Provide specific error messages for different scenarios
      if (errorCode === "-32002" || errorMessage.includes("too many errors")) {
        toast.error(
          "RPC endpoint is overloaded. Please try again after 1-2 minutes."
        );
        setError(
          "Network is temporarily unavailable. Please wait and try again."
        );
      } else if (
        err.code === "ACTION_REJECTED" ||
        errorMessage.toLowerCase().includes("user rejected") ||
        errorMessage.toLowerCase().includes("user denied")
      ) {
        toast.warn("Transaction was cancelled.");
        setError("You cancelled the transaction.");
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("Insufficient funds in your wallet.");
        setError("Not enough ETH in your wallet for this repayment.");
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setError("Unauthorized request. Please login again.");
      } else if (err.response?.status === 404) {
        const backendMessage =
          err.response?.data?.message ||
          "No approved active loan found to repay.";
        toast.error(backendMessage);
        setError(backendMessage);
      } else {
        toast.error("Repayment failed. See console for details.");
        setError(
          err.response?.data?.message ||
            "Repayment failed. Please try again or contact support."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualRepay = () => {
    const amount = parseFloat(activeLoanInfo?.loanAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("No active approved loan amount available for repayment.");
      return;
    }

    const loanTx = {
      amount,
      date: new Date().toISOString().split("T")[0],
      type: "Loan Credit",
    };
    handleRepay(loanTx);
  };

  /* --------------------------- Filtering & Summary --------------------------- */

  const filteredTransactions = React.useMemo(() => {
    if (filterRange === "all") return transactions;

    const now = new Date();

    return transactions.filter((tx) => {
      if (!tx.date || tx.date === "--") return false;
      const txDate = new Date(tx.date);
      if (Number.isNaN(txDate.getTime())) return false;

      if (filterRange === "7d") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return txDate >= sevenDaysAgo && txDate <= now;
      }

      if (filterRange === "month") {
        return (
          txDate.getFullYear() === now.getFullYear() &&
          txDate.getMonth() === now.getMonth()
        );
      }

      return true;
    });
  }, [transactions, filterRange]);

  const totalLoanCredits = filteredTransactions
    .filter((t) => t.type === "Loan Credit" && typeof t.amount === "number")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRepayments = filteredTransactions
    .filter((t) => t.type === "Repayment" && typeof t.amount === "number")
    .reduce((sum, t) => sum + t.amount, 0);

  /* --------------------------------- Render --------------------------------- */

  const FILTER_OPTIONS = [
    { value: "all", label: "All" },
    { value: "7d", label: "Last 7 days" },
    { value: "month", label: "This month" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Transaction History</h1>
                </div>
              </div>
              <p className="text-white/80 text-lg max-w-xl">
                View all your loan credits and repayments in one place.
              </p>
            </div>
            <button
              className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 text-white rounded-2xl font-semibold shadow-lg transition-all hover:scale-105"
              onClick={handleManualRepay}
            >
              Repay Loan
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-0 pb-12">

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/90 backdrop-blur-xl border border-red-200 shadow-lg animate-slide-down">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-900 flex-1">{error}</p>
              <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">X</button>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/90 backdrop-blur-xl border border-emerald-200 shadow-lg animate-slide-down">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-900 flex-1">{success}</p>
              <button onClick={() => setSuccess("")} className="text-emerald-600 hover:text-emerald-800">X</button>
            </div>
          </div>
        )}

        {/* Filters Row */}
        {!loading && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Date Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-500">Date range:</span>
              <div className="inline-flex bg-slate-100 rounded-full p-1 gap-1">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterRange(opt.value)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
                      filterRange === opt.value
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INR Toggle */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] text-slate-500">
                  Show INR equivalent
                </span>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showINR}
                  onChange={(e) => setShowINR(e.target.checked)}
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors flex items-center">
                  <div className="h-4 w-4 bg-white rounded-full shadow transform peer-checked:translate-x-4 translate-x-1 transition-transform" />
                </div>
              </label>
              {showINR && (
                <p className="text-[10px] text-slate-400">
                  Approx: 1 ETH approx{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(ethToInr || 250000)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Summary Card (based on filtered data) */}
        {!loading && filteredTransactions.length > 0 && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-3.5">
              <p className="text-[11px] text-slate-500">
                Total Loan Credit (filtered)
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {totalLoanCredits.toFixed(4)} ETH
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-3.5">
              <p className="text-[11px] text-slate-500">
                Total Repayments (filtered)
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {totalRepayments.toFixed(4)} ETH
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-3.5">
              <p className="text-[11px] text-slate-500">
                Outstanding (approx, filtered)
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {(totalLoanCredits - totalRepayments).toFixed(4)} ETH
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState onRepay={handleManualRepay} />
        ) : (
          <div className="mt-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Date
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Type
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <tr
                      key={tx.id || index}
                      className={`border-t border-slate-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="px-4 py-2.5 align-middle text-xs text-slate-700">
                        {tx.date}
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        <AmountCell
                          amount={tx.amount}
                          showINR={showINR}
                          rate={ethToInr || 250000}
                        />
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        <StatusPill type={tx.type} />
                      </td>
                      <td className="px-4 py-2.5 align-middle">
                        {tx.type === "Loan Credit" &&
                        typeof tx.amount === "number" &&
                        !isNaN(tx.amount) ? (
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"
                            onClick={() => handleRepay(tx)}
                          >
                            Repay
                          </button>
                        ) : tx.type === "Loan Request" ? (
                          <span className="text-[11px] text-amber-600">
                            Awaiting Approval
                          </span>
                        ) : tx.type === "Repayment" ? (
                          <span className="text-[11px] text-emerald-600 font-medium">
                            Paid
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Note */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p>
                Note: For any mismatch in amounts or dates, please contact{" "}
                <span className="font-semibold text-slate-700">
                  support@dhansetu.io
                </span>
                .
              </p>
              <p>Blockchain confirmations may take a few minutes.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default VendorTransactions;

