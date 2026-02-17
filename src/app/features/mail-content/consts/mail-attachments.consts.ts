import { ICON_NAMES, IconName } from '../../../shared/consts/icon-name.consts';

export const ATTACHMENT_NAME_MAX_LENGTH: number = 20;

export const EXTENSION_COLORS: Record<string, string> = {
  docx: '#2f67bf',
  doc: '#2f67bf',
  xlsx: '#219a58',
  xls: '#219a58',
  png: '#01caff',
  jpg: '#01caff',
  jpeg: '#01caff',
  gif: '#01caff',
  pdf: '#ea355a',
  pptx: '#d35230',
  ppt: '#d35230',
  txt: '#6b7280',
  zip: '#f59e0b',
  default: '#9ca3af',
};

export const EXTENSION_ICONS: Record<string, IconName> = {
  docx: ICON_NAMES.FILE_WORD,
  doc: ICON_NAMES.FILE_WORD,
  xlsx: ICON_NAMES.FILE_EXCEL,
  xls: ICON_NAMES.FILE_EXCEL,
  png: ICON_NAMES.IMAGE,
  jpg: ICON_NAMES.IMAGE,
  jpeg: ICON_NAMES.IMAGE,
  gif: ICON_NAMES.IMAGE,
  pdf: ICON_NAMES.FILE_PDF,
  pptx: ICON_NAMES.FILE,
  ppt: ICON_NAMES.FILE,
  txt: ICON_NAMES.FILE,
  zip: ICON_NAMES.FILE,
  default: ICON_NAMES.FILE,
};
