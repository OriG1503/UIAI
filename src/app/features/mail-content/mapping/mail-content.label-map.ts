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
