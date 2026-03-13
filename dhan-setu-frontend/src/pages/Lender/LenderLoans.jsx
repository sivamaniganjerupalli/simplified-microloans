// src/pages/lender/LenderLoans.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserProvider, parseEther } from "ethers";
import { Layers3, Clock3, CircleCheck, CircleX, Sparkles } from "lucide-react";
import Button from "../../components/common/Button";
import { API_BASE_URL } from "../../utils/constants";
import { BLOCKCHAIN_CONFIG } from "../../config/blockchain.config";

/* -------------------------- Small UI Components -------------------------- */

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold";

  switch (status) {
    case "Approved":
      return (
        <span
          className={`${base} bg-blue-50 text-blue-700 border border-blue-100`}
        >
          {status}
        </span>
      );
    case "Pending":
      return (
        <span
          className={`${base} bg-amber-50 text-amber-700 border border-amber-100`}
        >
          {status}
        </span>
      );
    case "Rejected":
      return (
        <span
          className={`${base} bg-red-50 text-red-600 border border-red-100`}
        >
          {status}
        </span>
      );
    case "Repaid":
      return (
        <span
          className={`${base} bg-blue-50 text-blue-700 border border-blue-100`}
        >
          {status}
        </span>
      );
    default:
      return (
        <span
          className={`${base} bg-slate-100 text-slate-700 border border-slate-200`}
        >
          {status || "Unknown"}
        </span>
      );
  }
};

const StatCard = ({ label, value, variant }) => {
  const base =
    "rounded-xl px-3 py-2 shadow-sm border text-xs flex flex-col justify-between";
  const variants = {
    total: `${base} bg-white border-slate-100`,
    pending: `${base} bg-amber-50 border-amber-100`,
    approved: `${base} bg-blue-50 border-blue-100`,
    rejected: `${base} bg-red-50 border-red-100`,
  };

  return (
    <div className={variants[variant] || base}>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-lg font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-10 gap-3">
    <div className="h-10 w-10 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-slate-300">Loading your loans...</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="max-w-md mx-auto text-center py-10">
    <p className="text-sm text-red-600 font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="mt-3 inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 gap-2">
    <p className="text-lg font-semibold text-slate-100">No loans found yet</p>
    <p className="text-sm text-slate-300 text-center max-w-sm">
      Once you start funding vendor requests, you&apos;ll see all your loans
      listed here, along with their status and details.
    </p>
  </div>
);

const NoResultsState = () => (
  <div className="flex flex-col items-center justify-center py-10 gap-2">
    <p className="text-sm font-semibold text-slate-100">
      No loans match your filters
    </p>
    <p className="text-xs text-slate-300 text-center max-w-xs">
      Try changing the status filter or clearing the search to see more loans.
    </p>
  </div>
);

const LoanCard = ({ loan, onView }) => (
  <div className="bg-slate-900/55 rounded-2xl border border-cyan-300/20 shadow-sm p-4 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between gap-2">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-100">
          {loan.fullName} {loan.surname}
        </p>
        <p className="text-[12px] text-slate-300">
          {loan.businessType || "Business"}
        </p>
      </div>
      <StatusBadge status={loan.status} />
    </div>

    <div className="mt-3 space-y-1 text-xs text-slate-300">
      <p>
        <span className="font-semibold text-slate-100">Loan Amount:</span>{" "}
        {loan.loanAmount} ETH
      </p>
      <p>
        <span className="font-semibold text-slate-100">Repayment Time:</span>{" "}
        {loan.repayTime} months
      </p>
      {loan.createdAt && (
        <p>
          <span className="font-semibold text-slate-100">Applied On:</span>{" "}
          {new Date(loan.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>

    <div className="mt-4 flex justify-between items-center">
      <Button label="View Details" onClick={() => onView(loan)} />
      {loan.status === "Pending" && (
        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
          Action needed
        </span>
      )}
    </div>
  </div>
);

const LoanDetailsModal = ({
  loan,
  baseUrl,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full mx-4 md:mx-0 p-5 md:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button (top-right) */}
        <button
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-800 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 text-center">
          Loan Request Details
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Info Section */}
          <div className="flex-1 space-y-2 text-sm md:text-[15px] text-slate-800 leading-relaxed">
            <p>
              <span className="font-semibold">Full Name:</span>{" "}
              {loan.fullName} {loan.surname}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {loan.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {loan.phone}
            </p>
            <p>
              <span className="font-semibold">Wallet Address:</span>{" "}
              {loan.walletAddress || "Not available"}
            </p>
            <p>
              <span className="font-semibold">Loan Amount:</span>{" "}
              {loan.loanAmount} ETH
            </p>
            <p>
              <span className="font-semibold">Business Type:</span>{" "}
              {loan.businessType}
            </p>
            <p>
              <span className="font-semibold">Reason:</span> {loan.reason}
            </p>
            <p>
              <span className="font-semibold">Repayment Time:</span>{" "}
              {loan.repayTime} months
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <StatusBadge status={loan.status} />
            </p>
            <p>
              <span className="font-semibold">Applied On:</span>{" "}
              {new Date(loan.createdAt).toLocaleDateString()}
            </p>

            {loan.status === "Pending" && (
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  label="Approve & Send ETH"
                  onClick={() => onApprove(loan)}
                />
                <Button
                  label="Reject"
                  onClick={() => onReject(loan._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                />
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="flex-1 space-y-4">
            {loan.aadhaarImage && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Aadhaar Image
                </p>
                <img
                  src={`${baseUrl}/uploads/${loan.aadhaarImage}`}
                  alt="Aadhaar"
                  className="rounded-lg w-full max-h-64 object-contain border border-slate-200 bg-slate-50"
                />
              </div>
            )}
            {loan.businessImage && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Business Image
                </p>
                <img
                  src={`${baseUrl}/uploads/${loan.businessImage}`}
                  alt="Business"
                  className="rounded-lg w-full max-h-64 object-contain border border-slate-200 bg-slate-50"
                />
              </div>
            )}
            {!loan.aadhaarImage && !loan.businessImage && (
              <p className="text-sm text-slate-500">
                No images uploaded for this request.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------ Filter Bar (status + search) ------------------------ */

const FilterBar = ({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}) => {
  const statuses = ["All", "Pending", "Approved", "Rejected"];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-1">
      {/* Status buttons */}
      <div className="inline-flex rounded-full bg-slate-950/60 p-1 text-xs border border-cyan-300/20">
        {statuses.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="w-full md:w-64">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-cyan-300/20 bg-slate-950/45 px-3 py-1.5 text-xs md:text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400 placeholder:text-slate-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            🔍
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Main Page ------------------------------ */

const LenderLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const API_URL = API_BASE_URL;
  const BASE_URL = API_BASE_URL.replace(/\/api$/, "");

  // Fetch all loans for this lender
  const fetchLoans = async () => {
    if (!lenderId || !token) {
      setLoans([]);
      setError("Please login to view your loans.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/lender/${lenderId}/loans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data.loans || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err.message);
      const status = err.response?.status;
      if (status === 400 || status === 404) {
        setLoans([]);
        setError("");
      } else if (status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(err.response?.data?.message || "Failed to load loans. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to wait with exponential backoff
  const waitWithBackoff = (attempt) => {
    const baseDelay = 1000; // 1 second
    const delay = baseDelay * Math.pow(2, attempt);
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  const ensureSepoliaNetwork = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not available.");
    }

    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
    if (currentChainId === BLOCKCHAIN_CONFIG.METAMASK.chainHex) {
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BLOCKCHAIN_CONFIG.METAMASK.chainHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BLOCKCHAIN_CONFIG.METAMASK.chainHex,
              chainName: BLOCKCHAIN_CONFIG.NETWORK.name,
              rpcUrls: [BLOCKCHAIN_CONFIG.NETWORK.rpcUrl],
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: [BLOCKCHAIN_CONFIG.NETWORK.explorerUrl],
            },
          ],
        });
        return;
      }

      throw switchError;
    }
  };

  // Send transaction with retry logic for RPC rate limits
  const sendTransactionWithRetry = async (
    signer,
    to,
    value,
    maxRetries = 3
  ) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await waitWithBackoff(attempt - 1);
        }

        const tx = await signer.sendTransaction({
          to,
          value,
          gasLimit: 21000,
        });

        return tx;
      } catch (err) {
        const errorCode = err.code || "";
        const errorMessage = err.message || "";
        const normalizedMessage = errorMessage.toLowerCase();
        const isPendingWalletRequest =
          String(errorCode) === "-32002" ||
          normalizedMessage.includes("request already pending") ||
          normalizedMessage.includes("already processing") ||
          normalizedMessage.includes("already pending");
        const isRateLimitError =
          normalizedMessage.includes("too many requests") ||
          normalizedMessage.includes("rate limit") ||
          normalizedMessage.includes("rpc endpoint returned too many errors") ||
          normalizedMessage.includes("429") ||
          normalizedMessage.includes("too many errors");

        if (isPendingWalletRequest) {
          throw new Error(
            "A MetaMask request is already pending. Open MetaMask and approve or reject the existing request first."
          );
        }

        if (isRateLimitError && attempt < maxRetries - 1) {
          console.warn(
            `RPC rate limit. Retrying in ${Math.pow(2, attempt)}s... (Attempt ${attempt + 1}/${maxRetries})`
          );
          if (attempt === 0) {
            alert(`Network busy. Retrying in ${Math.pow(2, attempt)} seconds...`);
          }
          continue;
        }

        throw err;
      }
    }
  };

  // Send ETH via MetaMask
  const sendEthToVendor = async (walletAddress, amountEth) => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not available.");
        return null;
      }

      await ensureSepoliaNetwork();
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await sendTransactionWithRetry(
        signer,
        walletAddress,
        parseEther(amountEth.toString()),
        3 // max retries
      );

      alert("Waiting for blockchain confirmation...");
      await tx.wait();
      alert(`Transaction successful! Hash: ${tx.hash}`);
      return tx.hash;
    } catch (err) {
      console.error("ETH Transfer Error:", err);

      const errorCode = err.code || "";
      const errorMessage = err.message || "";
      const normalizedMessage = errorMessage.toLowerCase();

      if (normalizedMessage.includes("metamask request is already pending")) {
        alert("MetaMask already has a pending approval request. Open MetaMask and complete or reject it first.");
      } else if (normalizedMessage.includes("too many requests") || normalizedMessage.includes("too many errors") || normalizedMessage.includes("rate limit") || normalizedMessage.includes("429")) {
        alert(
          `Sepolia RPC is rate-limited. Switch MetaMask to a stable custom Sepolia RPC and try again. Suggested RPC: ${BLOCKCHAIN_CONFIG.NETWORK.rpcUrl}`
        );
      } else if (errorCode === 4001 || errorMessage.includes("User denied")) {
        alert("You cancelled the transaction in MetaMask.");
      } else if (normalizedMessage.includes("chain") && normalizedMessage.includes("switch")) {
        alert("Please switch MetaMask to Sepolia and try again.");
      } else if (errorMessage.includes("insufficient funds")) {
        alert("Insufficient ETH in your wallet.");
      } else {
        alert("Transaction failed: " + err.message);
      }
      return null;
    }
  };

  // Handle loan approval
  const handleApprove = async (loan) => {
    const { walletAddress, loanAmount } = loan;

    if (!walletAddress) {
      alert("Vendor wallet address missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve and send ETH?"
    );
    if (!confirmed) return;

    const txHash = await sendEthToVendor(walletAddress, loanAmount);
    if (!txHash) return;

    try {
      await axios.put(
        `${API_URL}/lender/loans/${loan._id}/approve`,
        { txHash },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Loan approved successfully.");
      setSelectedLoan(null);
      fetchLoans();
    } catch (err) {
      console.error("Approval Error:", err.message);
      alert("Failed to approve loan.");
    }
  };

  // Handle loan rejection
  const handleReject = async (loanId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this loan?"
    );
    if (!confirmReject) return;

    try {
      const response = await axios.put(
        `${API_URL}/lender/loans/${loanId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Loan rejection response:", response.data);
      alert("Loan rejected successfully.");
      setSelectedLoan(null);
      fetchLoans();
    } catch (err) {
      console.error(
        "Rejection error:",
        err.response ? err.response.data : err.message
      );
      alert(
        "Failed to reject loan." +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    if (lenderId && token) {
      fetchLoans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenderId, token]);

  const totalLoans = loans.length;
  const pendingCount = loans.filter((l) => l.status === "Pending").length;
  const approvedCount = loans.filter((l) => l.status === "Approved").length;
  const rejectedCount = loans.filter((l) => l.status === "Rejected").length;

  // Filter + search
  const filteredLoans = loans.filter((loan) => {
    const matchesStatus =
      statusFilter === "All" || loan.status === statusFilter;

    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesStatus;

    const haystack = `${loan.fullName || ""} ${
      loan.surname || ""
    } ${loan.businessType || ""}`
      .toLowerCase()
      .trim();

    return matchesStatus && haystack.includes(term);
  });

  return (
    <div className="w-full">
      <section className="max-w-6xl mx-auto px-4 md:px-0 py-4 md:py-6 space-y-6">
        {/* Header & Quick Stats */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-[#0b2e45] to-[#1b3558] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div>
              <p className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Lender · Loan Requests
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                Your Funded & Pending Loans
              </h1>
              <p className="text-sm text-slate-200 mt-1">
                Review vendor requests, approve or reject loans, and track the
                ETH you&apos;ve funded.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs min-w-[320px]">
              <StatCard label="Total" value={totalLoans} variant="total" />
              <StatCard
                label="Pending"
                value={pendingCount}
                variant="pending"
              />
              <StatCard
                label="Approved"
                value={approvedCount}
                variant="approved"
              />
              <StatCard
                label="Rejected"
                value={rejectedCount}
                variant="rejected"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-cyan-300/20 bg-slate-900/45 p-4 text-slate-200 text-sm flex items-center gap-2">
              <Layers3 className="w-4 h-4 text-cyan-300" />
              Total Pipeline: {totalLoans}
            </div>
            <div className="rounded-xl border border-amber-300/20 bg-slate-900/45 p-4 text-slate-200 text-sm flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-amber-300" />
              Pending Review: {pendingCount}
            </div>
            <div className="rounded-xl border border-emerald-300/20 bg-slate-900/45 p-4 text-slate-200 text-sm flex items-center gap-2">
              <CircleCheck className="w-4 h-4 text-emerald-300" />
              Approved: {approvedCount}
            </div>
            <div className="rounded-xl border border-rose-300/20 bg-slate-900/45 p-4 text-slate-200 text-sm flex items-center gap-2">
              <CircleX className="w-4 h-4 text-rose-300" />
              Rejected: {rejectedCount}
            </div>
          </div>

          {/* Status filter + search */}
          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Content area */}
        <div className="bg-slate-900/45 rounded-2xl border border-cyan-300/20 shadow-sm p-4 md:p-5 min-h-[200px]">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchLoans} />
          ) : loans.length === 0 ? (
            <EmptyState />
          ) : filteredLoans.length === 0 ? (
            <NoResultsState />
          ) : (
            <div className="grid gap-4 md:gap-5 sm:grid-cols-1 md:grid-cols-2">
              {filteredLoans.map((loan) => (
                <LoanCard
                  key={loan._id}
                  loan={loan}
                  onView={setSelectedLoan}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Loan Details */}
      {selectedLoan && (
        <LoanDetailsModal
          loan={selectedLoan}
          baseUrl={BASE_URL}
          onClose={() => setSelectedLoan(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default LenderLoans;
