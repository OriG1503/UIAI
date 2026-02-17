import { Language } from '../types/language.type';
import { MailFilter } from '../types/mail-filter.type';

export const MAIL_FILTER_LABEL_MAP: Record<MailFilter, string> = {
  all: 'הכל',
  seen: 'נקראו',
  unseen: 'לא נקראו',
};

export const LANGUAGE_LABEL_MAP: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};
