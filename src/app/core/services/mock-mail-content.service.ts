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
    [
      'mail-001',
      `
      <p>שלום לכולם,</p>

      <p>רציתי להזכיר כי פגישת סקירת התקציב לרבעון הרביעי תתקיים ביום חמישי הקרוב בשעה 10:00.</p>

      <p>בפגישה נסקור את:</p>
      <ul>
        <li>הוצאות בפועל מול תחזית</li>
        <li>חריגות תקציביות והסברים</li>
        <li>המלצות להמשך השנה</li>
      </ul>

      <p>נא לוודא שכל הנתונים מעודכנים במערכת עד יום רביעי בערב.</p>

      <p>אם יש נושאים נוספים שתרצו להעלות – אנא שלחו לי מראש.</p>

      <br>
      <p>בברכה,<br>דוד כהן</p>
      `,
    ],
    [
      'mail-002',
      `
      <p>היי מותק,</p>

      <p>רק רציתי לבדוק מה קורה איתך ומה התוכניות לסוף השבוע 😊</p>

      <p>חשבתי שאולי נוכל:</p>
      <ul>
        <li>להיפגש לארוחת צהריים ביום שישי</li>
        <li>לעשות סיבוב קטן בעיר</li>
        <li>או פשוט לשבת לקפה רגוע</li>
      </ul>

      <p>תודיע/י לי מה נוח לך ומה הלו"ז שלך נראה.</p>

      <br>
      <p>אוהבת,<br>אמא</p>
      `,
    ],
    [
      'mail-003',
      `
      <p>Hi Team,</p>

      <p>Please find attached the detailed status report for <strong>Project Alpha</strong>.</p>

      <h4>Key Highlights</h4>
      <ul>
        <li>Development phase completed on schedule</li>
        <li>All core features merged to main branch</li>
        <li>QA testing begins next week</li>
      </ul>

      <h4>Risks & Notes</h4>
      <p>We identified minor performance issues under heavy load, which are being addressed.</p>

      <p>Expected launch date remains <strong>February 15th</strong>.</p>

      <p>Please review and let me know if there are any blockers or concerns.</p>

      <br>
      <p>Best regards,<br>Rachel Green</p>
      `,
    ],
    [
      'mail-004',
      `
      <h2>Tech Weekly Newsletter</h2>

      <p>Welcome to this week's edition! Here are the top stories you shouldn’t miss:</p>

      <ol>
        <li><strong>AI Breakthroughs:</strong> New language models show unprecedented reasoning capabilities.</li>
        <li><strong>Quantum Computing:</strong> IBM announces a new 1000-qubit quantum processor.</li>
        <li><strong>Cybersecurity:</strong> Major supply-chain vulnerabilities discovered.</li>
      </ol>

      <p>Plus:</p>
      <ul>
        <li>Top GitHub repositories this week</li>
        <li>Upcoming tech conferences</li>
        <li>Career tips for developers</li>
      </ul>

      <p><a href="#">Read the full articles on our website</a></p>
      `,
    ],
    [
      'mail-005',
      `
      <p>Hi Ori,</p>

      <p>We have completed the interview process for the <strong>Senior Developer</strong> position.</p>

      <p>Attached you will find:</p>
      <ul>
        <li>Candidate evaluation form</li>
        <li>Scoring matrix with technical and soft-skill feedback</li>
        <li>Updated resume and portfolio</li>
      </ul>

      <p>Overall, the feedback is positive, with some discussion points around system design depth.</p>

      <p>We would like to schedule a debrief meeting later this week to align on next steps.</p>

      <br>
      <p>Best,<br>HR Team</p>
      `,
    ],
    [
      'mail-006',
      `
      <p>Your order has shipped!</p>

      <p><strong>Order #123-456-789</strong></p>

      <p>Estimated delivery window:</p>
      <ul>
        <li>January 16 – January 18, 2024</li>
      </ul>

      <p>You can track your shipment using the tracking link below.</p>

      <p>If you have any issues with your order, feel free to contact our support team.</p>

      <br>
      <p>Thank you for shopping with Amazon!</p>
      `,
    ],
    [
      'mail-007',
      `
      <p>Hi Ori,</p>

      <p>I’ve opened a pull request for the <strong>user authentication feature</strong>.</p>

      <p><strong>Summary:</strong></p>
      <ul>
        <li>JWT-based auth flow</li>
        <li>Refresh token rotation</li>
        <li>Guards + interceptors added</li>
      </ul>

      <p>
        <strong>Stats:</strong><br>
        15 files changed<br>
        450 additions<br>
        120 deletions
      </p>

      <p>The diff is attached for offline review.</p>

      <br>
      <p>Thanks,<br>John</p>
      `,
    ],
    [
      'mail-008',
      `
      <p>היי לכולם!</p>

      <p>אנחנו שמחים להזמין אתכם לארוחת צהריים צוותית מחר (יום שלישי).</p>

      <p><strong>פרטים:</strong></p>
      <ul>
        <li>שעה: 12:30</li>
        <li>מקום: חדר האוכל בקומה 3</li>
      </ul>

      <p>נא לאשר הגעה עד סוף היום כדי שנוכל להיערך בהתאם.</p>

      <br>
      <p>תודה,<br>מנהלת המשרד</p>
      `,
    ],
    [
      'mail-009',
      `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Alignment, Expectations, and Collaboration</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="720" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:44px;">
            <tr>
              <td>
                <h1 style="margin:0 0 24px; font-size:26px; color:#1f2937;">
                  Alignment, Expectations, and Ongoing Collaboration
                </h1>

                <p style="font-size:15px; line-height:1.8; color:#374151;">
                  Hello,
                </p>

                <p style="font-size:15px; line-height:1.8; color:#374151;">
                  I wanted to follow up with a more detailed message to ensure alignment and clearly set expectations
                  moving forward. Incident While some of the points below may already be familiar, consolidating them into one
                  structured communication will help avoid ambiguity and misalignment.
                </p>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Shared Understanding
                </h2>

                <p style="font-size:15px; line-height:1.8; color:#374151;">
                  Progress so far has been meaningful, and the effort invested by everyone involved is appreciated.
                  At the same time, this process has highlighted areas where clearer structure and consistency would
                  significantly improve outcomes.
                </p>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Expectations & Ownership
                </h2>

                <p style="font-size:15px; line-height:1.8; color:#374151;">
                  Expectations must be explicit Incident rather than implied. This includes timelines, deliverables, quality
                  standards, and communication cadence. Clear ownership removes uncertainty and accelerates execution.
                </p>

                <ul style="margin-left:20px; font-size:15px; line-height:1.8; color:#374151;">
                  <li>Defined responsibilities</li>
                  <li>Clear deliverable criteria</li>
                  <li>Transparent timelines</li>
                </ul>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Transparency & Feedback
                </h2>

                <p style="font-size:15px; line-height:1.8; color:#374151;">
                  Transparency is essential. Challenges and risks should be shared early to enable proactive solutions.
                  Feedback should be timely, specific, and constructive, fostering continuous improvement rather than
                  reactive fixes.
                </p>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Operational Focus
                </h2>

                <p style="font-size:15px; line-height:1.8; color:#374151;">
                  The coming period will prioritize refinement, documentation, and process stability. These steps are
                  not about bureaucracy, but about reducing friction and enabling sustainable collaboration.
                </p>

                <p style="margin-top:32px; font-size:15px; line-height:1.8; color:#374151;">
                  Alignment is not a one-time hila event, but an ongoing process.Incident  Open dialogue is encouraged, and every
                  perspective adds value.
                </p>

                <p style="margin-top:32px; font-size:15px; color:#111827;">
                  Kind regards,<br />
                  <strong>Ori</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

      `,
    ],
    [
      'mail-010',
      `
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Comprehensive Update and Next Steps</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="720" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
            <tr>
              <td>
                <h1 style="margin:0 0 24px; font-size:26px; color:#1f2937;">
                  Comprehensive Update and Next Steps
                </h1>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  Hello,
                </p>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  I hope this message finds you well. I’m writing to provide a detailed update, clarify the current status,
                  and outline the next steps moving forward. This message is intentionally thorough so that all relevant
                  information is consolidated into a single reference point.
                </p>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  Over the past period, substantial progress has been made across multiple areas. Some of this progress
                  has been visible, while other aspects have taken place behind the scenes. At this stage, alignment is
                  critical to ensure that expectations, responsibilities, and objectives remain clear for everyone involved.
                </p>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Current Status
                </h2>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  At a high level, the foundation is solid and functioning as expected. The core goals remain unchanged,
                  and no fundamental redesign is required. However, refinements have emerged as necessary based on
                  real-world usage, feedback, and technical considerations discovered during execution.
                </p>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  One key takeaway so far is the importance of clearly defined ownership. When accountability is explicit,
                  execution becomes smoother and decision-making is faster. Moving forward, this will be reinforced
                  across all areas.
                </p>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Communication & Process
                </h2>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  While communication has been consistent overall, there have been moments where context was fragmented.
                  This is natural in dynamic environments, but it is also something we can actively improve.
                </p>

                <ul style="margin:0 0 16px 20px; padding:0; color:#374151; font-size:15px; line-height:1.7;">
                  <li>More structured updates</li>
                  <li>Clear documentation for decisions</li>
                  <li>Defined points of contact per area</li>
                </ul>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  These changes are not intended to add overhead, but rather to reduce friction and ensure long-term
                  stability.
                </p>

                <h2 style="margin:32px 0 12px; font-size:20px; color:#111827;">
                  Looking Ahead
                </h2>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#374151;">
                  The next phase will focus on refinement, validation, and controlled expansion. Feedback will play a
                  central role, and constructive input is strongly encouraged.
                </p>

                <p style="margin:32px 0 0; font-size:15px; line-height:1.7; color:#374151;">
                  Thank you for your time and continued collaboration. If you have questions or suggestions, please
                  don’t hesitate to reach out.
                </p>

                <p style="margin:32px 0 0; font-size:15px; color:#111827;">
                  Best regards,<br />
                  <strong>Ori</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    ],
  ]);

  public getMailContent(filename: string): string {
    return this._mailContents.get(filename) ?? '<p>No content available for this email.</p>';
  }
}
