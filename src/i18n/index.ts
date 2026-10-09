import { en } from './en';
import { defaultLocale, type PublishedLocale } from './locales.ts';
export * from './locales.ts';
export { localePath } from '../routing.ts';
export type Messages = typeof en;
const dictionaries: Record<PublishedLocale, Messages> = { en };

export function getMessages(locale: PublishedLocale = defaultLocale): Messages {
  return dictionaries[locale];
}
