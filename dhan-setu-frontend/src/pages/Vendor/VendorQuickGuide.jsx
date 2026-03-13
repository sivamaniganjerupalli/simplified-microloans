// Quick Reference Guide for Street Vendors - Like a cheat sheet
import React from "react";
import {
  BookOpen,
  Phone,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Wallet,
  CreditCard,
  Clock,
  DollarSign,
  Users,
  Info,
  HelpCircle,
  TrendingUp,
  Download,
  Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const colorStepClasses = {
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
};

const statusClasses = {
  amber: "bg-amber-50 border-amber-200 text-amber-600",
  green: "bg-green-50 border-green-200 text-green-600",
  red: "bg-red-50 border-red-200 text-red-600",
  blue: "bg-blue-50 border-blue-200 text-blue-600",
};

const QuickReferenceCard = ({ icon: Icon, title, steps, gradient, color }) => (
  <div className="rounded-3xl bg-white border-2 border-gray-200 p-6 hover:shadow-xl transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
    </div>
    <ol className="space-y-2">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-2 text-sm">
          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colorStepClasses[color]}`}>
            {index + 1}
          </span>
          <span className="text-gray-700 leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  </div>
);

const ImportantNumberCard = ({ icon: Icon, title, number, description, gradient }) => (
  <a
    href={number.startsWith('+') ? `tel:${number}` : number.startsWith('https') ? number : `mailto:${number}`}
    target={number.startsWith('https') ? '_blank' : undefined}
    rel={number.startsWith('https') ? 'noopener noreferrer' : undefined}
    className="block rounded-2xl bg-white border-2 border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all"
  >
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-lg font-bold text-indigo-600 mb-1">{number}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </a>
);

const StatusBadge = ({ status, description, color, icon: Icon }) => (
  <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${statusClasses[color]}`}>
    <Icon className="w-6 h-6" />
    <div>
      <p className="font-bold text-gray-900">{status}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const VendorQuickGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/30 items-center justify-center shadow-2xl mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Quick Guide</h1>
            <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
              Everything in one place for faster and easier use.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-semibold hover:bg-white/30 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={() => alert("PDF download will be available soon.")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-semibold hover:bg-white/30 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-0 pb-12">
        
        {/* Emergency Contacts - Most Important */}
        <section className="mb-12 rounded-3xl bg-gradient-to-r from-red-500 to-pink-500 p-8 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImportantNumberCard
              icon={Phone}
              title="Phone Support"
              number="+91 98765 43210"
              description="Mon-Sun, 9 AM - 9 PM"
              gradient="from-blue-500 to-indigo-500"
            />
            <ImportantNumberCard
              icon={MessageCircle}
              title="WhatsApp Support"
              number="https://wa.me/919876543210"
              description="Chat support for quick help"
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </section>

        {/* Common Tasks - Quick Steps */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Common Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickReferenceCard
              icon={FileText}
              title="Apply for New Loan"
              gradient="from-blue-500 to-cyan-500"
              color="blue"
              steps={[
                "Open Dashboard and click Request Loan",
                "Fill your name, phone number, and Aadhaar",
                "Enter amount needed and loan purpose",
                "Upload Aadhaar and shop photos",
                "Submit and track status"
              ]}
            />
            
            <QuickReferenceCard
              icon={CreditCard}
              title="Repay Your Loan"
              gradient="from-emerald-500 to-teal-500"
              color="emerald"
              steps={[
                "Open Transactions page",
                "Select loan to repay",
                "Click Repay",
                "Connect wallet (MetaMask)",
                "Confirm amount and send"
              ]}
            />
            
            <QuickReferenceCard
              icon={Wallet}
              title="Check Your Wallet"
              gradient="from-purple-500 to-pink-500"
              color="purple"
              steps={[
                "Open MetaMask app",
                "Check ETH balance",
                "Review transaction history",
                "Copy wallet address when required"
              ]}
            />
            
            <QuickReferenceCard
              icon={Users}
              title="Update Profile"
              gradient="from-orange-500 to-red-500"
              color="orange"
              steps={[
                "Open Profile page",
                "Edit business name and address",
                "Email and phone are locked fields",
                "Click Save Changes"
              ]}
            />
          </div>
        </section>

        {/* Loan Status Meanings */}
        <section className="mb-12 rounded-3xl bg-white border-2 border-gray-200 p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Loan Status Meaning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusBadge
              status="Pending"
              description="Waiting for lender review"
              color="amber"
              icon={Clock}
            />
            <StatusBadge
              status="Approved"
              description="Loan approved and disbursed"
              color="green"
              icon={CheckCircle}
            />
            <StatusBadge
              status="Rejected"
              description="Loan not approved"
              color="red"
              icon={XCircle}
            />
            <StatusBadge
              status="Repaid"
              description="Loan fully paid"
              color="blue"
              icon={DollarSign}
            />
          </div>
          <div className="mt-6 p-6 rounded-2xl bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-blue-900 mb-2">Remember:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>- <strong>Pending:</strong> Lender is reviewing your request</li>
                  <li>- <strong>Approved:</strong> Funds are sent to your wallet</li>
                  <li>- <strong>Rejected:</strong> Update profile details and apply again</li>
                  <li>- <strong>Repaid:</strong> Loan is complete</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Important Don'ts */}
        <section className="mb-12 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 p-8">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-red-900">
              Never Do This
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-red-200">
              <p className="font-bold text-red-900 mb-2">Never share OTP</p>
              <p className="text-sm text-red-700">Support team never asks OTP on calls.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-red-200">
              <p className="font-bold text-red-900 mb-2">Never share wallet secret phrase</p>
              <p className="text-sm text-red-700">Never share your 12-24 word secret phrase.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-red-200">
              <p className="font-bold text-red-900 mb-2">Avoid incorrect details</p>
              <p className="text-sm text-red-700">Do not upload fake documents or unclear photos.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-red-200">
              <p className="font-bold text-red-900 mb-2">Do not skip repayment</p>
              <p className="text-sm text-red-700">Skipping repayment can block future loans.</p>
            </div>
          </div>
        </section>

        {/* Tips for Success */}
        <section className="mb-12 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-8">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-green-900">
              Success Tips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white border-2 border-green-200 text-center">
              <CheckCircle className="w-9 h-9 mx-auto mb-3 text-green-600" />
              <p className="font-bold text-green-900 mb-2">Clear Photos</p>
              <p className="text-sm text-green-700">Take photos in clear daylight</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border-2 border-green-200 text-center">
              <CheckCircle className="w-9 h-9 mx-auto mb-3 text-green-600" />
              <p className="font-bold text-green-900 mb-2">Honest Reason</p>
              <p className="text-sm text-green-700">Write a clear and truthful loan purpose</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border-2 border-green-200 text-center">
              <CheckCircle className="w-9 h-9 mx-auto mb-3 text-green-600" />
              <p className="font-bold text-green-900 mb-2">On Time Repay</p>
              <p className="text-sm text-green-700">On-time repayment improves trust score</p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/vendor/request-loan")}
            className="p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:scale-105 transition-transform shadow-xl"
          >
            <FileText className="w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Apply for Loan</h3>
            <p className="text-white/90">Start a new request now</p>
          </button>
          
          <button
            onClick={() => navigate("/vendor/help")}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform shadow-xl"
          >
            <HelpCircle className="w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Help Center</h3>
            <p className="text-white/90">Open detailed support</p>
          </button>
          
          <button
            onClick={() => navigate("/vendor")}
            className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:scale-105 transition-transform shadow-xl"
          >
            <TrendingUp className="w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Dashboard</h3>
            <p className="text-white/90">View your profile and status</p>
          </button>
        </section>
      </main>
    </div>
  );
};

export default VendorQuickGuide;

