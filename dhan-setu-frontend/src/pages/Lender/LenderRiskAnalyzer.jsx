import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertTriangle, ShieldCheck, TrendingUp, CircleGauge } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const LenderRiskAnalyzer = () => {
  const [availableLoans, setAvailableLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [loanAmount, setLoanAmount] = useState("5");
  const [tenureMonths, setTenureMonths] = useState("6");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        if (!lenderId || !token) {
          setAvailableLoans([]);
          setError("Please login to analyze risk.");
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/lender/${lenderId}/loans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pending = (res.data?.loans || []).filter((loan) => loan.status === "Pending");
        setAvailableLoans(pending);
        if (pending.length > 0) {
          const first = pending[0];
          setSelectedLoanId(first._id);
          setLoanAmount(String(first.loanAmount || 0));
          setTenureMonths(String(first.repayTime || 0));
        }
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load loans for analysis");
        setAvailableLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [lenderId, token]);

  const riskScore = useMemo(() => {
    const amount = Number(loanAmount) || 0;
    const tenure = Number(tenureMonths) || 0;
    const amountRisk = Math.min((amount / 15) * 45, 45);
    const tenureRisk = Math.min((tenure / 24) * 35, 35);
    const baseRisk = 20;
    return Math.round(Math.min(100, baseRisk + amountRisk + tenureRisk));
  }, [loanAmount, tenureMonths]);

  const riskLabel = riskScore < 35 ? "Low" : riskScore < 65 ? "Medium" : "High";
  const riskColor = riskScore < 35 ? "text-emerald-300" : riskScore < 65 ? "text-amber-300" : "text-rose-300";
  const riskNote = riskScore < 35
    ? "Stable risk profile with manageable downside."
    : riskScore < 65
      ? "Balanced risk; prefer staged disbursement."
      : "High volatility; consider lower ticket size or stronger collateral evidence.";

  const stressLoss = useMemo(() => {
    const amount = Number(loanAmount) || 0;
    const tenure = Number(tenureMonths) || 0;
    const baseFactor = riskScore / 100;
    const tenureImpact = Math.min(tenure / 24, 1);
    return (amount * (0.06 + baseFactor * 0.18 + tenureImpact * 0.08)).toFixed(3);
  }, [loanAmount, riskScore, tenureMonths]);

  const confidence = Math.max(12, 100 - riskScore);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-200/30 bg-gradient-to-r from-[#0b2740] via-[#103b52] to-[#1a4a58] p-8 text-white">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <p className="text-cyan-200 text-sm font-semibold tracking-wide uppercase">Lender Toolkit</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Risk Analyzer</h1>
          <p className="text-cyan-100 mt-2 max-w-2xl">Run a quick stress simulation before approving a loan and compare downside potential across risk bands.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-cyan-200/30 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <CircleGauge className="w-5 h-5 text-cyan-300" />
              Simulation Inputs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Select Loan</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => {
                    setSelectedLoanId(e.target.value);
                    const loan = availableLoans.find((l) => l._id === e.target.value);
                    if (loan) {
                      setLoanAmount(String(loan.loanAmount || 0));
                      setTenureMonths(String(loan.repayTime || 0));
                    }
                  }}
                  className="w-full rounded-xl border border-cyan-200/30 bg-slate-950/40 px-3 py-2 text-slate-100"
                >
                  {availableLoans.map((loan) => (
                    <option key={loan._id} value={loan._id}>
                      {`${loan.fullName || "Vendor"} ${loan.surname || ""}`.trim()} ({loan.loanAmount} ETH)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Loan Amount (ETH)</label>
                <input
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full rounded-xl border border-cyan-200/30 bg-slate-950/40 px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Tenure (months)</label>
                <input
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(e.target.value)}
                  className="w-full rounded-xl border border-cyan-200/30 bg-slate-950/40 px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-cyan-200/25 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-200">Risk Score</p>
                <p className={`text-2xl font-bold mt-1 ${riskColor}`}>{riskScore}/100 ({riskLabel})</p>
              </div>
              <div className="rounded-xl border border-cyan-200/25 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-200">Estimated Stress Loss</p>
                <p className="text-2xl font-bold mt-1 text-rose-300">{stressLoss} ETH</p>
              </div>
              <div className="rounded-xl border border-cyan-200/25 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-200">Confidence</p>
                <p className="text-2xl font-bold mt-1 text-emerald-300">{confidence}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-cyan-200/30 bg-white/5 p-5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                Recommended Move
              </h3>
              <p className="text-slate-300 text-sm">{riskNote}</p>
            </div>
            <div className="rounded-2xl border border-cyan-200/30 bg-white/5 p-5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                Underwriting Tip
              </h3>
              <p className="text-slate-300 text-sm">If stress loss exceeds 20% of monthly inflow, reduce ticket size or split disbursement in stages.</p>
            </div>
            <div className="rounded-2xl border border-cyan-200/30 bg-white/5 p-5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-300" />
                Portfolio Impact
              </h3>
              <p className="text-slate-300 text-sm">Keep high-risk exposure below 30% of active capital for smoother returns.</p>
            </div>
          </div>
        </div>
        {loading && <p className="text-slate-300 text-sm">Loading loans for analysis...</p>}
        {error && <p className="text-amber-300 text-sm">{error}</p>}
        {!loading && !error && availableLoans.length === 0 && (
          <p className="text-slate-300 text-sm">No pending loans available for risk analysis.</p>
        )}
      </div>
    </div>
  );
};

export default LenderRiskAnalyzer;
