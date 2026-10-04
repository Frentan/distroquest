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

test('scalar evidence has one owning question; required direct evidence covers every option', () => {
  // Use cases and interests accumulate across questions; scalar evidence must
  // not silently depend on which question happens to come last in the schema.
  const owners: Record<string, string> = {
    'traits.wantsRolling': 'release',
    'traits.rollingStrength': 'release',
    'traits.wantsAtomic': 'system-model',
    'traits.atomicStrength': 'system-model',
    'traits.containerFirst': 'system-model',
    'traits.fossPreference': 'software-freedom',
    'traits.gpu': 'gpu',
    'traits.hardware': 'hardware',
    'traits.deviceType': 'hardware',
    'traits.freshnessIntent': 'freshness',
    'traits.desktopLayoutPreference': 'customization',
    'eligibility.experience': 'experience',
    'eligibility.maintenanceTolerance': 'maintenance',
    'eligibility.learningTolerance': 'troubleshooting',
    'eligibility.systemControl': 'control',
  };
  const required = new Set([
    'traits.fossPreference',
    'traits.gpu',
    'traits.hardware',
    'traits.freshnessIntent',
    'eligibility.experience',
    'eligibility.maintenanceTolerance',
    'eligibility.learningTolerance',
    'eligibility.systemControl',
  ]);
  const seen = new Set<string>();
  for (const question of questions) {
    for (const option of question.options) {
      const supplied = new Set<string>();
      for (const group of ['traits', 'eligibility'] as const) {
        for (const key of Object.keys(option.effects[group] ?? {})) {
          if (group === 'traits' && (key === 'useCase' || key === 'interest'))
            continue;
          const field = `${group}.${key}`;
          assert.equal(
            owners[field],
            question.id,
            `${question.id}/${option.id}: ${field}`,
          );
          supplied.add(field);
          seen.add(field);
        }
      }
      for (const field of required)
        if (owners[field] === question.id)
          assert.ok(
            supplied.has(field),
            `${question.id}/${option.id}: missing ${field}`,
          );
    }
  }
  assert.deepEqual([...seen].sort(), Object.keys(owners).sort());
});

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
  assert.equal(en.home.facts[0], '16 questions (+1 for Macs)');
  assert.equal(en.quiz.progress(1, QUESTION_COUNT), 'Question 1 of 16');
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
  assert.ok(result.traits.useCases.includes('security-testing'));
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
    customization: ['defaults', 'touches', 'familiar', 'workflow', 'castle'],
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

test('new answer labels preserve ordering and have distinct emoji within their questions', () => {
  const customization = questions.find(
    (question) => question.id === 'customization',
  )!;
  assert.deepEqual(
    customization.options.map((option) => option.id),
    ['defaults', 'touches', 'familiar', 'workflow', 'castle'],
  );
  assert.equal(customization.options[2].emoji, '🪟');
  assert.equal(
    questionContentEn.customization.options.familiar.label,
    'Familiar panels and menus, with plenty to tweak.',
  );
  const hardware = questions.find((question) => question.id === 'hardware')!;
  assert.equal(
    hardware.options.find((option) => option.id === 'handheld')!.emoji,
    '🕹️',
  );
  for (const question of [customization, hardware])
    assert.equal(
      new Set(question.options.map((option) => option.emoji)).size,
      question.options.length,
    );
});

test('layout and handheld answers do not grant control, expertise or GPU evidence', () => {
  const original = profile(base);
  const layout = profile({ ...base, customization: ['familiar'] });
  assert.equal(layout.targets.customization, 3.5);
  assert.equal(layout.traits.desktopLayoutPreference, 'panel-menu');
  assert.equal(layout.targets.systemControl, original.targets.systemControl);
  assert.deepEqual(layout.eligibility, original.eligibility);
  const handheld = profile({ ...base, hardware: ['handheld'] });
  assert.equal(handheld.traits.deviceType, 'handheld');
  assert.equal(handheld.traits.hardware, 'unspecified');
  assert.equal(handheld.targets.oldHardware, 2);
  assert.equal(handheld.traits.gpu, original.traits.gpu);
  assert.equal(handheld.targets.gaming, original.targets.gaming);
  assert.equal(original.traits.deviceType, 'desktop-or-laptop');
  assert.equal(original.traits.desktopLayoutPreference, undefined);
});

test('freshness intent comes only from its direct answer and survives secondary reinforcement', () => {
  for (const intent of ['proven', 'balanced', 'modern', 'newest']) {
    const result = profile({
      ...base,
      freshness: [intent],
      identity: ['dependable'],
      path: ['modern'],
    });
    assert.equal(result.traits.freshnessIntent, intent);
  }
});
