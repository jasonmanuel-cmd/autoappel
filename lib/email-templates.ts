/**
 * Production Email Templates
 * Used with Resend API for transactional emails
 */

interface EmailTemplateData {
  [key: string]: string | number | boolean
}

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
`

const buttonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #ff2400;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  margin: 16px 0;
`

const dangerButtonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #ff6b6b;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  margin: 16px 0;
`

const successButtonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  margin: 16px 0;
`

// Welcome email on successful signup
export function welcomeEmail(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #ff2400; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          ol, ul { margin: 12px 0; padding-left: 20px; }
          li { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Welcome to AppealMyTicket<span style="color:#ff2400">S</span>.com, ${data.fullName}!</h1>
        
        <p>Thank you for signing up. We're here to help you manage your traffic citations efficiently and get the best possible outcomes.</p>
        
        <h2>What's Next?</h2>
        <ol>
          <li>Verify your email (if you haven't already)</li>
          <li>Log in to your dashboard</li>
          <li>Add your citations</li>
          <li>Choose your next step (appeal, payment plan, etc.)</li>
        </ol>
        
        <a href="${data.dashboardUrl}" style="${buttonStyle}">Go to Dashboard</a>
        
        <h2>Questions?</h2>
        <p>Visit our <a href="${data.faqUrl}">FAQ page</a> or <a href="${data.contactUrl}">contact us</a>.</p>
        
        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Deadline alert email - sent when deadline is approaching
export function deadlineAlertEmail(data: EmailTemplateData): string {
  const name = data.firstName || data.fullName || 'Valued Customer'
  const days = data.daysRemaining || 3
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #ff6b6b; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .alert-box { background-color: #fff3cd; border-left: 4px solid #ff6b6b; padding: 16px; margin: 16px 0; }
          .details { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; }
          .details p { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>⚠️ Your Citation Deadline is Approaching – ${days} Day${days !== 1 ? 's' : ''} Left</h1>
        
        <p>Hi ${name},</p>
        
        <div class="alert-box">
          <p><strong>Your citation ${data.citationNumber} is due in ${days} day${days !== 1 ? 's' : ''}.</strong></p>
        </div>
        
        <h2>Citation Details</h2>
        <div class="details">
          <p><strong>Citation Number:</strong> ${data.citationNumber}</p>
          <p><strong>Due Date:</strong> ${data.deadline || data.responseDeadline}</p>
          ${data.violationType ? `<p><strong>Violation:</strong> ${data.violationType}</p>` : ''}
        </div>
        
        <p><strong>Don't wait – act now to avoid late fees and additional penalties!</strong></p>
        
        <p>Track your appeal: <a href="${data.citationUrl || 'https://AppealMyTickets.com/dashboard'}">Visit Dashboard</a></p>
        <p>Questions? <a href="mailto:info@lagnafnetwork.com">Contact us</a></p>
        
        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Submission received confirmation
export function submissionReceivedEmail(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #ff2400; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .details { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; }
          .details p { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>✅ Your ${data.submissionType} Has Been Received</h1>
        
        <p>Hi ${data.fullName},</p>
        
        <p>Thank you for submitting your ${data.submissionType}. We've received it and it will be reviewed shortly.</p>
        
        <h2>Submission Details</h2>
        <div class="details">
          <p><strong>Citation Number:</strong> ${data.citationNumber}</p>
          <p><strong>Request Type:</strong> ${data.submissionType}</p>
          <p><strong>Submitted:</strong> ${data.submissionDate}</p>
          <p><strong>Status:</strong> Pending Review</p>
        </div>
        
        <h2>What Happens Next?</h2>
        <p>Your submission will be reviewed and we will get back to you within 2-3 business days. You can check the status of your submission in your dashboard anytime.</p>
        
        <a href="${data.citationUrl}" style="${buttonStyle}">Check Status</a>
        
        <p>We'll also notify you by email as soon as there's an update.</p>
        
        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Submission approved
export function submissionApprovedEmail(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #28a745; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .alert-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 16px; margin: 16px 0; }
          .details { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; }
          .details p { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>🎉 Good News: Your ${data.submissionType} Has Been Approved!</h1>
        
        <p>Hi ${data.fullName},</p>
        
        <div class="alert-box">
          <p><strong>Great news! Your ${data.submissionType} has been reviewed and approved.</strong></p>
        </div>
        
        <h2>What This Means</h2>
        <div class="details">
          <p><strong>Citation Number:</strong> ${data.citationNumber}</p>
          <p><strong>Previous Status:</strong> Pending</p>
          <p><strong>New Status:</strong> ${data.newStatus}</p>
          <p><strong>Admin Notes:</strong> "${data.adminNotes}"</p>
        </div>
        
        <h2>Next Steps</h2>
        <p>${data.nextStepsText}</p>
        
        <a href="${data.citationUrl}" style="${successButtonStyle}">View Full Details</a>
        
        <p>Questions? <a href="${data.contactUrl}">Contact us</a></p>
        
        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Submission rejected
export function submissionRejectedEmail(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #ff6b6b; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .alert-box { background-color: #f8d7da; border-left: 4px solid #ff6b6b; padding: 16px; margin: 16px 0; }
          .details { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; }
          .details p { margin: 8px 0; }
          ul { margin: 12px 0; padding-left: 20px; }
          li { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Update on Your ${data.submissionType} – Further Action Needed</h1>
        
        <p>Hi ${data.fullName},</p>
        
        <p>Thank you for submitting your ${data.submissionType}. After careful review, we're unable to approve it at this time.</p>
        
        <h2>Submission Details</h2>
        <div class="details">
          <p><strong>Citation Number:</strong> ${data.citationNumber}</p>
          <p><strong>Request Type:</strong> ${data.submissionType}</p>
          <p><strong>Status:</strong> Not Approved</p>
          <p><strong>Reason:</strong> ${data.rejectionReason}</p>
        </div>
        
        <h2>What You Can Do</h2>
        <p>${data.adminNotes}</p>
        
        <p>You have other options available:</p>
        <ul>
          <li>Appeal the citation</li>
          <li>Request a payment plan</li>
          <li>Pay the fine in full</li>
          <li>Reach out to us for guidance</li>
        </ul>
        
        <a href="${data.citationUrl}" style="${buttonStyle}">Explore Your Options</a>
        
        <p>We're here to help. <a href="${data.contactUrl}">Contact us</a> if you have questions about this decision.</p>
        
        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Payment confirmation
export function paymentConfirmationEmail(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #28a745; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .alert-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 16px; margin: 16px 0; }
          .receipt { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; font-family: monospace; }
          .receipt p { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>✅ Payment Received – Citation ${data.citationNumber}</h1>
        
        <p>Hi ${data.fullName},</p>
        
        <div class="alert-box">
          <p><strong>Thank you! We've received your payment and your citation has been marked as paid.</strong></p>
        </div>
        
        <h2>Payment Details</h2>
        <div class="receipt">
          <p><strong>Citation Number:</strong> ${data.citationNumber}</p>
          <p><strong>Amount Paid:</strong> $${data.amountPaid}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p><strong>Date:</strong> ${data.paymentDate}</p>
        </div>
        
        <h2>What's Next?</h2>
        <p>Your citation is now settled. You don't need to take any further action. A receipt has been attached to this email for your records.</p>
        
        <a href="${data.dashboardUrl}" style="${successButtonStyle}">View Receipt</a>
        
        <p>Thank you for using AppealMyTicket<span style="color:#ff2400">S</span>.com!</p>
        
        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Admin notification - new submission
export function adminNewSubmissionEmail(data: EmailTemplateData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #ff6b6b; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .alert-box { background-color: #fff3cd; border-left: 4px solid #ff6b6b; padding: 16px; margin: 16px 0; }
          .details { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; }
          .details p { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>🔔 New Submission for Review</h1>
        
        <div class="alert-box">
          <p><strong>A new ${data.submissionType} submission requires your review.</strong></p>
        </div>
        
        <h2>Submission Details</h2>
        <div class="details">
          <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Citation Number:</strong> ${data.citationNumber}</p>
          <p><strong>Violation:</strong> ${data.violationType}</p>
          <p><strong>Request Type:</strong> ${data.submissionType}</p>
          <p><strong>Submitted:</strong> ${data.submissionDate}</p>
          <p><strong>Reason:</strong> ${data.submissionReason}</p>
        </div>
        
        ${data.documentCount ? `<h2>Attachments</h2><p>Documents attached: ${data.documentCount} file(s)</p>` : ''}
        
        <a href="${data.adminReviewUrl}" style="${dangerButtonStyle}">Review Submission</a>
        
        <p><strong>Action required within 48 hours.</strong></p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Citation verification needed - sent when citation format is unclear
export function citationVerificationEmail(data: EmailTemplateData): string {
  const name = data.firstName || 'Valued Customer'
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { ${baseStyles} }
          h1 { color: #ff2400; margin-top: 24px; }
          h2 { color: #333; margin-top: 20px; font-size: 18px; }
          .alert-box { background-color: #fff3cd; border-left: 4px solid #ff2400; padding: 16px; margin: 16px 0; }
          .details { background-color: #f8f9fa; padding: 16px; border-radius: 5px; margin: 16px 0; }
          .details p { margin: 8px 0; }
          a { color: #ff2400; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>We Need You to Verify Your Citation Number</h1>

        <p>Hi ${name},</p>

        <div class="alert-box">
          <p><strong>We received your citation submission, but the citation number "${data.citationNumber}" doesn't match the expected format for ${data.county} County.</strong></p>
        </div>

        <p>To proceed with your appeal strategy document, we need to confirm your citation number is correct.</p>

        <h2>What To Do</h2>
        <ol>
          <li>Check the citation number on your ticket</li>
          <li>Look for a format like: <strong>${data.expectedFormat || 'TX-XX-YYYY-NNNNN'}</strong></li>
          <li>Log in to your dashboard and update it, or reply to this email with the correct number</li>
        </ol>

        <a href="${data.dashboardUrl}" style="${buttonStyle}">Update Citation in Dashboard</a>

        <p>If you entered it correctly, you don't need to do anything — we'll double-check it on our end.</p>

        <h2>Still Need Help?</h2>
        <p>Reply to this email or <a href="mailto:info@lagnafnetwork.com">contact us</a> with any questions.</p>

        <div class="footer">
          <p>Best regards,<br/>The AppealMyTicket<span style="color:#ff2400">S</span>.com Team</p>
          <p>© ${new Date().getFullYear()} AppealMyTicket<span style="color:#ff2400">S</span>.com. All rights reserved.</p>
        </div>
      </body>
    </html>
  `
}

// Email template registry
const templates: Record<string, { subject: string; generate: (data: EmailTemplateData) => string }> = {
  welcome: {
    subject: 'Welcome to AppealMyTickets.com',
    generate: welcomeEmail,
  },
  verification: {
    subject: 'Verify Your Email Address',
    generate: welcomeEmail, // Use welcome template as fallback
  },
  password_reset: {
    subject: 'Reset Your Password',
    generate: welcomeEmail, // Use welcome template as fallback
  },
  deadline_alert: {
    subject: 'Citation Deadline Alert',
    generate: deadlineAlertEmail,
  },
  submission_received: {
    subject: 'Submission Received',
    generate: submissionReceivedEmail,
  },
  submission_approved: {
    subject: 'Submission Approved',
    generate: submissionApprovedEmail,
  },
  payment_received: {
    subject: 'Payment Received',
    generate: paymentConfirmationEmail,
  },
  citation_verification: {
    subject: 'Please Verify Your Citation Number',
    generate: citationVerificationEmail,
  },
  appeal_decision: {
    subject: 'Appeal Decision',
    generate: submissionApprovedEmail, // Use approved template as fallback
  },
}

export function getEmailTemplate(type: string): { subject: string; generate: (data: EmailTemplateData) => string } | null {
  return templates[type] || null
}
