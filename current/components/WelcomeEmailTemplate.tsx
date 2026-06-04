// This component represents the email template structure that would be sent to new team members
// In a real application, this would be rendered on the backend and sent via email service

export interface WelcomeEmailData {
  memberName: string;
  institutionName: string;
  inviterName: string;
  resetPasswordLink: string;
  loginUrl: string;
  supportEmail: string;
}

export function generateWelcomeEmailContent(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${data.institutionName} on theGarage</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
    .content { padding: 40px 30px; }
    .welcome-message { font-size: 18px; color: #1f2937; margin-bottom: 30px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .info-box { background-color: #f3f4f6; border-left: 4px solid #ff6b35; padding: 20px; margin: 30px 0; border-radius: 4px; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
    .footer a { color: #ff6b35; text-decoration: none; }
    .logo { font-size: 24px; font-weight: 600; margin-bottom: 5px; }
    .logo .the { color: #ffffff; }
    .logo .garage { color: #ffffff; }
    .divider { height: 1px; background-color: #e5e7eb; margin: 30px 0; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <span class="the">the</span><span class="garage">Garage</span>
      </div>
      <h1>Welcome to Your Team!</h1>
      <p>You've been invited to join ${data.institutionName}</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="welcome-message">
        Hi ${data.memberName},
      </div>
      
      <p>Great news! ${data.inviterName} has invited you to join <strong>${data.institutionName}</strong> on theGarage - the professional recruiting platform that's revolutionizing how teams find and hire top talent.</p>
      
      <p>As a member of ${data.institutionName}, you'll have access to:</p>
      <ul>
        <li><strong>Advanced Candidate Sourcing</strong> - Access to our AI-powered candidate queues</li>
        <li><strong>Streamlined Hiring Process</strong> - Manage jobs, candidates, and interviews in one place</li>
        <li><strong>Team Collaboration</strong> - Work seamlessly with your recruiting team</li>
        <li><strong>Analytics & Insights</strong> - Data-driven hiring decisions and performance tracking</li>
      </ul>

      <div class="info-box">
        <strong>🔒 Security First:</strong> For your security, you'll need to set up your password before accessing your account. Click the button below to get started.
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${data.resetPasswordLink}" class="cta-button">Set Up Your Password</a>
      </div>

      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Click the "Set Up Your Password" button above</li>
        <li>Create a secure password for your account</li>
        <li>Log in to theGarage and explore your new workspace</li>
        <li>Complete your profile to get the most out of the platform</li>
      </ol>

      <div class="divider"></div>

      <p><strong>Need help getting started?</strong></p>
      <p>Our support team is here to help! Contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a> or check out our comprehensive help center.</p>

      <p>Welcome to the future of recruiting!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The theGarage Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div style="margin-bottom: 20px;">
        <div class="logo">
          <span class="the" style="color: #374151;">the</span><span class="garage" style="color: #ff6b35;">Garage</span>
        </div>
      </div>
      
      <p>This email was sent to you because ${data.inviterName} invited you to join ${data.institutionName} on theGarage.</p>
      
      <p style="margin-top: 20px;">
        <a href="${data.loginUrl}">Login to theGarage</a> |
        <a href="mailto:${data.supportEmail}">Support</a> |
        <a href="#">Privacy Policy</a>
      </p>
      
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        © 2024 theGarage. All rights reserved.<br>
        Professional recruiting platform for modern teams.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Helper function to simulate sending email (in real app this would call email service)
export async function sendWelcomeEmail(emailData: WelcomeEmailData): Promise<boolean> {
  try {
    // Simulate API call to email service
    console.log('Sending welcome email to:', emailData.memberName);
    console.log('Email content generated:', generateWelcomeEmailContent(emailData));
    
    // In a real application, this would be something like:
    // await emailService.send({
    //   to: emailData.memberEmail,
    //   subject: `Welcome to ${emailData.institutionName} on theGarage`,
    //   html: generateWelcomeEmailContent(emailData)
    // });
    
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

// Email template previewer for testing
export function WelcomeEmailPreview({ emailData }: { emailData: WelcomeEmailData }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Email Preview</h3>
      <div 
        className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto"
        dangerouslySetInnerHTML={{ 
          __html: generateWelcomeEmailContent(emailData) 
        }}
      />
    </div>
  );
}