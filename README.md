# DhanSetu â€” Blockchain-Powered Microloan Platform

> **Empowering India's street vendors with instant, transparent, and secure microloans â€” backed by Ethereum smart contracts.**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Project Structure](#5-project-structure)
6. [Smart Contract](#6-smart-contract)
7. [Backend API](#7-backend-api)
8. [Frontend Application](#8-frontend-application)
9. [Database Models](#9-database-models)
10. [Authentication & Security](#10-authentication--security)
11. [Blockchain Integration](#11-blockchain-integration)
12. [Oracle System](#12-oracle-system)
13. [Environment Variables](#13-environment-variables)
14. [Installation & Setup](#14-installation--setup)
15. [Running the Application](#15-running-the-application)
16. [API Reference](#16-api-reference)
17. [Pages & Routes](#17-pages--routes)
18. [User Roles](#18-user-roles)
19. [Deployment](#19-deployment)
20. [Testing](#20-testing)

---

## 1. Project Overview

**DhanSetu** (meaning "Bridge of Wealth" in Hindi) is a full-stack decentralized microloan platform built to help street vendors â€” vegetable sellers, food stall owners, artisans â€” access small business loans quickly, without needing a bank account or collateral.

The platform uses **Ethereum smart contracts** to make every loan transparent, immutable, and tamper-proof. Vendors apply with their Aadhaar card, get verified via KYC, and receive funds to their wallet within 24 hours. Lenders can invest, track their portfolio, analyze risk, and withdraw returns â€” all through a modern dark-themed web dashboard.

### Goals
- Remove friction from the microloan process for unbanked vendors
- Use blockchain for trustless, verifiable loan contracts
- Provide lenders with transparent investment insights and risk tools
- Be mobile-first and accessible in multiple Indian languages

---

## 2. Key Features

### For Vendors
- Register with Aadhaar + wallet address (no bank account required)
- Apply for loans up to â‚¹1,00,000
- Track loan status (Pending â†’ Approved â†’ Repaid)
- View all transactions and repayment history
- Repayment Planner to calculate weekly/monthly payment schedules
- Daily Checklist to manage business tasks
- Reminder Center for upcoming repayments
- Expense Tracker for personal bookkeeping
- Sales Booster with vendor tips and strategies
- KYC Quick Guide and Easy Assist for first-time users
- Tutorial section for onboarding

### For Lenders
- Register with API key + wallet address
- View and approve loan requests
- Track active loans, investment history, and portfolio
- Withdraw funds back to wallet
- **Risk Analyzer** â€” score-based loan risk assessment with visual dashboards
- **Yield Planner** â€” calculate expected returns based on interest rates and tenure
- **Opportunity Radar** â€” discover high-potential loan opportunities across vendors
- Two-Factor Authentication (TOTP)

### Platform-Wide
- Blockchain-recorded loan contracts (Ethereum)
- AES-256-CBC encrypted KYC/Aadhaar data
- JWT-based authentication with role separation
- 6-digit OTP email verification on registration
- TOTP 2FA setup for lenders
- Password reset via secure tokenized email link
- Dark, modern UI across all pages
- QuickAccess floating dock (role-aware shortcuts)
- Responsive mobile-first design

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contracts** | Solidity 0.8.20, Hardhat 2.x, Ethers.js v6 |
| **Blockchain Network** | Ethereum (local: Ganache / testnet: configurable) |
| **Backend** | Node.js, Express.js 5.x |
| **Database** | MongoDB + Mongoose 8.x |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Email** | Nodemailer (Gmail SMTP) |
| **OTP / 2FA** | Custom OTP service, speakeasy (TOTP), QR Code |
| **File Uploads** | Multer |
| **Scheduling** | node-cron (Oracle jobs) |
| **Frontend** | React 19, Create React App |
| **Styling** | Tailwind CSS 3.x, custom dark-theme CSS |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM v7 |
| **PDF Export** | jsPDF + file-saver |
| **Linting** | ESLint (react-app) |

---

## 4. System Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                        CLIENT (React)                           â”‚
â”‚  Vendor Dashboard â”€â”€â”                                           â”‚
â”‚  Lender Dashboard â”€â”€â”¤â”€â”€â–º Axios HTTP â”€â”€â–º Express REST API        â”‚
â”‚  Auth Pages â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â”‚                                 â”‚
â”‚                               â”‚                                 â”‚
â”‚                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                      â”‚
â”‚                    â”‚   Backend (Node.js) â”‚                      â”‚
â”‚                    â”‚  - Route handlers   â”‚                      â”‚
â”‚                    â”‚  - JWT middleware   â”‚                      â”‚
â”‚                    â”‚  - KYC encryption   â”‚                      â”‚
â”‚                    â””â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”˜                      â”‚
â”‚                       â”‚              â”‚                          â”‚
â”‚              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”             â”‚
â”‚              â”‚  MongoDB   â”‚  â”‚  Ethereum Node    â”‚             â”‚
â”‚              â”‚ (Mongoose) â”‚  â”‚  (Ganache/Infura) â”‚             â”‚
â”‚              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜             â”‚
â”‚                                       â”‚                         â”‚
â”‚                          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”             â”‚
â”‚                          â”‚   LoanContract.sol    â”‚             â”‚
â”‚                          â”‚ - Vendor registration â”‚             â”‚
â”‚                          â”‚ - Loan lifecycle      â”‚             â”‚
â”‚                          â”‚ - Credit scoring      â”‚             â”‚
â”‚                          â”‚ - Lender deposits     â”‚             â”‚
â”‚                          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜             â”‚
â”‚                                                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚      Oracle (node-cron)                                  â”‚  â”‚
â”‚  â”‚   Reads vendor sales from DB â”€â”€â–º recordSales() on-chain  â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 5. Project Structure

```
simplified-microloans/
â”‚
â”œâ”€â”€ contracts/
â”‚   â””â”€â”€ LoanContract.sol          # Solidity smart contract
â”‚
â”œâ”€â”€ scripts/
â”‚   â””â”€â”€ deploy.js                 # Hardhat deployment script
â”‚
â”œâ”€â”€ test/
â”‚   â””â”€â”€ testLoanContract.js       # Smart contract unit tests
â”‚
â”œâ”€â”€ artifacts/                    # Compiled contract ABIs (auto-generated)
â”‚
â”œâ”€â”€ oracles/
â”‚   â””â”€â”€ salesOracleSimulator.js   # Cron job: pushes vendor sales to blockchain
â”‚
â”œâ”€â”€ hardhat.config.js             # Hardhat network + compiler config
â”œâ”€â”€ kycEncryption.js              # Root-level KYC util (reference)
â”œâ”€â”€ package.json                  # Root dependencies (backend + blockchain)
â”‚
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ server.js                 # Entry point â€” starts Express on configured port
â”‚   â”œâ”€â”€ app.js                    # Express app: CORS, routes, middleware setup
â”‚   â”‚
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ db.js                 # MongoDB connection via Mongoose
â”‚   â”‚
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ Vendor.js             # Vendor user schema
â”‚   â”‚   â”œâ”€â”€ Lender.js             # Lender user schema
â”‚   â”‚   â”œâ”€â”€ Loan.js               # Loan application schema
â”‚   â”‚   â””â”€â”€ Transaction.js        # Transaction record schema
â”‚   â”‚
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ vendorController.js   # Vendor auth + loan logic
â”‚   â”‚   â”œâ”€â”€ lenderController.js   # Lender auth + approval logic
â”‚   â”‚   â””â”€â”€ loanController.js     # Loan CRUD operations
â”‚   â”‚
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ vendorRoutes.js       # /api/vendor/*
â”‚   â”‚   â”œâ”€â”€ lenderDashboardRoutes.js  # /api/lender/*
â”‚   â”‚   â”œâ”€â”€ loanRoutes.js         # /api/loan/*
â”‚   â”‚   â”œâ”€â”€ otpRoutes.js          # /api/otp/*
â”‚   â”‚   â”œâ”€â”€ totpRoutes.js         # /api/totp/*
â”‚   â”‚   â””â”€â”€ authRoutes.js         # /api/auth/* (forgot/reset password, 2FA)
â”‚   â”‚
â”‚   â”œâ”€â”€ middlewares/
â”‚   â”‚   â”œâ”€â”€ auth.js               # JWT Bearer token verification
â”‚   â”‚   â”œâ”€â”€ authenticate.js       # Alternate auth middleware
â”‚   â”‚   â””â”€â”€ requireLender.js      # Role-guard: lender-only routes
â”‚   â”‚
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ blockchain.js         # Ethers.js contract instance
â”‚   â”‚   â”œâ”€â”€ kycEncryption.js      # AES-256-CBC encrypt/decrypt Aadhaar
â”‚   â”‚   â”œâ”€â”€ otpService.js         # Generate/verify OTP via email
â”‚   â”‚   â”œâ”€â”€ totpService.js        # TOTP 2FA setup + verification
â”‚   â”‚   â””â”€â”€ oracleHelper.js       # Push sales data to blockchain
â”‚   â”‚
â”‚   â””â”€â”€ uploads/                  # Multer upload destination (KYC images)
â”‚
â””â”€â”€ dhan-setu-frontend/
    â”œâ”€â”€ package.json
    â”œâ”€â”€ tailwind.config.js
    â”œâ”€â”€ postcss.config.js
    â”‚
    â”œâ”€â”€ public/
    â”‚   â””â”€â”€ index.html
    â”‚
    â””â”€â”€ src/
        â”œâ”€â”€ App.js                # Root router â€” all route definitions
        â”œâ”€â”€ index.js              # React entry point
        â”œâ”€â”€ index.css             # Global dark theme CSS overrides
        â”œâ”€â”€ App.css               # Base app styles
        â”‚
        â”œâ”€â”€ assets/
        â”‚   â”œâ”€â”€ images/           # home1.png, home2.png (hero images)
        â”‚   â””â”€â”€ icons/
        â”‚
        â”œâ”€â”€ components/
        â”‚   â”œâ”€â”€ common/
        â”‚   â”‚   â”œâ”€â”€ Button.jsx          # Reusable dark-themed button
        â”‚   â”‚   â”œâ”€â”€ Input.jsx           # Dark-themed text input
        â”‚   â”‚   â”œâ”€â”€ Select.jsx          # Dark-themed select box
        â”‚   â”‚   â”œâ”€â”€ Alert.jsx           # Success/error/warning/info alerts
        â”‚   â”‚   â”œâ”€â”€ Badge.jsx           # Status badge (active, pending, etc.)
        â”‚   â”‚   â”œâ”€â”€ StatCard.jsx        # Dashboard metric card
        â”‚   â”‚   â”œâ”€â”€ Table.jsx           # Dark-themed data table with search/sort
        â”‚   â”‚   â”œâ”€â”€ Header.jsx          # Public page header/navbar
        â”‚   â”‚   â”œâ”€â”€ Footer.jsx          # Site footer
        â”‚   â”‚   â”œâ”€â”€ QuickAccessDock.jsx # Floating role-aware shortcuts dock
        â”‚   â”‚   â”œâ”€â”€ ProtectedRoute.jsx  # Route guard (checks JWT + role)
        â”‚   â”‚   â””â”€â”€ ErrorBoundary.jsx   # React error boundary
        â”‚   â”‚
        â”‚   â””â”€â”€ progress/
        â”‚       â”œâ”€â”€ ProgressBar.jsx
        â”‚       â””â”€â”€ StepIndicator.jsx
        â”‚
        â”œâ”€â”€ layouts/
        â”‚   â””â”€â”€ DashboardLayout.jsx  # Shared sidebar + hamburger layout
        â”‚
        â”œâ”€â”€ pages/
        â”‚   â”œâ”€â”€ Home.jsx             # Landing page
        â”‚   â”œâ”€â”€ NotFound.jsx         # 404 page
        â”‚   â”‚
        â”‚   â”œâ”€â”€ Auth/
        â”‚   â”‚   â”œâ”€â”€ Login.jsx
        â”‚   â”‚   â”œâ”€â”€ Register.jsx
        â”‚   â”‚   â”œâ”€â”€ VerifyOTP.jsx
        â”‚   â”‚   â”œâ”€â”€ ForgotPassword.jsx
        â”‚   â”‚   â”œâ”€â”€ ResetPassword.jsx
        â”‚   â”‚   â”œâ”€â”€ EmailVerificationSuccess.jsx
        â”‚   â”‚   â”œâ”€â”€ TwoFactorSetup.jsx
        â”‚   â”‚   â””â”€â”€ AuthLayout.jsx
        â”‚   â”‚
        â”‚   â”œâ”€â”€ Vendor/
        â”‚   â”‚   â”œâ”€â”€ Dashboard.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorLoans.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorTransactions.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorProfile.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorSettings.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorHelp.jsx
        â”‚   â”‚   â”œâ”€â”€ LoanRequestForm.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorRepaymentPlanner.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorDailyChecklist.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorReminderCenter.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorExpenseTracker.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorSalesBooster.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorEasyAssist.jsx
        â”‚   â”‚   â”œâ”€â”€ VendorTutorial.jsx
        â”‚   â”‚   â””â”€â”€ VendorQuickGuide.jsx
        â”‚   â”‚
        â”‚   â””â”€â”€ Lender/
        â”‚       â”œâ”€â”€ Dashboard.jsx
        â”‚       â”œâ”€â”€ LenderLoans.jsx
        â”‚       â”œâ”€â”€ LenderPortfolio.jsx
        â”‚       â”œâ”€â”€ LenderTransactions.jsx
        â”‚       â”œâ”€â”€ LenderInvestmentHistory.jsx
        â”‚       â”œâ”€â”€ LenderWithdrawal.jsx
        â”‚       â”œâ”€â”€ LenderRiskAnalyzer.jsx
        â”‚       â”œâ”€â”€ LenderYieldPlanner.jsx
        â”‚       â”œâ”€â”€ LenderOpportunityRadar.jsx
        â”‚       â”œâ”€â”€ LenderProfile.jsx
        â”‚       â”œâ”€â”€ LenderSettings.jsx
        â”‚       â””â”€â”€ LenderHelp.jsx
        â”‚
        â””â”€â”€ utils/
            â”œâ”€â”€ constants.js
            â”œâ”€â”€ formatters.js
            â””â”€â”€ validators.js
```

---

## 6. Smart Contract

**File:** `contracts/LoanContract.sol`  
**Compiler:** Solidity `^0.8.20` with optimizer enabled (200 runs)

### Entities

| Struct | Fields |
|---|---|
| `Vendor` | walletAddress, totalSales, creditScore (0â€“1000), totalLoansRepaid, totalLoanDefaults, exists, isBlacklisted |
| `Lender` | walletAddress, totalLent, totalRepaid, availableBalance, exists |
| `Loan` | loanId, lender, principalAmount, interestRate (basis points), disbursementDate, dueDate, amountRepaid, lateFeeRate, isFullyRepaid, isDefaulted, status |

### Loan Status Flow
```
PENDING â†’ ACTIVE â†’ REPAYING â†’ COMPLETED
                             â†’ DEFAULTED
```

### Key Functions

| Function | Access | Description |
|---|---|---|
| `registerVendor(address)` | Admin | Register a new vendor on-chain |
| `recordSales(address, uint256)` | Admin | Push vendor sales amount to blockchain |
| `setVendorBlacklist(address, bool)` | Admin | Blacklist/unblacklist a vendor |
| `registerLender()` | Public | Self-register as a lender |
| `depositFunds()` | Lender | Deposit ETH into lender balance |
| `approveLoan(uint256, address)` | Lender | Approve a pending loan request |
| `disburseLoan(uint256)` | Admin | Disburse approved loan to vendor |
| `makePayment(uint256)` | Vendor | Make partial or full repayment |
| `markDefault(uint256)` | Admin | Mark loan as defaulted |
| `updateCreditScore(address, uint256)` | Admin | Manually update vendor credit score |

### Key Events
- `VendorRegistered`, `VendorBlacklisted`
- `LenderRegistered`, `LenderDeposit`
- `SalesRecorded`
- `LoanRequested`, `LoanApproved`, `LoanDisbursed`
- `PaymentMade`, `LoanFullyRepaid`, `LoanDefaulted`
- `CreditScoreUpdated`, `PlatformFeeCollected`

### Platform Parameters
- Platform fee: **0.5%** (50 basis points)
- Default grace period: **30 days**
- Credit score range: **0â€“1000** (new vendors start at 500)
- Interest rate stored in **basis points** (100 = 1%)

---

## 7. Backend API

**Base URL:** `http://localhost:5000`

### Authentication Routes (`/api/vendor`, `/api/lender`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/vendor/register` | Register new vendor |
| POST | `/api/vendor/login` | Vendor login â†’ returns JWT |
| POST | `/api/vendor/profile` | Get vendor profile (protected) |
| POST | `/api/lender/register` | Register new lender |
| POST | `/api/lender/login` | Lender login (requires API key) |
| GET | `/api/lender/dashboard` | Lender dashboard stats (protected) |
| GET | `/api/lender/loans` | All loan requests (protected) |
| POST | `/api/lender/approve/:id` | Approve a loan (protected) |
| POST | `/api/lender/reject/:id` | Reject a loan (protected) |

### Loan Routes (`/api/loan`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/loan/apply` | Submit new loan application |
| GET | `/api/loan/my-loans` | Get vendor's own loans (protected) |
| POST | `/api/loan/repay/:id` | Mark loan as repaid |
| GET | `/api/loan/all` | Get all loans (lender only) |

### OTP Routes (`/api/otp`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/otp/send` | Send 6-digit OTP to email |
| POST | `/api/otp/verify` | Verify OTP code |

### TOTP / 2FA Routes (`/api/totp`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/totp/generate` | Generate TOTP secret + QR code |
| POST | `/api/totp/verify` | Verify TOTP code |
| POST | `/api/totp/disable` | Disable 2FA |

### Auth Utility Routes (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/validate-reset-token` | Check token validity |
| POST | `/api/auth/reset-password` | Set new password |
| POST | `/api/auth/2fa/generate` | Generate 2FA QR code |
| POST | `/api/auth/2fa/verify` | Verify 2FA and enable |

### Static Files
```
GET /uploads/:filename   â†’ Serve uploaded KYC images
```

---

## 8. Frontend Application

Built with **React 19** (Create React App), **Tailwind CSS 3**, **React Router DOM v7**, and **Lucide React** icons.

### Design System
- **Theme:** Full dark black (`#05070d` base, `#0A0F1E` dashboard)
- **Accent:** Cyan / Blue (`from-cyan-500 to-blue-600`)
- **Cards:** `bg-slate-900/55` with `border-slate-600/30` and `backdrop-blur`
- **Text:** `text-slate-100` (primary), `text-slate-300` (secondary), `text-slate-400` (muted)
- **Inputs:** `bg-slate-950/60 border-slate-600/40 text-slate-100`
- CSS scope classes `vendor-modern-scope` and `lender-modern-scope` applied per role in `DashboardLayout`

### Protected Routes
`ProtectedRoute` component checks:
1. `localStorage.getItem("token")` â€” if missing, redirects to `/login`
2. `localStorage.getItem("role")` â€” must match `requiredRole` prop

### QuickAccess Dock
A floating panel (`QuickAccessDock.jsx`) docked to bottom-right:
- **Closed by default** â€” shows small "Quick Access" toggle button
- **Opens on click** â€” reveals 3 role-specific quick-action buttons
- **Lender shortcuts:** Risk Analyzer, Withdraw Funds, Help
- **Vendor shortcuts:** Reminder Center, Expense Tracker, Help
- Closes with âœ• button

---

## 9. Database Models

### Vendor (`/backend/models/Vendor.js`)
```
fullname, surname, email (unique), phone (unique), password,
role: "vendor", aadhaarNumber (unique), encryptedKYC, walletAddress,
profileImage, enable2FA, notifyByEmail, notifyBySMS,
language ("en" / "hi" / "te"), theme ("light" / "dark"),
emailVerified, isEmailVerified, resetToken, resetTokenExpiry,
totp_secret, totp_enabled, createdAt, updatedAt
```

### Lender (`/backend/models/Lender.js`)
```
fullname, surname, email (unique), aadhaarNumber (unique),
phone, walletAddress, encryptedKYC, profileImage,
password, enable2FA, walletBalance, role: "lender",
language, theme, notifyByEmail, notifyBySMS,
lastLogin, createdAt, updatedAt
```

### Loan (`/backend/models/Loan.js`)
```
vendorId (ref: Vendor), lenderId (ref: Lender),
fullName, surname, dob, email, phone, aadhaar,
location, walletAddress, loanAmount, reason, repayTime,
businessType, termsAccepted,
aadhaarImage (filename), businessImage (filename),
amount, interestRate,
status: "Pending" | "Approved" | "Rejected" | "Repaid",
repaymentDue, repaid, repaymentDate, approvedAt,
transactionHash (MetaMask tx hash),
createdAt, updatedAt
```

### Transaction (`/backend/models/Transaction.js`)
```
vendorId / lenderId, loanId, type, amount,
txHash, status, createdAt
```

---

## 10. Authentication & Security

### JWT Tokens
- All protected routes require `Authorization: Bearer <token>` header
- Tokens are signed with `JWT_SECRET` environment variable
- Expiry: configurable (default varies by route)

### Password Hashing
- Passwords are hashed using **bcrypt** with salt rounds

### KYC Encryption
- Aadhaar numbers are **never stored in plaintext**
- Encrypted using AES-256-CBC with a random 16-byte IV
- Key derived from `KYC_SECRET` via SHA-256
- Stored as `iv:encryptedHex` string in MongoDB

### OTP Email Verification
- 6-digit OTP generated via `crypto.randomBytes`
- Stored in-memory with 5-minute expiry (`Map`)
- Sent via Gmail SMTP (Nodemailer)

### TOTP 2FA
- Uses `speakeasy` to generate TOTP secrets
- QR code rendered with `qrcode` library
- Configurable per user; backup codes provided

### CORS
- Strict origin whitelist: `FRONTEND_URL` + `localhost:3000/3001`
- Credentials allowed

### Lender API Key
- Lenders must present a valid `REACT_APP_LENDER_API_KEY` on login
- Validated both client-side and server-side

---

## 11. Blockchain Integration

**File:** `backend/utils/blockchain.js`

```js
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_API);
const signer   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, signer);
```

- ABI loaded from `artifacts/contracts/LoanContract.sol/LoanContract.json`
- Works with any EVM-compatible node (Ganache locally, Infura for testnet/mainnet)
- MetaMask transaction hashes are stored against approved loans in MongoDB

### Deploying the Contract
```bash
# Start local Ganache first (port 7545)
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
# Copy the deployed address into .env as CONTRACT_ADDRESS
```

---

## 12. Oracle System

**File:** `oracles/salesOracleSimulator.js`

The Oracle bridges real-world vendor sales data with the smart contract:

1. **Connects to MongoDB** to fetch all registered vendors
2. **Simulates daily sales** in range â‚¹100â€“â‚¹1000 per vendor (replace with real POS/UPI data in production)
3. **Calls `recordSales(address, amount)`** on-chain via `oracleHelper.js`
4. **Scheduled via `node-cron`** to run every day at 09:00 AM

On-chain sales data is used for:
- **Credit score calculation** (longer repayment history + higher sales = better score)
- **Loan eligibility** (higher sales increase borrowing limit)

```bash
# Run oracle manually for testing
node oracles/salesOracleSimulator.js
```

---

## 13. Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/dhansetu

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# KYC Encryption
KYC_SECRET=your_kyc_encryption_secret_32chars

# Email (Gmail SMTP)
OTP_EMAIL=your_gmail@gmail.com
OTP_PASS=your_gmail_app_password

# Blockchain
INFURA_API=http://127.0.0.1:7545
PRIVATE_KEY=your_ethereum_wallet_private_key
CONTRACT_ADDRESS=0xYourDeployedContractAddress

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in `dhan-setu-frontend/`:

```env
# Lender API Key (must match backend validation)
REACT_APP_LENDER_API_KEY=your_lender_api_key

# Backend base URL (optional, defaults to localhost:5000)
REACT_APP_API_URL=http://localhost:5000
```

---

## 14. Installation & Setup

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local or MongoDB Atlas)
- Ganache (for local Ethereum blockchain)
- Git

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/simplified-microloans.git
cd simplified-microloans

# Install root dependencies (backend + hardhat)
npm install

# Install frontend dependencies
cd dhan-setu-frontend
npm install
cd ..
```

### Compile Smart Contract

```bash
npx hardhat compile
```

### Deploy Smart Contract (local)

```bash
# 1. Start Ganache on port 7545
# 2. Run the deployment script
npx hardhat run scripts/deploy.js --network localhost
# 3. Copy the output contract address to .env (CONTRACT_ADDRESS)
```

---

## 15. Running the Application

### Development Mode

**Terminal 1 â€” Backend:**
```bash
npm run dev
# Starts Express server on http://localhost:5000
# Uses nodemon for auto-restart on changes
```

**Terminal 2 â€” Frontend:**
```bash
cd dhan-setu-frontend
npm start
# Starts React dev server on http://localhost:3000
```

**Terminal 3 â€” Oracle (optional):**
```bash
node oracles/salesOracleSimulator.js
# Runs once immediately, then schedules daily at 09:00 AM
```

### Production Build

```bash
# Build frontend
cd dhan-setu-frontend
npm run build
# Output in dhan-setu-frontend/build/

# Start backend in production
NODE_ENV=production npm start
```

---

## 16. API Reference

### Request Headers (Protected Routes)
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Example: Register Vendor
```http
POST /api/vendor/register
{
  "fullname": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "aadhaarNumber": "123456789012",
  "walletAddress": "0xABC123..."
}
```

### Example: Login
```http
POST /api/vendor/login
{
  "email": "rajesh@example.com",
  "password": "SecurePass123",
  "role": "vendor"
}

Response:
{
  "success": true,
  "token": "eyJhbGci...",
  "role": "vendor",
  "userId": "..."
}
```

### Example: Apply for Loan
```http
POST /api/loan/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

fullName, surname, dob, email, phone, aadhaar,
location, walletAddress, loanAmount, reason,
repayTime, businessType, termsAccepted,
aadhaarImage (file), businessImage (file)
```

### Example: Send OTP
```http
POST /api/otp/send
{ "email": "rajesh@example.com" }

POST /api/otp/verify
{ "email": "rajesh@example.com", "otp": "492817" }
```

---

## 17. Pages & Routes

### Public Routes
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with features, how-it-works, testimonials, FAQ |
| `/login` | `Login` | Dual-role login (vendor / lender with API key) |
| `/register` | `Register` | 3-step registration (role â†’ info â†’ password + wallet) |
| `/verify-otp` | `VerifyOTP` | Email OTP verification after registration |
| `/forgot-password` | `ForgotPassword` | Request password reset link |
| `/reset-password` | `ResetPassword` | Set new password via tokenized link |
| `/email-verified` | `EmailVerificationSuccess` | Post-verification success (auto-redirect to login) |
| `/2fa-setup` | `TwoFactorSetup` | TOTP 2FA onboarding (scan QR, verify, save backup codes) |

### Lender Dashboard Routes (protected, role: `lender`)
| Path | Component | Description |
|---|---|---|
| `/lender` | `LenderDashboard` | Overview: total lent, active loans, returns, stats |
| `/lender/loans` | `LenderLoans` | All loan requests with filter/approve/reject |
| `/lender/portfolio` | `LenderPortfolio` | Portfolio breakdown with charts |
| `/lender/investments` | `LenderInvestmentHistory` | Full investment history table |
| `/lender/transactions` | `LenderTransactions` | All financial transactions |
| `/lender/withdrawal` | `LenderWithdrawal` | Withdraw funds to wallet |
| `/lender/risk-analyzer` | `LenderRiskAnalyzer` | Risk scoring dashboard |
| `/lender/yield-planner` | `LenderYieldPlanner` | Return calculator tool |
| `/lender/opportunity-radar` | `LenderOpportunityRadar` | Discover loan opportunities |
| `/lender/settings` | `LenderSettings` | Account preferences + 2FA + notifications |
| `/lender/profile` | `LenderProfile` | View/edit lender profile |
| `/lender/help` | `LenderHelp` | Help center, FAQs, contacts |

### Vendor Dashboard Routes (protected, role: `vendor`)
| Path | Component | Description |
|---|---|---|
| `/vendor` | `VendorDashboard` | Overview: wallet balance, loans, quick actions |
| `/vendor/loans` | `VendorLoans` | All loan applications + status tracker |
| `/vendor/transactions` | `VendorTransactions` | Payment history |
| `/vendor/request-loan` | `LoanRequestForm` | Multi-step loan application form |
| `/vendor/planner` | `VendorRepaymentPlanner` | EMI / weekly repayment calculator |
| `/vendor/checklist` | `VendorDailyChecklist` | Daily business task checklist |
| `/vendor/reminders` | `VendorReminderCenter` | Set/view repayment reminders |
| `/vendor/expense-tracker` | `VendorExpenseTracker` | Log and track business expenses |
| `/vendor/sales-booster` | `VendorSalesBooster` | Tips and strategies to grow sales |
| `/vendor/easy` | `VendorEasyAssist` | Simplified help for first-time users |
| `/vendor/tutorial` | `VendorTutorial` | Step-by-step onboarding tutorial |
| `/vendor/quick-guide` | `VendorQuickGuide` | Visual quick-start guide |
| `/vendor/settings` | `VendorSettings` | Preferences, language, notifications |
| `/vendor/profile` | `VendorProfile` | View/edit vendor profile |
| `/vendor/help` | `VendorHelp` | Help center |

---

## 18. User Roles

### Vendor
- Registered via `/register` with role `vendor`
- JWT payload contains `role: "vendor"` and `userId`
- Can access `/vendor/*` protected routes
- Cannot access Lender routes

### Lender
- Registered via `/register` with role `lender`
- **Login requires a valid `REACT_APP_LENDER_API_KEY`** (both client + server validated)
- JWT payload contains `role: "lender"` and `userId`
- Can access `/lender/*` protected routes
- Can approve and reject vendor loan requests

### Admin
- Exists only at smart contract level (`admin` = deployer wallet address)
- Can register vendors on-chain, record sales, blacklist vendors, disburse loans, mark defaults

---

## 19. Deployment

### Frontend (Static)
The React app builds to `dhan-setu-frontend/build/`. Deploy to:
- **Vercel:** connect repo, set `Root Directory = dhan-setu-frontend`, all env vars
- **Netlify:** drag-and-drop `build/` folder or connect repo
- **AWS S3 + CloudFront:** upload `build/` and point CloudFront to S3

### Backend (Node.js)
Deploy to:
- **Railway / Render / Heroku:** `npm start` with all `.env` vars set in dashboard
- **AWS EC2:** use PM2 (`pm2 start backend/server.js`)
- **Docker:** containerize with a `Dockerfile` exposing port 5000

### Smart Contract (Production)
1. Set `INFURA_API` to your Infura / Alchemy endpoint for Sepolia/Mainnet
2. Set `PRIVATE_KEY` to deployer wallet private key
3. Run `npx hardhat run scripts/deploy.js --network sepolia`
4. Update `CONTRACT_ADDRESS` in all environment configs

---

## 20. Testing

### Smart Contract Tests
```bash
npx hardhat test
# Runs test/testLoanContract.js
```

### Backend
```bash
# No automated tests currently â€” manual testing via Postman recommended
# Import endpoints from API Reference section above
```

### Frontend
```bash
cd dhan-setu-frontend
npm test
# Runs React Testing Library tests (App.test.js, setupTests.js)
```

### Build Validation
```bash
cd dhan-setu-frontend
npm run build
# Should complete with "Compiled with warnings." (only pre-existing lint warnings)
# Bundle: ~365 kB JS (gzipped), ~18 kB CSS
```

---

## License

ISC License â€” see [LICENSE](LICENSE) for details.

---

## Author

Built with â¤ï¸ for India's street vendors â€” making financial inclusion a reality through blockchain technology.

---

*DhanSetu â€” Blockchain Microloans Â· Ethereum Â· React Â· Node.js Â· MongoDB*

---
Last reviewed: 2026-03-14
