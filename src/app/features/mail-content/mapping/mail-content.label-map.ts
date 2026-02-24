import { Encoding } from '../types/encoding.type';

export const ENCODING_LABEL_MAP: Record<Encoding, string> = {
  none: 'ללא',
  'utf-8': 'UTF-8',
  'iso-8859-1': 'ISO-8859-1',
  'windows-1255': 'Windows-1255 (Hebrew)',
};

export const HIGHLIGHT_NAV_LABEL_MAP = {
  outOf: 'מתוך',
  matches: 'התאמתויות',
};

export const MAIL_EXTRA_INFO_LABEL_MAP = {
  title: 'Additional Info',
};

export const MAIL_CONTENT_TOOLBAR_LABEL_MAP = {
  download: 'הורד MAIL',
  next: 'הבא',
  previous: 'הקודם',
};

export const MAIL_ATTACHMENTS_LABEL_MAP = {
  downloadAll: 'הורד דבוקות',
};

export const EXTRA_INFO_ROW_LABEL_MAP = {
  fileCase: 'תיק:',
  dueDate: 'תאריך יעד:',
  handler: 'מטפל:',
  classification: 'סיווג:',
};
