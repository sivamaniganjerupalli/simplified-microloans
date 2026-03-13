# Authentication Backend Setup

## New Backend Files Created

The following backend files have been created to support the new authentication features:

### Models
1. **PasswordReset.js** - Stores password reset tokens with expiration
2. **TwoFactorAuth.js** - Manages 2FA secrets and backup codes

### Controllers
3. **authController.js** - Handles all authentication logic:
   - `forgotPassword` - Sends password reset email
   - `validateResetToken` - Validates reset token
   - `resetPassword` - Resets password with valid token
   - `generate2FA` - Generates TOTP secret and QR code
   - `verify2FA` - Verifies and enables 2FA
   - `disable2FA` - Disables 2FA with password confirmation

### Routes
4. **authRoutes.js** - Authentication API endpoints:
   - `POST /api/auth/forgot-password`
   - `POST /api/auth/validate-reset-token`
   - `POST /api/auth/reset-password`
   - `POST /api/auth/2fa/generate` (requires auth)
   - `POST /api/auth/2fa/verify` (requires auth)
   - `POST /api/auth/2fa/disable` (requires auth)

### Utilities
5. **emailService.js** - Email sending functionality:
   - `sendPasswordResetEmail` - Password reset email with link
   - `send2FAEnabledEmail` - 2FA confirmation email
   - `sendWelcomeEmail` - Welcome email after registration

## Environment Variables Required

Add these to your `.env` file:

```env
# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL for reset links
FRONTEND_URL=http://localhost:3000
```

### Gmail App Password Setup:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Copy the password to `EMAIL_PASSWORD` in .env

## NPM Packages Required

Install these packages if not already installed:

```bash
npm install nodemailer speakeasy qrcode
```

- **nodemailer** - For sending emails
- **speakeasy** - For TOTP 2FA generation/verification
- **qrcode** - For generating QR codes

## Testing the Endpoints

### 1. Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### 2. Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"RESET_TOKEN_FROM_EMAIL","password":"NewPassword123"}'
```

### 3. Generate 2FA (requires authentication token)
```bash
curl -X POST http://localhost:5000/api/auth/2fa/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Verify 2FA
```bash
curl -X POST http://localhost:5000/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"code":"123456","secret":"BASE32_SECRET"}'
```

## Frontend Integration

The new authentication pages will automatically connect to these endpoints:

- **ForgotPassword.jsx**  `/api/auth/forgot-password`
- **ResetPassword.jsx**  `/api/auth/validate-reset-token` & `/api/auth/reset-password`
- **TwoFactorSetup.jsx**  `/api/auth/2fa/generate` & `/api/auth/2fa/verify`

## Security Features

 **Password Reset:**
- Cryptographically secure tokens (SHA-256)
- 1-hour expiration
- One-time use tokens
- Auto-cleanup of expired tokens

 **Two-Factor Authentication:**
- TOTP standard (RFC 6238)
- QR code generation
- 10 backup codes
- Email confirmation

 **Email Security:**
- HTML email templates
- Anti-phishing measures
- Expiration warnings

## Notes

1. The auth routes are now registered in `app.js` under `/api/auth`
2. 2FA routes require the `authenticate` middleware
3. Password reset tokens auto-expire after 1 hour
4. Backup codes are one-time use only
5. All passwords are hashed with bcrypt (salt rounds: 10)

---
Last reviewed: 2026-03-14

## Recent Updates (Mar 2026)

- Vendor pages now use live API-driven data for dashboard, loans, settings, transactions, and reminders.
- Reminder Center is persisted through backend CRUD APIs at /api/reminders (vendor-scoped).
- TOTP verification reliability was improved by persisting 2FA secrets in MongoDB instead of in-memory storage.
- Loan apply upload handling now returns JSON-safe errors and uses a hardened absolute uploads path.
- Lender approval flow now blocks self-wallet approvals when lender and vendor wallet addresses match.
- Auth flow was hardened with better expired-token handling across protected routes.
