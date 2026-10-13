import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { en } from '../src/i18n/en.ts';
import { draftPt } from '../src/i18n/pt/draft.ts';
import { dictionaries } from '../src/i18n/catalog.ts';
import { getMessages, type PublishedLocale } from '../src/i18n/index.ts';
import { formattingLocale } from '../src/i18n/locales.ts';
import { dictionaryIssues } from '../src/i18n/validation.ts';
import {
  publicationIssues,
  type PublicationReview,
} from '../scripts/lib/publication.ts';
import { reviewReport } from '../scripts/lib/translation-review.ts';
import { distroIds } from '../src/domain/distro.ts';
import { distroProfiles, getDistros } from '../src/data/index.ts';
import { validateDataset } from '../src/data/validate.ts';

const reviews = JSON.parse(
  readFileSync(new URL('../src/i18n/pt/reviews.json', import.meta.url), 'utf8'),
) as PublicationReview;

test('Portuguese draft covers complete authored sections but cannot be published', () => {
  const source = Object.fromEntries(
    Object.keys(draftPt).map((key) => [key, en[key as keyof typeof en]]),
  );
  assert.deepEqual(dictionaryIssues(draftPt, source), []);
  assert.equal(dictionaries.pt, undefined);
  assert.throws(
    () => getMessages('pt' as PublishedLocale),
    /No complete published dictionary/,
  );
  assert.equal(reviews.approved, false);
  assert.equal(reviews.approvedBy, null);
  const issues = publicationIssues('pt', en, draftPt, reviews);
  assert.ok(issues.includes('pt: explicit publication approval missing'));
  assert.ok(issues.some((issue) => issue.includes('explanations')));
  assert.ok(!issues.some((issue) => issue.includes('unreviewed')));
  assert.ok(
    !issues.some((issue) => issue.includes('incorrect message locale')),
  );
  const report = reviewReport(en, draftPt, reviews.units);
  assert.equal(Object.keys(reviews.units).length, 666);
  assert.equal(report.unreviewed.length, 0);
  assert.equal(report.missing.length, 99);
  for (const reason of [
    'staleSource',
    'changedTranslation',
    'invalidReview',
    'orphaned',
    'extra',
  ] as const)
    assert.deepEqual(report[reason], [], reason);
});

test('Portuguese dossiers cover the exact roster without changing technical profiles', () => {
  assert.deepEqual(Object.keys(draftPt.distros).sort(), [...distroIds].sort());
  assert.deepEqual(validateDataset(distroProfiles, draftPt.distros), []);
  const localized = getDistros(draftPt.distros);
  for (const profile of distroProfiles) {
    const composed = localized.find((distro) => distro.id === profile.id)!;
    for (const [key, value] of Object.entries(profile))
      assert.deepEqual(
        Reflect.get(composed, key),
        value,
        `${profile.id}/${key}`,
      );
    assert.equal(composed.name, en.distros[profile.id].name);
  }
  assert.equal(
    new Set(localized.map((distro) => distro.archetype.name)).size,
    distroIds.length,
  );
});

test('Portuguese uses Brazilian number conventions with pt message identity and unchanged inputs', () => {
  assert.equal(formattingLocale('pt'), 'pt-BR');
  assert.equal(
    new Intl.NumberFormat(formattingLocale('pt')).resolvedOptions().locale,
    'pt-BR',
  );
  assert.equal(formattingLocale('en'), 'en');
  assert.equal(formattingLocale('es'), 'es');
  const score = 87.55;
  assert.equal(
    draftPt.quiz.match(score),
    '87,6% de afinidade com suas preferências',
  );
  assert.equal(score, 87.55);
  assert.equal(draftPt.quiz.match.unit.locale, 'pt');
  assert.equal(draftPt.quiz.statValue(3.5), '3,5 de 5');
  assert.equal(
    draftPt.quiz.capabilityComparison('Jogos', 3.5, 4.25, 'NVIDIA'),
    'Jogos: 3,5/5, em comparação com 4,25/5 de NVIDIA',
  );
  assert.equal(en.quiz.match(score), '87.6% preference fit');
});
