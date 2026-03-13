# ðŸš€ Production Deployment Checklist

**Status**: Ready to Deploy  
**Date**: March 12, 2026  
**Target**: Netlify (Frontend) + Render (Backend)

---

## âœ… Pre-Deployment (TODAY)

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

## ðŸ“‹ Deployment Steps (IN ORDER)

### Step 1: Create Render Account & Deploy Backend (5 min)

- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access to your repo
- [ ] Dashboard â†’ New+ â†’ Web Service
- [ ] Connect repository
- [ ] **Select `backend` as root directory** âš ï¸
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
- [ ] Leave `FRONTEND_URL` empty for now âš ï¸
- [ ] Click "Create Web Service"
- [ ] **WAIT for deployment to complete** (~3-5 min)
- [ ] âœ… **Note your Render URL:** `https://dhansetu-api.onrender.com`

### Step 2: Update Frontend Config

- [ ] Create `dhan-setu-frontend/.env.production` (copy from template):
  ```
  REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
  REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
  REACT_APP_BLOCKCHAIN_NETWORK=sepolia
  REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
  REACT_APP_ENV=production
  ```
- [ ] **Do NOT commit** `.env.production` âš ï¸
- [ ] Test locally: `npm run build` (in dhan-setu-frontend)
- [ ] Verify no errors â†’ creates `/build` folder

### Step 3: Create Netlify Account & Deploy Frontend (5 min)

- [ ] Go to https://netlify.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access
- [ ] Dashboard â†’ Add new site â†’ Import existing project
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
- [ ] âœ… **Note your Netlify URL:** `https://your-site-name.netlify.app`
- [ ] Test: Visit your Netlify URL â†’ should load without errors

### Step 4: Update Backend with Frontend URL

- [ ] Go to Render Dashboard
- [ ] Select your backend service
- [ ] Environment â†’ Edit
- [ ] Add/Update:
  ```
  FRONTEND_URL=https://your-site-name.netlify.app
  ```
- [ ] Save â†’ Render auto-redeploys (~1 min)
- [ ] âœ… Confirm "Deploy in Progress" completes

### Step 5: Test End-to-End

- [ ] Visit frontend: `https://your-site-name.netlify.app`
- [ ] Open browser DevTools â†’ Network tab
- [ ] Register new account
- [ ] Test MetaMask connection
- [ ] Check Network tab:
  - [ ] API calls go to `https://dhansetu-api.onrender.com/api/...`
  - [ ] No CORS errors
  - [ ] Responses are successful (200, 201 status)
- [ ] MongoDB updated (check Atlas dashboard)
- [ ] Etherscan shows transaction (if applicable)

---

## ðŸ”— Deployment URLs (AFTER COMPLETION)

```
ðŸŒ Frontend:  https://your-site-name.netlify.app
ðŸ”— Backend:   https://dhansetu-api.onrender.com
ðŸ“¡ API:       https://dhansetu-api.onrender.com/api
â›“ï¸  Contract:  https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

## âš ï¸ Common Issues & Solutions

### Issue: CORS errors in browser console

**Solution:**
```
1. Check FRONTEND_URL in Render environment
2. Ensure it matches your Netlify URL exactly
3. Render â†’ Redeploy
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
4. Try: MetaMask â†’ Settings â†’ Extension â†’ Storage â†’ Clear site data
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

## ðŸ“Š Verification Checklist

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

## ðŸ”’ Security Reminders

- âœ… No `.env.production` committed to git
- âœ… Private keys in environment variables (not code)
- âœ… MongoDB connection string secured
- âœ… JWT secret is strong (32+ chars)
- âœ… CORS only allows Netlify domain
- âœ… HTTPS enabled (automatic on both services)

---

## ðŸ“± Share Public URLs

Once deployment completes, share these URLs:

```
ðŸ”— APPLICATION: https://your-site-name.netlify.app
```

That's it! Users can access the full application at that URL.

---

## ðŸš¨ Maintenance & Monitoring

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

## ðŸ“ž Support Links

- **Render Docs:** https://render.com/docs/deploy-node-express-app
- **Netlify Docs:** https://docs.netlify.com/frameworks/react/
- **GitHub Deployments:** https://docs.github.com/en/actions
- **Environment Variables:** https://12factor.net/config

---

## âœ… Deployment Complete!

Once all steps done, your application is:
- ðŸŒ **Publicly accessible**
- âš¡ **Scalable**
- ðŸ” **Secure**
- ðŸš€ **Production-ready**


---
Last reviewed: 2026-03-14
