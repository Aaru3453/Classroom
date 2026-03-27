// const nodemailer = require('nodemailer');

// class EmailService {
//   constructor() {
//     // ✅ Use Gmail SMTP (most reliable)
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.GMAIL_USER || 'your-email@gmail.com',
//         pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password' // ⚠️ Use App Password, NOT regular password
//       }
//     });
//   }

//   async sendPasswordResetEmail(user, resetToken) {
//     try {
//       const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      
//       const mailOptions = {
//         from: process.env.FROM_EMAIL || 'noreply@eduscheduler.com',
//         to: user.email,
//         subject: 'Password Reset Request - EduScheduler',
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #2563eb;">Password Reset Request</h2>
//             <p>Hello <strong>${user.name}</strong>,</p>
//             <p>You requested to reset your password. Click the button below to reset it:</p>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${resetUrl}" 
//                  style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
//                 Reset Password
//               </a>
//             </div>
            
//             <p style="color: #666; font-size: 14px;">
//               This link will expire in 1 hour.<br>
//               If you didn't request this, please ignore this email.
//             </p>
            
//             <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
//               <p>Thank you,<br><strong>EduScheduler Team</strong></p>
//             </div>
//           </div>
//         `
//       };

//       console.log('📧 Attempting to send email to:', user.email);
      
//       // ✅ ACTUALLY SEND THE EMAIL (uncomment this)
//       const result = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Email sent successfully!');
//       console.log('📨 Message ID:', result.messageId);
      
//       return true;
//     } catch (error) {
//       console.error('❌ Email sending failed:', error);
//       return false;
//     }
//   }

//   async sendWelcomeEmail(user) {
//     // Similar implementation for welcome email
//     console.log('👋 Welcome email would be sent to:', user.email);
//     return true;
//   }

//   async sendEmail({ to, subject, html }) {
//     console.log('📧 Email would be sent to:', to);
//     console.log('📝 Subject:', subject);
//     return true;
//   }
// }

// module.exports = new EmailService();


// backend/services/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Check if email configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ Email configuration missing. Emails will not be sent.");
      console.log("Required vars:", {
        host: !!process.env.SMTP_HOST,
        user: !!process.env.SMTP_USER,
        pass: !!process.env.SMTP_PASS
      });
      this.isConfigured = false;
      return;
    }

    console.log("📧 Configuring email service with:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
    });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email service configuration error:", error.message);
        this.isConfigured = false;
      } else {
        console.log("✅ Email service is ready to send messages");
        this.isConfigured = true;
      }
    });
  }

  async sendSupportConfirmation(ticket) {
    if (!this.isConfigured) {
      console.log("📧 Email not sent - service not configured");
      return { success: false, message: "Email service not configured" };
    }

    // Get response time based on urgency
    const getResponseTime = (urgency) => {
      const times = {
        low: "24 hours",
        medium: "12 hours",
        high: "4 hours",
        urgent: "1 hour"
      };
      return times[urgency] || "24 hours";
    };

    const mailOptions = {
      from: `"EduScheduler Support" <${process.env.SMTP_USER}>`,
      to: ticket.email,
      subject: `Your Request Has Been Received - ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
            <h2 style="color: #159895; margin: 0; font-size: 24px;">Thank You for Contacting Us</h2>
            <p style="color: #666; margin: 5px 0 0; font-size: 15px;">We've received your request</p>
          </div>
          
          <!-- Greeting -->
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Dear <strong>${ticket.name}</strong>,</p>
          
          <!-- Main Message -->
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
            Thank you for reaching out to EduScheduler Support. Your request has been received and our team will review it shortly.
          </p>
          
          <!-- Request Details Card -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #159895;">
            <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Request Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 100px;">Request ID:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #159895;">${ticket.ticketNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Subject:</td>
                <td style="padding: 8px 0; color: #333;">${ticket.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 15px; font-size: 13px;">Under Review</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Response Time Info -->
          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 15px 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #159895; font-weight: 500;">
              ⏱️ Expected response time: <strong>${getResponseTime(ticket.urgencyLevel)}</strong>
            </p>
          </div>
          
          <!-- Quick Note -->
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
            Our support team will get back to you as soon as possible. You'll receive email updates about your request status.
          </p>
          
          <!-- Footer -->
          <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #888; font-size: 13px; margin: 5px 0;">
              <strong>EduScheduler Support Team</strong><br>
              support@eduscheduler.com | +91 92841 54457
            </p>
            <p style="color: #aaa; font-size: 12px; margin: 10px 0 0;">
              This is an automated message, please do not reply directly.
            </p>
          </div>
        </div>
      `,
      text: `
        Thank You for Contacting EduScheduler Support
        
        Dear ${ticket.name},
        
        Thank you for reaching out to EduScheduler Support. Your request has been received and our team will review it shortly.
        
        REQUEST DETAILS:
        - Request ID: ${ticket.ticketNumber}
        - Subject: ${ticket.subject}
        - Status: Under Review
        
        Expected response time: ${getResponseTime(ticket.urgencyLevel)}
        
        Our support team will get back to you as soon as possible.
        
        Best regards,
        EduScheduler Support Team
        support@eduscheduler.com | +91 92841 54457
      `,
    };

    try {
      console.log(`📧 Sending confirmation email to ${ticket.email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Confirmation email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Failed to send confirmation email:", error.message);
      throw error;
    }
  }

  async sendSupportNotification(ticket) {
    if (!this.isConfigured) {
      return { success: false, message: "Email service not configured" };
    }

    const mailOptions = {
      from: `"EduScheduler Support" <${process.env.SMTP_USER}>`,
      to: process.env.SUPPORT_EMAIL || process.env.SMTP_USER,
      subject: `New Support Request: ${ticket.ticketNumber} (${ticket.urgencyLevel})`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px;">
          <h3 style="color: #159895;">New Support Request Received</h3>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p><strong>From:</strong> ${ticket.name} (${ticket.email})</p>
            <p><strong>Request ID:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>Priority:</strong> ${ticket.urgencyLevel}</p>
            <p><strong>Message:</strong><br>${ticket.message}</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    };

    try {
      console.log("📧 Sending notification to support team...");
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Notification sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Failed to send notification:", error.message);
      throw error;
    }
  }

  async testConfiguration() {
    console.log("🔍 Testing email configuration...");
    
    if (!this.isConfigured) {
      console.log("❌ Email service is not configured");
      return false;
    }
    
    try {
      await this.transporter.verify();
      console.log("✅ Email service is working properly");
      return true;
    } catch (error) {
      console.error("❌ Email service test failed:", error.message);
      return false;
    }
  }
}

const emailService = new EmailService();
export default emailService;