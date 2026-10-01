import assert from 'node:assert/strict';
import { test } from 'node:test';
import { capabilityKeys, distroIds } from '../src/domain/distro.ts';
import { getDistros, distroProfiles } from '../src/data/index.ts';
import { validateDataset } from '../src/data/validate.ts';
import { distroContentEn } from '../src/i18n/en/distros.ts';

const first = distroProfiles[0];
const changeProfile = (patch: Record<string, unknown>) => [
  { ...first, ...patch },
  ...distroProfiles.slice(1),
];
const changeContent = (patch: Record<string, unknown>) => ({
  ...distroContentEn,
  'linux-mint': { ...distroContentEn['linux-mint'], ...patch },
});
const rejects = (profiles: unknown, content: unknown, pattern: RegExp) =>
  assert.match(validateDataset(profiles, content).join('\n'), pattern);

test('complete dataset passes runtime validation', () => {
  assert.deepEqual(validateDataset(distroProfiles, distroContentEn), []);
});

test('reviewed relative relationships remain coherent', () => {
  const get = (id: (typeof distroIds)[number]) =>
    distroProfiles.find((profile) => profile.id === id)!;
  const mint = get('linux-mint');
  const tumbleweed = get('opensuse-tumbleweed');
  const arch = get('arch-linux');
  const gentoo = get('gentoo');
  const bazzite = get('bazzite');
  const mx = get('mx-linux');
  const workstation = get('fedora-workstation');
  const kde = get('fedora-kde');
  assert.ok(
    kde.capabilities.customization > workstation.capabilities.customization,
  );
  assert.ok(
    workstation.capabilities.desktopPolish > kde.capabilities.desktopPolish,
  );
  assert.ok(
    workstation.capabilities.beginnerFriendly >
      kde.capabilities.beginnerFriendly,
  );
  assert.ok(workstation.recommendation.breadth > kde.recommendation.breadth);
  assert.ok(
    bazzite.capabilities.systemControl <
      get('bluefin').capabilities.systemControl,
  );
  for (const id of ['fedora-workstation', 'fedora-kde'] as const) {
    const fedora = get(id);
    assert.ok(
      mint.capabilities.beginnerFriendly > fedora.capabilities.beginnerFriendly,
    );
    assert.ok(
      fedora.capabilities.beginnerFriendly >
        tumbleweed.capabilities.beginnerFriendly,
    );
    assert.ok(bazzite.capabilities.gaming > fedora.capabilities.gaming);
    assert.ok(fedora.recommendation.breadth > bazzite.recommendation.breadth);
  }
  assert.ok(
    tumbleweed.capabilities.beginnerFriendly >
      arch.capabilities.beginnerFriendly,
  );
  assert.ok(
    arch.capabilities.beginnerFriendly > gentoo.capabilities.beginnerFriendly,
  );
  assert.ok(mx.capabilities.oldHardware > mint.capabilities.oldHardware);
  assert.ok(mint.recommendation.breadth > mx.recommendation.breadth);
  assert.equal(arch.traits.focus.gaming, false);
});

test('frozen roster contains exactly the requested 25 distributions', () => {
  assert.deepEqual(
    getDistros(distroContentEn).map((distro) => distro.name),
    [
      'Linux Mint',
      'Ubuntu',
      'Fedora Workstation',
      'Fedora KDE',
      'Debian',
      'Pop!_OS',
      'Zorin OS',
      'elementary OS',
      'openSUSE Tumbleweed',
      'EndeavourOS',
      'Arch Linux',
      'CachyOS',
      'Nobara',
      'Bazzite',
      'Bluefin',
      'NixOS',
      'Gentoo',
      'Void Linux',
      'Kali Linux',
      'MX Linux',
      'Garuda Linux',
      'Solus',
      'PikaOS',
      'Alpine Linux',
      'Slackware',
    ],
  );
  assert.equal(distroIds.length, 25);
});

test('composition uses the supplied dictionary without mutating profiles', () => {
  const content = changeContent({ summary: 'Alternate locale summary' });
  const assembled = getDistros(content);
  assert.equal(assembled[0].summary, 'Alternate locale summary');
  assert.equal(assembled[0].capabilities, first.capabilities);
  assert.equal('summary' in first, false);
});

test('rejects roster omissions, substitutions, duplicates, and invalid slugs', () => {
  rejects(
    distroProfiles.slice(1),
    distroContentEn,
    /exactly 25.*|missing frozen roster/,
  );
  rejects(
    changeProfile({ id: 'unlisted' }),
    distroContentEn,
    /profiles\[0\]\.id/,
  );
  rejects(
    changeProfile({ id: distroProfiles[1].id }),
    distroContentEn,
    /duplicate ID/,
  );
  rejects(
    changeProfile({ slug: distroProfiles[1].slug }),
    distroContentEn,
    /duplicate slug/,
  );
  rejects(
    changeProfile({ slug: '../unsafe slug' }),
    distroContentEn,
    /URL-safe slug/,
  );
});

test('rejects invalid scores for every capability and breadth', () => {
  for (const bad of [-0.5, 5.5, 3.25, NaN, Infinity, '4', null, undefined]) {
    for (const key of capabilityKeys) {
      rejects(
        changeProfile({ capabilities: { ...first.capabilities, [key]: bad } }),
        distroContentEn,
        new RegExp(`capabilities.${key}:`),
      );
    }
    rejects(
      changeProfile({ recommendation: { breadth: bad, constraints: [] } }),
      distroContentEn,
      /recommendation\.breadth:/,
    );
  }
  const { gaming: _gaming, ...incomplete } = first.capabilities;
  rejects(
    changeProfile({ capabilities: incomplete }),
    distroContentEn,
    /missing fields/,
  );
  rejects(
    changeProfile({ capabilities: { ...first.capabilities, extra: 4 } }),
    distroContentEn,
    /unexpected or missing fields/,
  );
});

test('rejects missing content, empty metadata, and wrong list sizes', () => {
  rejects(distroProfiles, {}, /content: unexpected or missing fields/);
  for (const key of ['name', 'summary', 'assessmentBasis']) {
    rejects(
      distroProfiles,
      changeContent({ [key]: '  ' }),
      /required nonempty text/,
    );
  }
  rejects(
    distroProfiles,
    changeContent({ archetype: {} }),
    /archetype\.description/,
  );
  for (const key of ['strengths', 'cautions', 'idealFor']) {
    rejects(
      distroProfiles,
      changeContent({ [key]: [] }),
      /expected .* entries/,
    );
    rejects(
      distroProfiles,
      changeContent({ [key]: ['Valid', '', 'Valid'] }),
      /required nonempty text/,
    );
  }
  rejects(
    distroProfiles,
    changeContent({ strengths: Array(6).fill('Strength') }),
    /expected 3–5/,
  );
  rejects(
    distroProfiles,
    changeContent({ cautions: Array(5).fill('Caution') }),
    /expected 2–4/,
  );
});

test('rejects arbitrary traits, nonboolean focus, and inconsistent images', () => {
  for (const key of [
    'family',
    'lineage',
    'release',
    'systemModel',
    'baseMutability',
    'softwarePolicy',
    'nvidiaSupport',
  ]) {
    rejects(
      changeProfile({ traits: { ...first.traits, [key]: 'arbitrary-tag' } }),
      distroContentEn,
      new RegExp(`traits.${key}:`),
    );
  }
  rejects(
    changeProfile({ traits: { ...first.traits, atomicUpdates: 'yes' } }),
    distroContentEn,
    /atomicUpdates: expected boolean/,
  );
  rejects(
    changeProfile({
      traits: { ...first.traits, focus: { ...first.traits.focus, gaming: 1 } },
    }),
    distroContentEn,
    /focus\.gaming: expected boolean/,
  );
  rejects(
    changeProfile({ traits: { ...first.traits, systemModel: 'image-based' } }),
    distroContentEn,
    /image-based profiles require/,
  );
});

test('rejects malformed constraints and each invalid condition variant', () => {
  const invalid = [
    null,
    [{ effect: 'ban', allOf: [{ kind: 'experience', minimum: 'advanced' }] }],
    [{ effect: 'require', allOf: [] }],
    [{ effect: 'require', allOf: [null] }],
    [{ effect: 'require', allOf: [{ kind: 'unknown', value: 'anything' }] }],
    ...[
      'experience',
      'maintenance-tolerance',
      'learning-tolerance',
      'system-control',
    ].map((kind) => [
      { effect: 'require', allOf: [{ kind, minimum: 'unknown' }] },
    ]),
    ...['use-case', 'interest'].map((kind) => [
      { effect: 'require', allOf: [{ kind, value: 'unknown' }] },
    ]),
    [{ effect: 'require', allOf: [{ kind: 'experience', value: 'advanced' }] }],
    [
      {
        effect: 'require',
        allOf: [{ kind: 'interest', value: 'minimalism', weight: 100 }],
      },
    ],
  ];
  for (const constraints of invalid) {
    rejects(
      changeProfile({ recommendation: { breadth: 4, constraints } }),
      distroContentEn,
      /recommendation\.constraints/,
    );
  }
});

test('specialist restrictions survive dataset edits', () => {
  const get = (id: string) =>
    distroProfiles.find((profile) => profile.id === id)!;
  assert.deepEqual(get('kali-linux').recommendation.constraints, [
    {
      effect: 'require',
      allOf: [
        { kind: 'use-case', value: 'security-testing' },
        { kind: 'experience', minimum: 'intermediate' },
      ],
    },
  ]);
  for (const [id, expected] of [
    [
      'gentoo',
      [
        { kind: 'experience', minimum: 'advanced' },
        { kind: 'maintenance-tolerance', minimum: 'high' },
        { kind: 'system-control', minimum: 'high' },
      ],
    ],
    [
      'alpine-linux',
      [
        { kind: 'experience', minimum: 'advanced' },
        { kind: 'interest', value: 'minimalism' },
        { kind: 'interest', value: 'technical-learning' },
      ],
    ],
    [
      'slackware',
      [
        { kind: 'experience', minimum: 'advanced' },
        { kind: 'interest', value: 'traditional-unix' },
        { kind: 'maintenance-tolerance', minimum: 'high' },
      ],
    ],
    [
      'nixos',
      [
        { kind: 'experience', minimum: 'intermediate' },
        { kind: 'interest', value: 'declarative-configuration' },
        { kind: 'learning-tolerance', minimum: 'high' },
      ],
    ],
  ] as const) {
    assert.deepEqual(get(id).recommendation.constraints, [
      { effect: 'strongly-prefer', allOf: expected },
    ]);
  }
});

test('rejects invalid provenance and handles wrong root shapes without throwing', () => {
  for (const reviewedOn of ['2026-02-30', 'not a date', null]) {
    rejects(
      changeProfile({ assessment: { ...first.assessment, reviewedOn } }),
      distroContentEn,
      /expected a real ISO date/,
    );
  }
  rejects(
    changeProfile({ assessment: { ...first.assessment, sources: [] } }),
    distroContentEn,
    /expected 1–10 entries/,
  );
  rejects(
    changeProfile({
      assessment: { ...first.assessment, sources: ['javascript:alert(1)'] },
    }),
    distroContentEn,
    /HTTPS source URL/,
  );
  assert.deepEqual(validateDataset(null, null), [
    'profiles: expected an array',
  ]);
  assert.ok(validateDataset([null], null).length > 0);
});
