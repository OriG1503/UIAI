import { SavedSearch } from '../types/saved-search.type';

export const MAX_SAVED_SEARCH_NAME_LENGTH: number = 65;

export const CURRENT_USERNAME: string = 'user_ori';

export const MAX_VISIBLE_SAVED_SEARCHES: number = 6;

export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  { name: 'חיפוש מיילים מהשבוע האחרון עם קבצים מצורפים מסוג PDF בלבד44343434', username: 'user_ori', date: new Date('2026-02-17'), isPinned: true },
  { name: 'הודעות שלא נקראו מאת צוות הפיתוח', username: 'user_ori', date: new Date('2026-02-16'), isPinned: false },
  { name: 'מיילים עם תמונות מצורפות מינואר 2026', username: 'user_ori', date: new Date('2026-02-15'), isPinned: false },
  { name: 'תכתובות עם לקוחות חדשים ברבעון הראשון', username: 'user_ori', date: new Date('2026-02-14'), isPinned: false },
  { name: 'דוחות חודשיים מהנהלה', username: 'user_ori', date: new Date('2026-02-12'), isPinned: false },
  { name: 'מיילים ממחלקת משאבי אנוש בנושא חופשות', username: 'user_ori', date: new Date('2026-02-10'), isPinned: false },
  { name: 'חיפוש לפי נושא ישיבת צוות שבועית', username: 'user_ori', date: new Date('2026-02-08'), isPinned: false },
  { name: 'הודעות דחופות מלקוח מרכזי', username: 'user_ori', date: new Date('2026-02-05'), isPinned: false },
  { name: 'הודעות דחופות מלקוח מרכזי 2', username: 'user_ori', date: new Date('2026-02-05'), isPinned: false },
  { name: 'הודעות דחופות מלקוח מרכזי 3', username: 'user_ori', date: new Date('2026-02-05'), isPinned: false },
  { name: 'הודעות דחופות מלקוח מרכזי 4', username: 'user_ori', date: new Date('2026-02-05'), isPinned: false },
  { name: 'הודעות דחופות מלקוח מרכזי 5', username: 'user_ori', date: new Date('2026-02-05'), isPinned: false },
  { name: 'Search for quarterly reports from finance', username: 'user_david', date: new Date('2026-02-13'), isPinned: false },
  { name: 'All emails with attachment from HR department', username: 'user_sarah', date: new Date('2026-02-11'), isPinned: false },
  { name: 'מיילים מצוות התמיכה בחודש האחרון', username: 'user_maya', date: new Date('2026-02-09'), isPinned: false },
  { name: 'מיילים מצוות התמיכה בחודש האחרון 2', username: 'user_maya', date: new Date('2026-02-09'), isPinned: false },
  { name: 'מיילים מצוות התמיכה בחודש האחרון 3', username: 'user_maya', date: new Date('2026-02-09'), isPinned: false },
  { name: 'מיילים מצוות התמיכה בחודש האחרון 4', username: 'user_maya', date: new Date('2026-02-09'), isPinned: false },
  { name: 'מיילים מצוות התמיכה בחודש האחרון 5', username: 'user_maya', date: new Date('2026-02-09'), isPinned: false }
];
