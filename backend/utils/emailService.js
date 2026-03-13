// backend/utils/emailService.js

const nodemailer = require('nodemailer');

const SMTP_USER = process.env.OTP_EMAIL || process.env.EMAIL_USER;
const SMTP_PASS = process.env.OTP_PASS || process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

const assertEmailEnv = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('Missing SMTP credentials: set OTP_EMAIL/OTP_PASS (or EMAIL_USER/EMAIL_PASSWORD) in environment variables.');
  }
};

// Create reusable transporter
const createTransporter = () => {
  assertEmailEnv();
  return nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, userName = 'User') => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"DhanSetu" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Reset Your DhanSetu Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>We received a request to reset your password for your DhanSetu account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px; font-size: 12px;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
              </div>
              <p>For security reasons, we recommend using a strong password that includes:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>Uppercase and lowercase letters</li>
                <li>Numbers and special characters</li>
              </ul>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} DhanSetu. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${userName},
        
        We received a request to reset your password for your DhanSetu account.
        
        Click the link below to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        DhanSetu Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send 2FA setup confirmation email
 */
const send2FAEnabledEmail = async (email, userName = 'User') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"DhanSetu" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Two-Factor Authentication Enabled',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 2FA Enabled Successfully</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <div class="success">
                <strong>✅ Success!</strong> Two-factor authentication has been enabled for your DhanSetu account.
              </div>
              <p>Your account is now more secure. You'll need to enter a verification code from your authenticator app each time you log in.</p>
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Keep your backup codes in a safe place</li>
                <li>Don't share your 2FA codes with anyone</li>
                <li>If you lose access to your authenticator app, use a backup code</li>
              </ul>
              <p>If you didn't enable 2FA, please contact support immediately.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} DhanSetu. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('2FA confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending 2FA email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email after successful registration
 */
const sendWelcomeEmail = async (email, userName = 'User', role = 'user') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"DhanSetu" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to DhanSetu!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to DhanSetu!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Welcome to DhanSetu - India's leading blockchain-powered microloan platform! 🚀</p>
              <p>You've successfully registered as a <strong>${role}</strong>. Here's what you can do:</p>
              <ul>
                ${role === 'vendor' ? `
                  <li>Apply for instant microloans</li>
                  <li>Track your loan status in real-time</li>
                  <li>View transparent transaction history on blockchain</li>
                ` : `
                  <li>Invest in verified vendor loans</li>
                  <li>Earn competitive returns</li>
                  <li>Track all investments on blockchain</li>
                `}
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Get Started</a>
              </p>
              <p><strong>Need help?</strong> Check out our help center or contact support.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} DhanSetu. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send lender API key after successful lender registration
 */
const sendLenderApiKeyEmail = async (email, userName = 'Lender', apiKey = '') => {
  try {
    if (!apiKey) {
      return { success: false, error: 'Lender API key is missing in environment configuration.' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"DhanSetu" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Your DhanSetu Lender Login API Key',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .api-key { background: #111827; color: #f9fafb; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 14px; word-break: break-all; }
            .info { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Lender Registration Successful</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your lender account has been created successfully.</p>
              <p>Use the following API key while logging in as a lender:</p>
              <div class="api-key">${apiKey}</div>
              <div class="info">
                <strong>Important:</strong> Keep this API key secure and do not share it publicly.
              </div>
              <p>You can now log in from:</p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">${process.env.FRONTEND_URL || 'http://localhost:3000'}/login</a></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} DhanSetu. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${userName},

        Your lender account has been created successfully.

        Use this API key while logging in as a lender:
        ${apiKey}

        Keep this key secure and do not share it publicly.

        Login URL: ${(process.env.FRONTEND_URL || 'http://localhost:3000')}/login

        Regards,
        DhanSetu Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Lender API key email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending lender API key email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  sendPasswordResetEmail,
  send2FAEnabledEmail,
  sendWelcomeEmail,
  sendLenderApiKeyEmail,
};
