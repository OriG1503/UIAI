import { LastSearch } from '../types/last-search.type';

export const MOCK_LAST_SEARCHES: LastSearch[] = [
  { searchType: 'agent', date: new Date('2026-02-17T14:30:00') },
  { searchType: 'regular', date: new Date('2026-02-17T11:15:00') },
  { searchType: 'advanced', date: new Date('2026-02-16T16:45:00') },
  { searchType: 'regular', date: new Date('2026-02-16T09:20:00') },
  { searchType: 'agent', date: new Date('2026-02-15T18:00:00') },
  { searchType: 'advanced', date: new Date('2026-02-15T10:30:00') },
  { searchType: 'regular', date: new Date('2026-02-14T13:45:00') },
  { searchType: 'agent', date: new Date('2026-02-13T15:10:00') },
  { searchType: 'regular', date: new Date('2026-02-12T08:50:00') },
  { searchType: 'advanced', date: new Date('2026-02-11T17:25:00') }
];
