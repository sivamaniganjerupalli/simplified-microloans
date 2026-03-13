# DhanSetu â€” Frontend

> React 19 Â· Tailwind CSS Â· React Router v7 Â· Ethers.js Â· Dark Theme

This is the frontend application for **DhanSetu**, a blockchain-powered microloan platform for India's street vendors.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Production build (output: build/)
npm run build

# Run tests
npm test
```

---

## Environment Variables

Create `.env` in this directory:

```env
REACT_APP_LENDER_API_KEY=your_lender_api_key
REACT_APP_API_URL=http://localhost:5000
```

---

## Key Technologies

| Package | Version | Purpose |
|---|---|---|
| react | 19.x | Core UI library |
| react-router-dom | 7.x | Client-side routing |
| tailwindcss | 3.x | Utility-first CSS |
| lucide-react | 0.577+ | Icon set |
| axios | 1.x | HTTP requests to backend |
| ethers | 6.x | Ethereum wallet interaction |
| recharts | 3.x | Charts for dashboards |
| react-toastify | 11.x | Toast notifications |

---

## Folder Overview

```
src/
â”œâ”€â”€ App.js                 # Root router
â”œâ”€â”€ index.css              # Global dark theme CSS
â”œâ”€â”€ layouts/
â”‚   â””â”€â”€ DashboardLayout.jsx  # Sidebar + hamburger nav
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ Home.jsx           # Public landing page
â”‚   â”œâ”€â”€ Auth/              # Login, Register, OTP, ForgotPwd, Reset, 2FA
â”‚   â”œâ”€â”€ Vendor/            # All vendor dashboard pages (15 pages)
â”‚   â””â”€â”€ Lender/            # All lender dashboard pages (12 pages)
â”œâ”€â”€ components/
â”‚   â””â”€â”€ common/            # Button, Input, Select, Alert, Badge, Table, StatCard,
â”‚                          # Header, Footer, QuickAccessDock, ProtectedRoute, ErrorBoundary
â””â”€â”€ utils/                 # constants, formatters, validators
```

---

## Routes Summary

| Path | Page |
|---|---|
| `/` | Home (landing page) |
| `/login` | Login (vendor or lender) |
| `/register` | 3-step registration |
| `/verify-otp` | Email OTP verification |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |
| `/email-verified` | Verification success |
| `/2fa-setup` | TOTP 2FA setup |
| `/vendor` | Vendor dashboard |
| `/vendor/loans` | Loan applications |
| `/vendor/request-loan` | Apply for loan |
| `/vendor/transactions` | Transaction history |
| `/vendor/planner` | Repayment calculator |
| `/vendor/checklist` | Daily task checklist |
| `/vendor/reminders` | Reminder center |
| `/vendor/expense-tracker` | Expense tracking |
| `/vendor/sales-booster` | Business tips |
| `/vendor/easy` | Easy assist |
| `/vendor/tutorial` | Onboarding tutorial |
| `/vendor/quick-guide` | Visual quick guide |
| `/vendor/profile` | Profile |
| `/vendor/settings` | Settings |
| `/vendor/help` | Help center |
| `/lender` | Lender dashboard |
| `/lender/loans` | Loan requests |
| `/lender/portfolio` | Investment portfolio |
| `/lender/investments` | Investment history |
| `/lender/transactions` | Transaction log |
| `/lender/withdrawal` | Withdraw funds |
| `/lender/risk-analyzer` | Risk scoring tool |
| `/lender/yield-planner` | Return calculator |
| `/lender/opportunity-radar` | Opportunity finder |
| `/lender/profile` | Profile |
| `/lender/settings` | Settings |
| `/lender/help` | Help center |

---

## Theme & Design System

- **Base bg:** `#05070d` (near-black)
- **Dashboard bg:** `#0A0F1E`
- **Card bg:** `bg-slate-900/55` with `backdrop-blur`
- **Borders:** `border-slate-600/30`
- **Primary accent:** cyan â†’ blue gradient (`from-cyan-500 to-blue-600`)
- **Text:** slate-100 / slate-300 / slate-400
- **CSS scope classes:** `vendor-modern-scope`, `lender-modern-scope` (applied in DashboardLayout)

---

## Build Output

```
build/static/js/main.*.js    ~365 kB (gzipped)
build/static/css/main.*.css  ~18 kB  (gzipped)
```

For full project documentation, see the [root README](../README.md).


Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---
Last reviewed: 2026-03-14
