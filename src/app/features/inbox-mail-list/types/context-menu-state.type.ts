import { Mail } from '../../../shared/types/mail.type';

export type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  mail: Mail | null;
};
