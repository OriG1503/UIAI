import { MailFilter } from '../types';

export const MAIL_FILTER_LABELS: Record<MailFilter, string> = {
  all: 'הכל',
  read: 'נקראו',
  unread: 'לא נקראו'
};

export const INBOX_TRANSLATIONS = {
  mails: 'מיילים',
  noMails: 'אין מיילים',
  attachments: 'קבצים מצורפים'
};
