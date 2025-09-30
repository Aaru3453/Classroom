const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // ✅ Use Gmail SMTP (most reliable)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password' // ⚠️ Use App Password, NOT regular password
      }
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@eduscheduler.com',
        to: user.email,
        subject: 'Password Reset Request - EduScheduler',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour.<br>
              If you didn't request this, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>Thank you,<br><strong>EduScheduler Team</strong></p>
            </div>
          </div>
        `
      };

      console.log('📧 Attempting to send email to:', user.email);
      
      // ✅ ACTUALLY SEND THE EMAIL (uncomment this)
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      console.log('📨 Message ID:', result.messageId);
      
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(user) {
    // Similar implementation for welcome email
    console.log('👋 Welcome email would be sent to:', user.email);
    return true;
  }

  async sendEmail({ to, subject, html }) {
    console.log('📧 Email would be sent to:', to);
    console.log('📝 Subject:', subject);
    return true;
  }
}

module.exports = new EmailService();