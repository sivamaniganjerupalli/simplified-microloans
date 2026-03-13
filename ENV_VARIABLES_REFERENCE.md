#  Production Environment Variables - Where to Get Each Value

**Use this guide to fill in Render & Netlify environment variables**

---

## Backend Variables (Render)

### MongoDB Atlas Connection String
**Command:**
```bash
# From MongoDB Atlas dashboard
1. Go to: https://cloud.mongodb.com
2. Project  Connect  Drivers
3. Copy connection string
4. Replace <password> with your database password
```

**Format:** `mongodb+srv://username:password@cluster.mongodb.net/dhansetu?retryWrites=true&w=majority`

**Example:**
```
mongodb+srv://vvitsiva:vvit1234@cluster0.ga1hscg.mongodb.net/dhansetu?retryWrites=true&w=majority
```

---

### JWT Secret
**Generate:**
```bash
# Run in terminal any of these commands
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or online: https://www.uuidgenerator.net/guid
```

**Example (DON'T USE THIS ONE):**
```
aBc123XyZ9!@#$%^&*()_+{}|:"<>?[];\',./
```

**Usage in Render:**
```
JWT_SECRET=<your-generated-random-secret>
```

---

### Blockchain - Private Key
**Source:**
```
From your .env file:
PRIVATE_KEY=41c1a3c06b63e510702093436905fe1bb93c4e9ba9749c9ace2bdf790509f9fe
```

**Copy exactly as is:**
```
PRIVATE_KEY=41c1a3c06b63e510702093436905fe1bb93c4e9ba9749c9ace2bdf790509f9fe
```

 **NEVER share this publicly** 

---

### Blockchain - Sepolia RPC URL
**From your .env:**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a
```

**Copy exactly:**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a
```

---

### Etherscan API Key
**From your .env:**
```
ETHERSCAN_API_KEY=HZ124ZD68E4FEAU6V4EC5TDCEA1WQZE5DD
```

**Copy exactly:**
```
ETHERSCAN_API_KEY=HZ124ZD68E4FEAU6V4EC5TDCEA1WQZE5DD
```

---

### Contract Address
**Already finalized:**
```
CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

**Copy exactly:**
```
CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

### Email Service Variables
**From your .env:**
```
OTP_EMAIL=sivamaniganjerupalli@gmail.com
OTP_PASS=ntfd pnkw ngkc fkuu
```

**Copy exactly:**
```
OTP_EMAIL=sivamaniganjerupalli@gmail.com
OTP_PASS=ntfd pnkw ngkc fkuu
```

 This is Gmail App Password, NOT your actual password

---

### Fast2SMS API Key
**From your .env:**
```
FAST2SMS_API_KEY=u8s7e32W5pFqh16rJoXlDwmAEKCjVYbSHkIaRzGUxQ40cMdigNXU0IB1KNmqRyfYz3iawuVQnH4pSODZ
```

**Copy exactly:**
```
FAST2SMS_API_KEY=u8s7e32W5pFqh16rJoXlDwmAEKCjVYbSHkIaRzGUxQ40cMdigNXU0IB1KNmqRyfYz3iawuVQnH4pSODZ
```

---

### Other Backend Variables
**From your `.env`:**
```
KYC_SECRET=supersecurekey
API_KEY=91821295770
```

**Copy exactly:**
```
KYC_SECRET=supersecurekey
API_KEY=91821295770
```

---

## Frontend Variables (Netlify)

### React App API URL
**Get from Render:**
1. Deploy backend first (see deployment checklist)
2. After deployment, Render shows URL like:
   ```
   https://dhansetu-api.onrender.com
   ```

**Format:**
```
REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
```

---

### Contract Address
**Use same as backend:**
```
REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

### Network Configuration
**For Sepolia testnet (don't change):**
```
REACT_APP_BLOCKCHAIN_NETWORK=sepolia
REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
```

---

### Sepolia RPC URL
**From your .env:**
```
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a
```

---

### Environment
**Don't change for production:**
```
REACT_APP_ENV=production
```

---

## Summary Table

### Backend (Render) - 10 Variables

| Variable | Value | From |
|----------|-------|------|
| `NODE_ENV` | `production` | Type this |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `JWT_SECRET` | Generated random | Generate above |
| `PRIVATE_KEY` | `41c1a3c...` | Your `.env` |
| `SEPOLIA_RPC_URL` | `https://sepolia...` | Your `.env` |
| `ETHERSCAN_API_KEY` | `HZ124ZD...` | Your `.env` |
| `CONTRACT_ADDRESS` | `0x43eb6e...` | Your `.env` |
| `BLOCKCHAIN_NETWORK` | `sepolia` | Type this |
| `OTP_EMAIL` | `sivam...@gmail.com` | Your `.env` |
| `OTP_PASS` | `ntfd pnkw...` | Your `.env` |

### Frontend (Netlify) - 5 Variables

| Variable | Value | From |
|----------|-------|------|
| `REACT_APP_API_URL` | `https://dhansetu-api...` | Render URL after deploy |
| `REACT_APP_CONTRACT_ADDRESS` | `0x43eb6e...` | Backend contract address |
| `REACT_APP_BLOCKCHAIN_NETWORK` | `sepolia` | Type this |
| `REACT_APP_BLOCKCHAIN_NETWORK_ID` | `11155111` | Type this |
| `REACT_APP_ENV` | `production` | Type this |

---

##  Copy-Paste Ready Values

### Backend (Save these for Render)

```
NODE_ENV=production
MONGO_URI=mongodb+srv://vvitsiva:vvit1234@cluster0.ga1hscg.mongodb.net/dhansetu?retryWrites=true&w=majority
JWT_SECRET=[GENERATE NEW RANDOM STRING]
PRIVATE_KEY=41c1a3c06b63e510702093436905fe1bb93c4e9ba9749c9ace2bdf790509f9fe
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a
ETHERSCAN_API_KEY=HZ124ZD68E4FEAU6V4EC5TDCEA1WQZE5DD
CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
BLOCKCHAIN_NETWORK=sepolia
OTP_EMAIL=sivamaniganjerupalli@gmail.com
OTP_PASS=ntfd pnkw ngkc fkuu
FAST2SMS_API_KEY=u8s7e32W5pFqh16rJoXlDwmAEKCjVYbSHkIaRzGUxQ40cMdigNXU0IB1KNmqRyfYz3iawuVQnH4pSODZ
KYC_SECRET=supersecurekey
API_KEY=91821295770
```

### Frontend (Save these for Netlify)

```
REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
REACT_APP_BLOCKCHAIN_NETWORK=sepolia
REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
REACT_APP_ENV=production
```

---

##  Verification

### Before Submitting to Render

- [x] All values copied exactly (no extra spaces)
- [x] No quotes around values (unless indicated)
- [x] Sensitive keys are secure
- [x] URLs use HTTPS (not HTTP)

### Before Submitting to Netlify

- [x] Render backend deployed first (has URL)
- [x] All environment variables filled in
- [x] Contract address verified on Etherscan
- [x] Network ID is 11155111


---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
