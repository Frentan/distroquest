import type { Capability, Score, interests } from './distro.ts';

export const questionIds = [
  'experience',
  'setup',
  'freshness',
  'maintenance',
  'control',
  'customization',
  'release',
  'system-model',
  'use-cases',
  'gaming',
  'hardware',
  'gpu',
  'software-freedom',
  'troubleshooting',
  'identity',
  'path',
] as const;
export type QuestionId = (typeof questionIds)[number];
export const preferenceUseCases = [
  'general-desktop',
  'development',
  'gaming',
  'creative',
  'technical-learning',
  'security-testing',
  'homelab',
  'old-hardware',
] as const;
export type UseCase = (typeof preferenceUseCases)[number];
export type Interest = (typeof interests)[number];
export type Experience = 'new' | 'beginner' | 'intermediate' | 'advanced';
export type Tolerance = 'low' | 'moderate' | 'high';
export type Gpu = 'nvidia' | 'amd' | 'intel' | 'other' | 'unknown';
export type Hardware =
  'powerful' | 'recent' | 'aging' | 'limited' | 'unspecified';
export type DeviceType = 'desktop-or-laptop' | 'handheld';
export type FreshnessIntent = 'proven' | 'balanced' | 'modern' | 'newest';

// Each selected option supplies a target and its evidence weight, not a delta.
export type PreferenceEffect = Readonly<{
  capabilities?: Partial<
    Record<Capability, Readonly<{ target: Score; weight: number }>>
  >;
  traits?: Readonly<{
    wantsRolling?: boolean;
    rollingStrength?: 1 | 2;
    wantsAtomic?: boolean;
    atomicStrength?: 1 | 2;
    containerFirst?: boolean;
    fossPreference?: Score;
    gpu?: Gpu;
    hardware?: Hardware;
    deviceType?: DeviceType;
    freshnessIntent?: FreshnessIntent;
    desktopLayoutPreference?: 'panel-menu';
    useCase?: UseCase;
    interest?: Interest;
  }>;
  eligibility?: Readonly<{
    experience?: Experience;
    maintenanceTolerance?: Tolerance;
    learningTolerance?: Tolerance;
    systemControl?: Tolerance;
  }>;
}>;
export type Question = Readonly<{
  id: QuestionId;
  section: 'core' | 'practical' | 'philosophy' | 'finale';
  selection: 'single' | 'multiple';
  maxSelections: number;
  options: readonly Readonly<{
    id: string;
    emoji: string;
    effects: PreferenceEffect;
  }>[];
}>;
export type QuestionContent = Readonly<{
  prompt: string;
  helper?: string;
  options: Readonly<
    Record<string, Readonly<{ label: string; description?: string }>>
  >;
}>;
export type QuestionDictionary = Readonly<Record<QuestionId, QuestionContent>>;
// Arrays use the same transport shape for radio and checkbox questions.
export type AnswerSet = Readonly<Record<QuestionId, readonly string[]>>;
export type UserTraits = Readonly<{
  wantsRolling?: boolean;
  rollingStrength: 0 | 1 | 2;
  wantsAtomic?: boolean;
  atomicStrength: 0 | 1 | 2;
  containerFirst: boolean;
  fossPreference: Score;
  securityUseCase: boolean;
  gpu: Gpu;
  hardware: Hardware;
  deviceType: DeviceType;
  freshnessIntent: FreshnessIntent;
  desktopLayoutPreference?: 'panel-menu';
  useCases: readonly UseCase[];
  interests: readonly Interest[];
}>;
export type UserPreferenceProfile = Readonly<{
  version: 1;
  // Continuous 0–5 targets; do not round to distro assessment half steps.
  targets: Readonly<Record<Capability, number>>;
  // 0–5 relative importance; zero means no requested benefit on that axis.
  importance: Readonly<Record<Capability, number>>;
  traits: UserTraits;
  // Explicit evidence for Milestone 4's existing constraint vocabulary.
  eligibility: Readonly<{
    experience: Experience;
    maintenanceTolerance: Tolerance;
    learningTolerance: Tolerance;
    systemControl: Tolerance;
  }>;
}>;
