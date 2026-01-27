import { MailUserInfo } from './mail-user-info.type';

export type Mail = {
  tag: string;
  subject: string;
  filename: string;
  attachments: { filename: string[] };
  from: MailUserInfo;
  to: MailUserInfo[];
  cc?: MailUserInfo[];
  bcc?: MailUserInfo[];
  sent: Date;
  mailbox_name: string;
  body_paths?: string[];
  html_path?: string[];
  seen?: boolean;
};
