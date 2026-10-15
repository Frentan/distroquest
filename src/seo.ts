import type { PublishedLocale } from './i18n/locales.ts';
import { pagePath, type Page } from './routing.ts';

/** Only visible, factual page descriptions; no ratings or product claims. */
export function structuredData(
  page: Page,
  locale: PublishedLocale,
  site: URL | undefined,
  title: string,
  description: string,
) {
  if (!site || page === 'quiz') return undefined;
  const url = new URL(pagePath(page, locale), site).href;
  const website = `${new URL('/', site).href}#website`;
  const graph: Record<string, unknown>[] = [];
  if (page === 'home' && locale === 'en')
    graph.push({
      '@type': 'WebSite',
      '@id': website,
      name: 'DistroQuest',
      url: new URL('/', site).href,
    });
  graph.push({
    '@type': page === 'distros' ? 'CollectionPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { '@id': website },
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** JSON-LD remains inert even if a future description contains HTML syntax. */
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}
