import { Injectable, signal } from '@angular/core';
import { Mail } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class MockMailService {
  private _mails = signal<Mail[]>(this._generateMockMails());
  private _starredMailIds = signal<Set<string>>(new Set());

  readonly mails = this._mails.asReadonly();
  readonly starredMailIds = this._starredMailIds.asReadonly();

  readonly userEmail = 'ori@gmail.com';

  toggleStarred(mailFilename: string): void {
    this._starredMailIds.update((starred) => {
      const newStarred = new Set(starred);
      if (newStarred.has(mailFilename)) {
        newStarred.delete(mailFilename);
      } else {
        newStarred.add(mailFilename);
      }
      return newStarred;
    });
  }

  markAsRead(mailFilename: string): void {
    this._mails.update((mails) =>
      mails.map((mail) => (mail.filename === mailFilename ? { ...mail, seen: true } : mail))
    );
  }

  markAsUnread(mailFilename: string): void {
    this._mails.update((mails) =>
      mails.map((mail) => (mail.filename === mailFilename ? { ...mail, seen: false } : mail))
    );
  }

  isStarred(mailFilename: string): boolean {
    return this._starredMailIds().has(mailFilename);
  }

  private _generateMockMails(): Mail[] {
    // const mockMails: Mail[] = [
    //   {
    //     tag: 'work',
    //     subject: 'Q4 Budget Review Meeting',
    //     filename: 'mail-001',
    //     attachments: { filename: ['budget.xlsx', 'presentation.pptx'] },
    //     from: { username: 'David Cohen', mail: 'david.cohen@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     cc: [{ username: 'Sarah Levi', mail: 'sarah@company.com' }],
    //     sent: new Date('2024-01-15T09:30:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //   {
    //     tag: 'personal',
    //     subject: 'Weekend Plans',
    //     filename: 'mail-002',
    //     attachments: { filename: [] },
    //     from: { username: 'Mom', mail: 'mom@family.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-15T08:15:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'work',
    //     subject: 'Project Alpha - Status Update Required',
    //     filename: 'mail-003',
    //     attachments: { filename: ['status-report.pdf'] },
    //     from: { username: 'Rachel Green', mail: 'rachel.g@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     cc: [
    //       { username: 'Mike Ross', mail: 'mike@company.com' },
    //       { username: 'Harvey Specter', mail: 'harvey@company.com' },
    //     ],
    //     bcc: [{ username: 'CEO', mail: 'ceo@company.com' }],
    //     sent: new Date('2024-01-14T16:45:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //   {
    //     tag: 'newsletter',
    //     subject: 'Tech Weekly: AI Breakthroughs in 2024',
    //     filename: 'mail-004',
    //     attachments: { filename: [] },
    //     from: { username: 'Tech Weekly', mail: 'newsletter@techweekly.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-14T06:00:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'work',
    //     subject: 'Interview Feedback - Senior Developer Position',
    //     filename: 'mail-005',
    //     attachments: { filename: ['candidate-review.docx', 'scoring-matrix.xlsx', 'resume.pdf'] },
    //     from: { username: 'HR Team', mail: 'hr@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     cc: [{ username: 'Tech Lead', mail: 'techlead@company.com' }],
    //     sent: new Date('2024-01-13T14:20:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //   {
    //     tag: 'personal',
    //     subject: 'Your Amazon Order has Shipped',
    //     filename: 'mail-006',
    //     attachments: { filename: [] },
    //     from: { mail: 'shipping@amazon.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-13T11:30:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'work',
    //     subject: 'Code Review Request: Feature/user-auth',
    //     filename: 'mail-007',
    //     attachments: { filename: ['diff.patch'] },
    //     from: { username: 'John Developer', mail: 'john.dev@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-12T17:00:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'work',
    //     subject: 'Team Lunch Tomorrow - Please RSVP',
    //     filename: 'mail-008',
    //     attachments: { filename: [] },
    //     from: { username: 'Office Manager', mail: 'office@company.com' },
    //     to: [{ mail: 'all-staff@company.com' }],
    //     cc: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-12T10:00:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //         {
    //     tag: 'work',
    //     subject: 'Production Incident Report – Jan 16',
    //     filename: 'mail-009',
    //     attachments: { filename: ['incident-report.pdf'] },
    //     from: { username: 'SRE Team', mail: 'sre@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-16T07:40:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //   {
    //     tag: 'personal',
    //     subject: 'Gym Membership Renewal',
    //     filename: 'mail-010',
    //     attachments: { filename: ['invoice.pdf'] },
    //     from: { username: 'Fitness Club', mail: 'billing@gym.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-16T06:10:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'newsletter',
    //     subject: 'Angular Weekly #412',
    //     filename: 'mail-011',
    //     attachments: { filename: [] },
    //     from: { username: 'Angular Weekly', mail: 'newsletter@angularweekly.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-15T22:00:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //   {
    //     tag: 'work',
    //     subject: 'Reminder: Submit Timesheet',
    //     filename: 'mail-012',
    //     attachments: { filename: [] },
    //     from: { username: 'Finance Bot', mail: 'finance@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-15T18:30:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'personal',
    //     subject: 'Flight Confirmation – Milan → Tel Aviv',
    //     filename: 'mail-013',
    //     attachments: { filename: ['ticket.pdf'] },
    //     from: { username: 'ITA Airways', mail: 'no-reply@ita-airways.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-15T13:05:00'),
    //     mailbox_name: 'inbox',
    //     seen: false,
    //   },
    //   {
    //     tag: 'work',
    //     subject: 'Design Review Notes – Dashboard Revamp',
    //     filename: 'mail-014',
    //     attachments: { filename: ['design-notes.fig', 'summary.md'] },
    //     from: { username: 'UX Team', mail: 'ux@company.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     cc: [{ username: 'Product Manager', mail: 'pm@company.com' }],
    //     sent: new Date('2024-01-14T19:10:00'),
    //     mailbox_name: 'inbox',
    //     seen: true,
    //   },
    //   {
    //     tag: 'spam',
    //     subject: '🔥 Limited Offer: Make $10,000 Working From Home',
    //     filename: 'mail-015',
    //     attachments: { filename: [] },
    //     from: { mail: 'promo@scammy-deals.com' },
    //     to: [{ mail: 'ori@gmail.com' }],
    //     sent: new Date('2024-01-14T03:25:00'),
    //     mailbox_name: 'spam',
    //     seen: false,
    //   },
    // ];
const mockMails: Mail[] = [
  {
    tag: 'work',
    subject: 'Q4 Budget Review Meeting',
    filename: 'mail-001',
    attachments: {
      filename: [
        'budget.xlsx',
        'presentation-final-v3-approved-by-finance-committee-jan-2024.pptx',
      ],
    },
    from: { username: 'David Cohen', mail: 'david.cohen@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    cc: [{ username: 'Sarah Levi', mail: 'sarah@company.com' }],
    sent: new Date('2024-01-15T09:30:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'personal',
    subject: 'Weekend Plans',
    filename: 'mail-002',
    attachments: { filename: [] },
    from: { username: 'Mom', mail: 'mom@family.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-15T08:15:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'work',
    subject: 'Project Alpha - Status Update Required',
    filename: 'mail-003',
    attachments: {
      filename: ['status-report.pdf', 'alpha-env-config.json', 'notes.txt'],
    },
    from: { username: 'Rachel Green', mail: 'rachel.g@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    cc: [
      { username: 'Mike Ross', mail: 'mike@company.com' },
      { username: 'Harvey Specter', mail: 'harvey@company.com' },
    ],
    bcc: [{ username: 'CEO', mail: 'ceo@company.com' }],
    sent: new Date('2024-01-14T16:45:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'newsletter',
    subject: 'Tech Weekly: AI Breakthroughs in 2024',
    filename: 'mail-004',
    attachments: { filename: [] },
    from: { username: 'Tech Weekly', mail: 'newsletter@techweekly.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-14T06:00:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'work',
    subject: 'Interview Feedback - Senior Developer Position',
    filename: 'mail-005',
    attachments: {
      filename: [
        'cv.docx',
        'candidate-review-technical-and-soft-skills-evaluation-extended-version.docx',
        'scoring.xlsx',
        'resume.pdf',
      ],
    },
    from: { username: 'HR Team', mail: 'hr@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    cc: [{ username: 'Tech Lead', mail: 'techlead@company.com' }],
    sent: new Date('2024-01-13T14:20:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'personal',
    subject: 'Your Amazon Order has Shipped',
    filename: 'mail-006',
    attachments: { filename: [] },
    from: { mail: 'shipping@amazon.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-13T11:30:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'work',
    subject: 'Code Review Request: Feature/user-auth',
    filename: 'mail-007',
    attachments: {
      filename: ['diff.patch', 'user-auth-refactor.tar.gz', 'debug.log'],
    },
    from: { username: 'John Developer', mail: 'john.dev@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-12T17:00:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'work',
    subject: 'Team Lunch Tomorrow - Please RSVP',
    filename: 'mail-008',
    attachments: { filename: [] },
    from: { username: 'Office Manager', mail: 'office@company.com' },
    to: [{ mail: 'all-staff@company.com' }],
    cc: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-12T10:00:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'work',
    subject: 'Production Incident Report – Jan 16',
    filename: 'mail-009',
    attachments: {
      filename: [
        'incident-report.pdf',
        'cpu-usage-spike-graph-2024-01-16.png',
        'wmi-provider-host-dump.log',
      ],
    },
    from: { username: 'SRE Team', mail: 'sre@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-16T07:40:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'personal',
    subject: 'Gym Membership Renewal',
    filename: 'mail-010',
    attachments: { filename: ['invoice.pdf', '01.pdf'] },
    from: { username: 'Fitness Club', mail: 'billing@gym.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-16T06:10:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'newsletter',
    subject: 'Angular Weekly #412',
    filename: 'mail-011',
    attachments: { filename: [] },
    from: { username: 'Angular Weekly', mail: 'newsletter@angularweekly.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-15T22:00:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'work',
    subject: 'Reminder: Submit Timesheet',
    filename: 'mail-012',
    attachments: { filename: [] },
    from: { username: 'Finance Bot', mail: 'finance@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-15T18:30:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'personal',
    subject: 'Flight Confirmation – Milan → Tel Aviv',
    filename: 'mail-013',
    attachments: {
      filename: [
        'ticket.pdf',
        'boarding-pass-tel-aviv-milan-seat-14a-qr-code.png',
      ],
    },
    from: { username: 'ITA Airways', mail: 'no-reply@ita-airways.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-15T13:05:00'),
    mailbox_name: 'inbox',
    seen: false,
  },
  {
    tag: 'work',
    subject: 'Design Review Notes – Dashboard Revamp',
    filename: 'mail-014',
    attachments: {
      filename: [
        'design-notes.fig',
        'dashboard-layout-v2-dark-mode-mobile-desktop-responsive.fig',
        'summary.md',
        'icons.svg',
      ],
    },
    from: { username: 'UX Team', mail: 'ux@company.com' },
    to: [{ mail: 'ori@gmail.com' }],
    cc: [{ username: 'Product Manager', mail: 'pm@company.com' }],
    sent: new Date('2024-01-14T19:10:00'),
    mailbox_name: 'inbox',
    seen: true,
  },
  {
    tag: 'spam',
    subject: '🔥 Limited Offer: Make $10,000 Working From Home',
    filename: 'mail-015',
    attachments: { filename: [] },
    from: { mail: 'promo@scammy-deals.com' },
    to: [{ mail: 'ori@gmail.com' }],
    sent: new Date('2024-01-14T03:25:00'),
    mailbox_name: 'spam',
    seen: false,
  },
];

    return mockMails;
  }
}
