import assert from 'node:assert/strict';
import { test } from 'node:test';
import { staticPageIssues } from '../scripts/lib/static-pages.ts';
import {
  getMessages,
  publishedLocales,
  type PublishedLocale,
} from '../src/i18n/index.ts';
import { capabilityKeys, distroIds } from '../src/domain/distro.ts';
import { distroProfiles } from '../src/data/distros.ts';
import { officialWebsites } from '../src/data/official-websites.ts';
import { distroPage, pagePath } from '../src/routing.ts';
import { supportUrl } from '../src/config.ts';

function fixture(locale: PublishedLocale, directory = false) {
  const messages = getMessages(locale),
    distro = messages.distros['linux-mint'];
  const link = (href: string) => `<a href="${href}">Link</a>`;
  const content = directory
    ? distroIds
        .map(
          (id) =>
            link(pagePath(distroPage(id), locale)) +
            messages.distros[id].summary,
        )
        .join(' ')
    : [
        distro.name,
        distro.archetype.name,
        distro.archetype.description,
        distro.summary,
        ...distro.idealFor,
        ...distro.strengths,
        ...distro.cautions,
        distro.assessmentBasis,
      ].join(' ') +
      link(officialWebsites['linux-mint']!) +
      `<img src="/characters/linux-mint.png" width="512" height="512">`;
  const profile = distroProfiles.find(
    (profile) => profile.id === 'linux-mint',
  )!;
  const capabilities = directory
    ? ''
    : capabilityKeys
        .map(
          (capability) =>
            `${messages.capabilityLabels[capability]}<div role="meter" aria-labelledby="capability-${capability}" aria-valuenow="${profile.capabilities[capability]}"></div>`,
        )
        .join(' ');
  return `<html><body>${link(supportUrl)}${messages.discovery.support}<main><h1>Title</h1>${content}${capabilities}${link(pagePath('distros', locale))}${link(pagePath('quiz', locale))}</main></body></html>`;
}

test('emitted-content gate rejects missing translations and unknown or unnormalized navigation', () => {
  for (const locale of publishedLocales) {
    const html = fixture(locale);
    assert.deepEqual(
      staticPageIssues(html, distroPage('linux-mint'), locale),
      [],
    );
    assert.ok(
      staticPageIssues(
        html.replace('aria-valuenow="5"', 'aria-valuenow="0"'),
        distroPage('linux-mint'),
        locale,
      ).includes('incorrect capability rating: beginnerFriendly'),
    );
    const summary = getMessages(locale).distros['linux-mint'].summary;
    assert.ok(
      staticPageIssues(
        html.replace(summary, ''),
        distroPage('linux-mint'),
        locale,
      ).some((issue) => issue.startsWith('missing profile content')),
    );
    for (const href of [
      '/en/distros/linux-mint/',
      '/fr/',
      '/distros/nonexistent/',
      '/quiz/results/',
      '/desktop/',
      '/quiz',
    ]) {
      assert.ok(
        staticPageIssues(
          html.replace('</main>', `<a href="${href}">Bad link</a></main>`),
          distroPage('linux-mint'),
          locale,
        ).some((issue) => /internal link/.test(issue)),
      );
    }
  }
});

test('directory content gate requires the complete localized roster and forbids application bundles and imagery', () => {
  for (const locale of publishedLocales) {
    const html = fixture(locale, true);
    assert.deepEqual(staticPageIssues(html, 'distros', locale), []);
    assert.ok(
      staticPageIssues(
        html.replace(getMessages(locale).distros.gentoo.summary, ''),
        'distros',
        locale,
      ).includes('missing directory entry: gentoo'),
    );
    assert.ok(
      staticPageIssues(
        html.replace(
          '</body>',
          '<script src="/_astro/quiz.js"></script></body>',
        ),
        'distros',
        locale,
      ).includes('static page must not load the quiz bundle'),
    );
    assert.ok(
      staticPageIssues(
        html.replace('</main>', '<img src="image.png"></main>'),
        'distros',
        locale,
      ).includes('directory must not load imagery'),
    );
  }
});
