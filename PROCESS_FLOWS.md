# DhanSetu  Complete Process Flows & System Documentation

> This document explains every process in the DhanSetu platform end-to-end, with detailed flowcharts using Mermaid syntax. Render in GitHub, VS Code (Markdown Preview Enhanced), or any Mermaid-compatible viewer.

---

## Table of Contents

1. [High-Level System Flow](#1-high-level-system-flow)
2. [Vendor Registration Process](#2-vendor-registration-process)
3. [Lender Registration Process](#3-lender-registration-process)
4. [Login & Authentication Flow](#4-login--authentication-flow)
5. [Email OTP Verification Flow](#5-email-otp-verification-flow)
6. [Password Reset Flow](#6-password-reset-flow)
7. [Two-Factor Authentication (2FA) Setup](#7-two-factor-authentication-2fa-setup)
8. [Loan Application Process](#8-loan-application-process)
9. [Loan Approval / Rejection Process](#9-loan-approval--rejection-process)
10. [Loan Repayment Process](#10-loan-repayment-process)
11. [KYC Encryption & Decryption Flow](#11-kyc-encryption--decryption-flow)
12. [Blockchain Smart Contract Lifecycle](#12-blockchain-smart-contract-lifecycle)
13. [Oracle Sales Data Flow](#13-oracle-sales-data-flow)
14. [JWT Authorization Flow](#14-jwt-authorization-flow)
15. [Frontend Routing & Protected Routes](#15-frontend-routing--protected-routes)
16. [Data Flow Diagram  Full System](#16-data-flow-diagram--full-system)
17. [State Machines](#17-state-machines)
18. [Database Entity Relationships](#18-database-entity-relationships)
19. [Component Architecture (Frontend)](#19-component-architecture-frontend)
20. [Deployment Pipeline](#20-deployment-pipeline)

---

## 1. High-Level System Flow

```mermaid
flowchart TD
    User([ User Browser]) -->|HTTPS| FE[React Frontend\nPort 3000]
    FE -->|REST API / JSON| BE[Express Backend\nPort 5000]
    BE -->|Mongoose ODM| DB[(MongoDB)]
    BE -->|Ethers.js| ETH[Ethereum Node\nGanache / Infura]
    ETH -->|EVM| SC[LoanContract.sol\nSmart Contract]
    Oracle[ Oracle Cron Job\nDaily 9 AM] -->|MongoDB read| DB
    Oracle -->|recordSales tx| ETH
    BE -->|Send OTP email| SMTP[Gmail SMTP\nNodemailer]
    SMTP -->|Email| User

    subgraph Blockchain Layer
        ETH
        SC
    end

    subgraph Backend Layer
        BE
        DB
        Oracle
        SMTP
    end

    subgraph Frontend Layer
        FE
    end
```

---

## 2. Vendor Registration Process

```mermaid
flowchart TD
    A([Start: Visit /register]) --> B[Select Role: Vendor]
    B --> C[Step 1: Role Selection\nClick on Street Vendor tile]
    C --> D{Role selected?}
    D -- No --> C
    D -- Yes --> E[Step 2: Personal Details\nName, Email, Phone]
    E --> F{Validate Step 2}
    F -- Invalid --> G[Show field error] --> E
    F -- Valid --> H[Step 3: Security & Wallet\nPassword, Aadhaar, Wallet Address]
    H --> I{Validate Step 3\nPassword 8 chars\nAadhaar 12 digits\n0x wallet address}
    I -- Invalid --> J[Show error] --> H
    I -- Valid --> K[POST /api/vendor/register]
    
    K --> L{Backend Validation}
    L -- Missing fields --> M[400: Required fields missing] --> H
    L -- Invalid phone format --> N[400: Invalid phone] --> H
    L -- Email already exists --> O[409: Duplicate email] --> H
    L -- Aadhaar already exists --> P[409: Duplicate Aadhaar] --> H
    
    L -- All valid --> Q[Encrypt Aadhaar\nAES-256-CBC  encryptedKYC]
    Q --> R[Hash password\nbcrypt salt=10]
    R --> S[Save Vendor to MongoDB]
    S --> T[Response: success=true]
    T --> U[Navigate to /verify-otp\nwith email in state]
    U --> V{OTP Verification\nsee Flow 5}
    V -- Verified --> W([Vendor Account Active ])
```

---

## 3. Lender Registration Process

```mermaid
flowchart TD
    A([Start: Visit /register]) --> B[Select Role: Lender]
    B --> C[Same 3-step form\nas vendor]
    C --> D[POST /api/lender/register]

    D --> E{Check existing\nby email / Aadhaar / phone}
    E -- Exists in DEV mode --> F[Update existing record\n test mode only]
    E -- Exists in PROD --> G[409: Lender already registered]
    E -- Not exists --> H[Encrypt Aadhaar  encryptedKYC]
    H --> I[Hash password bcrypt]
    I --> J[Create Lender document\nin MongoDB]
    J --> K[JWT not issued yet\nEmail verification required]
    K --> L[Navigate to /verify-otp]
    L --> M{Email OTP verified?\nsee Flow 5}
    M -- Yes --> N([Lender Account Active ])

    subgraph Additional Lender Fields
        J --> J1[walletBalance: 0.00\nrole: lender\nenable2FA: false\nnotifyByEmail: true]
    end
```

---

## 4. Login & Authentication Flow

```mermaid
flowchart TD
    A([Start: Visit /login]) --> B[Select Role Toggle\nVendor or Lender]
    B --> C{Role = Lender?}
    C -- Yes --> D[Show API Key field]
    C -- No --> E[Standard form: Email + Password]
    D --> E

    E --> F[Submit form]
    F --> G{Client-side\nvalidation}
    G -- Fails --> H[Show error message] --> E
    G -- Passes --> I{Role = Lender?}
    I -- Yes --> J{API Key matches\nREACT_APP_LENDER_API_KEY?}
    J -- No --> K[Error: Invalid API Key] --> E
    J -- Yes --> L[POST /api/lender/login]
    I -- No --> M[POST /api/vendor/login]

    L --> N{Backend: Find by email\nverify password bcrypt}
    M --> N

    N -- User not found --> O[404: Not registered] --> E
    N -- Wrong password --> P[401: Invalid credentials] --> E
    N -- Found + valid --> Q[Update lastLogin]
    Q --> R[Sign JWT\nPayload: userId, role, email\nSecret: JWT_SECRET]
    R --> S[Return token + role + userId]

    S --> T[localStorage.setItem token\nlocalStorage.setItem role\nlocalStorage.setItem userId]
    T --> U{role?}
    U -- vendor --> V[Navigate to /vendor]
    U -- lender --> W[Navigate to /lender]
    U -- other --> X[Navigate to /dashboard]

    V --> Y([Dashboard Loaded ])
    W --> Y
```

---

## 5. Email OTP Verification Flow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant FE as React Frontend
    participant BE as Backend (Express)
    participant Store as OTP Store (Memory Map)
    participant SMTP as Gmail SMTP

    U->>FE: Navigate to /verify-otp
    FE->>U: Show email input form
    U->>FE: Enter email, click Send OTP

    FE->>BE: POST /api/otp/send { email }
    BE->>Store: Generate 6-digit OTP via crypto.randomBytes
    BE->>Store: Store { otp, expires: now + 5min }
    BE->>SMTP: sendMail(to=email, subject="Your OTP Code", text="Your OTP is XXXXXX")
    SMTP-->>U:  Email delivered

    BE-->>FE: { success: true, message: "OTP sent" }
    FE->>U: Show 6-box OTP input, start 2-min countdown

    U->>FE: Enter 6 digits (auto-focus next box)
    U->>FE: Click Verify OTP

    FE->>BE: POST /api/otp/verify { email, otp }
    BE->>Store: Lookup email in map
    BE->>BE: Check expiry (Date.now > expires?)
    BE->>BE: Compare: stored.otp === inputOtp?

    alt OTP valid
        BE-->>FE: { success: true }
        FE->>U: Show " Email verified! Redirecting..."
        FE->>U: setTimeout 1.5s  Navigate /login
    else OTP expired
        BE-->>FE: { success: false, message: "OTP expired" }
        FE->>U: Show error, allow resend
    else OTP wrong
        BE-->>FE: { success: false, message: "Invalid OTP" }
        FE->>U: Show error message
    end
```

---

## 6. Password Reset Flow

```mermaid
flowchart TD
    A([User forgot password]) --> B[Visit /forgot-password]
    B --> C[Enter registered email]
    C --> D[POST /api/auth/forgot-password]
    D --> E{User found in DB?}
    E -- No --> F[Still return success\nto prevent email enumeration]
    E -- Yes --> G[Generate secure reset token\ncrypto.randomBytes 32 hex]
    G --> H[Store: resetToken + resetTokenExpiry\n= now + 1 hour in DB]
    H --> I[Send email via Nodemailer\nLink: /reset-password?token=xxx]
    I --> J[ Email sent to user]
    J --> K[Show: Check your inbox]

    K --> L[User clicks link in email]
    L --> M[Visit /reset-password?token=xxx]
    M --> N[useSearchParams extracts token]
    N --> O[POST /api/auth/validate-reset-token\ntoken]
    O --> P{Token valid & not expired?}
    P -- No --> Q[Show: Invalid link  \nOffer Request New Link]
    P -- Yes --> R[Show reset password form]

    R --> S[Enter new password + confirm]
    S --> T{Client validation\n8 chars, uppercase, number}
    T -- Fails --> U[Show strength indicator + error] --> S
    T -- Passes --> V[POST /api/auth/reset-password\ntoken + password]
    V --> W[bcrypt hash new password]
    W --> X[Clear resetToken from DB]
    X --> Y[Return success]
    Y --> Z[Show: Password reset! \nRedirecting in 3s...]
    Z --> AA([Navigate to /login])
```

---

## 7. Two-Factor Authentication (2FA) Setup

```mermaid
flowchart TD
    A([Authenticated User\n visits /2fa-setup]) --> B{JWT in localStorage?}
    B -- No --> C[Redirect to /login]
    B -- Yes --> D[Step 1: Enable 2FA screen\nExplain requirements]

    D --> E[Click Enable Two-Factor Authentication]
    E --> F[POST /api/auth/2fa/generate\nAuthorization: Bearer token]
    F --> G[Backend: speakeasy.generateSecret]
    G --> H[Generate QR Code image\nqrcode.toDataURL base64]
    H --> I[Save temp secret to session\nnot yet enabled]
    I --> J[Return qrCode + secret]

    J --> K[Step 2: Scan QR Code\nShow QR image in UI]
    K --> L[User opens Authenticator App\nGoogle / Microsoft / Authy]
    L --> M[Scan QR or enter secret manually]
    M --> N[App generates 6-digit TOTP codes\nRefreshes every 30s]

    N --> O[User enters current TOTP code]
    O --> P[POST /api/auth/2fa/verify\ncode + secret]
    P --> Q[Backend: speakeasy.totp.verify\nwindow=1 allow 30s drift]
    Q --> R{Code valid?}
    R -- No --> S[Error: Invalid code] --> O
    R -- Yes --> T[Enable 2FA on user account\ntotp_enabled: true\nsave totp_secret encrypted]
    T --> U[Generate backup codes\n8 single-use codes]
    U --> V[Step 3: Backup Codes\nShow codes  save safely!]
    V --> W[Click Finish]
    W --> X([2FA Active \nNext login requires TOTP code])

    subgraph Skip Option
        D --> Y[Click Skip for now]
        Y --> Z[Navigate to /vendor or /lender]
    end
```

---

## 8. Loan Application Process

```mermaid
flowchart TD
    A([Vendor visits /vendor/request-loan]) --> B[Multi-step Loan Form]
    
    B --> B1[Step 1: Personal Info\nName, DOB, Phone, Aadhaar, Location]
    B1 --> B2[Step 2: Business Details\nBusiness Type, Reason for Loan\nRepayment Period]
    B2 --> B3[Step 3: Loan Amount\nEnter amount in INR/ETH\nWallet address auto-filled]
    B3 --> B4[Step 4: Upload Documents\nAadhaar Image + Business Photo\nvia Multer file upload]
    B4 --> B5[Step 5: Review & Accept Terms]

    B5 --> C{All validation\npassed?}
    C -- No --> D[Highlight missing fields] --> B1
    C -- Yes --> E[POST /api/loan/apply\nmultipart/form-data\nAuthorization: Bearer token]

    E --> F{JWT middleware\nauthenticate vendor}
    F -- Invalid token --> G[401 Unauthorized] 
    F -- Valid --> H[Extract vendorId from req.user.id]
    H --> I{Vendor exists\nin MongoDB?}
    I -- No --> J[404: Vendor not found]
    I -- Yes --> K[Check aadhaarImage\n& businessImage uploaded]
    K --> L{Files present?}
    L -- No --> M[400: Missing documents]
    L -- Yes --> N[Create Loan document\nstatus: Pending\nrepaymentDue: +30 days]
    N --> O[Save to MongoDB]
    O --> P[201: Loan submitted\nReturn loan object]
    P --> Q[Frontend: Show success toast\nLoan ID: xxx]
    Q --> R([Loan visible in /vendor/loans\nstatus: Pending ])
```

---

## 9. Loan Approval / Rejection Process

```mermaid
flowchart TD
    A([Lender visits /lender/loans]) --> B[GET /api/lender/all-loans\nAuthorization: Bearer token]
    B --> C{requireLender middleware\nchecks role === lender}
    C -- Fails --> D[403 Forbidden]
    C -- Passes --> E[Fetch all loans from MongoDB\nstatus: Pending first]
    E --> F[Render loan cards with\nVendor details, amount,\ndocument previews, reason]

    F --> G{Lender reviews\nloan request}
    G --> H[View Aadhaar image\n& Business photo]
    H --> I{Decision}

    I -- Approve --> J[PUT /api/lender/loans/:loanId/approve]
    J --> K[Backend: Find loan by ID]
    K --> L{Loan is Pending?}
    L -- No --> M[400: Already processed]
    L -- Yes --> N[Update Loan:\nstatus  Approved\nlenderId  this lender\napprovedAt  now]
    N --> O[Create Transaction record\ntype: Approval]
    O --> P[Blockchain interaction\ncontract.approveLoan loanId, vendorAddress]
    P --> Q[Store txHash in loan document]
    Q --> R[200: Loan approved ]
    R --> S[Vendor notified on next\ndashboard visit]

    I -- Reject --> T[PUT /api/lender/loans/:loanId/reject]
    T --> U[Update Loan:\nstatus  Rejected]
    U --> V[200: Loan rejected ]

    subgraph Vendor sees result
        S --> W[/vendor/loans  status: Approved ]
        V --> X[/vendor/loans  status: Rejected ]
    end
```

---

## 10. Loan Repayment Process

```mermaid
sequenceDiagram
    participant V as Vendor
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB
    participant BC as Ethereum Contract
    participant MM as MetaMask

    V->>FE: Navigate to repayment section
    FE->>BE: GET /api/loan/my-loans
    BE->>DB: Find loans by vendorId, status=Approved
    DB-->>BE: Active loans list
    BE-->>FE: Loans with repaymentDue dates
    FE->>V: Show loan cards with Pay button

    V->>FE: Click Pay Now on loan
    FE->>MM: Request MetaMask transaction\nSend ETH to lender wallet
    MM->>V: Show confirmation dialog\nAmount + Gas fee
    V->>MM: Confirm transaction
    MM->>BC: Send ETH transaction
    BC-->>MM: Transaction hash
    MM-->>FE: txHash returned

    FE->>BE: POST /api/loan/repay/:loanId\n{ txHash }
    BE->>DB: Find loan, verify status
    BE->>DB: Update:\nrepaid: true\nstatus: Repaid\nrepaymentDate: now\ntransactionHash: txHash
    BE->>DB: Create Transaction record\ntype: Repayment, txHash
    DB-->>BE: Updated
    BE-->>FE: { success: true }
    FE->>V: Show  Repayment successful toast
    FE->>V: Update loan card status  Repaid

    Note over BC: On-chain:\nmakePayment() called\nCredit score updated\n+50 points on full repayment
```

---

## 11. KYC Encryption & Decryption Flow

```mermaid
flowchart LR
    subgraph Registration
        A[Aadhaar: 123456789012] --> B[encryptKYC function]
        B --> C[crypto.createHash SHA-256\nKYC_SECRET  32-byte KEY]
        C --> D[crypto.randomBytes 16\n random IV]
        D --> E[AES-256-CBC encrypt\ncipher.update + cipher.final]
        E --> F[ivHex:encryptedHex\ne.g. a3f9...5c:8d2e...7f]
        F --> G[(MongoDB\nencryptedKYC field)]
    end

    subgraph Retrieval
        G --> H[decryptKYC function]
        H --> I[Split on :  ivHex + encryptedHex]
        I --> J[Buffer.from ivHex hex  IV]
        J --> K[AES-256-CBC decrypt\ncreateDecipheriv]
        K --> L[Original Aadhaar: 123456789012]
    end

    subgraph Never Stored
        M[ Raw Aadhaar never in DB]
        M --> N[ Not logged or transmitted]
    end
```

---

## 12. Blockchain Smart Contract Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Deployed: Admin deploys LoanContract.sol

    state Deployed {
        [*] --> Ready
        Ready --> VendorRegistered: registerVendor(address)
        Ready --> LenderRegistered: registerLender()
        LenderRegistered --> FundsDeposited: depositFunds() payable
    }

    state LoanLifecycle {
        [*] --> PENDING: requestLoan(amount, rate, tenure)
        PENDING --> ACTIVE: approveLoan(loanId, vendorAddr)\nby Lender
        ACTIVE --> REPAYING: makePayment(loanId) partial
        ACTIVE --> COMPLETED: makePayment(loanId) full
        REPAYING --> COMPLETED: makePayment(loanId) remaining
        ACTIVE --> DEFAULTED: markDefault(loanId)\nafter grace period
        REPAYING --> DEFAULTED: markDefault(loanId)
        COMPLETED --> [*]: LoanFullyRepaid event\nCredit score +50
        DEFAULTED --> [*]: LoanDefaulted event\nCredit score -100
    }

    state CreditSystem {
        [*] --> NeutralScore: New vendor: score=500
        NeutralScore --> ImprovedScore: recordSales() via Oracle
        ImprovedScore --> HighScore: Full repayment: +50 pts
        HighScore --> ReducedScore: Default: -100 pts
        ReducedScore --> Blacklisted: Admin: setVendorBlacklist(true)
    }
```

---

## 13. Oracle Sales Data Flow

```mermaid
flowchart TD
    A[ node-cron\nSchedule: 0 9 * * *\nEvery day 09:00 AM] --> B[simulateAndPushSales]
    B --> C[Connect to MongoDB]
    C --> D[Vendor.find  get all vendors]
    D --> E{Vendors found?}
    E -- None --> F[Log: No vendors] --> Z
    E -- Found --> G[For each vendor loop]
    G --> H[Simulate sales\nMath.random  1001000 INR\n Replace with real POS/UPI data]
    H --> I[Log: Updating vendorAddress amount]
    I --> J[updateSalesDataToBlockchain\nvendor.walletAddress, amount]
    J --> K[contract.recordSales\naddress, amount via Ethers.js]
    K --> L{Transaction confirmed?}
    L -- Error --> M[console.error Oracle update error]
    L -- Success --> N[tx.wait  block confirmed]
    N --> O[Event: SalesRecorded emitted on-chain]
    O --> P[vendor.totalSales += amount\non blockchain state]
    P --> G
    G --> Q{All vendors\nprocessed?}
    Q -- No --> G
    Q -- Yes --> Z([Oracle run complete ])

    subgraph Production Integration
        H2[Real-world data sources:\n- UPI payment APIs\n- POS terminal webhooks\n- WhatsApp Business API\n- Bank statement parsing]
        H2 -.->|Replace simulation| H
    end
```

---

## 14. JWT Authorization Flow

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant MW as auth.js Middleware
    participant DB as MongoDB
    participant H as Route Handler

    C->>MW: HTTP Request\nAuthorization: Bearer eyJhbGci...

    MW->>MW: Check header exists\nand starts with "Bearer "
    alt No token
        MW-->>C: 401 Access denied. No token provided.
    end

    MW->>MW: Extract token = header.split(" ")[1]
    MW->>MW: jwt.verify(token, JWT_SECRET)

    alt Token expired
        MW-->>C: 403 Token has expired. Please log in again.
    else Token tampered / invalid
        MW-->>C: 403 Invalid or expired token.
    else Valid token
        MW->>MW: Decoded = { userId, role, email, iat, exp }
        MW->>H: req.user = decoded  next()
        H->>DB: Query with req.user.id
        DB-->>H: Data
        H-->>C: 200 Response with data
    end

    Note over C,H: requireLender.js additionally checks:\nif (req.user.role !== "lender") return 403
```

---

## 15. Frontend Routing & Protected Routes

```mermaid
flowchart TD
    A([Browser navigates to URL]) --> B{Is path public?}
    
    B -- / or /login or /register\nor /verify-otp etc. --> C[Render public component directly]
    
    B -- /vendor/* or /lender/* --> D[ProtectedRoute component]
    D --> E{localStorage.getItem token?}
    E -- null or empty --> F[Redirect to /login]
    E -- Has token --> G{localStorage.getItem role\n=== requiredRole prop?}
    G -- Mismatch --> H[Redirect to /login\nwrong role]
    G -- Match --> I[Render DashboardLayout]

    I --> J[DashboardLayout mounts]
    J --> K[Read role from localStorage]
    K --> L{role?}
    L -- vendor --> M[Show vendor nav links\nApply vendor-modern-scope CSS]
    L -- lender --> N[Show lender nav links\nApply lender-modern-scope CSS]
    L -- null --> O[Show generic layout]

    M --> P[Render Outlet\n= matched child route]
    N --> P
    P --> Q[Child page component renders]
    Q --> R[QuickAccessDock: role-aware shortcuts]
    Q --> S[Footer renders]

    subgraph Route Definitions in App.js
        T1[/vendor  VendorDashboard index]
        T2[/vendor/loans  VendorLoans]
        T3[/vendor/request-loan  LoanRequestForm]
        T4[... 12 more vendor routes]
        T5[/lender  LenderDashboard index]
        T6[/lender/loans  LenderLoans]
        T7[... 11 more lender routes]
    end
```

---

## 16. Data Flow Diagram  Full System

```mermaid
flowchart LR
    U([User]) -->|Form inputs| FE[React App]
    FE -->|Axios POST/GET| API[Express REST API]

    API -->|Mongoose| MongoDB[(MongoDB\nVendors\nLenders\nLoans\nTransactions)]

    API -->|encryptKYC| ENC[AES-256-CBC\nEncrypted Aadhaar]
    ENC --> MongoDB

    API -->|jwt.sign| JWT[JWT Token\nreturned to client]
    JWT -->|localStorage| FE

    API -->|contract.approveLoan\ncontract.recordSales| ETH[Ethers.js Provider]
    ETH -->|JSON-RPC| NODE[Ethereum Node\nGanache / Infura]
    NODE -->|EVM execute| SC[LoanContract.sol]

    SC -->|Events emitted| EVENTS[VendorRegistered\nLoanApproved\nPaymentMade\nCreditScoreUpdated]
    EVENTS -.->|future: webhook| API

    CRON[node-cron Oracle\nDaily 9AM] -->|Vendor.find| MongoDB
    CRON -->|recordSales tx| ETH

    API -->|nodemailer| GMAIL[Gmail SMTP]
    GMAIL -->|Email delivery| U

    FE -->|MetaMask| MM[MetaMask Extension]
    MM -->|Sign tx| NODE
    MM -->|txHash| FE
    FE -->|POST txHash| API
    API --> MongoDB
```

---

## 17. State Machines

### Loan Document State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Vendor submits application\nPOST /api/loan/apply
    
    Pending --> Approved: Lender approves\nPUT /api/lender/loans/:id/approve\nstatus = Approved, lenderId set, approvedAt set
    
    Pending --> Rejected: Lender rejects\nPUT /api/lender/loans/:id/reject\nstatus = Rejected
    
    Approved --> Repaid: Vendor repays via MetaMask\nPOST /api/loan/repay/:id\nrepaid = true, repaymentDate set, txHash stored
    
    Rejected --> [*]: Final state
    Repaid --> [*]: Final state\nCredit score updated on-chain
    
    note right of Pending
        Default repaymentDue = +30 days
        Documents: Aadhaar + Business images
    end note
    
    note right of Approved
        Blockchain: LoanApproved event
        Transaction record created
    end note
```

### Vendor Onboarding State Machine

```mermaid
stateDiagram-v2
    [*] --> Unregistered
    Unregistered --> Registered: POST /api/vendor/register\nAadhaar encrypted, password hashed
    Registered --> EmailVerified: POST /api/otp/verify\nOTP correct + not expired
    EmailVerified --> LoggedIn: POST /api/vendor/login\nJWT issued
    LoggedIn --> Active: Access /vendor dashboard
    Active --> Suspended: Admin blacklists on-chain\nsetVendorBlacklist(true)
    Suspended --> Active: Admin unblacklists
    Active --> LoggedOut: Logout / token cleared
    LoggedOut --> LoggedIn: Login again
```

---

## 18. Database Entity Relationships

```mermaid
erDiagram
    VENDOR {
        ObjectId _id PK
        string fullname
        string email UK
        string phone UK
        string password
        string role
        string aadhaarNumber UK
        string encryptedKYC
        string walletAddress
        string profileImage
        boolean enable2FA
        boolean notifyByEmail
        boolean notifyBySMS
        string language
        string theme
        boolean emailVerified
        string resetToken
        Date resetTokenExpiry
        string totp_secret
        boolean totp_enabled
        Date createdAt
        Date updatedAt
    }

    LENDER {
        ObjectId _id PK
        string fullname
        string email UK
        string aadhaarNumber UK
        string phone
        string walletAddress
        string encryptedKYC
        string profileImage
        string password
        boolean enable2FA
        string walletBalance
        string role
        string language
        string theme
        boolean notifyByEmail
        boolean notifyBySMS
        Date lastLogin
        Date createdAt
        Date updatedAt
    }

    LOAN {
        ObjectId _id PK
        ObjectId vendorId FK
        ObjectId lenderId FK
        string fullName
        string surname
        string dob
        string email
        string phone
        string aadhaar
        string location
        string walletAddress
        string loanAmount
        string reason
        string repayTime
        string businessType
        boolean termsAccepted
        string aadhaarImage
        string businessImage
        number amount
        number interestRate
        string status
        Date repaymentDue
        boolean repaid
        Date repaymentDate
        Date approvedAt
        string transactionHash
        Date createdAt
        Date updatedAt
    }

    TRANSACTION {
        ObjectId _id PK
        ObjectId vendorId FK
        ObjectId lenderId FK
        ObjectId loanId FK
        string type
        number amount
        string txHash
        string status
        Date createdAt
    }

    VENDOR ||--o{ LOAN : "applies for"
    LENDER ||--o{ LOAN : "approves / funds"
    LOAN ||--o{ TRANSACTION : "generates"
    VENDOR ||--o{ TRANSACTION : "participates in"
    LENDER ||--o{ TRANSACTION : "participates in"
```

---

## 19. Component Architecture (Frontend)

```mermaid
flowchart TD
    APP[App.js\nBrowserRouter + Routes] --> PUB[Public Routes\n/ /login /register etc.]
    APP --> PROT[ProtectedRoute\nJWT + role check]
    PROT --> DL[DashboardLayout.jsx\nSidebar + Hamburger + Footer]
    
    DL --> OUTLET[Outlet  child pages]
    DL --> QAD[QuickAccessDock.jsx\nFloating shortcuts]
    DL --> FOOTER[Footer.jsx]

    OUTLET --> VP[Vendor Pages\n15 route components]
    OUTLET --> LP[Lender Pages\n12 route components]

    VP --> VD[Dashboard.jsx]
    VP --> VL[VendorLoans.jsx]
    VP --> VT[VendorTransactions.jsx]
    VP --> VF[LoanRequestForm.jsx]
    VP --> VTOOLS[Tools:\nRepaymentPlanner\nChecklist\nReminders\nExpenseTracker\nSalesBooster]
    VP --> VHELP[Help:\nEasyAssist\nTutorial\nQuickGuide\nHelp]

    LP --> LD[Dashboard.jsx]
    LP --> LL[LenderLoans.jsx]
    LP --> LPF[LenderPortfolio.jsx]
    LP --> LIH[LenderInvestmentHistory.jsx]
    LP --> LTOOLS[Tools:\nRiskAnalyzer\nYieldPlanner\nOpportunityRadar\nWithdrawal]
    LP --> LSETTINGS[Settings + Profile + Help]

    subgraph Common Components
        COMP[components/common/]
        COMP --> BTN[Button.jsx]
        COMP --> INP[Input.jsx]
        COMP --> SEL[Select.jsx]
        COMP --> ALT[Alert.jsx]
        COMP --> BDG[Badge.jsx]
        COMP --> STAT[StatCard.jsx]
        COMP --> TBL[Table.jsx]
        COMP --> HDR[Header.jsx]
        COMP --> FTR[Footer.jsx]
        COMP --> QAD2[QuickAccessDock.jsx]
        COMP --> PR[ProtectedRoute.jsx]
        COMP --> EB[ErrorBoundary.jsx]
    end
```

---

## 20. Deployment Pipeline

```mermaid
flowchart TD
    subgraph Development
        DEV1[Developer writes code] --> DEV2[npm run dev\nbackend nodemon]
        DEV2 --> DEV3[npm start\nReact dev server port 3000]
        DEV3 --> DEV4[Ganache local blockchain\nport 7545]
        DEV4 --> DEV5[node oracles/salesOracleSimulator.js]
    end

    subgraph Build & Test
        DEV5 --> B1[npm test  React + Hardhat tests]
        B1 --> B2[npm run build\nCreate React App production bundle]
        B2 --> B3{Build success?\nno errors}
        B3 -- Fail --> DEV1
        B3 -- Pass --> DEPLOY
    end

    subgraph DEPLOY[Deployment]
        direction TB
        F1[Frontend\nbuild/ folder] -->|Upload| VERCEL[Vercel / Netlify\nStatic CDN]
        
        BK1[Backend\nNode.js app] -->|Deploy| RAILWAY[Railway / Render\nor EC2 with PM2]
        
        SC1[Smart Contract] -->|npx hardhat run deploy.js\n--network sepolia| INFURA[Infura / Alchemy\nSepolia Testnet]
        
        INFURA -->|Contract Address| ENV[Update .env\nCONTRACT_ADDRESS=0x...]
        ENV --> RAILWAY
        
        RAILWAY -->|CORS allow| VERCEL
    end

    subgraph Environment Variables
        ENV2[Root .env:\nPORT, MONGO_URI, JWT_SECRET\nKYC_SECRET, OTP_EMAIL/PASS\nINFURA_API, PRIVATE_KEY\nCONTRACT_ADDRESS, FRONTEND_URL]
        ENV3[Frontend .env:\nREACT_APP_LENDER_API_KEY\nREACT_APP_API_URL]
    end
```

---

## Process Summary Table

| # | Process | Trigger | Key Steps | Output |
|---|---|---|---|---|
| 1 | Vendor Registration | `/register` form submit | Validate  Encrypt KYC  Hash PW  Save MongoDB | Vendor account created |
| 2 | Lender Registration | `/register` (lender role) | Same as vendor + API key required at login | Lender account created |
| 3 | Login | `/login` form submit | Validate  Find user  Compare bcrypt  Sign JWT | JWT token in localStorage |
| 4 | OTP Verification | After registration | Generate OTP  Send email  Verify  Activate account | Email verified |
| 5 | Password Reset | `/forgot-password` | Generate token  Email link  Validate token  Hash new PW | Password updated |
| 6 | 2FA Setup | `/2fa-setup` | Generate TOTP secret  QR code  Verify code  Enable | 2FA active |
| 7 | Loan Application | `/vendor/request-loan` | Fill form  Upload docs  POST to API  Status=Pending | Loan in MongoDB |
| 8 | Loan Approval | Lender dashboard | Review loan  PUT approve  Blockchain tx  Status=Approved | Loan funded on-chain |
| 9 | Loan Repayment | Vendor dashboard | MetaMask tx  POST txHash  Status=Repaid  Credit score++ | Loan closed |
| 10 | Oracle Sync | Daily 9 AM cron | Read vendors from DB  Simulate sales  recordSales() on-chain | Sales updated on blockchain |
| 11 | KYC Encrypt | Registration | AES-256-CBC  iv:ciphertext  MongoDB | Aadhaar never in plaintext |
| 12 | JWT Auth | Every protected request | Extract Bearer token  jwt.verify  req.user = decoded | Access granted or 401/403 |

---

*All flowcharts use [Mermaid](https://mermaid.js.org/) syntax. View on GitHub, VS Code with the Markdown Preview Mermaid Support extension, or at [mermaid.live](https://mermaid.live).*

---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
