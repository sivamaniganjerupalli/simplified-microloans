import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Shield, Zap, Users, IndianRupee, CheckCircle, ArrowRight,
  Menu, X, Star, TrendingUp, Clock, Lock, ChevronDown, Sparkles,
  BadgeCheck, BarChart3, Smartphone
} from 'lucide-react';
import home1 from '../assets/images/home1.png';
import home3 from '../assets/images/home3.png';
import home4 from '../assets/images/home4.png';
import home5 from '../assets/images/home5.png';

/* ─── tiny reusable pill ────────────────────────────────────────── */
const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
    {children}
  </span>
);

/* ─── floating gradient blob ────────────────────────────────────── */
const Blob = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${className}`} />
);

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Instant Approval',
      desc: 'AI-powered credit scoring approves your loan in under 10 minutes — no branch visit needed.',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      icon: Lock,
      title: 'Blockchain Security',
      desc: 'Every loan contract lives on Ethereum — fully transparent, tamper-proof, and auditable.',
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      icon: IndianRupee,
      title: 'Low Interest Rates',
      desc: 'Fair rates starting at just 5% p.a. with zero hidden charges or processing fees.',
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      desc: 'Designed for street vendors — big buttons, voice guidance, and works on any smartphone.',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    {
      icon: BarChart3,
      title: 'Credit Building',
      desc: 'Every repayment improves your credit score, unlocking bigger loans over time.',
      color: 'from-rose-500 to-red-500',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      icon: Users,
      title: 'Trusted Community',
      desc: 'Join 25,000+ verified vendors and lenders. Real people, real growth.',
      color: 'from-sky-500 to-cyan-500',
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
  ];

  const stats = [
    { value: '25K+', label: 'Active Vendors', icon: Users },
    { value: '₹100Cr+', label: 'Loans Disbursed', icon: IndianRupee },
    { value: '98.5%', label: 'Repayment Rate', icon: TrendingUp },
    { value: '<10 min', label: 'Avg. Approval', icon: Clock },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Account',
      desc: 'Register with your mobile number and Aadhar card in under 2 minutes.',
      icon: Smartphone,
    },
    {
      num: '02',
      title: 'Instant Verification',
      desc: 'Our AI verifies your documents automatically — no paperwork, no waiting.',
      icon: BadgeCheck,
    },
    {
      num: '03',
      title: 'Choose Your Loan',
      desc: 'Pick the amount and repayment tenure that fits your business needs.',
      icon: BarChart3,
    },
    {
      num: '04',
      title: 'Receive Funds',
      desc: 'Money hits your wallet within 24 hours of approval. Grow your business.',
      icon: Wallet,
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Street Food Vendor, Mumbai',
      text: 'Got ₹30,000 approved in just 8 minutes. Expanded my cart to double the size!',
      rating: 5,
      avatar: 'RK',
    },
    {
      name: 'Priya Sharma',
      role: 'Vegetable Seller, Delhi',
      text: 'No one gave me a loan before. DhanSetu trusted me. Now I buy fresh stock daily.',
      rating: 5,
      avatar: 'PS',
    },
    {
      name: 'Amit Patel',
      role: 'Tea Stall Owner, Surat',
      text: 'Simple app, big buttons, even explained in Hindi. Perfect for people like me.',
      rating: 5,
      avatar: 'AP',
    },
  ];

  const vendorMoments = [
    {
      src: home3,
      title: 'Fresh Inventory, Daily Growth',
      desc: 'DhanSetu helps vendors restock faster and keep sales moving every day.',
    },
    {
      src: home4,
      title: 'Built for Busy Streets',
      desc: 'A simple mobile flow that works during peak market hours without paperwork delays.',
    },
    {
      src: home5,
      title: 'Trust Through Transparency',
      desc: 'Every loan update stays visible and secure with blockchain-backed records.',
    },
  ];

  const faqs = [
    {
      q: 'Do I need a bank account to apply?',
      a: 'No. You only need a smartphone and your Aadhar card. Funds are sent directly to your digital wallet.',
    },
    {
      q: 'How is my data kept safe?',
      a: 'All personal data is encrypted end-to-end. Loan contracts are stored on the Ethereum blockchain — no one can alter them.',
    },
    {
      q: 'What is the maximum loan I can get?',
      a: 'First-time borrowers can get up to ₹50,000. Repeat borrowers with good repayment history can access up to ₹1,00,000.',
    },
    {
      q: 'What if I miss a repayment?',
      a: 'We send reminders 3 days before. If you\'re struggling, contact our support team — we work with you, not against you.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white overflow-x-hidden">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-white/10 shadow-xl'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-shadow">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Dhan<span className="text-blue-400">Setu</span>
              </span>
            </div>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8 text-sm text-gray-300 font-medium">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-sm text-gray-300 hover:text-white font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-6 pt-2 space-y-1 border-t border-white/10">
              {['#features', '#how-it-works', '#testimonials', '#faq'].map((href, i) => (
                <a
                  key={i}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors capitalize"
                >
                  {href.replace('#', '').replace(/-/g, ' ')}
                </a>
              ))}
              <div className="pt-3 space-y-2 px-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        {/* Background blobs */}
        <Blob className="w-[600px] h-[600px] bg-blue-600 -top-40 -right-40" />
        <Blob className="w-[500px] h-[500px] bg-purple-600 top-1/2 -left-60" />
        <Blob className="w-[400px] h-[400px] bg-indigo-400 bottom-0 right-1/4" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div>
                <Pill><Sparkles className="w-3 h-3" />Powered by Ethereum Blockchain</Pill>
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight">
                Microloans for
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Every Vendor
                </span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                From street food stalls to vegetable carts — get up to ₹1 Lakh approved in minutes.
                No bank account. No collateral. Just your Aadhar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 hover:shadow-2xl hover:shadow-blue-500/30 transition-all inline-flex items-center justify-center gap-2 text-base"
                >
                  Apply for Loan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-base"
                >
                  I'm a Lender
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                {[
                  { icon: CheckCircle, text: 'Zero Hidden Fees', color: 'text-emerald-400' },
                  { icon: Shield, text: 'KYC Secured', color: 'text-blue-400' },
                  { icon: Clock, text: '24hr Support', color: 'text-purple-400' },
                ].map(({ icon: Icon, text, color }, i) => (
                  <div key={i} className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
                    <Icon className="w-4 h-4" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image card */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-2xl scale-95" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-2 shadow-2xl max-w-md w-full">
                <img
                  src={home1}
                  alt="Vendor using DhanSetu"
                  className="w-full rounded-2xl object-cover"
                />
                {/* Floating stat chips */}
                <div className="absolute -bottom-5 -left-5 bg-[#0A0F1E] border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Repayment Rate</p>
                    <p className="text-lg font-bold text-emerald-400">98.5%</p>
                  </div>
                </div>
                <div className="absolute -top-5 -right-5 bg-[#0A0F1E] border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Avg. Approval</p>
                    <p className="text-lg font-bold text-blue-400">&lt;10 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS TICKER ────────────────────────────────────────── */}
      <section className="py-14 border-y border-white/10 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/10">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div key={i} className="text-center space-y-2 md:px-8">
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{value}</p>
                <p className="text-sm text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <Pill><Sparkles className="w-3 h-3" />Why DhanSetu</Pill>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Built for real people,<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">not just paperwork</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every feature is designed for street vendors — fast, simple, transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <Pill><Clock className="w-3 h-3" />Simple Process</Pill>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Funded in{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">4 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {/* connector */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-10" />
                )}
                <div className="group bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-white/25 hover:bg-white/[0.07] transition-all h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-5xl font-black text-white/10 leading-none select-none">{s.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => navigate('/register')}
              className="group px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 hover:shadow-2xl hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2"
            >
              Start Your Application
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── VENDOR MOMENTS ─────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Pill><Users className="w-3 h-3" />From the Ground</Pill>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Built around real vendor{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">workdays</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Not stock photos for style only. These visuals represent the speed and simplicity DhanSetu is designed for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendorMoments.map((item, i) => (
              <article
                key={i}
                className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 space-y-2">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section id="testimonials" className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <Pill><Star className="w-3 h-3" />Success Stories</Pill>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Real vendors,{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">real growth</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-all flex flex-col gap-5"
              >
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <Pill>Questions</Pill>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <Pill><Sparkles className="w-3 h-3" />Start Today — It's Free</Pill>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Your business deserves<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              a fair chance to grow
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Join 25,000+ vendors who chose DhanSetu. Apply in minutes, get funded today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="group px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 hover:shadow-2xl hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2 text-base"
            >
              Apply for a Loan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-base"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">Dhan<span className="text-blue-400">Setu</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Blockchain-powered microloans for street vendors across India.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'How It Works', 'Pricing', 'Security'],
              },
              {
                title: 'Company',
                links: ['About Us', 'Blog', 'Careers', 'Press'],
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href={`/${link.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                        className="text-gray-500 text-sm hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <span>© 2026 DhanSetu. All rights reserved.</span>
            <span>Made with ♥ for India's street vendors</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
