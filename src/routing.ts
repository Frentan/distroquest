import { distroIds, type DistroId } from './domain/distro.ts';
import {
  defaultLocale,
  knownLocales,
  publishedLocales,
  type Locale,
} from './i18n/locales.ts';

// This describes the existing pages, not a replacement for Astro's file routing.
export const pages = {
  home: { path: '/' },
  quiz: { path: '/quiz/' },
  distros: { path: '/distros/' },
} as const;
export type Page = keyof typeof pages | `distro:${DistroId}`;

// Distro slugs currently equal their stable IDs; a regression test enforces this.
export const allPages: readonly Page[] = [
  ...(Object.keys(pages) as (keyof typeof pages)[]),
  ...distroIds.map((id): Page => `distro:${id}`),
];

export function distroPage(id: DistroId): Page {
  return `distro:${id}`;
}

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
  if (!allPages.includes(page)) throw new Error(`Unknown page: ${page}`);
  return localePath(
    page.startsWith('distro:')
      ? `/distros/${page.slice('distro:'.length)}/`
      : pages[page as keyof typeof pages].path,
    locale,
  );
}

export function resolvePage(
  path: string,
): { page: Page; locale: Locale } | undefined {
  const pathname = path.split(/[?#]/, 1)[0];
  for (const locale of knownLocales) {
    for (const page of allPages) {
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
      ? [
          ...locales.map((language) => ({
            locale: language,
            href: new URL(pagePath(page, language), site).href,
          })),
          {
            locale: 'x-default',
            href: new URL(pagePath(page, defaultLocale), site).href,
          },
        ]
      : [];
  return { canonical, alternates, noindex: page === 'quiz' };
}

export function sitemapUrls(
  site: URL | undefined,
  locales: readonly Locale[] = publishedLocales,
): string[] {
  if (!site) return [];
  return locales.flatMap((locale) =>
    allPages
      .filter((page) => page !== 'quiz')
      .map((page) => new URL(pagePath(page, locale), site).href),
  );
}
