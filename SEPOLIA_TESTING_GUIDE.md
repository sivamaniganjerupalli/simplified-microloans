# Sepolia Testnet Quick Start Guide

##  Getting Started with DhanSetu on Sepolia

### Prerequisites
- MetaMask wallet extension installed
- Sepolia test ETH (free from faucets)
- Node.js 16+ and npm
- Backend and frontend installed

### Step 1: Setup Wallet

1. **Install MetaMask**: https://metamask.io
2. **Add Sepolia Network**:
   - Open MetaMask  Settings  Networks
   - Click "Add Network"  "Add a popular network"
   - Select "Sepolia"
3. **Get Test ETH**: Free from faucets:
   - https://sepoliafaucet.com
   - https://sepolia-faucet.pk910.de
   - https://faucets.chain.link/sepolia
   - (Paste your wallet address, claim 0.5-1 ETH)

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# .env already configured for Sepolia
# SEPOLIA_RPC_URL and CONTRACT_ADDRESS set to Sepolia deployment

# Start server
node server.js
# Server running on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
cd dhan-setu-frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Update REACT_APP_API_URL if backend is on different host

# Start development server
npm start
# Frontend running on http://localhost:3000
```

### Step 4: Test End-to-End Flow

#### As Lender:
1. Go to http://localhost:3000/register
2. Fill in registration form
3. Click "Connect MetaMask Wallet"
4. Approve transaction in MetaMask
5. Complete registration (Aadhaar + Phone verification)
6. Go to Lender Dashboard
7. Browse available loan requests
8. Click "Lend" on a loan
9. Approve transaction in MetaMask
10. Track investment in Portfolio

#### As Vendor:
1. Register as vendor
2. Go to Vendor Dashboard
3. Click "Request Loan"
4. Fill loan details:
   - Amount: 1000 USD (example)
   - Duration: 6 months
   - Purpose: Business expansion
5. Create loan (MetaMask popup)
6. Payment shows on blockchain in ~12 seconds
7. Monitor repayment schedule

### Step 5: Monitor on Etherscan

Open https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f

You should see:
- User transaction submissions
- Loan creation events
- Approval events
- Fund transfer transactions
- Gas fees used

### Step 6: Verify Data Consistency

Check that:
-  Loan appears in MongoDB
-  Status matches blockchain
-  Amount and dates are correct
-  User wallets match MetaMask
-  Transaction hashes visible on Etherscan

---

##  Troubleshooting

### "Network sepolia doesn't exist"
- Update hardhat.config.js network name to match
- Ensure SEPOLIA_RPC_URL in .env

### "Contract not found at address"
- Verify CONTRACT_ADDRESS in .env matches deployed address
- Check Etherscan: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f

### MetaMask won't connect
- Ensure Sepolia network selected in MetaMask
- Refresh page and try again
- Check network chain ID: 11155111

### Out of test ETH
- Get more from faucets (listed in Step 1)
- Wait a few minutes between faucet requests
- Each transaction uses ~0.001-0.01 ETH

### Transaction takes too long
- Sepolia blocks take ~12 seconds
- Check Etherscan for pending tx
- Wait up to 2 minutes for confirmation

---

##  Common Actions & Gas Costs

| Action | Gas Used | Cost (in ETH) | Est. Cost (USD) |
|--------|----------|---------------|-----------------|
| Create Loan | 150,000 | 0.003 | $1-3 |
| Approve Loan | 50,000 | 0.001 | $0.30-1 |
| Transfer Funds | 30,000 | 0.0006 | $0.20-0.60 |
| Repay Loan | 60,000 | 0.0012 | $0.40-1.20 |

*Costs vary based on network gas price*

---

##  Useful Links

- **Smart Context**: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f#code
- **Your Contract Events**: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f#events
- **Network Status**: https://sepolia.etherscan.io
- **Gas Tracker**: https://sepolia.etherscan.io/gastracker
- **Test Accounts**: MetaMask  Create multiple accounts to test different roles

---

##  Testing Checklist

Before moving to production, test:

- [ ] User registration & wallet connection
- [ ] Create loan request (Vendor)
- [ ] Browse loans (Lender)
- [ ] Approve & fund loan
- [ ] View transaction on Etherscan
- [ ] Database record created
- [ ] Loan status updated
- [ ] Multiple transactions in sequence
- [ ] Test with 2+ MetaMask accounts
- [ ] Error handling (insufficient gas, rejected tx)
- [ ] Withdraw funds/repay loan
- [ ] Check all events logged on blockchain

---

##  Production Migration Checklist

When ready for mainnet, ensure:
- [ ] All Sepolia tests passed
- [ ] No critical bugs identified
- [ ] Mainnet ETH funded in deployment wallet
- [ ] Contract audit completed (optional)
- [ ] Production RPC endpoint configured
- [ ] Secrets managed securely (no hardcoded keys)
- [ ] Backup and rollback plan documented
- [ ] Team trained on mainnet procedures
- [ ] Monitoring & alerting set up


---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
