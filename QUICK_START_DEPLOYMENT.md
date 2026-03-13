# ðŸš€ PRODUCTION DEPLOYMENT - QUICK START

**Get your app live in <15 minutes!**

---

## ðŸ“Š What We're Doing

```
Your Computer              Render (Backend)          Netlify (Frontend)
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   Local Dev  â”‚  â”€â”€â”€â”€â”€â”€â–º â”‚  Node.js API â”‚  â—„â”€â”€â”€â”€â”€  â”‚   React App  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
(localhost)             (Public Internet)        (Public Internet)

Users access: https://your-app.netlify.app
```

---

## ðŸŽ¯ Step-by-Step (Just Follow These Steps)

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

âœ… Both accounts created? Move to Step 2.

---

### STEP 2: Deploy Backend (5 minutes)

**On Render:**

1. Dashboard â†’ **New +** â†’ **Web Service**
2. "Build from repository" â†’ GitHub â†’ Select your repo
3. Fill in form:
   ```
   Name:            dhansetu-api
   Environment:     Node
   Region:          Oregon
   Branch:          main
   Build command:   npm install
   Start command:   npm start
   Root directory:  backend âš ï¸ IMPORTANT
   ```
4. Scroll down â†’ **Add Environment Variable**
   
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
6. â³ Wait 3-5 minutes for deployment
7. âœ… You'll see: "Live" (green checkmark)
8. ðŸ“ **COPY THIS URL:** `https://dhansetu-api.onrender.com` (or shown in dashboard)

âœ… Backend live? Move to Step 3.

---

### STEP 3: Deploy Frontend (5 minutes)

**On Netlify:**

1. Dashboard â†’ **Add new site** â†’ **Import an existing project**
2. "GitHub" â†’ Select your repository
3. Configure build settings:
   ```
   Base directory:    dhan-setu-frontend
   Build command:     npm run build
   Publish directory: build
   ```
4. Scroll down â†’ **Add environment variable**
   
   Copy-paste these (replace `YOUR_RENDER_URL` with the URL from Step 2):
   ```
   REACT_APP_API_URL              = https://dhansetu-api.onrender.com/api
   REACT_APP_CONTRACT_ADDRESS     = 0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
   REACT_APP_BLOCKCHAIN_NETWORK   = sepolia
   REACT_APP_BLOCKCHAIN_NETWORK_ID= 11155111
   REACT_APP_ENV                  = production
   ```
5. **Deploy site** button
6. â³ Wait 3-5 minutes for build
7. âœ… You'll see: "Published" (green checkmark)
8. ðŸ“ **COPY THIS URL:** `https://your-site-name.netlify.app`

âœ… Frontend live? Move to Step 4.

---

### STEP 4: Connect Frontend to Backend (1 minute)

**Back on Render:**

1. Go to your backend service
2. **Environment** â†’ Edit
3. Find `FRONTEND_URL` â†’ Update to:
   ```
   FRONTEND_URL = https://your-site-name.netlify.app
   ```
   Important: use origin only (no trailing slash, no /login, no /api path)
   Example for this project: FRONTEND_URL = https://dhan-setu.netlify.app
4. **Save** button
5. Render auto-redeploys (~1 minute)
6. âœ… Done!

---

### STEP 5: Test Everything (2 minutes)

1. **Open** `https://your-site-name.netlify.app` in browser
2. **DevTools** â†’ Network tab
3. **Register** a new account
4. **Connect** MetaMask wallet
5. **Check Network tab:**
   - See API calls to `https://dhansetu-api.onrender.com`?
   - No red errors? âœ…
6. **Create** a loan request
7. **Check Etherscan:** https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
   - Recent transaction? âœ…

---

## ðŸŽ‰ Done! Your App is Live!

### Share These URLs:
```
ðŸŒ App:      https://your-site-name.netlify.app
ðŸ“¡ API:      https://dhansetu-api.onrender.com/api
â›“ï¸  Contract: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

## âŒ If Something Breaks

### "CORS error" in browser
âžœ Wait 1 min, reload page (Ctrl+Shift+R to clear cache)

### "Cannot reach API"
âžœ Check Render dashboard: Is it "Live" (green)?

### "API returns 404"
âžœ Check `REACT_APP_API_URL` in Netlify environment variables

### "MetaMask won't connect"
âžœ Make sure MetaMask is set to "Sepolia" network

### "Build fails on Netlify"
âžœ Check build logs â†’ look for "npm ERR!"

### "Render backend is sleeping"
âžœ Free tier sleeps after 15 min â†’ first request takes 30 sec
âžœ Upgrade to paid ($7/mo) if needed

---

## ðŸ“ž Need Help?

**Before troubleshooting:**
1. Render Dashboard â†’ Logs â†’ See if there are errors?
2. Netlify Dashboard â†’ Deployments â†’ Click latest â†’ Build logs
3. Browser DevTools â†’ Console â†’ Any red errors?

**Common fixes:**
- Clear browser cache: `Ctrl+Shift+Delete`
- Force reload: `Ctrl+Shift+R`
- Check GitHub: Is code committed? (Deployments auto-trigger on push)
- Verify environment variables: One missing = broken!

---

## ðŸ“— Full Documentation

If you need more details, read these files:
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Deep dive guide
- `PRODUCTION_DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `ENV_VARIABLES_REFERENCE.md` - Where to get each value

---

## âœ¨ What Happens Now

Your application:
- âœ… **Runs on real servers** (not your computer)
- âœ… **Accessible 24/7** to anyone on internet
- âœ… **Auto-deploys** when you push code to GitHub
- âœ… **Uses real blockchain** (Sepolia testnet)
- âœ… **Stores data** in MongoDB Atlas (cloud)

---

## ðŸ”— Live Monitoring

Check if everything is working:

**Render Health:**
- https://render.com/dashboard â†’ Your service â†’ Check status

**Netlify Health:**
- https://netlify.com/dashboard â†’ Your site â†’ Check status

**Contract Activity:**
- https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f â†’ See recent transactions

---

## ðŸŽ“ Pro Tips

- Push code to GitHub = auto-redeploy (both services)
- Free tier Render sleeps = first request slow (upgrade if needed)
- Environment variables = restart required on change
- Check console logs to debug issues
- Use browser DevTools Network tab to see API calls

---

**Questions?** Check the detailed guides above or review deployment checklist! 

---
Last reviewed: 2026-03-14
