import {
  getMessages,
  publishedLocales,
  type PublishedLocale,
} from '../../src/i18n/index.ts';
import { decodeHtmlEntities } from './html-entities.ts';
import {
  capabilityKeys,
  distroIds,
  type DistroId,
} from '../../src/domain/distro.ts';
import { distroProfiles } from '../../src/data/distros.ts';
import { officialWebsites } from '../../src/data/official-websites.ts';
import {
  distroPage,
  pagePath,
  resolvePage,
  type Page,
} from '../../src/routing.ts';
import { structuredData } from '../../src/seo.ts';
import { supportUrl } from '../../src/config.ts';

function textContent(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Build-time checks use actual emitted HTML, including every localized summary. */
export function staticPageIssues(
  html: string,
  page: Page,
  locale: PublishedLocale,
  site?: URL,
): string[] {
  const issues: string[] = [];
  const messages = getMessages(locale);
  const copy = messages.discovery;
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? '';
  const text = textContent(main);
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(
    (match) => match[1],
  );
  if (!main) issues.push('missing main content');
  if (page !== 'quiz' && [...main.matchAll(/<h1\b/g)].length !== 1)
    issues.push('expected one static H1');
  for (const href of hrefs.filter((href) => href.startsWith('/'))) {
    const route = resolvePage(href);
    if (!route || !publishedLocales.some((locale) => locale === route.locale))
      issues.push(`unpublished internal link: ${href}`);
    else if (href.split(/[?#]/, 1)[0] !== pagePath(route.page, route.locale))
      issues.push(`unnormalized internal link: ${href}`);
  }
  if (!hrefs.includes(supportUrl) || !html.includes(copy.support))
    issues.push('missing localized support link');
  if (page === 'home' && !hrefs.includes(pagePath('distros', locale)))
    issues.push('missing directory entry point');
  let title = messages.home.title,
    description = messages.home.description;
  if (page === 'distros') {
    title = copy.directoryTitle;
    description = copy.directoryDescription;
    for (const id of distroIds)
      if (
        !hrefs.includes(pagePath(distroPage(id), locale)) ||
        !text.includes(messages.distros[id].summary)
      )
        issues.push(`missing directory entry: ${id}`);
    if (/<img\b/i.test(main)) issues.push('directory must not load imagery');
  }
  if (page.startsWith('distro:')) {
    const id = page.slice('distro:'.length) as DistroId;
    const distro = messages.distros[id];
    const profile = distroProfiles.find((profile) => profile.id === id)!;
    const meters = [...main.matchAll(/<div\b[^>]*\brole="meter"[^>]*>/g)].map(
      (match) => match[0],
    );
    if (meters.length !== capabilityKeys.length)
      issues.push('missing full capability profile');
    for (const capability of capabilityKeys) {
      const meter = meters.find((tag) =>
        tag.includes(`aria-labelledby="capability-${capability}"`),
      );
      if (
        !meter?.includes(
          `aria-valuenow="${profile.capabilities[capability]}"`,
        ) ||
        !text.includes(messages.capabilityLabels[capability])
      )
        issues.push(`incorrect capability rating: ${capability}`);
    }
    title = copy.profileTitle(distro.name);
    description = distro.summary;
    for (const value of [
      distro.name,
      distro.archetype.name,
      distro.archetype.description,
      distro.summary,
      ...distro.idealFor,
      ...distro.strengths,
      ...distro.cautions,
      distro.assessmentBasis,
      ...('editionNote' in distro ? [distro.editionNote] : []),
    ]) {
      if (!text.includes(value.replace(/\s+/g, ' ')))
        issues.push(`missing profile content: ${value}`);
    }
    if (
      !hrefs.includes(pagePath('distros', locale)) ||
      !hrefs.includes(pagePath('quiz', locale))
    )
      issues.push('missing directory or quiz navigation');
    const official = officialWebsites[id];
    if (official && !hrefs.includes(official))
      issues.push('missing verified official link');
    if (!official && main.includes(copy.official))
      issues.push('unverified official link');
    if (
      !main.includes(`src="/characters/${id}.png"`) ||
      !main.includes('width="512" height="512"')
    )
      issues.push('missing dimensioned character artwork');
  }
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const json = scripts.filter((match) =>
    /\btype="application\/ld\+json"/.test(match[1]),
  );
  if (page !== 'quiz' && scripts.some((match) => /\bsrc=/.test(match[1])))
    issues.push('static page must not load the quiz bundle');
  const expected = structuredData(page, locale, site, title, description);
  try {
    if (
      expected
        ? json.length !== 1 ||
          JSON.stringify(JSON.parse(json[0][2])) !== JSON.stringify(expected)
        : json.length !== 0
    )
      issues.push('incorrect JSON-LD');
  } catch {
    issues.push('invalid JSON-LD');
  }
  return issues;
}
