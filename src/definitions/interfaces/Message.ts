import { FlashTypes } from '../enums/FlashTypes';

export interface Message {
  variant: FlashTypes;
  content: string;
}
