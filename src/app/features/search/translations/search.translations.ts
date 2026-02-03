import { SearchModeType } from '../types/search-mode-type.type';
import { SearchViewType } from '../types/search-view-type.type';

export const SEARCH_MODE_LABELS: Record<SearchModeType, string> = {
  regular: 'חיפוש רגיל',
  agent: 'סוכן חיפוש'
};

export const SEARCH_VIEW_LABELS: Record<SearchViewType, string> = {
  graph: 'גרף',
  list: 'רשימה'
};

export const SEARCH_TRANSLATIONS = {
  run: 'הרצה',
  freeSearch: 'חיפוש חופשי...',
  advancedQuery: 'שאילתה מתקדמת'
};
