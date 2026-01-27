import { Encoding, Language, MailFilter } from '../types';

export const MAIL_FILTER_LABELS: Record<MailFilter, string> = {
  all: 'הכל',
  read: 'נקראו',
  unread: 'לא נקראו',
  starred: 'מסומנים בכוכב'
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français'
};

export const ENCODING_LABELS: Record<Encoding, string> = {
  'utf-8': 'UTF-8',
  'iso-8859-1': 'ISO-8859-1',
  'windows-1255': 'Windows-1255 (Hebrew)'
};

export const INBOX_TRANSLATIONS = {
  mails: 'מיילים',
  noMails: 'אין מיילים',
  attachments: 'קבצים מצורפים',
  export: 'ייצוא',
  translate: 'תרגום',
  markAsUnread: 'סמן כלא נקרא',
  encoding: 'קידוד',
  download: 'הורדה',
  downloadAll: 'הורד הכל',
  from: 'מאת',
  to: 'אל',
  cc: 'העתק',
  bcc: 'העתק מוסתר',
  noMailSelected: 'לא נבחר מייל'
};
