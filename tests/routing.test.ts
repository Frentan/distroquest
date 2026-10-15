import assert from 'node:assert/strict';
import { test } from 'node:test';
import { distroProfiles } from '../src/data/distros.ts';
import { allPages, distroPage } from '../src/routing.ts';
import {
  plannedLocales,
  deferredLocales,
  knownLocales,
  publishedLocales,
} from '../src/i18n/locales.ts';
import {
  localePath,
  pagePath,
  resolvePage,
  publishedPagePath,
  pageMetadata,
  sitemapUrls,
} from '../src/routing.ts';

const site = new URL('https://distroquest.example/?campaign=test#section');

test('known home and quiz paths keep English unprefixed and preserve reserved paths', () => {
  for (const locale of knownLocales) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    assert.equal(pagePath('home', locale), `${prefix}/`);
    assert.equal(pagePath('quiz', locale), `${prefix}/quiz/`);
    for (const page of ['home', 'quiz'] as const) {
      assert.deepEqual(resolvePage(pagePath(page, locale)), { page, locale });
    }
  }
});

test('equivalent paths replace locale prefixes and preserve navigation suffixes', () => {
  assert.equal(
    localePath('/es/quiz/?from=home#question', 'it'),
    '/it/quiz/?from=home#question',
  );
  assert.equal(localePath('/it/quiz', 'en'), '/quiz/');
  assert.equal(localePath('/es/', 'fr'), '/fr/');
  assert.deepEqual(resolvePage('/es/quiz?from=home#question'), {
    page: 'quiz',
    locale: 'es',
  });
  assert.deepEqual(resolvePage('/de'), { page: 'home', locale: 'de' });
  for (const path of [
    '/en/',
    '/quiz/results/',
    '/es/quiz/question/',
    '/unknown/',
  ]) {
    assert.equal(resolvePage(path), undefined);
  }
});

test('only published English, Spanish, Portuguese and Italian produce public links, metadata and sitemap entries', () => {
  assert.deepEqual(publishedLocales, ['en', 'es', 'pt', 'it']);
  assert.equal(publishedPagePath('home', 'en'), '/');
  assert.equal(publishedPagePath('quiz', 'en'), '/quiz/');
  for (const locale of knownLocales.filter(
    (locale) => !(publishedLocales as readonly string[]).includes(locale),
  )) {
    assert.equal(publishedPagePath('home', locale), undefined);
    assert.equal(publishedPagePath('quiz', locale), undefined);
    assert.equal(pageMetadata('home', locale, site).canonical, undefined);
    assert.deepEqual(pageMetadata('home', locale, site).alternates, []);
  }
  assert.equal(publishedPagePath('home', 'es'), '/es/');
  assert.equal(publishedPagePath('quiz', 'es'), '/es/quiz/');
  assert.equal(publishedPagePath('home', 'pt'), '/pt/');
  assert.equal(publishedPagePath('quiz', 'pt'), '/pt/quiz/');
  assert.equal(publishedPagePath('home', 'it'), '/it/');
  assert.equal(publishedPagePath('quiz', 'it'), '/it/quiz/');
  assert.deepEqual(
    sitemapUrls(site),
    publishedLocales.flatMap((locale) => {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      return [
        `${site.origin}${prefix}/`,
        `${site.origin}${prefix}/distros/`,
        ...distroProfiles.map(
          (distro) => `${site.origin}${prefix}/distros/${distro.slug}/`,
        ),
      ];
    }),
  );
});

test('canonical URLs and indexing policy belong to the page identity', () => {
  assert.deepEqual(pageMetadata('home', 'en', site), {
    canonical: 'https://distroquest.example/',
    alternates: [
      ...publishedLocales.map((locale) => ({
        locale,
        href: new URL(pagePath('home', locale), site).href,
      })),
      { locale: 'x-default', href: 'https://distroquest.example/' },
    ],
    noindex: false,
  });
  assert.deepEqual(pageMetadata('quiz', 'en', site), {
    canonical: 'https://distroquest.example/quiz/',
    alternates: [
      ...publishedLocales.map((locale) => ({
        locale,
        href: new URL(pagePath('quiz', locale), site).href,
      })),
      { locale: 'x-default', href: 'https://distroquest.example/quiz/' },
    ],
    noindex: true,
  });
  assert.deepEqual(sitemapUrls(undefined), []);
  for (const page of ['home', 'quiz'] as const) {
    const metadata = pageMetadata(page, 'en', undefined);
    assert.equal(metadata.canonical, undefined);
    assert.deepEqual(metadata.alternates, []);
  }
});

test('published pages produce reciprocal equivalents and self-canonicals', () => {
  const ready = publishedLocales;
  for (const page of ['home', 'quiz'] as const) {
    const english = pageMetadata(page, 'en', site, ready);
    const spanish = pageMetadata(page, 'es', site, ready);
    assert.deepEqual(english.alternates, spanish.alternates);
    assert.deepEqual(spanish.alternates, [
      {
        locale: 'en',
        href: `https://distroquest.example${page === 'home' ? '/' : '/quiz/'}`,
      },
      {
        locale: 'es',
        href: `https://distroquest.example/es/${page === 'home' ? '' : 'quiz/'}`,
      },
      {
        locale: 'pt',
        href: `https://distroquest.example/pt/${page === 'home' ? '' : 'quiz/'}`,
      },
      {
        locale: 'it',
        href: `https://distroquest.example/it/${page === 'home' ? '' : 'quiz/'}`,
      },
      {
        locale: 'x-default',
        href: `https://distroquest.example${page === 'home' ? '/' : '/quiz/'}`,
      },
    ]);
    assert.equal(spanish.canonical, spanish.alternates[1].href);
    assert.equal(publishedPagePath(page, 'es', ready), pagePath(page, 'es'));
    assert.deepEqual(pageMetadata(page, 'es', undefined, ready).alternates, []);
    const portuguese = pageMetadata(page, 'pt', site, ready);
    assert.deepEqual(portuguese.alternates, english.alternates);
    assert.equal(portuguese.canonical, portuguese.alternates[2].href);
    const italian = pageMetadata(page, 'it', site, ready);
    assert.deepEqual(italian.alternates, english.alternates);
    assert.equal(italian.canonical, italian.alternates[3].href);
  }
  assert.deepEqual(
    sitemapUrls(site, ready),
    publishedLocales.flatMap((locale) => {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      return [
        `${site.origin}${prefix}/`,
        `${site.origin}${prefix}/distros/`,
        ...distroProfiles.map(
          (distro) => `${site.origin}${prefix}/distros/${distro.slug}/`,
        ),
      ];
    }),
  );
});

test('French and German remain reserved but outside the active localization plan', () => {
  assert.deepEqual(plannedLocales, ['en', 'it', 'es', 'pt']);
  assert.deepEqual(deferredLocales, ['fr', 'de']);
  for (const locale of deferredLocales) {
    assert.ok(!(plannedLocales as readonly string[]).includes(locale));
    assert.equal(publishedPagePath('home', locale), undefined);
    assert.equal(publishedPagePath('quiz', locale), undefined);
  }
});

test('all 116 distro routes and four directories have published equivalents without extending the roster', () => {
  assert.equal(allPages.length * publishedLocales.length, 128);
  assert.equal(new Set(sitemapUrls(site)).size, 124);
  for (const distro of distroProfiles) {
    assert.equal(
      distro.slug,
      distro.id,
      'route IDs must reuse the assessed slug',
    );
    for (const locale of publishedLocales) {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      const path = `${prefix}/distros/${distro.slug}/`;
      const page = distroPage(distro.id);
      assert.equal(publishedPagePath(page, locale), path);
      assert.deepEqual(resolvePage(path), { page, locale });
      assert.deepEqual(resolvePage(path.slice(0, -1)), { page, locale });
      assert.equal(
        pageMetadata(page, locale, site).canonical,
        `${site.origin}${path}`,
      );
      assert.equal(pageMetadata(page, locale, site).noindex, false);
      for (const language of deferredLocales)
        assert.equal(publishedPagePath(page, language), undefined);
    }
  }
  for (const path of [
    '/distros/unknown/',
    '/distros/linux-mint/results/',
    '/desktop/',
    '/es/desktop/',
    '/en/distros/linux-mint/',
  ]) {
    assert.equal(resolvePage(path), undefined);
  }
  assert.equal(localePath('/es/desktop/', 'it'), '/it/desktop/');
});
