export const defaultLocale = 'en';
export const plannedLocales = ['en', 'it', 'es', 'pt', 'fr', 'de'] as const;
export type Locale = (typeof plannedLocales)[number];

// Publish only when reviewed content AND both static page routes are ready.
export const publishedLocales = ['en'] as const;
export type PublishedLocale = (typeof publishedLocales)[number];
