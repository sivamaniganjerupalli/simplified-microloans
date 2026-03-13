#  Production Deployment - Visual Guide

## Overall Architecture

```
                                     PUBLIC INTERNET 
                                                       
                 
  Your Computer                     RENDER             NETLIFY      
                                    Backend API      Frontend App   
   Local Dev                                                       
   Git Repo      PUSH CD   Node.js Server   React Build   
                                    Port 8080                       
                 
                                                              
                                                              
                                          
                                   MongoDB Atlas          Browser     
                                     (Cloud DB)           MetaMask    
                                          
                                                              
                                        
                                                      
                                                   HTTPS
                                                      
                                        
                                           Sepolia Testnet   
                                          Smart Contract     
                                         0x43eb6e786fd677...
                                        
```

---

## Deployment Process - Step by Step

### Phase 1: Backend Deployment (Render)

```
 STEP 1 
 Create Render Account & Connect GitHub       
  Go to render.com                           
  Sign up with GitHub                        
  Click "Deploy from GitHub"                 

                      
 STEP 2 
 Configure Backend Service                    
  Select repository                          
  Set root directory: backend                
  Build command: npm install                 
  Start command: npm start                   

                      
 STEP 3 
 Add Environment Variables (14 total)         
  MONGO_URI                                  
  JWT_SECRET                                 
  PRIVATE_KEY                                
  SEPOLIA_RPC_URL                            
  ... (others from template)                 

                      
 STEP 4 
 Deploy                                        
  Click "Create Web Service"                 
   Wait 3-5 minutes                         
   Status: "Live"                          
   URL: https://dhansetu-api.onrender.com 

```

### Phase 2: Frontend Deployment (Netlify)

```
 STEP 1 
 Create Netlify Account & Connect GitHub      
  Go to netlify.com                          
  Sign up with GitHub                        
  Click "Import existing project"            

                      
 STEP 2 
 Configure Frontend Build                     
  Base directory: dhan-setu-frontend         
  Build command: npm run build               
  Publish directory: build                   

                      
 STEP 3 
 Add Environment Variables (5 total)          
  REACT_APP_API_URL                          
  REACT_APP_CONTRACT_ADDRESS                 
  REACT_APP_BLOCKCHAIN_NETWORK               
  ... (others from template)                 

                      
 STEP 4 
 Deploy                                        
  Click "Deploy site"                        
   Wait 3-5 minutes                         
   Status: "Published"                     
   URL: https://your-site.netlify.app     

```

### Phase 3: Connect Frontend to Backend

```
 STEP 1 
 Update Backend CORS Configuration            
  Go back to Render dashboard                
  Select your backend service                
  Environment  Edit                         
  Find FRONTEND_URL                          

                      
 STEP 2 
 Set Frontend URL                             
  FRONTEND_URL=https://your-site.netlify.app
  Save                                       

                      
 STEP 3 
 Render Auto-Redeploys                        
  Backend automatically rebuilds             
   Wait 1-2 minutes                         
   CORS now fixed!                         

```

---

## Data Flow After Deployment

### User Registers for Loan

```
User Browser
    
     Visits: https://your-site.netlify.app
       Static files loaded from Netlify CDN
    
     Clicks "Register"
       React form rendered (frontend)
    
     Enters data + connects MetaMask
       MetaMask popup shown
    
     Submits form
       
         HTTPS POST to https://dhansetu-api.onrender.com/api/auth/register
          
            Backend receives request
          
            Validate + hash password
          
            Store in MongoDB Atlas
          
            Response back to frontend
             
               User sees success message
                  Account created!
```

### User Creates Loan Request

```
User Browser (Frontend)
    
     Fills loan form
       Form validation locally
    
     Clicks "Submit"
       
         POST request to backend API
       
        Backend processes loan
         
          Validate data
         
          Store in MongoDB
         
          Call smart contract
            
              Web3 request
               
                Send to Sepolia blockchain
                  
                    Transaction confirmed
       
         Response to frontend
          
           Update UI
              Show transaction hash
                 Link to Etherscan
```

---

## Environment & Configuration Flow

### When You Push to GitHub

```
You: git push origin main
           
           
    GitHub (receives code)
           
      
                
                
   Render    Netlify
   Backend   Frontend
   Builds    Builds
                
      
              
   Tests  Tests
              
      
           
           
        Deploy
```

### Environment Variables Flow

```
Render Environment Variables
     Read at startup
     Available as process.env.VAR
     Used by:
        MongoDB connection
        JWT signing
        Blockchain calls
        Email service

Netlify Environment Variables
     Read during build
     Injected as REACT_APP_*
     Available as:
        process.env.REACT_APP_VAR
```

---

## Security Data Flow

```
Private Key (KEPT SECURE - Only on Render)
     Only on Render backend
     Never sent to frontend
     Never exposed to browser
     Used only for signing blockchain transactions

Database Password (KEPT SECURE - Only on Render)
     Only in MONGO_URI env var
     Never in frontend
     Only for server-to-DB connection
     Not accessible from browser

JWT Secret (KEPT SECURE - Only on Render)
     Used to sign user tokens
     Verified on backend only
     Never sent to frontend code

Frontend (EXPOSED - Public Repo)
     Contract address (public anyway)
     RPC URL (public anyway)
     Network configuration (public anyway)
     NO sensitive keys exposed!
```

---

## Monitoring After Deployment

### Daily Checks

```
Task: Check if everything is working

 Render Dashboard
   Service status: Live? 
      If Red/Yellow: Check logs

 Netlify Dashboard
   Site status: Published? 
      If warning: Check logs

 Your App
   Load: https://your-site.netlify.app
      Page loads? 
      No console errors? 
      Can register? 

 Database
    MongoDB Atlas
       Collections have data? 
       Recent entries? 
```

---

## Auto-Deployment Flow

### Code Changes Trigger Deploy

```
Developer: Changes code locally
           
            git add .
               git commit -m "message"
                  git push origin main
                    
                    
              GitHub Receives Push
                    
              
                           
                           
          Render Job    Netlify Job
           Checks out   Checks out
           npm install  npm run build
           npm start    Uploads to CDN
                           
              
                     
                     
           Live (typically <5 min)
```

---

## Deployment Checklist - Visual

```

 BEFORE DEPLOYING                            

 Local Environment                           
  Backend runs: npm start                  
  Frontend runs: npm start                 
  MongoDB connection OK                    
  MetaMask works on localhost              
  Tests pass                               

                    
                    

 GITHUB READY                                

  Code committed                           
  Default branch: main                     
  No sensitive data in repo                
  .gitignore includes .env                 

                    
                    

 ACCOUNTS CREATED                            

  Render account                           
  Netlify account                          
  Both GitHub-connected                    

                    
                    

 DEPLOY BACKEND                              

  Create Render service                    
  Add all env variables                    
  Status: Live                             
  Copy URL                                 

                    
                    

 DEPLOY FRONTEND                             

  Create Netlify site                      
  Add all env variables                    
  Status: Published                        
  Copy URL                                 

                    
                    

 CONNECT SERVICES                            

  Update FRONTEND_URL in Render            
  Render redeploys                         
  Status: Live again                       

                    
                    

 TEST & VERIFY                               

  Frontend loads                           
  No CORS errors                           
  Register flow works                      
  MetaMask connects                        
  Blockchain txns appear                   

                    
                    
         DEPLOYMENT COMPLETE! 
                    
                    
        Your app is now PUBLIC!
```

---

## Files Structure After Deployment

```
Project Root

 QUICK_START_DEPLOYMENT.md  START HERE
 PRODUCTION_DEPLOYMENT_GUIDE.md
 ENV_VARIABLES_REFERENCE.md
 [Other files]

Backend Directory
 netlify.toml  Netlify config

Frontend Directory
 render.yaml  Render reference
 .env.production.template
 [Other files]

After Deployment:
 Live at: https://your-site-name.netlify.app
 API at: https://dhansetu-api.onrender.com/api
 Contract: https://sepolia.etherscan.io/address/...
```

---

## Success - You're Live! 

```
       Your Computer
       (Development)
              
               (git push)
              
              
         GitHub Repo
              
         
                   
                   
      Render    Netlify
      Backend   Frontend
                   
          CORS 
                   
         
              
              
         PUBLIC! 
    Anyone can visit:
    https://your-site-name.netlify.app
```

---

Done! Your deployment is fully visualized. Now go deploy! 

---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
