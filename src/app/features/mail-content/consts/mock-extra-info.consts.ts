import { ExtraInfoRow } from '../types/extra-info-row.type';
import { ICON_NAMES } from '../../../shared/consts/icon-name.consts';

export const MOCK_EXTRA_INFO_ROWS: ExtraInfoRow[] = [
  { icon: ICON_NAMES.FILE, label: 'תיק:', value: 'תיק 1234/2024' },
  { icon: ICON_NAMES.CALENDAR, label: 'תאריך יעד:', value: '15/03/2025' },
  { icon: ICON_NAMES.USER, label: 'מטפל:', value: 'ישראל ישראלי' },
  { icon: ICON_NAMES.SEARCH, label: 'סיווג:', value: 'סודי' },
];
