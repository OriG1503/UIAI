import { SavedSearch } from '../types/saved-search.type';

export const MAX_SAVED_SEARCH_NAME_LENGTH: number = 65;

export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  { name: 'חיפוש מיילים מהשבוע האחרון עם קבצים מצורפים מסוג PDF בלבד', date: new Date('2026-02-17') },
  { name: 'הודעות שלא נקראו מאת צוות הפיתוח', date: new Date('2026-02-16') },
  { name: 'מיילים עם תמונות מצורפות מינואר 2026', date: new Date('2026-02-15') },
  { name: 'תכתובות עם לקוחות חדשים ברבעון הראשון', date: new Date('2026-02-14') },
  { name: 'דוחות חודשיים מהנהלה', date: new Date('2026-02-12') },
  { name: 'מיילים ממחלקת משאבי אנוש בנושא חופשות', date: new Date('2026-02-10') },
  { name: 'חיפוש לפי נושא ישיבת צוות שבועית', date: new Date('2026-02-08') },
  { name: 'הודעות דחופות מלקוח מרכזי', date: new Date('2026-02-05') }
];
