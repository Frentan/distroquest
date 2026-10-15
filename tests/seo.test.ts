import assert from 'node:assert/strict';
import { test } from 'node:test';
import { structuredData, serializeStructuredData } from '../src/seo.ts';
import { allPages, pageMetadata, pagePath } from '../src/routing.ts';
import { publishedLocales, getMessages } from '../src/i18n/index.ts';
import { officialWebsites } from '../src/data/official-websites.ts';
import { distroIds } from '../src/domain/distro.ts';

const site = new URL('https://distroquest.com');

test('every published page has reciprocal alternates including its English x-default', () => {
  for (const page of allPages)
    for (const locale of publishedLocales) {
      const metadata = pageMetadata(page, locale, site);
      assert.equal(
        metadata.canonical,
        new URL(pagePath(page, locale), site).href,
      );
      assert.equal(metadata.alternates.length, 5);
      assert.equal(
        metadata.alternates.find((a) => a.locale === 'x-default')?.href,
        new URL(pagePath(page, 'en'), site).href,
      );
      for (const equivalent of publishedLocales)
        assert.deepEqual(
          metadata.alternates,
          pageMetadata(page, equivalent, site).alternates,
        );
    }
});

test('JSON-LD describes only indexable pages and the actual root website', () => {
  for (const page of allPages)
    for (const locale of publishedLocales) {
      const value = structuredData(page, locale, site, 'Title', 'Description');
      if (page === 'quiz') {
        assert.equal(value, undefined);
        continue;
      }
      assert.equal(value?.['@context'], 'https://schema.org');
      const graph = value!['@graph'];
      assert.equal(graph.length, page === 'home' && locale === 'en' ? 2 : 1);
      const node = graph.at(-1)!;
      assert.equal(
        node['@type'],
        page === 'distros' ? 'CollectionPage' : 'WebPage',
      );
      assert.equal(node.url, new URL(pagePath(page, locale), site).href);
      assert.equal(node.inLanguage, locale);
      assert.equal(node.name, 'Title');
      assert.equal(node.description, 'Description');
      assert.deepEqual(node.isPartOf, {
        '@id': 'https://distroquest.com/#website',
      });
      assert.doesNotMatch(
        JSON.stringify(value),
        /rating|review|Organization|Person|SearchAction|SoftwareApplication/,
      );
      assert.equal(
        structuredData(page, locale, undefined, 'Title', 'Description'),
        undefined,
      );
    }
  const unsafe = { description: '</script><script>alert(1)</script>' };
  const serialized = serializeStructuredData(unsafe);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), unsafe);
});

test('official destinations are separate from assessments and uncertain URLs can be absent', () => {
  for (const [id, url] of Object.entries(officialWebsites)) {
    assert.ok((distroIds as readonly string[]).includes(id));
    const parsed = new URL(url);
    assert.equal(parsed.protocol, id === 'slackware' ? 'http:' : 'https:');
    assert.equal(parsed.username, '');
    assert.equal(parsed.search, '');
  }
  assert.equal(officialWebsites.slackware, 'http://www.slackware.com/');
  for (const locale of publishedLocales)
    for (const id of distroIds) {
      const messages = getMessages(locale);
      assert.ok(
        messages.discovery
          .profileLink(messages.distros[id].name)
          .includes(messages.distros[id].name),
      );
      assert.ok(
        messages.discovery
          .profileTitle(messages.distros[id].name)
          .includes(messages.distros[id].name),
      );
    }
});
