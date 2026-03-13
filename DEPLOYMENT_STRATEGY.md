# DhanSetu Blockchain Deployment Strategy

## Current Status Ã¢Å“â€¦

- **Smart Contract**: Deployed to Sepolia Testnet
- **Contract Address**: `0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f`
- **Network**: Sepolia (Chain ID: 11155111)
- **Verification**: Verified on Etherscan Ã¢Å“â€œ
- **Explorer**: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
- **Backend**: Configured to use Sepolia RPC via `SEPOLIA_RPC_URL`
- **Test ETH Balance**: 0.1198 ETH available

---

## Environment Configuration

### Backend (`.env`)
```env
# Blockchain Configuration
PRIVATE_KEY=41c1a3c06b63e510702093436905fe1bb93c4e9ba9749c9ace2bdf790509f9fe
GANACHE_RPC_URL=http://127.0.0.1:8545
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a
ETHERSCAN_API_KEY=HZ124ZD68E4FEAU6V4EC5TDCEA1WQZE5DD
CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
BLOCKCHAIN_NETWORK=sepolia
```

### Frontend Setup
Add to `dhan-setu-frontend/.env`:
```env
REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
REACT_APP_BLOCKCHAIN_NETWORK=sepolia
REACT_APP_API_URL=http://localhost:5000/api
```

### Hardhat Configuration
File: `hardhat.config.js`
- Networks: Ganache (local) + Sepolia (testnet)
- Etherscan: Configured for contract verification
- Default network: Sepolia (`--network sepolia`)

---

## Phase 1: Sepolia Testnet Testing (CURRENT) Ã°Å¸Å¸Â¢

### What to Test
1. **User Registration & KYC**
   - Wallet connection (MetaMask)
   - Aadhaar + Phone verification
   - Profile setup

2. **Loan Operations**
   - Create loan request (Vendor)
   - Lend money (Lender)
   - Loan disbursement
   - Repayment (including interest calculations)

3. **Smart Contract Integration**
   - Loan creation on blockchain
   - Approval workflow
   - Fund transfers
   - Event logging

4. **Backend-Blockchain Sync**
   - MongoDB updates match blockchain state
   - Transaction tracking
   - Gas fee calculations

### Quick Test Checklist
```bash
# 1. Start backend
cd backend
npm install
node server.js

# 2. Test blockchain connectivity
node tests/testSepoliaContract.js

# 3. Start frontend
cd dhan-setu-frontend
npm install
npm start

# 4. Manual user flow
- Register new account (use Sepolia MetaMask account)
- Create a sample loan request
- Approve from lender account
- Check Etherscan for transaction

# 5. Monitor transactions
https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

### Funding Requirements
- **Per transaction**: ~0.01 ETH (gas fees on Sepolia)
- **Current balance**: 0.1198 ETH
- **Available for ~11 transactions**
- **Faucets** (when balance low):
  - https://sepoliafaucet.com
  - https://sepolia-faucet.pk910.de
  - https://faucets.chain.link/sepolia

---

## Phase 2: Bug Fixes & Optimization (AFTER TESTING)

Before mainnet, address:
1. Gas optimization (if high fees observed)
2. Error handling edge cases
3. Multi-sig support (for production)
4. Rate limiting (API + blockchain)
5. Audit potential vulnerabilities

---

## Phase 3: Production Mainnet Deployment (FUTURE)

### Prerequisites
- Ã¢Å“â€¦ Full Sepolia testing complete (2-4 weeks minimum)
- Ã¢Å“â€¦ No critical bugs in transaction flow
- Ã¢Å“â€¦ Smart contract audited (optional but recommended)
- Ã¢Å“â€¦ Mainnet ETH secured for deployment + operations
- Ã¢Å“â€¦ Production infrastructure ready

### Mainnet Deployment Steps
1. **Update hardhat.config.js** - Add Ethereum mainnet network
2. **Secure private key** - Use hardware wallet or secure vault
3. **Deploy contract**:
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```
4. **Verify on Etherscan**:
   ```bash
   npx hardhat verify --network mainnet <contract-address>
   ```
5. **Update production environment**:
   - `.env` with mainnet contract address
   - `MAINNET_RPC_URL` (Infura/Alchemy)
   - `BLOCKCHAIN_NETWORK=mainnet`
6. **Frontend update**:
   - Update `REACT_APP_CONTRACT_ADDRESS`
   - Update `REACT_APP_BLOCKCHAIN_NETWORK`
7. **Database migration** - Ensure compatibility
8. **Enable contract pause mechanism** - For emergency stops

---

## Network Comparison

| Feature | Ganache | Sepolia | Mainnet |
|---------|---------|---------|---------|
| **Environment** | Local | Public Testnet | Production |
| **Gas Costs** | Free (simulated) | ~0.001-0.1 ETH/tx | 0.1-10+ ETH/tx |
| **Consensus** | Instant | ~12 sec blocks | ~12 sec blocks |
| **Persistence** | Session only | Permanent | Permanent |
| **Visibility** | Local only | Public explorer | Public explorer |
| **Use Case** | Development | Testing/Staging | Live Users |

---

## Smart Contract Functions Reference

Key LoanContract functions (call from backend/frontend):

```solidity
// Core Loan Operations
- createLoan(amount, duration, interestRate) Ã¢â€ â€™ returns loanId
- approveLoan(loanId) Ã¢â€ â€™ lender approves
- disburseLoan(loanId) Ã¢â€ â€™ send funds to vendor
- repayLoan(loanId, amount) Ã¢â€ â€™ make payment

// View Functions
- getLoans(borrower) Ã¢â€ â€™ array of loans
- getLoan(loanId) Ã¢â€ â€™ loan details
- getTotalBorrowed(borrower) Ã¢â€ â€™ total amount
- getInterestDue(loanId) Ã¢â€ â€™ interest calculation
```

---

## Important Notes

Ã¢Å¡Â Ã¯Â¸Â **Before Mainnet:**
- Test withdrawal/transfer functions thoroughly
- Verify gas cost calculations
- Test with different user types (vendor, lender, borrower)
- Ensure database-blockchain synchronization works reliably
- Have a rollback plan ready

Ã°Å¸â€Â **Security Checklist:**
- No hardcoded private keys in code
- Use environment variables for all secrets
- Enable rate limiting on API endpoints
- Implement transaction validation on both sides
- Monitor for unusual contract activity on Etherscan

Ã°Å¸â€œÅ  **Monitoring After Deployment:**
- Set up alerts for failed transactions
- Track gas prices and costs
- Monitor contract balance
- Check event logs for anomalies
- Regular Etherscan audits

---

## Support Resources

- **Etherscan**: https://sepolia.etherscan.io
- **Hardhat Docs**: https://hardhat.org/docs
- **Ethers.js v6 Docs**: https://docs.ethers.org/v6
- **Sepolia Faucets**: https://sepoliafaucet.com
- **MetaMask Setup**: https://metamask.io

---

## Next Immediate Actions

1. Ã¢Å“â€¦ Add `.env` to frontend with contract address
2. Ã¢Å“â€¦ Test loan creation flow end-to-end
3. Ã¢Å“â€¦ Verify all transactions appear on Etherscan
4. Ã¢Å“â€¦ Test with multiple MetaMask accounts
5. Ã¢ÂÂ³ Plan 2-4 week Sepolia testing phase
6. Ã¢ÂÂ³ Document any bugs/improvements found
7. Ã¢ÂÂ³ Schedule mainnet deployment review


---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
