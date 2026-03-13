# Ã°Å¸Å¡â‚¬ Production Deployment Checklist

**Status**: Ready to Deploy  
**Date**: March 12, 2026  
**Target**: Netlify (Frontend) + Render (Backend)

---

## Ã¢Å“â€¦ Pre-Deployment (TODAY)

### Backend Preparation

- [x] Backend CORS configured with `FRONTEND_URL`
- [x] Backend uses `process.env.PORT` (Render compatible)
- [x] `backend/package.json` has start script
- [x] `.env.production.template` created
- [x] `render.yaml` created for reference
- [x] MongoDB Atlas connection string ready

### Frontend Preparation

- [x] `dhan-setu-frontend/netlify.toml` created
- [x] `.env.production.template` created
- [x] `npm run build` tested locally (works without errors)
- [x] `homepage: "."` set in package.json
- [x] Environment variables structure ready

### Smart Contract

- [x] Deployed on Sepolia: `0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f`
- [x] Verified on Etherscan
- [x] Contract address same across all configs

---

## Ã°Å¸â€œâ€¹ Deployment Steps (IN ORDER)

### Step 1: Create Render Account & Deploy Backend (5 min)

- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access to your repo
- [ ] Dashboard Ã¢â€ â€™ New+ Ã¢â€ â€™ Web Service
- [ ] Connect repository
- [ ] **Select `backend` as root directory** Ã¢Å¡Â Ã¯Â¸Â
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Add environment variables (from `backend/.env.production.template`):
  ```
  NODE_ENV=production
  MONGO_URI=<your_mongodb_atlas_uri>
  JWT_SECRET=<strong_random_string>
  PRIVATE_KEY=<your_wallet_key>
  SEPOLIA_RPC_URL=<your_infura_url>
  ETHERSCAN_API_KEY=<your_key>
  CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
  BLOCKCHAIN_NETWORK=sepolia
  OTP_EMAIL=<your_email>
  OTP_PASS=<your_app_password>
  FAST2SMS_API_KEY=<your_key>
  KYC_SECRET=<your_secret>
  API_KEY=<your_key>
  ```
- [ ] Leave `FRONTEND_URL` empty for now Ã¢Å¡Â Ã¯Â¸Â
- [ ] Click "Create Web Service"
- [ ] **WAIT for deployment to complete** (~3-5 min)
- [ ] Ã¢Å“â€¦ **Note your Render URL:** `https://dhansetu-api.onrender.com`

### Step 2: Update Frontend Config

- [ ] Create `dhan-setu-frontend/.env.production` (copy from template):
  ```
  REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
  REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
  REACT_APP_BLOCKCHAIN_NETWORK=sepolia
  REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
  REACT_APP_ENV=production
  ```
- [ ] **Do NOT commit** `.env.production` Ã¢Å¡Â Ã¯Â¸Â
- [ ] Test locally: `npm run build` (in dhan-setu-frontend)
- [ ] Verify no errors Ã¢â€ â€™ creates `/build` folder

### Step 3: Create Netlify Account & Deploy Frontend (5 min)

- [ ] Go to https://netlify.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access
- [ ] Dashboard Ã¢â€ â€™ Add new site Ã¢â€ â€™ Import existing project
- [ ] Select your repository
- [ ] Configure build:
  - Base directory: `dhan-setu-frontend`
  - Build command: `npm run build`
  - Publish directory: `build`
- [ ] Add environment variables:
  ```
  REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
  REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
  REACT_APP_BLOCKCHAIN_NETWORK=sepolia
  REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
  REACT_APP_ENV=production
  ```
- [ ] Click "Deploy site"
- [ ] **WAIT for build to complete** (~3 min)
- [ ] Ã¢Å“â€¦ **Note your Netlify URL:** `https://your-site-name.netlify.app`
- [ ] Test: Visit your Netlify URL Ã¢â€ â€™ should load without errors

### Step 4: Update Backend with Frontend URL

- [ ] Go to Render Dashboard
- [ ] Select your backend service
- [ ] Environment Ã¢â€ â€™ Edit
- [ ] Add/Update:
  ```
  FRONTEND_URL=https://your-site-name.netlify.app
  ```
- [ ] Save Ã¢â€ â€™ Render auto-redeploys (~1 min)
- [ ] Ã¢Å“â€¦ Confirm "Deploy in Progress" completes

### Step 5: Test End-to-End

- [ ] Visit frontend: `https://your-site-name.netlify.app`
- [ ] Open browser DevTools Ã¢â€ â€™ Network tab
- [ ] Register new account
- [ ] Test MetaMask connection
- [ ] Check Network tab:
  - [ ] API calls go to `https://dhansetu-api.onrender.com/api/...`
  - [ ] No CORS errors
  - [ ] Responses are successful (200, 201 status)
- [ ] MongoDB updated (check Atlas dashboard)
- [ ] Etherscan shows transaction (if applicable)

---

## Ã°Å¸â€â€” Deployment URLs (AFTER COMPLETION)

```
Ã°Å¸Å’Â Frontend:  https://your-site-name.netlify.app
Ã°Å¸â€â€” Backend:   https://dhansetu-api.onrender.com
Ã°Å¸â€œÂ¡ API:       https://dhansetu-api.onrender.com/api
Ã¢â€ºâ€œÃ¯Â¸Â  Contract:  https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

## Ã¢Å¡Â Ã¯Â¸Â Common Issues & Solutions

### Issue: CORS errors in browser console

**Solution:**
```
1. Check FRONTEND_URL in Render environment
2. Ensure it matches your Netlify URL exactly
3. Render Ã¢â€ â€™ Redeploy
4. Refresh browser (clear cache: Ctrl+Shift+Delete)
```

### Issue: API calls return 404

**Solution:**
```
1. Check REACT_APP_API_URL in Netlify environment
2. Verify it's https (not http)
3. Redeploy on Netlify
4. Check Network tab to see actual URL being called
```

### Issue: Render backend is slow (free tier)

**Solution:**
```
- Free tier sleeps after 15 minutes inactivity
- First request takes ~30 seconds (wake-up time)
- Options:
  a) Upgrade to paid plan (~$7/month)
  b) Keep activity with monitoring service
  c) Switch to Railway or other service
```

### Issue: MetaMask won't connect on production

**Solution:**
```
1. Ensure MetaMask is on Sepolia network
2. Check browser console for errors
3. Verify REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
4. Try: MetaMask Ã¢â€ â€™ Settings Ã¢â€ â€™ Extension Ã¢â€ â€™ Storage Ã¢â€ â€™ Clear site data
5. Refresh page
```

### Issue: 502 Bad Gateway from Render

**Solution:**
```
1. Render might be rebuilding
2. Check "Deployments" tab
3. Wait for "Deploy in Progress" to complete
4. If stuck, click "Rollback"
```

---

## Ã°Å¸â€œÅ  Verification Checklist

### Frontend (Netlify)
- [ ] Site loads at public URL
- [ ] No 404 errors
- [ ] Responsive design works
- [ ] Navigation functions
- [ ] Console has no CORS errors
- [ ] Environment variables loaded

### Backend (Render)
- [ ] API responds to health check
- [ ] CORS allows Netlify URL
- [ ] Database connections work
- [ ] Environment variables accessible
- [ ] Logs show no errors

### Integration
- [ ] Frontend can call backend
- [ ] Data persists in MongoDB
- [ ] MetaMask connection works
- [ ] Blockchain transactions process
- [ ] All features functioning

---

## Ã°Å¸â€â€™ Security Reminders

- Ã¢Å“â€¦ No `.env.production` committed to git
- Ã¢Å“â€¦ Private keys in environment variables (not code)
- Ã¢Å“â€¦ MongoDB connection string secured
- Ã¢Å“â€¦ JWT secret is strong (32+ chars)
- Ã¢Å“â€¦ CORS only allows Netlify domain
- Ã¢Å“â€¦ HTTPS enabled (automatic on both services)

---

## Ã°Å¸â€œÂ± Share Public URLs

Once deployment completes, share these URLs:

```
Ã°Å¸â€â€” APPLICATION: https://your-site-name.netlify.app
```

That's it! Users can access the full application at that URL.

---

## Ã°Å¸Å¡Â¨ Maintenance & Monitoring

### Daily
- [ ] Check Render logs for errors
- [ ] Monitor Netlify build status
- [ ] Verify API responses normal

### Weekly
- [ ] Review error logs
- [ ] Check MongoDB storage usage
- [ ] Monitor Sepolia contract activity

### Monthly
- [ ] Review performance metrics
- [ ] Update dependencies if needed
- [ ] Plan for scaling (if traffic grows)

---

## Ã°Å¸â€œÅ¾ Support Links

- **Render Docs:** https://render.com/docs/deploy-node-express-app
- **Netlify Docs:** https://docs.netlify.com/frameworks/react/
- **GitHub Deployments:** https://docs.github.com/en/actions
- **Environment Variables:** https://12factor.net/config

---

## Ã¢Å“â€¦ Deployment Complete!

Once all steps done, your application is:
- Ã°Å¸Å’Â **Publicly accessible**
- Ã¢Å¡Â¡ **Scalable**
- Ã°Å¸â€Â **Secure**
- Ã°Å¸Å¡â‚¬ **Production-ready**


---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
