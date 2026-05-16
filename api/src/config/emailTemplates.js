export const getWelcomeEmailTemplate = (firstName) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  return {
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
            color: #1A1A2E;
            margin: 0;
            padding: 0;
            background-color: #F8F9FB;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-content {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #0D7DFF;
          }
          .header h1 {
            color: #0D7DFF;
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            color: #717182;
            margin: 0;
            font-size: 14px;
          }
          .greeting {
            font-size: 16px;
            color: #1A1A2E;
            margin-bottom: 20px;
          }
          .content {
            color: #1A1A2E;
            font-size: 15px;
            line-height: 1.7;
          }
          .content p {
            margin: 0 0 16px 0;
          }
          .benefits-list {
            background-color: #F8F9FB;
            border-left: 4px solid #0D7DFF;
            padding: 20px 20px 20px 30px;
            margin: 24px 0;
            border-radius: 8px;
          }
          .benefits-list ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .benefits-list li {
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
          }
          .benefits-list li:before {
            content: "●";
            color: #0D7DFF;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          .cta-section {
            margin: 32px 0;
            padding: 24px;
            background-color: #F8F9FB;
            border-radius: 8px;
            text-align: center;
          }
          .cta-section h3 {
            color: #1A1A2E;
            margin: 0 0 20px 0;
            font-size: 18px;
            font-weight: 600;
          }
          .cta-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #0D7DFF;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            transition: background-color 0.2s;
          }
          .cta-button:hover {
            background-color: #0B6DE0;
          }
          .cta-button-secondary {
            background-color: #F1F3F5;
            color: #1A1A2E !important;
          }
          .cta-button-secondary:hover {
            background-color: #E9ECEF;
          }
          .signature {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #E9ECEF;
          }
          .signature p {
            margin: 4px 0;
          }
          .signature .name {
            font-weight: 600;
            color: #1A1A2E;
          }
          .signature .title {
            color: #717182;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            color: #717182;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #E9ECEF;
          }
          .footer a {
            color: #0D7DFF;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          @media only screen and (max-width: 600px) {
            .email-content {
              padding: 24px;
            }
            .header h1 {
              font-size: 24px;
            }
            .cta-buttons {
              flex-direction: column;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-content">
            <div style="text-align: center; margin-bottom: 24px;">
              <img 
                src="https://res.cloudinary.com/dpfkhymbc/image/upload/v1769275224/FOP_logo_2_lhfh3p.svg" 
                alt="FO Perspectives Logo" 
                style="height: 60px; width: auto; margin: 0 auto;"
              />
            </div>
            <div class="header">
              <h1>Welcome to FO Perspectives!</h1>
              <p>Your journey to career success starts here</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi <strong>${firstName}</strong>,</p>
              
              <p>Welcome to FO Perspectives - we're excited to have you in the community.</p>
              
              <p>FO Perspectives is here to help you navigate the early stages of your career with more clarity, confidence and direction. Whether you're applying for internships, spring weeks, placements, graduate schemes, apprenticeships or simply trying to understand your options, we'll be sharing resources, events and opportunities to support you along the way.</p>
              
              <div class="benefits-list">
                <p style="margin: 0 0 12px 0; font-weight: 600; color: #1A1A2E;">As part of the community, you'll get access to:</p>
                <ul>
                  <li> Exclusive career events and insight sessions with employers and industry professionals</li>
                  <li> Practical application support, including CV, interview and assessment centre guidance</li>
                  <li> Apprenticeships, internship, graduate and early-career opportunities</li>
                  <li> Free resources to help you improve your applications and stand out</li>
                  <li> Advice from people who have successfully broken into competitive industries</li>
                </ul>
              </div>
              
              <div class="cta-section">
                <h3>Get Started</h3>
                <p style="margin: 0 0 16px 0; color: #717182;">Check out our latest events, resources and opportunities:</p>
                <div class="cta-buttons">
                  <a href="${frontendUrl}/events" class="cta-button">📅 Events Calendar</a>
                  <a href="${frontendUrl}/resources" class="cta-button-secondary cta-button">📚 Career Resources Hub</a>
                  <a href="${frontendUrl}/jobs" class="cta-button-secondary cta-button">💼 Job Opportunities</a>
                </div>
              </div>
              
              <p>You'll hear from us regularly with upcoming opportunities, career advice and insights to help you take the next step in your journey.</p>
              
              <p>We're really glad to have you with us.</p>
              
              <div class="signature">
                <p class="name">Best,<br>Agbolade</p>
                <p class="title">Founder, FO Perspectives</p>
              </div>
            </div>
            
            <div class="footer">
              <p><a href="${frontendUrl}">Visit FO Perspectives</a></p>
              <p>&copy; ${new Date().getFullYear()} FO Perspectives. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${firstName},

Welcome to FO Perspectives - we're excited to have you in the community.

FO Perspectives is here to help you navigate the early stages of your career with more clarity, confidence and direction. Whether you're applying for internships, spring weeks, placements, graduate schemes, apprenticeships or simply trying to understand your options, we'll be sharing resources, events and opportunities to support you along the way.

As part of the community, you'll get access to:
• Exclusive career events and insight sessions with employers and industry professionals
• Practical application support, including CV, interview and assessment centre guidance
• Apprenticeships, internship, graduate and early-career opportunities
• Free resources to help you improve your applications and stand out
• Advice from people who have successfully broken into competitive industries

To get started, we recommend checking out our latest events, resources and opportunities here:

Events Calendar: ${frontendUrl}/events
Career Resources Hub: ${frontendUrl}/resources
Jobs and Opportunities: ${frontendUrl}/jobs

You'll hear from us regularly with upcoming opportunities, career advice and insights to help you take the next step in your journey.

We're really glad to have you with us.

Best,
Agbolade
Founder, FO Perspectives

Website: ${frontendUrl}

---
© ${new Date().getFullYear()} FO Perspectives. All rights reserved.
    `
  };
};
