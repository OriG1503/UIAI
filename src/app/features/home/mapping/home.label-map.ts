import { SearchType } from '../types/search-type.type';

export const HOME_LABEL_MAP = {
  savedSearches: 'חיפושים שמורים',
  lastSearches: 'חיפושים אחרונים',
  name: 'שם',
  user: 'משתמש',
  clear: 'ניקוי',
  save: 'שמור',
  emptyLastSearch: 'נראה שעוד לא חיפשת...',
  listView: 'רשימה',
  graphView: 'גרף'
};

export const SEARCH_TYPE_LABEL_MAP: Record<SearchType, string> = {
  agent: 'סוכן',
  regular: 'רגיל',
  advanced: 'מתקדם'
};
