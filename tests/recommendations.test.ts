import assert from 'node:assert/strict';
import { test } from 'node:test';
import { capabilityKeys, distroIds } from '../src/domain/distro.ts';
import type {
  DistroProfile,
  RecommendationCondition,
} from '../src/domain/distro.ts';
import type { RecommendationProfile } from '../src/domain/recommendations.ts';
import { distroProfiles } from '../src/data/distros.ts';
import { questions } from '../src/data/questions.ts';
import {
  buildPreferenceProfile,
  InvalidAnswersError,
} from '../src/preferences/profile.ts';
import {
  capabilitySimilarity,
  matchesCondition,
  normalizePreferenceProfile,
  rankDistros,
  recommend,
  scoreDistro,
  scoringRules,
} from '../src/recommendations/engine.ts';
import { recommendationPersonas as personas } from '../scripts/recommendation-personas.ts';
import {
  formatRankingTable,
  formatExampleRankings,
  reviewRecommendations,
} from '../scripts/review-recommendations.ts';

const get = (name: keyof typeof personas, id: string) =>
  recommend(personas[name]).ranking.find((row) => row.distroId === id)!;
const top = (name: keyof typeof personas, n: number) =>
  recommend(personas[name])
    .ranking.slice(0, n)
    .map((row) => row.distroId);
const within = (
  name: keyof typeof personas,
  ids: readonly string[],
  n: number,
) => {
  for (const id of ids)
    assert.ok(
      top(name, n).includes(id as (typeof distroIds)[number]),
      `${name}: ${id} missing from top ${n}`,
    );
};
const outside = (
  name: keyof typeof personas,
  ids: readonly string[],
  n: number,
) => {
  for (const id of ids)
    assert.ok(
      !top(name, n).includes(id as (typeof distroIds)[number]),
      `${name}: ${id} unexpectedly in top ${n}`,
    );
};

test('beginner: broad convenient desktops; specialist/manual systems stay away', () => {
  within('beginner', ['linux-mint', 'ubuntu', 'fedora-workstation'], 3);
  outside(
    'beginner',
    ['kali-linux', 'gentoo', 'alpine-linux', 'slackware', 'arch-linux'],
    10,
  );
});
test('Windows gaming migrant: accessible gaming and NVIDIA support', () => {
  within('windowsGamer', ['bazzite', 'pop-os', 'fedora-workstation'], 5);
  outside('windowsGamer', ['kali-linux', 'gentoo', 'alpine-linux'], 10);
});
test('experienced customizable-desktop developer: customization, freshness and development', () => {
  within('customizableDeveloper', ['fedora-kde', 'opensuse-tumbleweed'], 3);
  outside('customizableDeveloper', ['gentoo', 'slackware', 'alpine-linux'], 10);
});
test('beginner old laptop: MX and Debian near the top; heavy gaming options fall', () => {
  within('oldLaptop', ['mx-linux', 'debian'], 3);
  outside('oldLaptop', ['bazzite', 'cachyos', 'garuda-linux', 'bluefin'], 6);
});
test('rolling enthusiast: rolling candidates dominate', () => {
  within(
    'rollingEnthusiast',
    ['opensuse-tumbleweed', 'endeavouros', 'arch-linux'],
    5,
  );
  outside('rollingEnthusiast', ['linux-mint', 'ubuntu', 'bluefin'], 8);
});
test('high-control expert: Arch, Gentoo and Void are justified', () => {
  within('highControl', ['arch-linux', 'gentoo', 'void-linux'], 4);
  outside('highControl', ['bazzite', 'bluefin', 'zorin-os'], 10);
});
test('declarative/reproducibility user: NixOS strongly favored', () => {
  within('declarative', ['nixos'], 2);
  assert.equal(get('declarative', 'nixos').eligibilityAdjustment, 2);
  assert.ok(
    get('declarative', 'nixos').reasons.includes('workflow.declarative'),
  );
});
test('gaming-first user: gaming-focused distributions near the top', () => {
  within('gamingFirst', ['bazzite', 'nobara'], 3);
  outside('gamingFirst', ['kali-linux', 'slackware', 'alpine-linux'], 10);
});

test('the assessed Garuda Gaming setup distinguishes maximum-intensity rolling gaming', () => {
  assert.equal(top('rollingGamingDesktop', 1)[0], 'garuda-linux');
  const full = recommend(personas.rollingGamingDesktop);
  const lower = recommend({
    ...personas.rollingGamingDesktop,
    gaming: ['important'],
  });
  assert.ok(
    lower.ranking.findIndex((row) => row.distroId === 'cachyos') <
      lower.ranking.findIndex((row) => row.distroId === 'garuda-linux'),
  );
  const garuda = full.ranking[0];
  assert.ok(garuda.rawScore - full.ranking[1].rawScore > 3);
  assert.equal(top('gamingFirst', 1)[0], 'bazzite');
  assert.equal(top('gamingAppliance', 1)[0], 'bazzite');
});
test('gaming appliance: Bazzite favored by gaming, convenience and atomic preference', () => {
  within('gamingAppliance', ['bazzite'], 2);
  assert.ok(get('gamingAppliance', 'bazzite').reasons.includes('atomic.match'));
});
test('atomic/container-first developer: Bluefin strongly favored', () => {
  within('atomicDeveloper', ['bluefin'], 2);
  assert.ok(
    get('atomicDeveloper', 'bluefin').rawScore >
      get('atomicDeveloper', 'bazzite').rawScore,
  );
  outside('atomicDeveloper', ['nixos', 'arch-linux', 'gentoo'], 8);
});
test('genuine penetration tester: Kali is eligible and ranks highly', () => {
  assert.equal(top('penetrationTester', 1)[0], 'kali-linux');
  assert.equal(get('penetrationTester', 'kali-linux').eligible, true);
});

test('qualified security intent has separate credit even when general traits are capped', () => {
  const result = recommend(personas.penetrationTester);
  assert.equal(result.modelVersion, 10);
  const kali = result.ranking[0];
  assert.equal(kali.distroId, 'kali-linux');
  assert.equal(kali.traitAdjustment, 12);
  assert.ok(
    kali.traitModifiers.some((modifier) => modifier.code === 'traits.cap'),
  );
  assert.equal(kali.specialistAdjustment, 4);
  assert.deepEqual(kali.specialistModifiers, [
    { code: 'specialist.security-testing', points: 4 },
  ]);
  assert.ok(kali.rawScore >= 109 && kali.rawScore <= 112);
  assert.ok(kali.normalizedScore >= 94 && kali.normalizedScore <= 96);
  assert.ok(kali.rawScore - result.ranking[1].rawScore > 3);
  assert.ok(
    result.ranking.slice(1).every((row) => row.specialistAdjustment === 0),
  );

  for (const release of ['either', 'rolling']) {
    for (const system of ['either', 'traditional']) {
      const rows = recommend({
        ...personas.penetrationTester,
        release: [release],
        'system-model': [system],
      }).ranking;
      const row = rows.find(
        (candidate) => candidate.distroId === 'kali-linux',
      )!;
      assert.equal(row.specialistAdjustment, 4);
      assert.equal(rows[0].distroId, 'kali-linux');
    }
  }
  const source = distroProfiles.find((distro) => distro.id === 'kali-linux')!;
  assert.equal(
    scoreDistro(result.profile, { ...source, id: 'debian' })
      .specialistAdjustment,
    4,
  );
});

test('specialist intent cannot grant eligibility or arise from aspiration or broad purposes', () => {
  for (const experience of ['new', 'tried', 'regular', 'terminal', 'init']) {
    const result = recommend({
      ...personas.penetrationTester,
      experience: [experience],
    });
    const kali = result.ranking.find((row) => row.distroId === 'kali-linux')!;
    const qualified = !['new', 'tried'].includes(experience);
    assert.equal(kali.eligible, qualified);
    assert.equal(kali.specialistAdjustment, qualified ? 4 : 0);
    if (!qualified) assert.equal(kali.normalizedScore, 0);
  }
  for (const answers of [personas.highControl, personas.securityCurious]) {
    assert.ok(
      recommend(answers).ranking.every((row) => row.specialistAdjustment === 0),
    );
  }
  assert.deepEqual(top('securityCurious', 3), [
    'linux-mint',
    'ubuntu',
    'fedora-workstation',
  ]);
});

test('handheld gaming specialist credit needs gaming intensity and a documented gaming path', () => {
  for (const gaming of ['occasional', 'important', 'main', 'none']) {
    const result = recommend({ ...personas.gamingAppliance, gaming: [gaming] });
    const bazzite = result.ranking.find((row) => row.distroId === 'bazzite')!;
    assert.equal(bazzite.specialistAdjustment, gaming === 'none' ? 0 : 2);
    assert.deepEqual(
      bazzite.specialistModifiers,
      gaming === 'none'
        ? []
        : [{ code: 'specialist.handheld-gaming', points: 2 }],
    );
    assert.ok(
      result.ranking
        .filter((row) => row !== bazzite)
        .every((row) => row.specialistAdjustment === 0),
    );
  }
  assert.equal(get('gamingFirst', 'bazzite').specialistAdjustment, 0);
  const profile = recommend(personas.gamingAppliance).profile;
  const distro = distroProfiles.find((row) => row.id === 'bazzite')!;
  assert.equal(
    scoreDistro(profile, { ...distro, id: 'debian' }).specialistAdjustment,
    2,
  );
  for (const traits of [
    { ...distro.traits, handheldSupport: 'unassessed' as const },
    { ...distro.traits, focus: { ...distro.traits.focus, gaming: false } },
  ])
    assert.equal(
      scoreDistro(profile, { ...distro, traits }).specialistAdjustment,
      0,
    );
});

test('container development specialist credit needs both explicit intents and an assessed workflow', () => {
  const bluefin = get('atomicDeveloper', 'bluefin');
  assert.deepEqual(bluefin.specialistModifiers, [
    { code: 'specialist.container-development', points: 2 },
  ]);
  assert.equal(get('atomicDeveloper', 'bazzite').specialistAdjustment, 0);
  assert.equal(get('atomicDeveloper', 'nixos').specialistAdjustment, 0);
  for (const answers of [
    { ...personas.atomicDeveloper, 'use-cases': ['homelab'] },
    { ...personas.atomicDeveloper, 'system-model': ['protected'] },
    { ...personas.atomicDeveloper, 'system-model': ['traditional'] },
  ])
    assert.ok(
      recommend(answers).ranking.every((row) => row.specialistAdjustment === 0),
    );
  const profile = recommend(personas.atomicDeveloper).profile;
  const distro = distroProfiles.find((row) => row.id === 'bluefin')!;
  assert.equal(
    scoreDistro(profile, { ...distro, id: 'debian' }).specialistAdjustment,
    2,
  );
  for (const traits of [
    { ...distro.traits, systemModel: 'declarative' as const },
    { ...distro.traits, focus: { ...distro.traits.focus, development: false } },
  ])
    assert.equal(
      scoreDistro(profile, { ...distro, traits }).specialistAdjustment,
      0,
    );
});

test('new specialist matches remain outside the trait cap and cannot bypass requirements', () => {
  for (const [name, id] of [
    ['gamingAppliance', 'bazzite'],
    ['atomicDeveloper', 'bluefin'],
  ] as const) {
    const profile = recommend({
      ...personas[name],
      'system-model': ['containers'],
      'use-cases': ['gaming', 'development', 'creative'],
      gpu: ['nvidia'],
    }).profile;
    const distro = distroProfiles.find((row) => row.id === id)!;
    const row = scoreDistro(profile, distro);
    assert.equal(row.traitAdjustment, 12);
    assert.equal(row.specialistAdjustment, 2);
    const excluded = scoreDistro(profile, {
      ...distro,
      recommendation: {
        ...distro.recommendation,
        constraints: [
          {
            effect: 'require',
            allOf: [{ kind: 'use-case', value: 'security-testing' }],
          },
        ],
      },
    });
    assert.equal(excluded.eligible, false);
    assert.equal(excluded.specialistAdjustment, 0);
    assert.equal(excluded.normalizedScore, 0);
  }
});

test('the current roster fits the fixed normalization ceiling before clamping', () => {
  const profile = recommend(personas.penetrationTester).profile;
  const allSpecialistIntents: RecommendationProfile = {
    ...profile,
    capabilities: { ...profile.capabilities, gaming: { target: 5, weight: 1 } },
    traits: {
      ...profile.traits,
      containerFirst: true,
      deviceType: 'handheld',
      useCases: [...profile.traits.useCases, 'development'],
    },
  };
  for (const distro of distroProfiles) {
    const positiveConstraints =
      distro.recommendation.constraints.filter(
        (constraint) => constraint.effect === 'strongly-prefer',
      ).length * scoringRules.satisfiedSoftConstraint;
    const maximum =
      100 +
      scoringRules.traitLimit +
      positiveConstraints +
      (scoringRules.breadthMaximum * distro.recommendation.breadth) / 5 +
      scoreDistro(allSpecialistIntents, distro).specialistAdjustment;
    assert.ok(
      maximum <= scoringRules.normalizationMaximum,
      `${distro.id}: theoretical upper bound ${maximum}`,
    );
  }
});
test('beginner curious about security: aspirations cannot unlock Kali', () => {
  assert.equal(get('securityCurious', 'kali-linux').eligible, false);
  assert.equal(get('securityCurious', 'kali-linux').normalizedScore, 0);
  const ranking = recommend(personas.securityCurious).ranking;
  const kaliIndex = ranking.findIndex((row) => row.distroId === 'kali-linux');
  assert.ok(ranking.every((row, index) => !row.eligible || index < kaliIndex));
  outside('securityCurious', ['gentoo', 'alpine-linux', 'slackware'], 10);
});
test('FOSS-focused user: free-software-first choices rank well', () => {
  within(
    'foss',
    ['fedora-kde', 'fedora-workstation', 'opensuse-tumbleweed'],
    3,
  );
  assert.ok(
    get('foss', 'fedora-kde').reasons.includes(
      'software-policy.free-software-first',
    ),
  );
});
test('conservative stability user: Debian/Mint/MX favored', () => {
  within('conservative', ['debian', 'linux-mint', 'mx-linux'], 3);
  outside('conservative', ['arch-linux', 'cachyos', 'garuda-linux'], 10);
});
test('manual Unix administrator: Slackware is an appropriate high recommendation', () => {
  within('unixAdministrator', ['slackware'], 3);
  assert.equal(get('unixAdministrator', 'slackware').eligibilityAdjustment, 2);
});

test('normalized profile preserves targets/relative importance and isolates returned data', () => {
  for (const answers of Object.values(personas)) {
    const source = buildPreferenceProfile(answers);
    const normalized = normalizePreferenceProfile(source);
    for (const key of capabilityKeys) {
      assert.equal(normalized.capabilities[key].target, source.targets[key]);
      assert.equal(
        normalized.capabilities[key].weight,
        source.importance[key] / 5,
      );
      assert.ok(
        normalized.capabilities[key].weight >= 0 &&
          normalized.capabilities[key].weight <= 1,
      );
    }
    assert.deepEqual(normalized.traits, source.traits);
    assert.deepEqual(normalized.eligibility, source.eligibility);
  }
  const source = buildPreferenceProfile(personas.beginner);
  const normalized = normalizePreferenceProfile(source);
  assert.notEqual(normalized.traits.useCases, source.traits.useCases);
});

test('similarity has understandable distance semantics; surplus benefits never hurt', () => {
  assert.ok(Math.abs(capabilitySimilarity('freshness', 1, 5) - 0.2) < 1e-12);
  assert.equal(
    capabilitySimilarity('freshness', 5, 1),
    capabilitySimilarity('freshness', 1, 5),
  );
  assert.equal(capabilitySimilarity('gaming', 5, 0), 0);
  assert.equal(capabilitySimilarity('gaming', 0, 5), 1);
  assert.equal(capabilitySimilarity('beginnerFriendly', 1, 5), 1);
  assert.equal(capabilitySimilarity('lowMaintenance', 4, 3), 0.8);
});

test('known weighted example gives 75 capability points; zero weights are ignored', () => {
  const base = recommend(personas.beginner).profile;
  const capabilities = Object.fromEntries(
    capabilityKeys.map((key) => [key, { target: 0, weight: 0 }]),
  ) as RecommendationProfile['capabilities'];
  const profile = {
    ...base,
    traits: { ...base.traits, freshnessIntent: 'proven' as const },
    capabilities: {
      ...capabilities,
      gaming: { target: 5, weight: 1 },
      freshness: { target: 1, weight: 1 },
    },
  };
  const distro = {
    ...distroProfiles[0],
    capabilities: {
      ...distroProfiles[0].capabilities,
      gaming: 5,
      freshness: 3.5,
    },
  } satisfies DistroProfile;
  assert.equal(scoreDistro(profile, distro).capabilityScore, 75);
  assert.equal(
    scoreDistro({ ...base, capabilities }, distro).capabilityScore,
    0,
  );
});

test('every persona has curated unique scores with finite reconstructable diagnostics', () => {
  for (const answers of Object.values(personas)) {
    const result = recommend(answers);
    assert.deepEqual(
      [...result.ranking.map((row) => row.distroId)].sort(),
      [...distroIds].sort(),
    );
    for (const row of result.ranking) {
      assert.ok(Number.isFinite(row.rawScore));
      assert.ok(row.normalizedScore >= 0 && row.normalizedScore <= 100);
      assert.ok(row.capabilityScore >= 0 && row.capabilityScore <= 100 + 1e-10);
      assert.ok(Math.abs(row.traitAdjustment) <= scoringRules.traitLimit);
      assert.ok(row.breadthAdjustment >= 0 && row.breadthAdjustment <= 2);
      assert.equal(row.capabilityMatches.length, 10);
      assert.equal(
        row.rawScore,
        row.capabilityScore +
          row.traitAdjustment +
          row.specialistAdjustment +
          row.eligibilityAdjustment +
          row.breadthAdjustment,
      );
      assert.equal(
        row.specialistAdjustment,
        row.specialistModifiers.reduce(
          (sum, modifier) => sum + modifier.points,
          0,
        ),
      );
      assert.ok(
        Math.abs(
          row.traitAdjustment -
            row.traitModifiers.reduce(
              (sum, modifier) => sum + modifier.points,
              0,
            ),
        ) < 1e-10,
      );
      assert.ok(row.reasons.length);
    }
    for (let index = 1; index < result.ranking.length; index++) {
      const a = result.ranking[index - 1],
        b = result.ranking[index];
      assert.ok(a.eligible || !b.eligible);
      if (a.eligible === b.eligible) assert.ok(a.rawScore >= b.rawScore);
    }
  }
});

test('ranking is deterministic, independent of answer order, and never mutates inputs/data', () => {
  const answers = structuredClone(personas.atomicDeveloper);
  const before = structuredClone(answers);
  const dataBefore = structuredClone(distroProfiles);
  const reversed = Object.fromEntries(
    Object.entries(answers)
      .reverse()
      .map(([key, values]) => [key, [...values].reverse()]),
  );
  assert.deepEqual(recommend(answers), recommend(reversed));
  assert.deepEqual(recommend(answers), recommend(answers));
  const profile = recommend(answers).profile;
  const profileBefore = structuredClone(profile);
  assert.deepEqual(rankDistros(profile), rankDistros(profile));
  assert.deepEqual(profile, profileBefore);
  assert.deepEqual(answers, before);
  assert.deepEqual(distroProfiles, dataBefore);
  assert.throws(() => recommend({}), InvalidAnswersError);
});

// Construct witnesses for every condition, then independently remove each one.
function satisfy(
  profile: RecommendationProfile,
  condition: RecommendationCondition,
): RecommendationProfile {
  switch (condition.kind) {
    case 'experience':
      return {
        ...profile,
        eligibility: { ...profile.eligibility, experience: condition.minimum },
      };
    case 'maintenance-tolerance':
      return {
        ...profile,
        eligibility: {
          ...profile.eligibility,
          maintenanceTolerance: condition.minimum,
        },
      };
    case 'learning-tolerance':
      return {
        ...profile,
        eligibility: {
          ...profile.eligibility,
          learningTolerance: condition.minimum,
        },
      };
    case 'system-control':
      return {
        ...profile,
        eligibility: {
          ...profile.eligibility,
          systemControl: condition.minimum,
        },
      };
    case 'use-case':
      return {
        ...profile,
        traits: {
          ...profile.traits,
          useCases: [...profile.traits.useCases, condition.value],
        },
      };
    case 'interest':
      return {
        ...profile,
        traits: {
          ...profile.traits,
          interests: [...profile.traits.interests, condition.value],
        },
      };
  }
}
function fail(
  profile: RecommendationProfile,
  condition: RecommendationCondition,
): RecommendationProfile {
  switch (condition.kind) {
    case 'experience':
      return {
        ...profile,
        eligibility: { ...profile.eligibility, experience: 'beginner' },
      };
    case 'maintenance-tolerance':
      return {
        ...profile,
        eligibility: { ...profile.eligibility, maintenanceTolerance: 'low' },
      };
    case 'learning-tolerance':
      return {
        ...profile,
        eligibility: { ...profile.eligibility, learningTolerance: 'low' },
      };
    case 'system-control':
      return {
        ...profile,
        eligibility: { ...profile.eligibility, systemControl: 'low' },
      };
    case 'use-case':
      return {
        ...profile,
        traits: {
          ...profile.traits,
          useCases: profile.traits.useCases.filter(
            (value) => value !== condition.value,
          ),
        },
      };
    case 'interest':
      return {
        ...profile,
        traits: {
          ...profile.traits,
          interests: profile.traits.interests.filter(
            (value) => value !== condition.value,
          ),
        },
      };
  }
}
test('all stored constraints are conjunctive; each missing condition is independently explained', () => {
  for (const distro of distroProfiles) {
    for (const [
      index,
      constraint,
    ] of distro.recommendation.constraints.entries()) {
      const satisfied = constraint.allOf.reduce(
        satisfy,
        recommend(personas.beginner).profile,
      );
      assert.equal(
        scoreDistro(satisfied, distro).constraints[index].matched,
        true,
      );
      for (const condition of constraint.allOf) {
        assert.equal(matchesCondition(satisfied, condition), true);
        const broken = fail(satisfied, condition);
        assert.equal(matchesCondition(broken, condition), false);
        const score = scoreDistro(broken, distro);
        assert.equal(score.constraints[index].matched, false);
        assert.ok(score.eligibilityAdjustment < 0);
        assert.equal(
          score.eligible,
          score.constraints.every(
            (outcome, constraintIndex) =>
              distro.recommendation.constraints[constraintIndex].effect !==
                'require' || outcome.matched,
          ),
        );
        assert.ok(
          score.cautions.some((code) => code.startsWith('constraint.')),
        );
      }
    }
  }
});

test('Kali requires both genuine security intent and experience, including at the intermediate boundary', () => {
  for (const experience of ['new', 'tried', 'regular', 'terminal', 'init']) {
    for (const security of [false, true]) {
      const row = recommend({
        ...personas.beginner,
        experience: [experience],
        'use-cases': [security ? 'security' : 'everyday'],
      }).ranking.find((row) => row.distroId === 'kali-linux')!;
      assert.equal(
        row.eligible,
        security && ['regular', 'terminal', 'init'].includes(experience),
      );
    }
  }
});

test('manual desktops enforce only minimum experience, upkeep and control through quiz answers', () => {
  const ids = [
    'arch-linux',
    'gentoo',
    'slackware',
    'void-linux',
    'alpine-linux',
  ];
  for (const experience of ['new', 'tried', 'regular', 'terminal', 'init'])
    for (const maintenance of ['minimal', 'occasional', 'sometimes', 'hobby'])
      for (const control of [
        'drive',
        'understand',
        'components',
        'everything',
      ]) {
        const result = recommend({
          ...personas.highControl,
          experience: [experience],
          maintenance: [maintenance],
          control: [control],
        });
        const expected =
          !['new', 'tried'].includes(experience) &&
          maintenance !== 'minimal' &&
          control !== 'drive';
        for (const id of ids) {
          const row = result.ranking.find(
            (candidate) => candidate.distroId === id,
          )!;
          assert.equal(
            row.eligible,
            expected,
            `${id}: ${experience}/${maintenance}/${control}`,
          );
          if (!expected) {
            assert.equal(row.normalizedScore, 0);
            assert.equal(
              row.constraints.filter(
                (constraint) => constraint.effect === 'require',
              ).length,
              1,
            );
            assert.ok(row.cautions.includes('eligibility.excluded'));
          }
        }
      }
});

test('NixOS minimum learning evidence is independent of upkeep and control preferences', () => {
  for (const experience of ['new', 'tried', 'regular', 'terminal', 'init'])
    for (const troubleshooting of [
      'distress',
      'search',
      'investigate',
      'learn',
    ])
      for (const maintenance of [
        'minimal',
        'occasional',
        'sometimes',
        'hobby',
      ]) {
        const row = recommend({
          ...personas.declarative,
          experience: [experience],
          troubleshooting: [troubleshooting],
          maintenance: [maintenance],
          control: ['drive'],
        }).ranking.find((candidate) => candidate.distroId === 'nixos')!;
        const expected =
          !['new', 'tried'].includes(experience) &&
          troubleshooting !== 'distress';
        assert.equal(row.eligible, expected);
        if (!expected) assert.equal(row.normalizedScore, 0);
        if (expected && troubleshooting !== 'learn')
          assert.ok(
            row.constraints.some(
              (constraint) =>
                constraint.effect === 'strongly-prefer' && !constraint.matched,
            ),
          );
      }
});

test('specialist interests cannot bypass newcomer experience requirements', () => {
  for (const experience of ['new', 'tried'])
    for (const identity of ['minimal', 'declarative', 'unix', 'understand']) {
      const result = recommend({
        ...personas.highControl,
        experience: [experience],
        identity: [identity],
        path: ['forbidden'],
        'use-cases': ['learning', 'development', 'security'],
      });
      for (const id of [
        'arch-linux',
        'gentoo',
        'slackware',
        'void-linux',
        'alpine-linux',
        'nixos',
      ])
        assert.equal(
          result.ranking.find((row) => row.distroId === id)!.eligible,
          false,
        );
      assert.equal(
        result.profile.eligibility.experience,
        experience === 'new' ? 'new' : 'beginner',
      );
    }
});

test('Gentoo soft preferences remain distinct from minimum eligibility', () => {
  assert.equal(get('beginner', 'gentoo').eligibilityAdjustment, -124);
  assert.equal(get('highControl', 'gentoo').eligibilityAdjustment, 2);
  const profile = recommend(personas.highControl).profile;
  for (const condition of distroProfiles.find(
    (distro) => distro.id === 'gentoo',
  )!.recommendation.constraints[0].allOf)
    assert.equal(
      scoreDistro(
        fail(profile, condition),
        distroProfiles.find((distro) => distro.id === 'gentoo')!,
      ).constraints[0].adjustment,
      -8,
    );
});

test('breadth is only a two-point prior; family grouping does not change core scores', () => {
  const profile = recommend(personas.customizableDeveloper).profile;
  const distro = distroProfiles[0];
  const broad = scoreDistro(profile, {
    ...distro,
    recommendation: { ...distro.recommendation, breadth: 5 },
  });
  const niche = scoreDistro(profile, {
    ...distro,
    recommendation: { ...distro.recommendation, breadth: 0 },
  });
  assert.equal(broad.rawScore - niche.rawScore, 2);
  assert.equal(broad.capabilityScore, niche.capabilityScore);
  const workstation = get('customizableDeveloper', 'fedora-workstation');
  const kde = get('customizableDeveloper', 'fedora-kde');
  assert.equal(workstation.presentationGroup, kde.presentationGroup);
  assert.notEqual(
    kde.presentationGroup,
    get('customizableDeveloper', 'bazzite').presentationGroup,
  );
  assert.equal(kde.family, 'fedora');
  const reidentified = scoreDistro(profile, { ...distro, id: 'fedora-kde' });
  assert.equal(reidentified.rawScore, scoreDistro(profile, distro).rawScore);
});

test('trait adjustments are capped and evidence-specific; neutral answers invent no preference', () => {
  const neutral = get('beginner', 'linux-mint');
  assert.ok(
    !neutral.traitModifiers.some((modifier) =>
      /release|atomic|nvidia|containers/.test(modifier.code),
    ),
  );
  const capped = get('declarative', 'nixos');
  assert.equal(capped.traitAdjustment, 12);
  assert.ok(
    capped.traitModifiers.some((modifier) => modifier.code === 'traits.cap'),
  );
  const result = recommend({ ...personas.windowsGamer, gaming: ['none'] });
  assert.ok(
    result.ranking.every((row) => !row.reasons.includes('focus.gaming')),
  );
});

test('every questionnaire option remains scoreable through the real answer boundary', () => {
  for (const question of questions)
    for (const option of question.options) {
      const result = recommend({
        ...personas.beginner,
        [question.id]: [option.id],
      });
      assert.equal(result.ranking.length, distroIds.length);
      assert.ok(result.ranking.every((row) => Number.isFinite(row.rawScore)));
    }
});

test('development helper prints all score components and supports personas/JSON/errors', () => {
  const table = formatRankingTable(recommend(personas.beginner));
  assert.equal(table.split('\n').length, distroIds.length + 2);
  assert.ok(table.includes('Eligibility | Breadth'));
  assert.ok(table.includes('kali-linux | false'));
  const json = JSON.parse(
    reviewRecommendations(['--persona', 'atomicDeveloper', '--json']),
  );
  assert.equal(json.atomicDeveloper.ranking.length, distroIds.length);
  assert.throws(() => reviewRecommendations(['--persona', 'missing']));
  assert.throws(() => reviewRecommendations(['--persona']));
  assert.throws(() =>
    reviewRecommendations(['--persona', 'beginner', '--answers', 'file.json']),
  );
  assert.throws(() => reviewRecommendations(['--json', '--json']));
});

test('returned diagnostics do not expose mutable references into distro constraints', () => {
  const first = recommend(personas.beginner);
  const kali = first.ranking.find((row) => row.distroId === 'kali-linux')!;
  const original = structuredClone(distroProfiles);
  Object.assign(kali.constraints[0].conditions[0].condition, {
    value: 'general-desktop',
  });
  assert.deepEqual(distroProfiles, original);
  assert.equal(get('beginner', 'kali-linux').eligible, false);
});

test('ties use stable distro IDs and normalization preserves eligible ordering', () => {
  const ranking = recommend({
    ...personas.rollingEnthusiast,
    release: ['either'],
  }).ranking;
  const silverblue = ranking.findIndex(
    (row) => row.distroId === 'fedora-silverblue',
  );
  const vanilla = ranking.findIndex((row) => row.distroId === 'vanilla-os');
  assert.equal(ranking[silverblue].rawScore, ranking[vanilla].rawScore);
  assert.ok(silverblue < vanilla);
  for (let index = 1; index < ranking.length; index++) {
    if (ranking[index].eligible)
      assert.ok(
        ranking[index - 1].normalizedScore >= ranking[index].normalizedScore,
      );
  }
});

test('NVIDIA affects setup refinement, not eligibility or capability scores', () => {
  const nvidia = recommend({ ...personas.beginner, gpu: ['nvidia'] });
  const unknown = recommend(personas.beginner);
  for (const row of nvidia.ranking) {
    const other = unknown.ranking.find(
      (candidate) => candidate.distroId === row.distroId,
    )!;
    assert.equal(row.capabilityScore, other.capabilityScore);
    assert.equal(row.eligible, other.eligible);
    assert.ok(Math.abs(row.traitAdjustment - other.traitAdjustment) <= 2);
  }
});

test('balanced freshness allows limited extra currency; conservative answers remain strict', () => {
  assert.equal(capabilitySimilarity('freshness', 3, 4, 'balanced'), 1);
  assert.equal(capabilitySimilarity('freshness', 3, 4.5, 'balanced'), 0.9);
  assert.equal(capabilitySimilarity('freshness', 3, 2, 'balanced'), 0.8);
  assert.equal(capabilitySimilarity('freshness', 1, 4, 'proven'), 0.4);
  assert.equal(capabilitySimilarity('freshness', 4.5, 5, 'modern'), 0.9);
  const fedora = get('beginner', 'fedora-workstation');
  within('beginner', ['fedora-workstation'], 3);
  const freshness = fedora.capabilityMatches.find(
    (match) => match.capability === 'freshness',
  )!;
  assert.equal(freshness.distance, 1.5);
  assert.equal(freshness.effectiveDistance, 0.5);
});

test('gaming shortfalls count twice and similarity stays bounded', () => {
  assert.equal(capabilitySimilarity('gaming', 4, 3.5), 0.8);
  assert.equal(capabilitySimilarity('gaming', 5, 0), 0);
  assert.equal(capabilitySimilarity('gaming', 1, 5), 1);
  // Extend the gaming contract across every assessed focus, all intensities,
  // and explicit purpose selection without adding personas.
  for (const gaming of ['none', 'occasional', 'important', 'main']) {
    for (const selected of [false, true]) {
      const result = recommend({
        ...personas.beginner,
        gaming: [gaming],
        'use-cases': selected ? ['everyday', 'gaming'] : ['everyday'],
      });
      for (const distro of distroProfiles) {
        const row = result.ranking.find(
          (candidate) => candidate.distroId === distro.id,
        )!;
        const mismatch =
          distro.traits.focus.gaming &&
          (gaming === 'none' || (gaming === 'occasional' && !selected));
        assert.deepEqual(
          row.traitModifiers.filter(
            (modifier) => modifier.code === 'focus.gaming-mismatch',
          ),
          mismatch
            ? [
                {
                  code: 'focus.gaming-mismatch',
                  points: gaming === 'none' ? -6 : -3,
                },
              ]
            : [],
        );
        assert.equal(row.cautions.includes('focus.gaming-mismatch'), mismatch);
        const reward = row.traitModifiers.find(
          (modifier) => modifier.code === 'focus.gaming',
        );
        assert.equal(
          reward?.points ?? 0,
          distro.traits.focus.gaming &&
            (gaming === 'important' || gaming === 'main')
            ? 3 * result.profile.capabilities.gaming.weight
            : 0,
        );
        // Changing focus alone cannot change capabilities or constraints.
        const unfocused = scoreDistro(result.profile, {
          ...distro,
          traits: {
            ...distro.traits,
            focus: { ...distro.traits.focus, gaming: false },
          },
        });
        assert.equal(row.capabilityScore, unfocused.capabilityScore);
        assert.deepEqual(row.constraints, unfocused.constraints);
      }
    }
  }
  within('windowsGamer', ['fedora-workstation'], 2);
  assert.ok(
    get('windowsGamer', 'fedora-workstation').rawScore >
      get('windowsGamer', 'bluefin').rawScore,
  );
  for (let target = 0; target <= 5; target += 0.5)
    for (let actual = 0; actual <= 5; actual += 0.5) {
      const value = capabilitySimilarity('gaming', target, actual);
      assert.ok(value >= 0 && value <= 1);
    }
});

test('familiar-layout evidence gives a small cross-desktop bonus without implying KDE', () => {
  const profile = recommend(personas.beginner).profile;
  const styled = {
    ...profile,
    traits: {
      ...profile.traits,
      desktopLayoutPreference: 'panel-menu' as const,
    },
  };
  for (const id of ['linux-mint', 'fedora-kde', 'debian']) {
    const distro = distroProfiles.find((row) => row.id === id)!;
    const before = scoreDistro(profile, distro),
      after = scoreDistro(styled, distro);
    assert.equal(after.rawScore - before.rawScore, 2);
    assert.ok(after.reasons.includes('desktop-layout.match'));
  }
  const fedora = distroProfiles.find((row) => row.id === 'fedora-workstation')!;
  assert.equal(
    scoreDistro(styled, fedora).rawScore,
    scoreDistro(profile, fedora).rawScore,
  );
  for (const customization of ['workflow', 'castle']) {
    const rows = recommend({
      ...personas.customizableDeveloper,
      customization: [customization],
    }).ranking.slice(0, 5);
    assert.ok(rows.some((row) => row.distroId === 'fedora-kde'));
  }
});

test('handheld evidence changes device refinement without guessing gaming, GPU or expertise', () => {
  const answers = { ...personas.beginner, hardware: ['handheld'] };
  const result = recommend(answers);
  assert.equal(result.profile.traits.deviceType, 'handheld');
  assert.equal(result.profile.capabilities.gaming.target, 0);
  assert.equal(result.profile.traits.gpu, 'unknown');
  assert.equal(result.profile.eligibility.experience, 'new');
  assert.equal(result.profile.traits.wantsAtomic, undefined);
  assert.equal(result.profile.capabilities.oldHardware.target, 2);
  const bazzite = result.ranking.find((row) => row.distroId === 'bazzite')!;
  assert.ok(bazzite.reasons.includes('handheld.documented-support'));
  assert.ok(
    result.ranking.every((row) =>
      row.cautions.includes('handheld.check-device-compatibility'),
    ),
  );
  assert.ok(
    result.ranking
      .find((row) => row.distroId === 'fedora-workstation')!
      .cautions.includes('handheld.support-unassessed'),
  );
  const desktop = {
    ...result.profile,
    traits: {
      ...result.profile.traits,
      deviceType: 'desktop-or-laptop' as const,
    },
  };
  assert.equal(
    bazzite.traitAdjustment -
      scoreDistro(
        desktop,
        distroProfiles.find((row) => row.id === 'bazzite')!,
      ).traitAdjustment,
    3,
  );
  within('gamingAppliance', ['bazzite'], 1);
});

test('ancestry, edition groups and workflows remain distinct without modifying scores', () => {
  const result = recommend(personas.beginner);
  const rows = ['fedora-workstation', 'fedora-kde', 'bazzite', 'bluefin'].map(
    (id) => result.ranking.find((row) => row.distroId === id)!,
  );
  assert.ok(rows.every((row) => row.family === 'fedora'));
  assert.equal(rows[0].presentationGroup, rows[1].presentationGroup);
  assert.equal(rows[0].workflow, 'conventional-desktop');
  assert.equal(rows[2].workflow, 'gaming-appliance');
  assert.equal(rows[3].workflow, 'atomic-desktop');
  assert.equal(get('declarative', 'nixos').workflow, 'declarative-system');
});

test('example review includes complete accessible tables for every persona', () => {
  const output = formatExampleRankings();
  assert.deepEqual(
    [...output.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
    Object.keys(personas),
  );
  assert.equal(
    (output.match(/^\| \d+ \|/gm) ?? []).length,
    distroIds.length * Object.keys(personas).length,
  );
  assert.ok(output.includes('[customizableDeveloper](#customizabledeveloper)'));
  assert.ok(output.includes('## penetrationTester'));
  assert.ok(output.includes('## securityCurious'));
  assert.equal(reviewRecommendations(['--examples']), output);
  assert.throws(() => reviewRecommendations(['--examples', '--json']));
  assert.ok(
    reviewRecommendations(['--persona', 'penetrationTester']).includes(
      'kali-linux',
    ),
  );
});

test('creative intent adds only a small documented integration refinement', () => {
  for (const name of [
    'beginner',
    'windowsGamer',
    'oldLaptop',
    'atomicDeveloper',
    'securityCurious',
  ] as const) {
    const answers = personas[name];
    const before = recommend(answers);
    const after = recommend({
      ...answers,
      'use-cases': [...answers['use-cases'], 'creative'],
    });
    assert.deepEqual(after.profile.capabilities, before.profile.capabilities);
    assert.deepEqual(after.profile.eligibility, before.profile.eligibility);
    for (const row of after.ranking) {
      const previous = before.ranking.find(
        (other) => other.distroId === row.distroId,
      )!;
      const distro = distroProfiles.find((other) => other.id === row.distroId)!;
      assert.equal(row.capabilityScore, previous.capabilityScore);
      assert.equal(row.eligible, previous.eligible);
      assert.deepEqual(row.constraints, previous.constraints);
      assert.ok(row.traitAdjustment - previous.traitAdjustment >= 0);
      assert.ok(row.traitAdjustment - previous.traitAdjustment <= 2);
      if (distro.traits.creativeIntegration === 'documented') {
        assert.ok(row.reasons.includes('creative.documented-integration'));
        const expected = Math.min(
          scoringRules.traitLimit,
          previous.traitAdjustment + scoringRules.creativeIntegrationMatch,
        );
        assert.equal(row.traitAdjustment, expected);
        assert.ok(
          Math.abs(
            row.rawScore -
              previous.rawScore -
              (expected - previous.traitAdjustment),
          ) < 1e-10,
        );
      } else {
        assert.deepEqual(row, previous);
      }
    }
    if (
      name === 'beginner' ||
      name === 'oldLaptop' ||
      name === 'atomicDeveloper'
    )
      assert.equal(after.ranking[0].distroId, before.ranking[0].distroId);
    if (name === 'securityCurious')
      assert.equal(
        after.ranking.find((row) => row.distroId === 'kali-linux')!.eligible,
        false,
      );
  }
});

test('creative integration follows the assessed trait, remains capped, and is not inferred', () => {
  const distro = distroProfiles.find((row) => row.id === 'nobara')!;
  for (const answers of Object.values(personas)) {
    const explicitCreativeIntent = answers['use-cases'].some(
      (value) => value === 'creative',
    );
    for (const row of recommend(answers).ranking) {
      const assessed = distroProfiles.find(
        (distro) => distro.id === row.distroId,
      )!;
      assert.equal(
        row.reasons.includes('creative.documented-integration'),
        explicitCreativeIntent &&
          assessed.traits.creativeIntegration === 'documented',
      );
    }
  }
  const profile = recommend({
    ...personas.beginner,
    'use-cases': ['creative'],
  }).profile;
  const reidentified = { ...distro, id: 'linux-mint' as const };
  assert.equal(
    scoreDistro(profile, reidentified).rawScore,
    scoreDistro(profile, distro).rawScore,
  );
  const unassessed = {
    ...distro,
    traits: { ...distro.traits, creativeIntegration: 'unassessed' as const },
  };
  assert.equal(
    scoreDistro(profile, distro).rawScore -
      scoreDistro(profile, unassessed).rawScore,
    2,
  );
  const cappedProfile = {
    ...recommend(personas.declarative).profile,
    traits: {
      ...recommend(personas.declarative).profile.traits,
      useCases: ['creative'] as const,
    },
  };
  const nixos = distroProfiles.find((row) => row.id === 'nixos')!;
  const capped = scoreDistro(cappedProfile, {
    ...nixos,
    traits: { ...nixos.traits, creativeIntegration: 'documented' },
  });
  assert.equal(capped.traitAdjustment, scoringRules.traitLimit);
  assert.ok(
    capped.traitModifiers.some((modifier) => modifier.code === 'traits.cap'),
  );
});

test('official siblings use lineage, keep derivatives distinct and preserve platform boundaries', () => {
  const result = recommend(personas.atomicDeveloper);
  const byId = (id: string) => result.ranking.find((r) => r.distroId === id)!;
  const official = ['fedora-workstation', 'fedora-kde', 'fedora-silverblue'];
  assert.equal(
    new Set(official.map((id) => byId(id).presentationGroup)).size,
    1,
  );
  for (const id of ['bluefin', 'bazzite', 'nobara'])
    assert.notEqual(
      byId(id).presentationGroup,
      byId('fedora-silverblue').presentationGroup,
    );
  assert.equal(
    byId('opensuse-aeon').presentationGroup,
    byId('opensuse-tumbleweed').presentationGroup,
  );
  assert.equal(byId('opensuse-aeon').workflow, 'atomic-desktop');
  const aeon = distroProfiles.find((p) => p.id === 'opensuse-aeon')!;
  const renamed = scoreDistro(result.profile, { ...aeon, id: 'fedora-kde' });
  assert.equal(
    renamed.presentationGroup,
    byId('opensuse-aeon').presentationGroup,
  );
  assert.equal(renamed.rawScore, byId('opensuse-aeon').rawScore);
});

test('atomic and mutable rolling additions follow explicit workflow evidence without displacing ordinary beginners', () => {
  within(
    'atomicDeveloper',
    ['bluefin', 'fedora-silverblue', 'opensuse-aeon'],
    4,
  );
  assert.ok(
    get('atomicDeveloper', 'bluefin').rawScore >
      get('atomicDeveloper', 'fedora-silverblue').rawScore,
  );
  for (const id of ['fedora-silverblue', 'opensuse-aeon'])
    assert.ok(
      get('atomicDeveloper', id).rawScore >
        get('atomicDeveloper', 'bazzite').rawScore,
    );
  outside(
    'beginner',
    ['fedora-silverblue', 'opensuse-aeon', 'vanilla-os', 'rhino-linux'],
    4,
  );
  const rolling = recommend({
    ...personas.atomicDeveloper,
    release: ['rolling'],
  });
  assert.ok(
    rolling.ranking.findIndex((r) => r.distroId === 'opensuse-aeon') < 4,
  );
  const aeon = rolling.ranking.find((r) => r.distroId === 'opensuse-aeon')!;
  assert.ok(aeon.reasons.includes('containers.transactional'));
  assert.equal(aeon.specialistAdjustment, 0);
  within('rollingEnthusiast', ['rhino-linux'], 5);
  const newcomer = recommend({
    ...personas.beginner,
    release: ['rolling'],
    freshness: ['modern'],
  });
  const rhino = newcomer.ranking.find((r) => r.distroId === 'rhino-linux')!;
  assert.ok(rhino.eligible);
  assert.ok(rhino.eligibilityAdjustment < 0);
  // Aspirations never satisfy the cautious experience recommendation.
  const curious = recommend({
    ...personas.beginner,
    identity: ['understand'],
    path: ['artisan'],
  });
  assert.equal(
    curious.ranking.find((r) => r.distroId === 'rhino-linux')!.constraints[0]
      .conditions[0].matched,
    false,
  );
});
