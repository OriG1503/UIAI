import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Mail } from '../../shared/types/mail.type';
import { MailUserInfo } from '../../shared/types/mail-user-info.type';

@Injectable({
  providedIn: 'root',
})
export class MockGraphMailService {
  private _mails: WritableSignal<Mail[]> = signal<Mail[]>(this._generateMockMails());

  readonly mails: Signal<Mail[]> = this._mails.asReadonly();

  public markAsSeen(mailFilename: string): void {
    this._mails.update((mails: Mail[]) =>
      mails.map((mail: Mail) => (mail.filename === mailFilename ? { ...mail, seen: true } : mail)),
    );
  }

  public markAsUnseen(mailFilename: string): void {
    this._mails.update((mails: Mail[]) =>
      mails.map((mail: Mail) => (mail.filename === mailFilename ? { ...mail, seen: false } : mail)),
    );
  }

  private _generateMockMails(): Mail[] {
    const hubs: MailUserInfo[] = [
      { username: 'Ori Levi', mail: 'ori@company.com' },
      { username: 'David Cohen', mail: 'david.cohen@company.com' },
      { username: 'Sarah Mizrachi', mail: 'sarah.m@company.com' },
      { username: 'Yael Goldberg', mail: 'yael.g@company.com' },
      { username: 'Noam Peretz', mail: 'noam.p@company.com' },
    ];

    const midTier: MailUserInfo[] = [
      { username: 'Rachel Green', mail: 'rachel.g@company.com' },
      { username: 'Mike Ross', mail: 'mike.ross@company.com' },
      { username: 'Tamar Shapiro', mail: 'tamar.s@company.com' },
      { username: 'Avi Katz', mail: 'avi.k@company.com' },
      { username: 'Dana Friedman', mail: 'dana.f@company.com' },
      { username: 'Eyal Ben-Ari', mail: 'eyal.ba@company.com' },
      { username: 'Noa Avraham', mail: 'noa.a@company.com' },
      { username: 'Oren Levy', mail: 'oren.l@company.com' },
      { username: 'Shira Dahan', mail: 'shira.d@company.com' },
      { username: 'Itay Rosen', mail: 'itay.r@company.com' },
    ];

    const peripheral: MailUserInfo[] = [
      { username: 'Gal Zohar', mail: 'gal.z@company.com' },
      { username: 'Matan Haim', mail: 'matan.h@company.com' },
      { username: 'Lior Alon', mail: 'lior.a@company.com' },
      { username: 'Inbar Segal', mail: 'inbar.s@company.com' },
      { username: 'Rotem Yadin', mail: 'rotem.y@company.com' },
      { username: 'Amit Baruch', mail: 'amit.b@company.com' },
      { username: 'Hila Navon', mail: 'hila.n@company.com' },
      { username: 'Tomer Shaked', mail: 'tomer.sh@company.com' },
      { username: 'Maya Carmi', mail: 'maya.c@company.com' },
      { username: 'Yuval Stern', mail: 'yuval.st@company.com' },
      { username: 'Keren Ofer', mail: 'keren.o@company.com' },
      { username: 'Nadav Elkana', mail: 'nadav.e@company.com' },
      { username: 'Tal Golan', mail: 'tal.g@company.com' },
      { username: 'Lihi Tzur', mail: 'lihi.t@company.com' },
      { username: 'Shai Amir', mail: 'shai.am@company.com' },
      { username: 'Efrat Binyamin', mail: 'efrat.b@company.com' },
      { username: 'Omri Dor', mail: 'omri.d@company.com' },
      { username: 'Neta Paz', mail: 'neta.p@company.com' },
      { username: 'Arik Mor', mail: 'arik.m@company.com' },
      { username: 'Shani Lev', mail: 'shani.l@company.com' },
      { username: 'Guy Tal', mail: 'guy.t@company.com' },
      { username: 'Ronit Bar', mail: 'ronit.b@company.com' },
      { username: 'Dor Hasson', mail: 'dor.h@company.com' },
      { username: 'Michal Oz', mail: 'michal.oz@company.com' },
      { username: 'Elad Naim', mail: 'elad.n@company.com' },
    ];

    const tags: string[] = ['work', 'personal', 'newsletter', 'work', 'work', 'work'];
    const subjects: string[] = [
      'Q4 Budget Review',
      'Project Status Update',
      'Team Meeting Notes',
      'Code Review Request',
      'Design Feedback',
      'Sprint Planning',
      'Incident Report',
      'Feature Proposal',
      'Performance Review',
      'Architecture Discussion',
      'Release Notes',
      'Bug Report',
      'API Documentation',
      'Security Audit',
      'Deployment Plan',
      'Client Meeting Summary',
      'Research Findings',
      'Training Materials',
      'Policy Update',
      'Infrastructure Changes',
      'Data Migration Plan',
      'UX Research Results',
      'Vendor Proposal',
      'Compliance Report',
      'Monthly KPIs',
      'Technical Debt Review',
      'Onboarding Guide',
      'Product Roadmap',
      'Customer Feedback',
      'System Maintenance',
    ];

    const mails: Mail[] = [];
    const baseDate: Date = new Date('2024-03-15T12:00:00');

    const addMail = (
      from: MailUserInfo,
      to: MailUserInfo[],
      cc: MailUserInfo[] | undefined,
      bcc: MailUserInfo[] | undefined,
      index: number,
    ): void => {
      const mailDate: Date = new Date(baseDate.getTime() - index * 1800000);
      mails.push({
        tag: tags[index % tags.length],
        subject: `${subjects[index % subjects.length]} #${index + 1}`,
        filename: `graph-mail-${String(index + 1).padStart(4, '0')}`,
        attachments: { filename: index % 5 === 0 ? ['report.pdf'] : [] },
        from,
        to,
        cc,
        bcc,
        sent: mailDate,
        mailbox_name: 'inbox',
        seen: index % 2 === 0,
      });
    };

    let mailIndex: number = 0;

    // Hub-to-hub connections (high frequency: ~30 mails between hub pairs)
    hubs.forEach((hub: MailUserInfo, i: number) => {
      hubs.forEach((otherHub: MailUserInfo, j: number) => {
        if (i < j) {
          Array.from({ length: 30 }).forEach(() => {
            addMail(hub, [otherHub], undefined, undefined, mailIndex++);
          });
        }
      });
    });

    // Hub-to-midTier connections (moderate: ~10-15 mails each)
    hubs.forEach((hub: MailUserInfo) => {
      midTier.forEach((mid: MailUserInfo, midIdx: number) => {
        const count: number = 10 + (midIdx % 6);
        Array.from({ length: count }).forEach(() => {
          const ccRecipients: MailUserInfo[] | undefined =
            midIdx % 3 === 0 ? [hubs[(midIdx + 1) % hubs.length]] : undefined;
          addMail(hub, [mid], ccRecipients, undefined, mailIndex++);
        });
      });
    });

    // MidTier-to-midTier connections (moderate: ~5 mails between some pairs)
    midTier.forEach((mid: MailUserInfo, i: number) => {
      midTier.forEach((otherMid: MailUserInfo, j: number) => {
        if (i < j && (i + j) % 2 === 0) {
          Array.from({ length: 5 }).forEach(() => {
            addMail(mid, [otherMid], undefined, undefined, mailIndex++);
          });
        }
      });
    });

    // Hub/midTier-to-peripheral connections (sparse: 3-8 mails)
    peripheral.forEach((per: MailUserInfo, perIdx: number) => {
      const sender: MailUserInfo = perIdx % 2 === 0 ? hubs[perIdx % hubs.length] : midTier[perIdx % midTier.length];
      const count: number = 3 + (perIdx % 6);
      Array.from({ length: count }).forEach(() => {
        addMail(sender, [per], undefined, undefined, mailIndex++);
      });
      if (perIdx % 2 === 0) {
        Array.from({ length: 2 }).forEach(() => {
          addMail(per, [sender], undefined, undefined, mailIndex++);
        });
      }
    });

    // Multi-recipient mails for variety
    Array.from({ length: 30 }).forEach((_: unknown, i: number) => {
      const from: MailUserInfo = hubs[i % hubs.length];
      const toRecipients: MailUserInfo[] = [midTier[i % midTier.length], midTier[(i + 3) % midTier.length]];
      const ccRecipients: MailUserInfo[] = [peripheral[i % peripheral.length], midTier[(i + 5) % midTier.length]];
      addMail(from, toRecipients, ccRecipients, undefined, mailIndex++);
    });

    // Additional hub broadcast mails
    Array.from({ length: 20 }).forEach((_: unknown, i: number) => {
      const from: MailUserInfo = hubs[i % hubs.length];
      const toRecipients: MailUserInfo[] = [midTier[(i * 2) % midTier.length], midTier[(i * 2 + 1) % midTier.length]];
      const ccRecipients: MailUserInfo[] = [hubs[(i + 1) % hubs.length], hubs[(i + 2) % hubs.length]];
      addMail(from, toRecipients, ccRecipients, undefined, mailIndex++);
    });

    return mails;
  }
}
