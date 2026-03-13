import React, { useMemo, useState } from "react";
import {
  Volume2,
  FileText,
  Wallet,
  CreditCard,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorEasyAssist = () => {
  const navigate = useNavigate();
  const [speaking, setSpeaking] = useState(false);

  const canSpeak = useMemo(() => {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }, []);

  const speakText = (text) => {
    if (!canSpeak) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-IN";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const actions = [
    {
      title: "Apply for Loan",
      subtitle: "Tap here to ask for money",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
      onClick: () => navigate("/vendor/request-loan"),
      voice: "Apply for loan. Fill the form and submit.",
    },
    {
      title: "My Loans",
      subtitle: "Check approved or pending loans",
      icon: Wallet,
      color: "from-purple-600 to-indigo-600",
      onClick: () => navigate("/vendor/loans"),
      voice: "My loans. Check pending, approved, and repaid loans.",
    },
    {
      title: "Pay Loan",
      subtitle: "Repay from transactions page",
      icon: CreditCard,
      color: "from-emerald-600 to-teal-600",
      onClick: () => navigate("/vendor/transactions"),
      voice: "Pay loan. Open transactions and click repay.",
    },
    {
      title: "Help Center",
      subtitle: "Open step by step help",
      icon: HelpCircle,
      color: "from-orange-600 to-red-600",
      onClick: () => navigate("/vendor/help"),
      voice: "Help center. Open help and follow steps.",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Easy Help
          </h1>
          <p className="mt-2 text-white/90 text-base sm:text-lg">
            One tap pages for daily work.
          </p>
          <button
            onClick={() =>
              speakText(
                "Welcome. This page has easy buttons. Tap apply for loan, my loans, pay loan, or help center."
              )
            }
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/20 border border-white/30 px-5 py-3 font-semibold hover:bg-white/30 transition"
          >
            <Volume2 className="w-5 h-5" />
            {speaking ? "Reading..." : "Read This Page"}
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-0 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="rounded-3xl bg-white border-2 border-gray-200 p-6 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => speakText(action.voice)}
                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Volume2 className="w-4 h-4" />
                    Read
                  </button>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">{action.title}</h2>
                <p className="mt-1 text-slate-600">{action.subtitle}</p>

                <button
                  onClick={action.onClick}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white py-3.5 text-lg font-bold hover:bg-slate-800 transition"
                >
                  Open
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default VendorEasyAssist;

