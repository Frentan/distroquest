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
import {
  contentUnits,
  reviewReport,
} from '../scripts/lib/translation-review.ts';
import { distroIds } from '../src/domain/distro.ts';
import { distroProfiles, getDistros } from '../src/data/index.ts';
import { validateDataset } from '../src/data/validate.ts';
import { createExplanations } from '../src/i18n/explanations.ts';
import { recommendationPersonas } from '../scripts/recommendation-personas.ts';
import { recommend } from '../src/recommendations/engine.ts';

const reviews = JSON.parse(
  readFileSync(new URL('../src/i18n/pt/reviews.json', import.meta.url), 'utf8'),
) as PublicationReview;

test('Portuguese runtime composition matches reviewed content and cannot bypass publication approval', () => {
  const source = Object.fromEntries(
    Object.keys(draftPt).map((key) => [key, en[key as keyof typeof en]]),
  );
  assert.deepEqual(dictionaryIssues(draftPt, source), []);
  assert.equal(dictionaries.pt, draftPt);
  assert.equal(getMessages('pt'), draftPt);
  assert.equal(reviews.approved, true);
  assert.equal(reviews.approvedBy, 'Frentan');
  const issues = publicationIssues('pt', en, draftPt, reviews);
  assert.deepEqual(issues, []);
  assert.deepEqual(
    publicationIssues('pt', en, draftPt, {
      ...reviews,
      approved: false,
      approvedBy: null,
    }),
    ['pt: explicit publication approval missing'],
  );
  assert.throws(
    () => getMessages('fr' as PublishedLocale),
    /No complete published dictionary/,
  );
  const report = reviewReport(en, draftPt, reviews.units);
  assert.equal(
    Object.keys(reviews.units).length,
    Object.keys(contentUnits(en)).length,
  );
  assert.equal(report.unreviewed.length, 0);
  assert.equal(report.missing.length, 0);
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

test('complete Portuguese draft resolves recommendation explanations across review personas', () => {
  assert.deepEqual(dictionaryIssues(draftPt), []);
  const portuguese = createExplanations(draftPt.explanations);
  const english = createExplanations(en.explanations);
  for (const answers of Object.values(recommendationPersonas)) {
    for (const row of recommend(answers).ranking) {
      for (const code of row.reasons) {
        const expected = english.explainReason(code);
        const actual = portuguese.explainReason(code);
        if (expected) {
          assert.ok(actual, `${row.distroId}: ${code}`);
          assert.notEqual(actual, expected, code);
        } else assert.equal(actual, undefined, code);
      }
      for (const code of row.cautions) {
        const expected = english.explainCaution(code);
        const actual = portuguese.explainCaution(code);
        if (expected) {
          assert.ok(actual, `${row.distroId}: ${code}`);
          assert.notEqual(actual, expected, code);
        } else assert.equal(actual, undefined, code);
      }
    }
  }
  assert.equal(draftPt.platform.asahiName('kde'), 'Fedora Asahi Remix KDE');
  assert.equal(draftPt.platform.asahiName('gnome'), 'Fedora Asahi Remix GNOME');
  const literalName = 'Test $& {name}';
  assert.equal(
    draftPt.platform.baseMatch(literalName),
    `A afinidade é baseada em ${literalName}. O suporte ao hardware e os aplicativos disponíveis podem ser diferentes neste Mac.`,
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
