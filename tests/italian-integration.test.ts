import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { en } from '../src/i18n/en.ts';
import { it } from '../src/i18n/it.ts';
import { draftIt } from '../src/i18n/it/draft.ts';
import { dictionaries } from '../src/i18n/catalog.ts';
import { getMessages, type PublishedLocale } from '../src/i18n/index.ts';
import { dictionaryIssues } from '../src/i18n/validation.ts';
import {
  publicationIssues,
  type PublicationReview,
} from '../scripts/lib/publication.ts';
import { reviewReport } from '../scripts/lib/translation-review.ts';
import { distroIds } from '../src/domain/distro.ts';
import { getDistros, distroProfiles } from '../src/data/index.ts';
import { validateDataset } from '../src/data/validate.ts';
import { createExplanations } from '../src/i18n/explanations.ts';
import { recommendationPersonas } from '../scripts/recommendation-personas.ts';
import { recommend } from '../src/recommendations/engine.ts';

const reviews = JSON.parse(
  readFileSync(new URL('../src/i18n/it/reviews.json', import.meta.url), 'utf8'),
) as PublicationReview;

test('Italian runtime uses reviewed content and still requires separate publication approval', () => {
  assert.equal(it, draftIt);
  assert.equal(dictionaries.it, it);
  assert.equal(getMessages('it'), it);
  assert.deepEqual(dictionaryIssues(it), []);
  assert.equal(reviews.approved, true);
  assert.equal(reviews.approvedBy, 'Frentan');
  assert.equal(Object.keys(reviews.units).length, 765);
  for (const paths of Object.values(reviewReport(en, it, reviews.units)))
    assert.deepEqual(paths, []);
  assert.deepEqual(publicationIssues('it', en, it, reviews), []);
  assert.deepEqual(
    publicationIssues('it', en, it, {
      ...reviews,
      approved: false,
      approvedBy: null,
    }),
    ['it: explicit publication approval missing'],
  );
  assert.throws(
    () => getMessages('fr' as PublishedLocale),
    /No complete published dictionary/,
  );
});

test('Italian dossiers preserve all 29 technical profiles and distinct archetypes', () => {
  assert.deepEqual(Object.keys(it.distros).sort(), [...distroIds].sort());
  assert.deepEqual(validateDataset(distroProfiles, it.distros), []);
  const localized = getDistros(it.distros);
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
    29,
  );
});

test('Italian resolves recommendation explanation codes across all review personas', () => {
  const italian = createExplanations(it.explanations);
  const english = createExplanations(en.explanations);
  for (const answers of Object.values(recommendationPersonas))
    for (const row of recommend(answers).ranking) {
      for (const code of row.reasons) {
        const expected = english.explainReason(code);
        const actual = italian.explainReason(code);
        if (expected) {
          assert.ok(actual, code);
          assert.notEqual(actual, expected, code);
        } else assert.equal(actual, undefined, code);
      }
      for (const code of row.cautions) {
        const expected = english.explainCaution(code);
        const actual = italian.explainCaution(code);
        if (expected) {
          assert.ok(actual, code);
          assert.notEqual(actual, expected, code);
        } else assert.equal(actual, undefined, code);
      }
    }
});

test('Italian formats numbers and literal parameters without changing calculation inputs', () => {
  const score = 87.55;
  assert.equal(
    it.quiz.match(score),
    '87,6% di corrispondenza con le preferenze',
  );
  assert.equal(en.quiz.match(score), '87.6% preference fit');
  assert.equal(score, 87.55);
  assert.equal(it.quiz.match.unit.locale, 'it');
  assert.equal(it.quiz.statValue(3.5), '3,5 su 5');
  assert.equal(it.quiz.submitted(3, 16), '3 di 16 risposte confermate');
  assert.equal(
    it.quiz.capabilityComparison('Gaming', 3.5, 4.25, 'NVIDIA'),
    'Gaming: 3,5/5 rispetto a 4,25/5 di NVIDIA',
  );
  assert.equal(it.platform.asahiName('kde'), 'Fedora Asahi Remix KDE');
  assert.equal(it.platform.asahiName('gnome'), 'Fedora Asahi Remix GNOME');
  const literal = 'Test $& {name}';
  assert.equal(
    it.platform.baseMatch(literal),
    `La corrispondenza si basa su ${literal}. Il supporto hardware e le app disponibili possono essere diversi su questo Mac.`,
  );
});
