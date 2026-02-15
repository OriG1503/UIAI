import { SearchModeType } from '../types/search-mode-type.type';
import { SearchViewType } from '../types/search-view-type.type';

export const SEARCH_MODE_LABELS: Record<SearchModeType, string> = {
  regular: 'חיפוש',
  agent: 'Agent'
};

export const SEARCH_VIEW_LABELS: Record<SearchViewType, string> = {
  graph: 'גרף',
  list: 'רשימה'
};

export const SEARCH_TRANSLATIONS = {
  run: 'הרצה',
  freeSearch: 'חיפוש',
  advancedQuery: 'חיפוש מתקדם'
};

export const SEARCH_WARNING_TRANSLATIONS = {
  header: 'שים לב!',
  message: 'החיפוש כלל תווים מיוחדים שאינם נתמכים ועלולים להשפיע על תוצאות החיפוש.',
  confirm: 'אישור'
};

export const TAG_FILTER_TRANSLATIONS = {
  defaultLabel: 'בחירת תגיות',
  clear: 'ניקוי',
  searchToStart: 'חפשו כדי להתחיל',
  searchPlaceholder: 'Search',
  oneTagSelected: 'תגית אחת נבחרה',
  tagsSelected: 'תגיות נבחרו',
  countSelectedSingular: 'נבחר',
  countSelectedPlural: 'נבחרו',
  noResults: 'אין תוצאות'
};
