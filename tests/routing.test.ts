import assert from 'node:assert/strict';
import { test } from 'node:test';
import { plannedLocales, publishedLocales } from '../src/i18n/locales.ts';
import {
  localePath,
  pagePath,
  resolvePage,
  publishedPagePath,
  pageMetadata,
  sitemapUrls,
} from '../src/routing.ts';

const site = new URL('https://distroquest.example/?campaign=test#section');

test('planned home and quiz paths keep English unprefixed and use trailing slashes', () => {
  for (const locale of plannedLocales) {
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

test('planned locales do not become public links, metadata, or sitemap entries', () => {
  assert.deepEqual(publishedLocales, ['en']);
  assert.equal(publishedPagePath('home', 'en'), '/');
  assert.equal(publishedPagePath('quiz', 'en'), '/quiz/');
  for (const locale of plannedLocales.filter((locale) => locale !== 'en')) {
    assert.equal(publishedPagePath('home', locale), undefined);
    assert.equal(publishedPagePath('quiz', locale), undefined);
    assert.equal(pageMetadata('home', locale, site).canonical, undefined);
    assert.deepEqual(pageMetadata('home', locale, site).alternates, []);
  }
  assert.deepEqual(pageMetadata('home', 'en', site).alternates, []);
  assert.deepEqual(sitemapUrls(site), ['https://distroquest.example/']);
});

test('canonical URLs and indexing policy belong to the page identity', () => {
  assert.deepEqual(pageMetadata('home', 'en', site), {
    canonical: 'https://distroquest.example/',
    alternates: [],
    noindex: false,
  });
  assert.deepEqual(pageMetadata('quiz', 'en', site), {
    canonical: 'https://distroquest.example/quiz/',
    alternates: [],
    noindex: true,
  });
  assert.deepEqual(sitemapUrls(undefined), []);
  for (const page of ['home', 'quiz'] as const) {
    const metadata = pageMetadata(page, 'en', undefined);
    assert.equal(metadata.canonical, undefined);
    assert.deepEqual(metadata.alternates, []);
  }
});

test('future publication produces reciprocal page equivalents and self-canonicals', () => {
  const ready = ['en', 'es'] as const;
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
    ]);
    assert.equal(spanish.canonical, spanish.alternates[1].href);
    assert.equal(publishedPagePath(page, 'es', ready), pagePath(page, 'es'));
    assert.deepEqual(pageMetadata(page, 'es', undefined, ready).alternates, []);
  }
  assert.deepEqual(sitemapUrls(site, ready), [
    'https://distroquest.example/',
    'https://distroquest.example/es/',
  ]);
});
