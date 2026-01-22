import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"FO Perspectives" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-content {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .reset-button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
          }
          .reset-button:hover {
            background-color: #1d4ed8;
          }
          .link-text {
            color: #666;
            font-size: 14px;
            word-break: break-all;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-content">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your FOP account. Click the button below to create a new password:</p>
              
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              
              <div class="warning">
                ⚠️ <strong>Important:</strong> This link will expire in 15 minutes for security reasons.
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p class="link-text">${resetUrl}</p>
              
              <p style="margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from FOP App. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} FOP App. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request

Hello,

We received a request to reset your password for your FOP App account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 15 minutes for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
This is an automated email from FOP App. Please do not reply to this message.
© ${new Date().getFullYear()} FOP App. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export default {
  sendPasswordResetEmail,
};
