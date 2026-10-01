import assert from 'node:assert/strict';
import { test } from 'node:test';
import { capabilityKeys, interests, scores } from '../src/domain/distro.ts';
import { questionIds } from '../src/domain/preferences.ts';
import { questions, QUESTION_COUNT } from '../src/data/questions.ts';
import { questionContentEn } from '../src/i18n/en/questions.ts';
import { en } from '../src/i18n/en.ts';
import {
  buildPreferenceProfile,
  InvalidAnswersError,
  validateAnswers,
} from '../src/preferences/profile.ts';
import { preferenceExamples } from '../scripts/preference-examples.ts';

const base = preferenceExamples.newcomer;
const profile = buildPreferenceProfile;

test('16 questions have the requested sections, complete localized copy, and bounded effects', () => {
  assert.equal(QUESTION_COUNT, 16);
  assert.deepEqual(
    questions.map((question) => question.id),
    questionIds,
  );
  assert.deepEqual(Object.keys(questionContentEn), [...questionIds]);
  assert.deepEqual(
    ['core', 'practical', 'philosophy', 'finale'].map(
      (section) =>
        questions.filter((question) => question.section === section).length,
    ),
    [8, 4, 3, 1],
  );
  for (const question of questions) {
    const content = questionContentEn[question.id];
    assert.ok(content.prompt.trim());
    assert.equal(
      question.maxSelections,
      question.selection === 'single' ? 1 : 3,
    );
    assert.equal(
      new Set(question.options.map((option) => option.id)).size,
      question.options.length,
    );
    assert.deepEqual(
      Object.keys(content.options),
      question.options.map((option) => option.id),
    );
    for (const option of question.options) {
      assert.ok(option.emoji && content.options[option.id].label.trim());
      for (const [key, signal] of Object.entries(
        option.effects.capabilities ?? {},
      )) {
        assert.ok((capabilityKeys as readonly string[]).includes(key));
        assert.ok(scores.includes(signal.target));
        assert.ok(
          Number.isFinite(signal.weight) &&
            signal.weight > 0 &&
            signal.weight <= 4,
        );
      }
    }
  }
  assert.equal(en.home.facts[0], '16 questions');
  assert.equal(en.quiz.facts[0], '16 questions');
});

test('missing, malformed, duplicate, unknown, and excessive answers fail without defaults', () => {
  for (const bad of [
    null,
    [],
    'answers',
    {},
    { ...base, experience: [] },
    { ...base, experience: 'new' },
    { ...base, experience: ['new', 'tried'] },
    { ...base, experience: ['new', 'new'] },
    { ...base, gpu: ['integrated'] },
    { ...base, gpu: [null] },
    { ...base, gaming: Array(1) },
    { ...base, extra: ['new'] },
    { ...base, 'use-cases': ['everyday', 'development', 'gaming', 'learning'] },
  ]) {
    assert.ok(validateAnswers(bad).length);
    assert.throws(() => profile(bad), InvalidAnswersError);
  }
});

test('every answer option and all one-to-three use-case combinations produce finite bounded profiles', () => {
  const check = (answers: unknown) => {
    const result = profile(answers);
    assert.deepEqual(Object.keys(result.targets), [...capabilityKeys]);
    for (const key of capabilityKeys)
      for (const value of [result.targets[key], result.importance[key]])
        assert.ok(Number.isFinite(value) && value >= 0 && value <= 5);
  };
  for (const question of questions)
    for (const option of question.options)
      check({ ...base, [question.id]: [option.id] });
  const options = questions.find(
    (question) => question.id === 'use-cases',
  )!.options;
  for (let mask = 1; mask < 2 ** options.length; mask++) {
    const selected = options
      .filter((_, index) => mask & (1 << index))
      .map((option) => option.id);
    if (selected.length <= 3) check({ ...base, 'use-cases': selected });
  }
  for (const example of Object.values(preferenceExamples)) check(example);
});

test('submission and checkbox order do not change output; builder does not mutate inputs', () => {
  const answers = {
    ...base,
    'use-cases': ['gaming', 'development', 'learning'],
  };
  const before = structuredClone(answers);
  const reversed = Object.fromEntries(
    Object.entries(answers)
      .reverse()
      .map(([id, values]) => [id, [...values].reverse()]),
  );
  assert.deepEqual(profile(answers), profile(reversed));
  assert.deepEqual(answers, before);
  const first = profile(answers);
  (first.targets as Record<string, number>).gaming = 99;
  assert.notEqual(profile(answers).targets.gaming, 99);
});

test('playful identity and final road cannot invent experience or willingness to maintain', () => {
  const result = profile({
    ...base,
    'use-cases': ['security', 'learning'],
    troubleshooting: ['learn'],
    identity: ['declarative'],
    path: ['forbidden'],
  });
  assert.equal(result.eligibility.experience, 'new');
  assert.equal(result.eligibility.maintenanceTolerance, 'low');
  assert.equal(result.eligibility.systemControl, 'low');
  assert.equal(result.eligibility.learningTolerance, 'high');
  assert.equal(result.traits.securityUseCase, true);
  assert.ok(result.traits.interests.includes('declarative-configuration'));
});

test('final path reinforces primary preferences with at most a small change', () => {
  for (const example of Object.values(preferenceExamples)) {
    const variants = questions
      .find((question) => question.id === 'path')!
      .options.map((option) => profile({ ...example, path: [option.id] }));
    for (const key of capabilityKeys) {
      const targets = variants.map((variant) => variant.targets[key]);
      assert.ok(Math.max(...targets) - Math.min(...targets) < 0.6, key);
    }
    assert.ok(
      variants.every(
        (variant) =>
          JSON.stringify(variant.eligibility) ===
          JSON.stringify(variants[0].eligibility),
      ),
    );
  }
});

test('gaming intensity is authoritative and no gaming need does not mean preferring poor gaming', () => {
  const noGaming = profile({
    ...base,
    'use-cases': ['gaming'],
    gaming: ['none'],
  });
  assert.equal(noGaming.targets.gaming, 0);
  assert.equal(noGaming.importance.gaming, 0);
  assert.ok(noGaming.traits.useCases.includes('gaming'));
  const values = ['none', 'occasional', 'important', 'main'].map(
    (id) => profile({ ...base, gaming: [id] }).importance.gaming,
  );
  assert.deepEqual(values, [0, 2, 4, 5]);
});

test('freshness, rolling, atomic, and GPU are independent; no preference remains unknown', () => {
  const neutral = profile(base);
  assert.equal(neutral.traits.wantsRolling, undefined);
  assert.equal(neutral.traits.wantsAtomic, undefined);
  assert.equal(neutral.traits.rollingStrength, 0);
  for (const patch of [
    { release: ['rolling'] },
    { 'system-model': ['containers'] },
    { gpu: ['nvidia'] },
  ])
    assert.deepEqual(profile({ ...base, ...patch }).targets, neutral.targets);
  const fixed = profile({ ...base, release: ['fixed'] });
  assert.equal(fixed.traits.wantsRolling, false);
  assert.equal(fixed.traits.rollingStrength, 2);
  const atomic = profile({ ...base, 'system-model': ['containers'] });
  assert.equal(atomic.traits.containerFirst, true);
  assert.equal(atomic.traits.wantsAtomic, true);
  assert.equal(atomic.traits.atomicStrength, 2);
});

test('experience, hardware needs, and direct preference axes progress monotonically', () => {
  const ordered = {
    experience: ['init', 'terminal', 'regular', 'tried', 'new'],
    maintenance: ['hobby', 'sometimes', 'occasional', 'minimal'],
    control: ['drive', 'understand', 'components', 'everything'],
    customization: ['defaults', 'touches', 'workflow', 'castle'],
    freshness: ['proven', 'balanced', 'modern', 'newest'],
    hardware: ['powerful', 'recent', 'aging', 'limited'],
  };
  const axes = {
    experience: 'beginnerFriendly',
    maintenance: 'lowMaintenance',
    control: 'systemControl',
    customization: 'customization',
    freshness: 'freshness',
    hardware: 'oldHardware',
  } as const;
  for (const [id, options] of Object.entries(ordered)) {
    const values = options.map(
      (option) =>
        profile({ ...base, [id]: [option] }).targets[
          axes[id as keyof typeof axes]
        ],
    );
    assert.deepEqual(
      [...values].sort((a, b) => a - b),
      values,
    );
    assert.ok(values.at(-1)! > values[0]);
  }
});

test('examples distinguish developer, desktop tinkerer, declarative learner, and old hardware needs', () => {
  const developer = profile(preferenceExamples.developer);
  const tinkerer = profile(preferenceExamples.tinkerer);
  const architect = profile(preferenceExamples.architect);
  assert.ok(
    developer.targets.developerExperience >
      profile(base).targets.developerExperience,
  );
  assert.ok(tinkerer.targets.customization > developer.targets.customization);
  assert.ok(tinkerer.targets.systemControl < tinkerer.targets.customization);
  assert.equal(architect.eligibility.maintenanceTolerance, 'low');
  assert.equal(architect.eligibility.learningTolerance, 'high');
  assert.ok(architect.traits.interests.includes('declarative-configuration'));
  assert.equal(profile(preferenceExamples.oldHardware).targets.oldHardware, 5);
  for (const interest of interests) {
    const reachable = Object.values(preferenceExamples).some((example) =>
      profile(example).traits.interests.includes(interest),
    );
    assert.ok(reachable, interest);
  }
});
