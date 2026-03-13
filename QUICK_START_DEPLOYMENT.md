#  PRODUCTION DEPLOYMENT - QUICK START

**Get your app live in <15 minutes!**

---

##  What We're Doing

```
Your Computer              Render (Backend)          Netlify (Frontend)
                    
   Local Dev       Node.js API        React App  
                    
(localhost)             (Public Internet)        (Public Internet)

Users access: https://your-app.netlify.app
```

---

##  Step-by-Step (Just Follow These Steps)

### STEP 1: Create Accounts (2 minutes)

**A) Render Account**
- [ ] Go to https://render.com
- [ ] Click "Sign up"
- [ ] Choose "GitHub" (easiest)
- [ ] Authorize & confirm

**B) Netlify Account**
- [ ] Go to https://netlify.com
- [ ] Click "Sign up"
- [ ] Choose "GitHub" (easiest)
- [ ] Authorize & confirm

 Both accounts created? Move to Step 2.

---

### STEP 2: Deploy Backend (5 minutes)

**On Render:**

1. Dashboard  **New +**  **Web Service**
2. "Build from repository"  GitHub  Select your repo
3. Fill in form:
   ```
   Name:            dhansetu-api
   Environment:     Node
   Region:          Oregon
   Branch:          main
   Build command:   npm install
   Start command:   npm start
   Root directory:  backend  IMPORTANT
   ```
4. Scroll down  **Add Environment Variable**
   
   Copy-paste these (get values from `ENV_VARIABLES_REFERENCE.md`):
   ```
   NODE_ENV              = production
   MONGO_URI             = mongodb+srv://vvitsiva:vvit1234@cluster0.ga1hscg.mongodb.net/dhansetu?retryWrites=true&w=majority
   JWT_SECRET            = [GENERATE NEW]
   PRIVATE_KEY           = 41c1a3c06b63e510702093436905fe1bb93c4e9ba9749c9ace2bdf790509f9fe
   SEPOLIA_RPC_URL       = https://sepolia.infura.io/v3/320e819141b04e288ba4b010f96f431a
   ETHERSCAN_API_KEY     = HZ124ZD68E4FEAU6V4EC5TDCEA1WQZE5DD
   CONTRACT_ADDRESS      = 0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
   BLOCKCHAIN_NETWORK    = sepolia
   OTP_EMAIL             = sivamaniganjerupalli@gmail.com
   OTP_PASS              = ntfd pnkw ngkc fkuu
   FAST2SMS_API_KEY      = u8s7e32W5pFqh16rJoXlDwmAEKCjVYbSHkIaRzGUxQ40cMdigNXU0IB1KNmqRyfYz3iawuVQnH4pSODZ
   KYC_SECRET            = supersecurekey
   API_KEY               = 91821295770
   FRONTEND_URL          = (leave empty for now; must be exact Netlify origin later)
   ```
5. **Create Web Service** button
6.  Wait 3-5 minutes for deployment
7.  You'll see: "Live" (green checkmark)
8.  **COPY THIS URL:** `https://dhansetu-api.onrender.com` (or shown in dashboard)

 Backend live? Move to Step 3.

---

### STEP 3: Deploy Frontend (5 minutes)

**On Netlify:**

1. Dashboard  **Add new site**  **Import an existing project**
2. "GitHub"  Select your repository
3. Configure build settings:
   ```
   Base directory:    dhan-setu-frontend
   Build command:     npm run build
   Publish directory: build
   ```
4. Scroll down  **Add environment variable**
   
   Copy-paste these (replace `YOUR_RENDER_URL` with the URL from Step 2):
   ```
   REACT_APP_API_URL              = https://dhansetu-api.onrender.com/api
   REACT_APP_CONTRACT_ADDRESS     = 0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
   REACT_APP_BLOCKCHAIN_NETWORK   = sepolia
   REACT_APP_BLOCKCHAIN_NETWORK_ID= 11155111
   REACT_APP_ENV                  = production
   ```
5. **Deploy site** button
6.  Wait 3-5 minutes for build
7.  You'll see: "Published" (green checkmark)
8.  **COPY THIS URL:** `https://your-site-name.netlify.app`

 Frontend live? Move to Step 4.

---

### STEP 4: Connect Frontend to Backend (1 minute)

**Back on Render:**

1. Go to your backend service
2. **Environment**  Edit
3. Find `FRONTEND_URL`  Update to:
   ```
   FRONTEND_URL = https://your-site-name.netlify.app
   ```
   Important: use origin only (no trailing slash, no /login, no /api path)
   Example for this project: FRONTEND_URL = https://dhan-setu.netlify.app
4. **Save** button
5. Render auto-redeploys (~1 minute)
6.  Done!

---

### STEP 5: Test Everything (2 minutes)

1. **Open** `https://your-site-name.netlify.app` in browser
2. **DevTools**  Network tab
3. **Register** a new account
4. **Connect** MetaMask wallet
5. **Check Network tab:**
   - See API calls to `https://dhansetu-api.onrender.com`?
   - No red errors? 
6. **Create** a loan request
7. **Check Etherscan:** https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
   - Recent transaction? 

---

##  Done! Your App is Live!

### Share These URLs:
```
 App:      https://your-site-name.netlify.app
 API:      https://dhansetu-api.onrender.com/api
  Contract: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

##  If Something Breaks

### "CORS error" in browser
 Wait 1 min, reload page (Ctrl+Shift+R to clear cache)

### "Cannot reach API"
 Check Render dashboard: Is it "Live" (green)?

### "API returns 404"
 Check `REACT_APP_API_URL` in Netlify environment variables

### "MetaMask won't connect"
 Make sure MetaMask is set to "Sepolia" network

### "Build fails on Netlify"
 Check build logs  look for "npm ERR!"

### "Render backend is sleeping"
 Free tier sleeps after 15 min  first request takes 30 sec
 Upgrade to paid ($7/mo) if needed

---

##  Need Help?

**Before troubleshooting:**
1. Render Dashboard  Logs  See if there are errors?
2. Netlify Dashboard  Deployments  Click latest  Build logs
3. Browser DevTools  Console  Any red errors?

**Common fixes:**
- Clear browser cache: `Ctrl+Shift+Delete`
- Force reload: `Ctrl+Shift+R`
- Check GitHub: Is code committed? (Deployments auto-trigger on push)
- Verify environment variables: One missing = broken!

---

##  Full Documentation

If you need more details, read these files:
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Deep dive guide
- `PRODUCTION_DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `ENV_VARIABLES_REFERENCE.md` - Where to get each value

---

##  What Happens Now

Your application:
-  **Runs on real servers** (not your computer)
-  **Accessible 24/7** to anyone on internet
-  **Auto-deploys** when you push code to GitHub
-  **Uses real blockchain** (Sepolia testnet)
-  **Stores data** in MongoDB Atlas (cloud)

---

##  Live Monitoring

Check if everything is working:

**Render Health:**
- https://render.com/dashboard  Your service  Check status

**Netlify Health:**
- https://netlify.com/dashboard  Your site  Check status

**Contract Activity:**
- https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f  See recent transactions

---

##  Pro Tips

- Push code to GitHub = auto-redeploy (both services)
- Free tier Render sleeps = first request slow (upgrade if needed)
- Environment variables = restart required on change
- Check console logs to debug issues
- Use browser DevTools Network tab to see API calls

---

**Questions?** Check the detailed guides above or review deployment checklist! 

---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
