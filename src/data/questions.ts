import type { Capability, Score } from '../domain/distro.ts';
import type { PreferenceEffect, Question } from '../domain/preferences.ts';

const target = (value: Score, weight = 4) => ({ target: value, weight });
const option = (id: string, emoji: string, effects: PreferenceEffect = {}) => ({
  id,
  emoji,
  effects,
});
const single = (
  id: Question['id'],
  section: Question['section'],
  options: Question['options'],
): Question => ({
  id,
  section,
  selection: 'single',
  maxSelections: 1,
  options,
});
const mood = (
  values: Partial<Record<Capability, Score>>,
  weight: number,
): PreferenceEffect => ({
  capabilities: Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, target(value, weight)]),
  ),
});

export const questions: readonly Question[] = [
  single('experience', 'core', [
    option('new', '🐣', {
      capabilities: { beginnerFriendly: target(5) },
      eligibility: { experience: 'new' },
    }),
    option('tried', '🧭', {
      capabilities: { beginnerFriendly: target(4) },
      eligibility: { experience: 'beginner' },
    }),
    option('regular', '🛠️', {
      capabilities: { beginnerFriendly: target(2.5) },
      eligibility: { experience: 'intermediate' },
    }),
    option('terminal', '🧑‍💻', {
      capabilities: { beginnerFriendly: target(1) },
      eligibility: { experience: 'advanced' },
    }),
    option('init', '🧙‍♂️', {
      capabilities: { beginnerFriendly: target(0) },
      eligibility: { experience: 'advanced' },
    }),
  ]),
  single('setup', 'core', [
    option(
      'ready',
      '🛋️',
      mood({ lowMaintenance: 5, desktopPolish: 5, beginnerFriendly: 4.5 }, 1),
    ),
    option(
      'little',
      '🔧',
      mood({ lowMaintenance: 4, desktopPolish: 4, beginnerFriendly: 3.5 }, 1),
    ),
    option(
      'configure',
      '🧰',
      mood({ lowMaintenance: 2.5, desktopPolish: 2.5, systemControl: 4 }, 1),
    ),
    option(
      'build',
      '🏗️',
      mood({ lowMaintenance: 1, desktopPolish: 1, systemControl: 5 }, 1),
    ),
  ]),
  single('freshness', 'core', [
    option('proven', '🪨', {
      traits: { freshnessIntent: 'proven' },
      capabilities: { freshness: target(1), stability: target(5) },
    }),
    option('balanced', '🌿', {
      traits: { freshnessIntent: 'balanced' },
      capabilities: { freshness: target(3), stability: target(4.5) },
    }),
    option('modern', '⚡', {
      traits: { freshnessIntent: 'modern' },
      capabilities: { freshness: target(4.5), stability: target(3.5) },
    }),
    option('newest', '🔥', {
      traits: { freshnessIntent: 'newest' },
      capabilities: { freshness: target(5), stability: target(2.5) },
    }),
  ]),
  single('maintenance', 'core', [
    option('minimal', '😌', {
      capabilities: { lowMaintenance: target(5), stability: target(4.5, 1) },
      eligibility: { maintenanceTolerance: 'low' },
    }),
    option('occasional', '🧹', {
      capabilities: { lowMaintenance: target(4), stability: target(4, 1) },
      eligibility: { maintenanceTolerance: 'moderate' },
    }),
    option('sometimes', '🔧', {
      capabilities: { lowMaintenance: target(2.5), stability: target(3, 1) },
      eligibility: { maintenanceTolerance: 'moderate' },
    }),
    option('hobby', '🧨', {
      capabilities: { lowMaintenance: target(1), stability: target(2, 1) },
      eligibility: { maintenanceTolerance: 'high' },
    }),
  ]),
  single('control', 'core', [
    option('drive', '🚗', {
      capabilities: { systemControl: target(1) },
      eligibility: { systemControl: 'low' },
    }),
    option('understand', '🔍', {
      capabilities: { systemControl: target(3) },
      eligibility: { systemControl: 'moderate' },
    }),
    option('components', '🛠️', {
      capabilities: { systemControl: target(4) },
      eligibility: { systemControl: 'high' },
    }),
    option('everything', '🧬', {
      capabilities: { systemControl: target(5) },
      eligibility: { systemControl: 'high' },
    }),
  ]),
  single('customization', 'core', [
    option('defaults', '🎨', {
      capabilities: { customization: target(1), desktopPolish: target(5) },
    }),
    option('touches', '🪴', {
      capabilities: { customization: target(2.5), desktopPolish: target(4) },
    }),
    option('familiar', '🪟', {
      capabilities: { customization: target(3.5), desktopPolish: target(4) },
      traits: { desktopLayoutPreference: 'panel-menu' },
    }),
    option('workflow', '🧩', {
      capabilities: { customization: target(4), desktopPolish: target(3) },
    }),
    option('castle', '🏰', {
      capabilities: { customization: target(5), desktopPolish: target(1.5) },
    }),
  ]),
  single('release', 'core', [
    option('fixed', '🧱', {
      traits: { wantsRolling: false, rollingStrength: 2 },
    }),
    option('either', '😐'),
    option('appealing', '🌊', {
      traits: { wantsRolling: true, rollingStrength: 1 },
    }),
    option('rolling', '⚡', {
      traits: { wantsRolling: true, rollingStrength: 2 },
    }),
  ]),
  single('system-model', 'core', [
    option('traditional', '🔓', {
      traits: { wantsAtomic: false, atomicStrength: 2 },
    }),
    option('either', '😐'),
    option('protected', '🛡️', {
      traits: { wantsAtomic: true, atomicStrength: 1 },
    }),
    option('containers', '🧊', {
      traits: { wantsAtomic: true, atomicStrength: 2, containerFirst: true },
    }),
  ]),
  {
    id: 'use-cases',
    section: 'practical',
    selection: 'multiple',
    maxSelections: 3,
    options: [
      option('everyday', '🌐', { traits: { useCase: 'general-desktop' } }),
      option('development', '💻', {
        capabilities: { developerExperience: target(5) },
        traits: { useCase: 'development' },
      }),
      // The dedicated intensity question owns the numeric gaming preference.
      option('gaming', '🎮', { traits: { useCase: 'gaming' } }),
      option('creative', '🎬', { traits: { useCase: 'creative' } }),
      option('learning', '🧪', {
        traits: {
          useCase: 'technical-learning',
          interest: 'technical-learning',
        },
      }),
      option('security', '🔐', { traits: { useCase: 'security-testing' } }),
      option('homelab', '🖥️', {
        capabilities: { developerExperience: target(4, 2) },
        traits: { useCase: 'homelab' },
      }),
      option('old-hardware', '👴', {
        capabilities: { oldHardware: target(5, 1) },
        traits: { useCase: 'old-hardware' },
      }),
    ],
  },
  single('gaming', 'practical', [
    option('none', '💤', { capabilities: { gaming: target(0) } }),
    option('occasional', '🎲', { capabilities: { gaming: target(2) } }),
    option('important', '🎮', { capabilities: { gaming: target(4) } }),
    option('main', '🏆', { capabilities: { gaming: target(5) } }),
  ]),
  single('hardware', 'practical', [
    option('powerful', '🚀', {
      capabilities: { oldHardware: target(0) },
      traits: { hardware: 'powerful' },
    }),
    option('recent', '💻', {
      capabilities: { oldHardware: target(1) },
      traits: { hardware: 'recent' },
    }),
    option('aging', '📺', {
      capabilities: { oldHardware: target(3.5) },
      traits: { hardware: 'aging' },
    }),
    option('limited', '🥔', {
      capabilities: { oldHardware: target(5) },
      traits: { hardware: 'limited' },
    }),
    option('handheld', '🕹️', {
      capabilities: { oldHardware: target(2) },
      traits: { hardware: 'unspecified', deviceType: 'handheld' },
    }),
  ]),
  single('gpu', 'practical', [
    option('nvidia', '🟢', { traits: { gpu: 'nvidia' } }),
    option('open-driver', '🔵', { traits: { gpu: 'open-driver' } }),
    option('apple-silicon', '🍏', { traits: { gpu: 'other' } }),
    option('intel-mac', '🍎', { traits: { gpu: 'other' } }),
    option('unknown', '❓', { traits: { gpu: 'unknown' } }),
  ]),
  single('software-freedom', 'philosophy', [
    option('pragmatic', '😐', { traits: { fossPreference: 0 } }),
    option('prefer', '🌱', { traits: { fossPreference: 2 } }),
    option('important', '🐧', { traits: { fossPreference: 4 } }),
    option('strong', '🕊️', { traits: { fossPreference: 5 } }),
  ]),
  single('troubleshooting', 'philosophy', [
    option('distress', '😭', {
      ...mood({ beginnerFriendly: 5, lowMaintenance: 5 }, 1),
      eligibility: { learningTolerance: 'low' },
    }),
    option('search', '🔎', {
      ...mood({ beginnerFriendly: 3.5, lowMaintenance: 4 }, 1),
      eligibility: { learningTolerance: 'moderate' },
    }),
    option('investigate', '🧰', {
      ...mood({ beginnerFriendly: 2, systemControl: 4 }, 1),
      eligibility: { learningTolerance: 'moderate' },
    }),
    option('learn', '☕', {
      ...mood({ beginnerFriendly: 1, systemControl: 4.5 }, 1),
      eligibility: { learningTolerance: 'high' },
    }),
  ]),
  single('identity', 'philosophy', [
    option(
      'background',
      '🛋️',
      mood({ lowMaintenance: 5, desktopPolish: 4.5 }, 2),
    ),
    option(
      'dependable',
      '🧭',
      mood({ freshness: 4, stability: 4, desktopPolish: 4 }, 2),
    ),
    option('shape', '🧰', mood({ customization: 5, systemControl: 4.5 }, 2)),
    option('understand', '🧠', {
      ...mood({ systemControl: 4.5 }, 2),
      traits: { interest: 'technical-learning' },
    }),
    option('declarative', '🧪', {
      ...mood({ systemControl: 5 }, 2),
      traits: { interest: 'declarative-configuration' },
    }),
    option('minimal', '🪶', { traits: { interest: 'minimalism' } }),
    option('unix', '📜', { traits: { interest: 'traditional-unix' } }),
  ]),
  single('path', 'finale', [
    option(
      'comfortable',
      '🌿',
      mood(
        {
          beginnerFriendly: 5,
          lowMaintenance: 5,
          stability: 4.5,
          desktopPolish: 4.5,
        },
        0.5,
      ),
    ),
    option(
      'modern',
      '⚔️',
      mood({ freshness: 4.5, stability: 4, lowMaintenance: 4 }, 0.5),
    ),
    option('artisan', '🛠️', mood({ customization: 5, systemControl: 5 }, 0.5)),
    option(
      'explorer',
      '🧭',
      mood({ freshness: 4.5, customization: 4, systemControl: 4 }, 0.5),
    ),
    option(
      'forbidden',
      '☠️',
      mood({ systemControl: 5, customization: 5, lowMaintenance: 1 }, 0.5),
    ),
  ]),
];

export const QUESTION_COUNT = questions.length;
