import { dictionaries, type Messages } from './catalog.ts';
export type { Messages } from './catalog.ts';
import {
  defaultLocale,
  publishedLocales,
  type PublishedLocale,
} from './locales.ts';
export * from './locales.ts';
export { localePath } from '../routing.ts';

export function getMessages(locale: PublishedLocale = defaultLocale): Messages {
  const dictionary = dictionaries[locale];
  if (
    !publishedLocales.some((published) => published === locale) ||
    !dictionary
  )
    throw new Error(`No complete published dictionary for ${locale}`);
  return dictionary;
}
