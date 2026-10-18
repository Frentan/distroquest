import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AnswerSet, FinalRoad } from '../src/domain/preferences.ts';
import { questions } from '../src/data/questions.ts';
import { buildPreferenceProfile } from '../src/preferences/profile.ts';
import { rankDistros, recommend } from '../src/recommendations/engine.ts';
import { recommendationPersonas as personas } from '../scripts/recommendation-personas.ts';

const advanced: AnswerSet = {
  ...personas.customizableDeveloper,
  experience: ['terminal'],
  maintenance: ['hobby'],
  control: ['everything'],
  troubleshooting: ['learn'],
};
const roads: readonly FinalRoad[] = [
  'comfortable',
  'modern',
  'artisan',
  'explorer',
  'forbidden',
];

test('the final road survives normalization without supplying qualifications or traits', () => {
  assert.deepEqual(
    [...roads].sort(),
    questions
      .find((q) => q.id === 'path')!
      .options.map((o) => o.id)
      .sort(),
  );
  for (const base of [personas.beginner, advanced]) {
    const evidence = buildPreferenceProfile(base);
    for (const road of roads) {
      const answers = { ...base, path: [road] };
      const built = buildPreferenceProfile(answers);
      const result = recommend(answers);
      assert.equal(built.finalRoad, road);
      assert.equal(result.profile.finalRoad, road);
      assert.deepEqual(built.eligibility, evidence.eligibility);
      assert.deepEqual(built.traits, evidence.traits);
      for (const [key, value] of Object.entries(result.profile.capabilities)) {
        const capability = key as keyof typeof built.targets;
        assert.equal(value.target, built.targets[capability]);
        assert.equal(value.weight, built.importance[capability] / 5);
        assert.ok(value.weight >= 0 && value.weight <= 1);
      }
    }
  }
});

test('each qualification is independently necessary, including all moderate/high boundaries', () => {
  for (const experience of ['new', 'tried', 'regular', 'terminal', 'init']) {
    for (const maintenance of ['minimal', 'occasional', 'sometimes', 'hobby']) {
      for (const control of [
        'drive',
        'understand',
        'components',
        'everything',
      ]) {
        for (const troubleshooting of [
          'distress',
          'search',
          'investigate',
          'learn',
        ]) {
          const qualifies =
            ['terminal', 'init'].includes(experience) &&
            maintenance === 'hobby' &&
            ['components', 'everything'].includes(control) &&
            troubleshooting === 'learn';
          for (const road of roads) {
            const result = recommend({
              ...advanced,
              experience: [experience],
              maintenance: [maintenance],
              control: [control],
              troubleshooting: [troubleshooting],
              path: [road],
            });
            // Disable only the new interaction; retain this answer set's targets.
            const neutral = rankDistros({
              ...result.profile,
              finalRoad: 'modern',
            });
            if (!qualifies || road === 'comfortable' || road === 'modern') {
              assert.deepEqual(result.ranking, neutral);
            } else {
              assert.notDeepEqual(result.ranking, neutral);
              for (const row of result.ranking) {
                const before = neutral.find(
                  (r) => r.distroId === row.distroId,
                )!;
                assert.equal(row.eligible, before.eligible);
                assert.deepEqual(row.constraints, before.constraints);
                assert.deepEqual(row.traitModifiers, before.traitModifiers);
                assert.deepEqual(
                  row.specialistModifiers,
                  before.specialistModifiers,
                );
                assert.equal(row.breadthAdjustment, before.breadthAdjustment);
              }
            }
          }
        }
      }
    }
  }
});

test('qualified final roads resolve the reviewed advanced profile with bounded margins', () => {
  const expected = {
    comfortable: ['fedora-kde', 'opensuse-tumbleweed', 'arch-linux'],
    modern: ['fedora-kde', 'opensuse-tumbleweed', 'arch-linux'],
    explorer: ['fedora-kde', 'opensuse-tumbleweed', 'arch-linux'],
    artisan: ['fedora-kde', 'arch-linux', 'opensuse-tumbleweed'],
    forbidden: ['arch-linux', 'fedora-kde', 'opensuse-tumbleweed'],
  };
  const multipliers = {
    comfortable: 1,
    modern: 1,
    explorer: 1.25,
    artisan: 1.5,
    forbidden: 2,
  };
  for (const road of roads) {
    const result = recommend({ ...advanced, path: [road] });
    assert.equal(result.modelVersion, 16);
    assert.deepEqual(
      result.ranking.slice(0, 3).map((r) => r.distroId),
      expected[road],
    );
    for (const row of result.ranking) {
      const control = row.capabilityMatches.find(
        (m) => m.capability === 'systemControl',
      )!;
      assert.equal(
        control.weight,
        result.profile.capabilities.systemControl.weight * multipliers[road],
      );
      assert.ok(row.capabilityScore <= 100 + 1e-10);
      if (row.eligible) assert.ok(row.rawScore <= 116 + 1e-10);
    }
    const margin = result.ranking[0].rawScore - result.ranking[1].rawScore;
    if (road === 'artisan') assert.ok(margin > 0.41 && margin < 0.43);
    if (road === 'forbidden') assert.ok(margin > 1.09 && margin < 1.11);
  }
});

test('Forbidden still respects conservative software, NVIDIA, and specialist requirements', () => {
  for (const [changes, winner] of [
    [{ freshness: ['proven'] }, 'debian'],
    [{ gpu: ['nvidia'] }, 'fedora-kde'],
    [{ maintenance: ['minimal'] }, 'fedora-kde'],
  ] as const) {
    assert.equal(
      recommend({ ...advanced, ...changes, path: ['forbidden'] }).ranking[0]
        .distroId,
      winner,
    );
  }
  const aspirational = recommend({
    ...personas.highControl,
    experience: ['new'],
  });
  for (const id of [
    'arch-linux',
    'gentoo',
    'void-linux',
    'slackware',
    'alpine-linux',
    'nixos',
    'kali-linux',
  ]) {
    assert.equal(
      aspirational.ranking.find((r) => r.distroId === id)!.eligible,
      false,
    );
  }
  assert.equal(
    recommend({ ...advanced, path: ['forbidden'] }).ranking.find(
      (r) => r.distroId === 'kali-linux',
    )!.eligible,
    false,
  );
});

test('control priority composes with resource and self-build weights while retaining polish cautions', () => {
  const result = recommend({
    ...personas.highControl,
    hardware: ['limited'],
    customization: ['defaults'],
  });
  const input = structuredClone(result.profile);
  for (const row of result.ranking) {
    const matches = Object.fromEntries(
      row.capabilityMatches.map((m) => [m.capability, m]),
    );
    assert.equal(
      matches.systemControl.weight,
      result.profile.capabilities.systemControl.weight * 2,
    );
    assert.equal(
      matches.oldHardware.weight,
      result.profile.capabilities.oldHardware.weight * 1.5,
    );
    assert.equal(
      matches.desktopPolish.weight,
      result.profile.capabilities.desktopPolish.weight * 0.5,
    );
    assert.ok(
      row.cautions.includes('capability.desktopPolish.shortfall') ||
        matches.desktopPolish.effectiveDistance === 0,
    );
  }
  rankDistros(result.profile);
  assert.deepEqual(result.profile, input);
  const polished = recommend({
    ...personas.highControl,
    customization: ['defaults'],
  });
  assert.equal(polished.ranking[0].distroId, 'arch-linux');
  assert.ok(
    polished.ranking[0].cautions.includes('capability.desktopPolish.shortfall'),
  );
});

test('all 20 reviewed canonical persona winners are preserved', () => {
  const winners = {
    beginner: 'linux-mint',
    windowsGamer: 'bazzite',
    customizableDeveloper: 'fedora-kde',
    oldLaptop: 'linux-mint',
    rollingEnthusiast: 'opensuse-tumbleweed',
    highControl: 'arch-linux',
    declarative: 'nixos',
    gamingFirst: 'bazzite',
    gamingAppliance: 'bazzite',
    atomicDeveloper: 'bluefin',
    penetrationTester: 'kali-linux',
    securityCurious: 'linux-mint',
    foss: 'fedora-kde',
    conservative: 'debian',
    unixAdministrator: 'slackware',
    polishedSimpleDesktop: 'elementary-os',
    simpleRollingDesktop: 'solus',
    rollingGamingDesktop: 'garuda-linux',
    minimalOldLaptop: 'void-linux',
    minimalLearningDesktop: 'alpine-linux',
  } satisfies Record<keyof typeof personas, string>;
  for (const name of Object.keys(personas) as (keyof typeof personas)[]) {
    assert.equal(
      recommend(personas[name]).ranking[0].distroId,
      winners[name],
      name,
    );
  }
});
