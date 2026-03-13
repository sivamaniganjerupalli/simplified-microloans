import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Radar, Star, Clock3, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const LenderOpportunityRadar = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        if (!lenderId || !token) {
          setOpportunities([]);
          setError("Please login to view opportunities.");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/lender/${lenderId}/loans`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pending = (res.data?.loans || [])
          .filter((loan) => loan.status === "Pending")
          .map((loan) => {
            const amount = Number(loan.loanAmount || 0);
            const tenureMonths = Number(loan.repayTime || 0);
            const amountFactor = Math.max(0, 100 - Math.min(amount * 4, 40));
            const tenureFactor = Math.max(0, 100 - Math.min(tenureMonths * 3, 36));
            const score = Math.round((amountFactor * 0.5) + (tenureFactor * 0.5));
            return {
              id: loan._id,
              vendor: `${loan.fullName || "Vendor"} ${loan.surname || ""}`.trim(),
              sector: loan.businessType || "Business",
              amount: `${amount.toFixed(3)} ETH`,
              tenure: `${tenureMonths} months`,
              score,
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        setOpportunities(pending);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load opportunities");
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [lenderId, token]);

  const averageScore = useMemo(() => {
    if (!opportunities.length) return "0.0";
    const sum = opportunities.reduce((acc, item) => acc + Number(item.score || 0), 0);
    return (sum / opportunities.length).toFixed(1);
  }, [opportunities]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="rounded-3xl border border-amber-200/35 bg-gradient-to-r from-[#4a3413] to-[#62461b] p-8 text-white relative overflow-hidden">
          <div className="absolute -left-8 -top-12 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
          <p className="text-amber-100 text-sm font-semibold uppercase tracking-wide">Lender Toolkit</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Opportunity Radar</h1>
          <p className="text-amber-50 mt-2">Scan high-potential loan opportunities with quick quality signals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-amber-200/30 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-amber-200">Opportunities Today</p>
            <p className="text-3xl font-bold text-white mt-1">{opportunities.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-200/30 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-amber-200">Avg Quality Score</p>
            <p className="text-3xl font-bold text-amber-300 mt-1">{averageScore}</p>
          </div>
          <div className="rounded-2xl border border-amber-200/30 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-amber-200">Priority Window</p>
            <p className="text-3xl font-bold text-cyan-300 mt-1">24 hrs</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-slate-200 text-sm">Loading opportunities...</div>
        )}

        <div className="space-y-4">
          {!loading && opportunities.length === 0 && (
            <div className="rounded-2xl border border-amber-200/30 bg-white/5 p-6 text-slate-300">
              No pending loan opportunities available right now.
            </div>
          )}
          {opportunities.map((item) => (
            <div key={item.id} className="rounded-2xl border border-amber-200/30 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{item.vendor}</p>
                  <p className="text-sm text-slate-300 mt-1">{item.sector}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full border border-slate-500/40 text-slate-200">{item.amount}</span>
                  <span className="px-3 py-1 rounded-full border border-slate-500/40 text-slate-200">{item.tenure}</span>
                  <span className="px-3 py-1 rounded-full border border-amber-300/40 text-amber-200">Score {item.score}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-slate-500/30 bg-slate-900/30 p-3 text-slate-300 flex items-center gap-2">
                  <Radar className="w-4 h-4 text-cyan-300" />
                  Matched your preferred ticket size
                </div>
                <div className="rounded-xl border border-slate-500/30 bg-slate-900/30 p-3 text-slate-300 flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-amber-300" />
                  Disbursement expected in 48 hours
                </div>
                <div className="rounded-xl border border-slate-500/30 bg-slate-900/30 p-3 text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  KYC and repayment checks passed
                </div>
              </div>

              <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-95">
                <Star className="w-4 h-4" />
                Mark as Priority
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LenderOpportunityRadar;
