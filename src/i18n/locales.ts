export const defaultLocale = 'en';
export const plannedLocales = ['en', 'it', 'es', 'pt'] as const;
// Reserved IDs; translation and publication are deferred indefinitely.
export const deferredLocales = ['fr', 'de'] as const;
export const knownLocales = [...plannedLocales, ...deferredLocales] as const;
export type Locale = (typeof knownLocales)[number];

/** Regional presentation conventions are independent of route/message identity. */
export function formattingLocale(locale: Locale): string {
  return locale === 'pt' ? 'pt-BR' : locale;
}

// Publish only when reviewed content AND both static page routes are ready.
export const publishedLocales = ['en', 'es', 'pt'] as const;
export type PublishedLocale = (typeof publishedLocales)[number];
