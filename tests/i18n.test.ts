import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dictionaries } from '../src/i18n/catalog.ts';
import { en } from '../src/i18n/en.ts';
import { getMessages } from '../src/i18n/index.ts';
import { dictionaryIssues } from '../src/i18n/validation.ts';
import { createExplanations } from '../src/i18n/explanations.ts';
import { questions } from '../src/data/questions.ts';
import { distroIds, capabilityKeys } from '../src/domain/distro.ts';
import { publishedLocales, type PublishedLocale } from '../src/i18n/locales.ts';

test('published dictionaries cover the domain IDs and explanation outcomes', () => {
  for (const locale of publishedLocales) {
    const copy = getMessages(locale);
    assert.deepEqual(dictionaryIssues(copy), []);
    assert.deepEqual(Object.keys(copy.distros).sort(), [...distroIds].sort());
    assert.deepEqual(
      Object.keys(copy.questions).sort(),
      questions.map((q) => q.id).sort(),
    );
    for (const question of questions)
      assert.deepEqual(
        Object.keys(copy.questions[question.id].options).sort(),
        question.options.map((o) => o.id).sort(),
      );
    const explain = createExplanations(copy.explanations);
    for (const capability of capabilityKeys) {
      assert.ok(copy.capabilityLabels[capability]);
      assert.ok(explain.explainReason(`capability.${capability}.match`));
      assert.ok(explain.explainReason(`capability.${capability}.near`));
      assert.ok(explain.explainCaution(`capability.${capability}.shortfall`));
    }
  }
});

test('completeness catches missing options, explanations, platform copy and callable messages', () => {
  const incomplete = {
    ...en,
    questions: {
      ...en.questions,
      experience: { ...en.questions.experience, options: {} },
    },
    explanations: { ...en.explanations, near: {} },
    platform: { ...en.platform, asahiIntro: '' },
    quiz: { ...en.quiz, progress: undefined },
  };
  const issues = dictionaryIssues(incomplete);
  assert.ok(issues.includes('questions.experience.options.init'));
  assert.ok(issues.includes('explanations.near.lowMaintenance'));
  assert.ok(issues.includes('platform.asahiIntro'));
  assert.ok(issues.includes('quiz.progress'));
  assert.deepEqual(
    dictionaryIssues({ ...en, home: { ...en.home, steps: [] } }),
    ['home.steps'],
  );
});

test('unpublished dictionaries never silently resolve to English', () => {
  assert.deepEqual(publishedLocales, ['en']);
  assert.throws(
    () => getMessages('es' as PublishedLocale),
    /No complete published dictionary/,
  );
});

test('explanation lookup uses supplied presentation content', () => {
  const explanations = createExplanations({
    ...en.explanations,
    near: { ...en.explanations.near, lowMaintenance: 'Translated near match' },
  });
  assert.equal(
    explanations.explainReason('capability.lowMaintenance.near'),
    'Translated near match',
  );
  assert.equal(explanations.explainReason('unknown.code'), undefined);
});

test('a complete staged dictionary still cannot bypass the published locale registry', () => {
  dictionaries.es = en;
  try {
    assert.throws(
      () => getMessages('es' as PublishedLocale),
      /No complete published dictionary/,
    );
  } finally {
    delete dictionaries.es;
  }
});
