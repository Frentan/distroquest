import { en } from './en';

export const defaultLocale = 'en';
export const plannedLocales = ['en', 'it', 'es', 'pt', 'fr', 'de'] as const;
export type Locale = (typeof plannedLocales)[number];

// Publish a locale only when its dictionary AND static routes are ready.
export const publishedLocales = ['en'] as const;
export type PublishedLocale = (typeof publishedLocales)[number];
export type Messages = typeof en;
const dictionaries: Record<PublishedLocale, Messages> = { en };

export function getMessages(locale: PublishedLocale = defaultLocale): Messages {
  return dictionaries[locale];
}

// English keeps existing URLs; future translations use /it/, /es/, etc.
// This builds paths, not routes. Do not link to unpublished locales.
export function localePath(
  path: string,
  locale: Locale = defaultLocale,
): string {
  const relativePath = `/${path.replace(/^\/+/, '')}`;
  return locale === defaultLocale ? relativePath : `/${locale}${relativePath}`;
}
