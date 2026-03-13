import React, { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Shield,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  Wallet,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="group rounded-2xl bg-white border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors"
    >
      <span className="text-base font-semibold text-gray-900 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
        </div>
        {question}
      </span>
      {isOpen ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
    </button>
    {isOpen && <div className="px-6 pb-6 text-base text-gray-700 leading-relaxed border-t-2 border-gray-100 pt-5">{answer}</div>}
  </div>
);

const QuickActionCard = ({ icon: Icon, title, description, onClick, gradient, badge }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-300 text-left w-full"
  >
    {badge && <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">{badge}</div>}
    <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-base text-gray-600 mb-3 leading-relaxed">{description}</p>
    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
      <span>Open</span>
      <ArrowRight className="w-4 h-4" />
    </div>
  </button>
);

const StepCard = ({ number, icon: Icon, title, description }) => (
  <div className="flex gap-4 items-start p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-indigo-300 transition-all">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
      {number}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const VendorHelp = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqQuery, setFaqQuery] = useState("");

  const faqs = [
    {
      id: 1,
      question: "When will I receive money after applying for a loan?",
      answer: "Your request is first reviewed by a lender. Once approved, the amount is sent to your wallet and you will see a notification.",
    },
    {
      id: 2,
      question: "How do I repay a loan?",
      answer: "Go to Transactions, select the loan, click Repay, connect your wallet, and confirm the payment.",
    },
    {
      id: 3,
      question: "Is my personal data safe?",
      answer: "Yes. Your information is protected and used only for verification and loan processing.",
    },
    {
      id: 4,
      question: "What if I miss a repayment date?",
      answer: "Contact support immediately. Late repayment can reduce your chances of getting future loans.",
    },
    {
      id: 5,
      question: "What is a wallet?",
      answer: "A wallet is a secure app that stores your digital funds. Keep your secret phrase private and never share it.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return true;
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
          <div className="inline-flex w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 items-center justify-center shadow-2xl mb-4">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Help Center</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">Simple support, clear actions, and easy step-by-step guidance.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-0 pb-12 space-y-10">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Common Tasks</h2>
            <p className="text-lg text-gray-600">Use these quick actions to complete daily work.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard icon={FileText} title="Apply for a New Loan" description="Open the form and submit in a few simple steps." onClick={() => navigate("/vendor/request-loan")} gradient="from-blue-500 to-cyan-500" badge="Most Used" />
            <QuickActionCard icon={CreditCard} title="Repay a Loan" description="Go to transactions and repay securely from your wallet." onClick={() => navigate("/vendor/transactions")} gradient="from-emerald-500 to-teal-500" />
            <QuickActionCard icon={Wallet} title="View Loan Status" description="Check pending, approved, rejected, and repaid loans." onClick={() => navigate("/vendor/loans")} gradient="from-purple-500 to-pink-500" />
            <QuickActionCard icon={Play} title="Open Tutorial" description="Learn the app in guided steps." onClick={() => navigate("/vendor/tutorial")} gradient="from-orange-500 to-red-500" />
            <QuickActionCard icon={HelpCircle} title="Easy Help" description="Big buttons and voice support for daily use." onClick={() => navigate("/vendor/easy")} gradient="from-indigo-500 to-blue-500" badge="New" />
            <QuickActionCard icon={CreditCard} title="Repayment Planner" description="Calculate weekly payment before borrowing." onClick={() => navigate("/vendor/planner")} gradient="from-blue-500 to-indigo-500" />
            <QuickActionCard icon={CheckCircle} title="Daily Checklist" description="Track daily tasks with one tap." onClick={() => navigate("/vendor/checklist")} gradient="from-emerald-500 to-teal-500" />
            <QuickActionCard icon={AlertCircle} title="Reminder Center" description="Set custom reminders for repayment and tasks." onClick={() => navigate("/vendor/reminders")} gradient="from-violet-500 to-purple-500" badge="New" />
            <QuickActionCard icon={Wallet} title="Expense Tracker" description="Track daily expenses and profit." onClick={() => navigate("/vendor/expense-tracker")} gradient="from-cyan-500 to-blue-500" badge="New" />
            <QuickActionCard icon={TrendingUp} title="Sales Booster" description="See which days sell best and improve weak days." onClick={() => navigate("/vendor/sales-booster")} gradient="from-fuchsia-500 to-violet-500" badge="New" />
            <QuickActionCard icon={Info} title="Quick Guide" description="Open one-page instructions and safety tips." onClick={() => navigate("/vendor/quick-guide")} gradient="from-pink-500 to-rose-500" />
          </div>
        </section>

        <section className="rounded-3xl bg-white border-2 border-gray-200 p-8 md:p-10 shadow-xl space-y-4">
          <div className="text-center mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h2 className="text-3xl font-bold text-gray-900">How to Request a Loan</h2>
          </div>
          <StepCard number="1" icon={FileText} title="Fill the Form" description="Enter your details and business information carefully." />
          <StepCard number="2" icon={TrendingUp} title="Enter Amount" description="Type the amount you need and loan purpose." />
          <StepCard number="3" icon={BookOpen} title="Upload Documents" description="Upload clear photos of required documents." />
          <StepCard number="4" icon={CheckCircle} title="Submit Request" description="Review details and submit your application." />
          <StepCard number="5" icon={Shield} title="Track Status" description="Check loan status and updates in your dashboard." />

          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-amber-900 mb-2 text-lg">Important Tips</p>
                <ul className="space-y-1 text-base text-amber-800">
                  <li>Use your real details and documents.</li>
                  <li>Never share OTP, password, or secret phrase.</li>
                  <li>Upload clear photos for faster review.</li>
                  <li>Repay on time to improve your trust score.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions.</p>
          </div>
          <div className="max-w-4xl mx-auto mb-4">
            <input
              type="text"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              placeholder="Search FAQs by question or keyword"
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFaqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} isOpen={openFAQ === faq.id} onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)} />
            ))}
            {filteredFaqs.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600">
                No FAQ matches your search.
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default VendorHelp;

