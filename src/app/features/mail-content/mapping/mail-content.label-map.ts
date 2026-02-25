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
  mockContent:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
};

export const MAIL_CONTENT_TOOLBAR_LABEL_MAP = {
  download: 'הורד MAIL',
  extraInfo: 'מידע נוסף',
  next: 'הבא',
  previous: 'הקודם',
};

export const MAIL_ATTACHMENTS_LABEL_MAP = {
  downloadAll: 'הורד דבוקות',
};
