export type HighlightData = {
  searchTerms: string[];
  bodyWords: string[];
  attachmentContents: string[];
  attachmentNames: string[];
};

export type MailHighlight = {
  mailFilename: string;
  data: HighlightData;
};
