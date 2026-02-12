import { MailUserInfo } from '../../../shared/types/mail-user-info.type';

export type WorkerMail = {
  from: { mail?: string; username?: string };
  to: MailUserInfo[];
  cc?: MailUserInfo[];
  bcc?: MailUserInfo[];
};
