# Production Deployment Guide - Netlify & Render

**Date**: March 12, 2026  
**Target**: Public production deployment  
**Frontend**: Netlify  
**Backend**: Render  
**Database**: MongoDB Atlas (cloud)

---

## Prerequisites âœ…

- [ ] Netlify account (free at https://netlify.com)
- [ ] Render account (free at https://render.com)
- [ ] MongoDB Atlas account with database (already configured)
- [ ] GitHub repository (recommended for auto-deploy)
- [ ] Environment variables documented

---

## Part 1: Prepare Backend for Production

### 1.1 Update Backend Configuration

Backend needs to accept requests from public Netlify frontend:

```javascript
// backend/app.js - CORS configuration needs update

const allowedOrigins = [
  "https://your-netlify-domain.netlify.app",  // Your Netlify domain (add after deployment)
  "https://yourdomain.com",                     // Your custom domain (if any)
  process.env.FRONTEND_URL,                     // From .env
  "http://localhost:3000",                      // Keep for local development
].filter(Boolean);
```

### 1.2 Create Production `.env` for Backend

Create `.env.production` for Render:

```env
# Server
PORT=8080
NODE_ENV=production

# MongoDB
MONGO_URI=your_mongodb_atlas_uri

# JWT
JWT_SECRET=your_strong_secret_key

# Blockchain
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
BLOCKCHAIN_NETWORK=sepolia

# Email Service (Gmail)
OTP_EMAIL=your_email@gmail.com
OTP_PASS=your_app_specific_password

# Third-party APIs
FAST2SMS_API_KEY=your_fast2sms_key

# Frontend URL (for CORS)
FRONTEND_URL=https://your-netlify-domain.netlify.app

# Optional: Analytics, Logging
LOG_LEVEL=info
```

### 1.3 Add Production Build Script

Update `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "NODE_ENV=production node server.js"
  }
}
```

### 1.4 Verify Port Flexibility

Render assigns a dynamic PORT. Ensure backend uses it:

```javascript
// backend/server.js
const PORT = process.env.PORT || 5000;  // âœ… Correct
// NOT: const PORT = 5000;              // âŒ Wrong for Render
```

---

## Part 2: Deploy Backend to Render

### 2.1 Create Render Account & Service

1. Go to https://render.com
2. Sign up (GitHub recommended for easy deploy)
3. Dashboard â†’ New+ â†’ Web Service

### 2.2 Connect Repository

- Select "Build and deploy from a Git repository"
- Connect your GitHub account
- Select your repository
- Choose branch: `main` (or your default)

### 2.3 Configure Render Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `dhansetu-api` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to users) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` or `node backend/server.js` |
| **Plan** | Free (upgradeable) |

### 2.4 Set Environment Variables

In Render dashboard â†’ Environment:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dhansetu
JWT_SECRET=your_strong_secret_here
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
ETHERSCAN_API_KEY=your_key
CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
BLOCKCHAIN_NETWORK=sepolia
OTP_EMAIL=your_email@gmail.com
OTP_PASS=your_app_password
FAST2SMS_API_KEY=your_key
FRONTEND_URL=(leave empty for now, update after Netlify deploy)
```

### 2.5 Deploy

Click "Create Web Service" â†’ Render builds and deploys

**Wait for deployment to complete** â†’ You'll get a URL like:
```
https://dhansetu-api.onrender.com
```

âœ… Save this URL - you'll need it for frontend

---

## Part 3: Prepare Frontend for Production

### 3.1 Create `.env.production`

Create `dhan-setu-frontend/.env.production`:

```env
# Use Render backend URL (update after backend deployment)
REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
REACT_APP_BLOCKCHAIN_NETWORK=sepolia
REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
REACT_APP_ENV=production
```

### 3.2 Update Build Configuration

Ensure `dhan-setu-frontend/package.json` has:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "homepage": ".",
  "private": true
}
```

### 3.3 Create `netlify.toml`

Create file `dhan-setu-frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  environment = { REACT_APP_ENV = "production" }

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### 3.4 Verify Build Locally

```bash
cd dhan-setu-frontend
npm run build
# Should create /build folder without errors
```

---

## Part 4: Deploy Frontend to Netlify

### 4.1 Create Netlify Account

1. Go to https://netlify.com
2. Sign up (GitHub recommended)
3. Connect GitHub account

### 4.2 Create New Site

Dashboard â†’ Add new site â†’ Import existing project

- Select your repository
- Choose branch: `main`
- Build command: `npm run build` (auto-detected)
- Publish directory: `build` (auto-detected)
- Base directory: `dhan-setu-frontend`

### 4.3 Set Environment Variables

Netlify dashboard â†’ Site settings â†’ Build & deploy â†’ Environment:

```
REACT_APP_API_URL=https://dhansetu-api.onrender.com/api
REACT_APP_CONTRACT_ADDRESS=0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
REACT_APP_BLOCKCHAIN_NETWORK=sepolia
REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111
REACT_APP_ENV=production
```

### 4.4 Deploy

Click "Deploy site"

**Netlify deploys automatically** â†’ You get a URL:
```
https://your-site-name.netlify.app
```

âœ… Save this URL

---

## Part 5: Update Backend CORS

Now that you have both URLs, update backend:

1. Go to Render dashboard
2. Your service â†’ Environment â†’ Edit `FRONTEND_URL`
3. Set: `https://your-site-name.netlify.app`
4. Render auto-redeploys

---

## Part 6: DNS & Custom Domain (Optional)

### If you have your own domain:

**Netlify:**
1. Domain management â†’ Add domain
2. Update nameservers to Netlify
3. Or use CNAME records

**Render:**
1. Custom domain â†’ Add domain
2. Point to Render with CNAME record

---

## Part 7: Testing Production Deployment

### 7.1 Frontend Tests

```bash
# Visit your Netlify URL
https://your-site-name.netlify.app

âœ… Page loads without errors
âœ… Navbar visible
âœ… Navigation works
âœ… No 404 errors
```

### 7.2 Backend Tests

```bash
# Test API health
curl https://dhansetu-api.onrender.com/api/health

# Should return success status
```

### 7.3 End-to-End Tests

- [ ] Register new user
- [ ] Connect MetaMask wallet
- [ ] Create loan request
- [ ] Check API calls in Network tab
- [ ] Monitor Etherscan for blockchain calls
- [ ] Verify MongoDB updates

### 7.4 Check Browser Console

- [ ] No CORS errors
- [ ] Environment variables loaded correctly
- [ ] API calls use correct URL
- [ ] MetaMask connects to Sepolia

---

## Part 8: Monitoring & Logs

### Render Logs

Render dashboard â†’ Service â†’ Logs

View real-time logs while backend runs:
- Check for errors
- Monitor startup messages
- Track API calls

### Netlify Logs

Netlify dashboard â†’ Site â†’ Deploys

View build logs:
- Deployment status
- Build errors
- Asset sizes

---

## Part 9: Troubleshooting

### Frontend won't connect to backend

**Solution:**
```javascript
// Check API URL in Network tab (DevTools â†’ Network)
// Should see requests to https://dhansetu-api.onrender.com/api/...

// If seeing http:// instead of https:// â†’ CORS error
// Fix: Ensure REACT_APP_API_URL is correct
```

### Backend returns CORS error

**Solution:**
```
Render â†’ Environment â†’ Edit FRONTEND_URL
Make sure it matches your Netlify deployment URL
Redeploy backend
```

### Render backend goes to sleep (free tier)

**Solution:**
Free tier sleeps after 15 min inactivity

Options:
- Upgrade to paid ($7/month)
- OR use Uptime monitoring to keep it warm
- OR switch to alternative (Railway, Heroku alternative)

### MetaMask won't connect on production

**Solution:**
- Ensure `REACT_APP_BLOCKCHAIN_NETWORK_ID=11155111` set
- MetaMask must be on Sepolia network
- Check browser console for Web3 errors

---

## Part 10: Production Checklist

### Security
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled (automatic on Netlify & Render)
- [ ] `.env` files not committed to Git
- [ ] Private key secured (consider hardware wallet for prod)
- [ ] Database credentials not exposed

### Performance
- [ ] Frontend build size < 5MB
- [ ] API responses < 5 seconds
- [ ] Database queries optimized
- [ ] No console errors or warnings

### Monitoring
- [ ] Render logs accessible
- [ ] Netlify build logs accessible
- [ ] Error tracking setup (optional: Sentry)
- [ ] Uptime monitoring enabled

### Functionality
- [ ] User registration works
- [ ] MetaMask connects
- [ ] Loans can be created
- [ ] Blockchain transactions work
- [ ] Data persists in MongoDB

### Documentation
- [ ] Deployment URLs documented
- [ ] Environment variables listed
- [ ] Troubleshooting guide updated
- [ ] Team trained on deployment process

---

## URLs After Deployment

```
Frontend: https://your-site-name.netlify.app
Backend:  https://dhansetu-api.onrender.com
API:      https://dhansetu-api.onrender.com/api
Explorer: https://sepolia.etherscan.io
Contract: https://sepolia.etherscan.io/address/0x43eb6e7886fd677eBb5fFAEf2c688eB04aC8247f
```

---

## Quick Reference Commands

```bash
# Test frontend build
cd dhan-setu-frontend
npm run build

# Test backend
cd backend
npm test

# Check that start command works
npm start

# View render.yaml (for reference)
cat render.yaml
```

---

## Next Steps

1. **Create `.env.production` files** (don't commit them)
2. **Deploy backend to Render first** (takes ~5 min)
3. **Get Render backend URL**
4. **Deploy frontend to Netlify** (takes ~3 min)
5. **Update backend FRONTEND_URL**
6. **Run end-to-end tests**
7. **Monitor logs for 24 hours**
8. **Announce public URLs to users**

---

## Support

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MDN Deployment**: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/deployment


---
Last reviewed: 2026-03-14
