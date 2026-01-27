export type SearchQuery = {
  searchText: string;
  dateRange: { start: Date | null; end: Date | null };
  fromEmails: string[];
  toEmails: string[];
  mailbox: string | null;
};
