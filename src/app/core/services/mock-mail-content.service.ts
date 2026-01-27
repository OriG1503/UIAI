import { Injectable } from '@angular/core';

export type MailContent = {
  filename: string;
  body: string;
};

@Injectable({
  providedIn: 'root',
})
export class MockMailContentService {
  private _mailContents: Map<string, string> = new Map([
    ['mail-001', `
      <p>שלום לכולם,</p>
      <p>אני רוצה להזכיר לכם על פגישת סקירת התקציב לרבעון 4 שתתקיים ביום חמישי הקרוב.</p>
      <p>נא להכין את הנתונים הרלוונטיים מראש.</p>
      <br>
      <p>בברכה,<br>דוד כהן</p>
    `],
    ['mail-002', `
      <p>היי מותק,</p>
      <p>מה התוכניות לסוף השבוע? חשבתי שאולי נוכל להיפגש לארוחת צהריים ביום שישי.</p>
      <p>תודיע/י לי מה נוח לך.</p>
      <br>
      <p>אוהבת,<br>אמא</p>
    `],
    ['mail-003', `
      <p>Hi Team,</p>
      <p>Please find attached the status report for Project Alpha. Key highlights:</p>
      <ul>
        <li>Development phase completed on schedule</li>
        <li>QA testing begins next week</li>
        <li>Expected launch date: February 15th</li>
      </ul>
      <p>Let me know if you have any questions.</p>
      <br>
      <p>Best regards,<br>Rachel Green</p>
    `],
    ['mail-004', `
      <h2>Tech Weekly Newsletter</h2>
      <p>This week's top stories:</p>
      <ol>
        <li><strong>AI Breakthroughs:</strong> New language models show unprecedented capabilities</li>
        <li><strong>Quantum Computing:</strong> IBM announces new quantum processor</li>
        <li><strong>Cybersecurity:</strong> New threats and how to protect yourself</li>
      </ol>
      <p>Read more on our website...</p>
    `],
    ['mail-005', `
      <p>Hi Ori,</p>
      <p>We've completed the interview process for the Senior Developer position. Please review the attached documents:</p>
      <ul>
        <li>Candidate evaluation form</li>
        <li>Scoring matrix with detailed feedback</li>
        <li>Updated resume</li>
      </ul>
      <p>We'd like to schedule a debrief meeting this week to discuss our recommendations.</p>
      <br>
      <p>HR Team</p>
    `],
    ['mail-006', `
      <p>Your order has shipped!</p>
      <p><strong>Order #123-456-789</strong></p>
      <p>Estimated delivery: January 16-18, 2024</p>
      <p>Track your package using the link below.</p>
      <br>
      <p>Thank you for shopping with Amazon!</p>
    `],
    ['mail-007', `
      <p>Hi Ori,</p>
      <p>I've submitted a pull request for the user authentication feature. Could you please review it when you have a chance?</p>
      <p><strong>PR:</strong> Feature/user-auth<br>
      <strong>Changes:</strong> 15 files modified, 450 additions, 120 deletions</p>
      <p>The diff file is attached for offline review.</p>
      <br>
      <p>Thanks,<br>John</p>
    `],
    ['mail-008', `
      <p>היי לכולם!</p>
      <p>אנחנו שמחים להזמין אתכם לארוחת צהריים משותפת מחר (יום שלישי) בשעה 12:30.</p>
      <p><strong>מקום:</strong> חדר האוכל בקומה 3</p>
      <p>נא לאשר הגעה עד סוף היום.</p>
      <br>
      <p>תודה,<br>מנהלת המשרד</p>
    `],
    ['mail-009', `
      <h2>Production Incident Report</h2>
      <p><strong>Date:</strong> January 16, 2024<br>
      <strong>Severity:</strong> P2<br>
      <strong>Duration:</strong> 45 minutes</p>
      <h3>Summary</h3>
      <p>Database connection pool exhaustion caused service degradation between 07:00-07:45 UTC.</p>
      <h3>Resolution</h3>
      <p>Increased connection pool size and implemented connection timeout fixes.</p>
    `],
    ['mail-010', `
      <p>Dear Member,</p>
      <p>Your gym membership is up for renewal. Current plan expires on February 1, 2024.</p>
      <p>Renew now and get 15% off your annual membership!</p>
      <p>See attached invoice for details.</p>
      <br>
      <p>Fitness Club Team</p>
    `],
  ]);

  getMailContent(filename: string): string {
    return this._mailContents.get(filename) ?? '<p>No content available for this email.</p>';
  }
}
