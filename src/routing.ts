import {
  defaultLocale,
  knownLocales,
  publishedLocales,
  type Locale,
} from './i18n/locales.ts';

// This describes the existing pages, not a replacement for Astro's file routing.
export const pages = {
  home: { path: '/', indexable: true },
  quiz: { path: '/quiz/', indexable: false },
} as const;
export type Page = keyof typeof pages;

// Path construction preserves known locale paths, including reserved IDs.
// Neither planning nor path resolution establishes publication.
export function localePath(
  path: string,
  locale: Locale = defaultLocale,
): string {
  const boundary = path.search(/[?#]/);
  const pathname = boundary < 0 ? path : path.slice(0, boundary);
  const suffix = boundary < 0 ? '' : path.slice(boundary);
  const segments = pathname.split('/').filter(Boolean);
  if (knownLocales.some((language) => language === segments[0]))
    segments.shift();
  const relative = segments.length ? `/${segments.join('/')}/` : '/';
  return `${locale === defaultLocale ? '' : `/${locale}`}${relative}${suffix}`;
}

export function pagePath(page: Page, locale: Locale = defaultLocale): string {
  return localePath(pages[page].path, locale);
}

export function resolvePage(
  path: string,
): { page: Page; locale: Locale } | undefined {
  const pathname = path.split(/[?#]/, 1)[0];
  for (const locale of knownLocales) {
    for (const page of Object.keys(pages) as Page[]) {
      const expected = pagePath(page, locale);
      if (
        pathname === expected ||
        (expected !== '/' && pathname === expected.slice(0, -1))
      ) {
        return { page, locale };
      }
    }
  }
  return undefined;
}

// Optional locale lists allow isolated tests of future publication, not runtime enablement.
export function publishedPagePath(
  page: Page,
  locale: Locale,
  locales: readonly Locale[] = publishedLocales,
): string | undefined {
  return locales.includes(locale) ? pagePath(page, locale) : undefined;
}

export function pageMetadata(
  page: Page,
  locale: Locale,
  site: URL | undefined,
  locales: readonly Locale[] = publishedLocales,
) {
  const path = publishedPagePath(page, locale, locales);
  const canonical = site && path ? new URL(path, site).href : undefined;
  const alternates =
    canonical && locales.length > 1
      ? locales.map((language) => ({
          locale: language,
          href: new URL(pagePath(page, language), site).href,
        }))
      : [];
  return { canonical, alternates, noindex: !pages[page].indexable };
}

export function sitemapUrls(
  site: URL | undefined,
  locales: readonly Locale[] = publishedLocales,
): string[] {
  if (!site) return [];
  return locales.flatMap((locale) =>
    (Object.keys(pages) as Page[])
      .filter((page) => pages[page].indexable)
      .map((page) => new URL(pagePath(page, locale), site).href),
  );
}
