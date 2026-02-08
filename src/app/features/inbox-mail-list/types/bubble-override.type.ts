export type BubbleOverride =
  | { type: 'node'; email: string }
  | { type: 'edge'; fromEmail: string; toEmail: string };
