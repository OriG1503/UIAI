import { Language } from '../types/language.type';
import { MailFilter } from '../types/mail-filter.type';

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
