import { ExtraInfoRow } from '../types/extra-info-row.type';
import { ICON_NAMES } from '../../../shared/consts/icon-name.consts';
import { EXTRA_INFO_ROW_LABEL_MAP } from '../mapping/mail-content.label-map';

export const MOCK_EXTRA_INFO_ROWS: ExtraInfoRow[] = [
  { icon: ICON_NAMES.FILE, label: EXTRA_INFO_ROW_LABEL_MAP.fileCase, value: 'תיק 1234/2024' },
  { icon: ICON_NAMES.CALENDAR, label: EXTRA_INFO_ROW_LABEL_MAP.dueDate, value: '15/03/2025' },
  { icon: ICON_NAMES.USER, label: EXTRA_INFO_ROW_LABEL_MAP.handler, value: 'ישראל ישראלי' },
  { icon: ICON_NAMES.SEARCH, label: EXTRA_INFO_ROW_LABEL_MAP.classification, value: 'סודי' },
];
