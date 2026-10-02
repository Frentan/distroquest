export const scores = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
export type Score = (typeof scores)[number];

export const capabilityKeys = [
  'beginnerFriendly',
  'lowMaintenance',
  'stability',
  'freshness',
  'customization',
  'systemControl',
  'gaming',
  'developerExperience',
  'oldHardware',
  'desktopPolish',
] as const;
export type Capability = (typeof capabilityKeys)[number];
export type DistroCapabilities = Readonly<Record<Capability, Score>>;

export const distroIds = [
  'linux-mint',
  'ubuntu',
  'fedora-workstation',
  'fedora-kde',
  'debian',
  'pop-os',
  'zorin-os',
  'elementary-os',
  'opensuse-tumbleweed',
  'endeavouros',
  'arch-linux',
  'cachyos',
  'nobara',
  'bazzite',
  'bluefin',
  'nixos',
  'gentoo',
  'void-linux',
  'kali-linux',
  'mx-linux',
  'garuda-linux',
  'solus',
  'pikaos',
  'alpine-linux',
  'slackware',
] as const;
export type DistroId = (typeof distroIds)[number];

export const traitValues = {
  family: ['debian', 'fedora', 'arch', 'suse', 'independent'],
  lineage: ['upstream', 'derivative'],
  release: ['fixed', 'rolling'],
  systemModel: ['package-managed', 'image-based', 'declarative'],
  baseMutability: ['mutable', 'protected'],
  softwarePolicy: ['free-software-first', 'pragmatic'],
  nvidiaSupport: ['integrated', 'guided', 'manual'],
  desktopLayout: ['panel-menu', 'dock-overview', 'user-selected'],
  handheldSupport: ['documented', 'unassessed'],
  creativeIntegration: ['documented', 'unassessed'],
} as const;
type TraitValue<K extends keyof typeof traitValues> =
  (typeof traitValues)[K][number];

export type DistroTraits = Readonly<{
  [K in keyof typeof traitValues]: TraitValue<K>;
}> &
  Readonly<{
    atomicUpdates: boolean;
    focus: {
      gaming: boolean;
      security: boolean;
      minimal: boolean;
      development: boolean;
    };
  }>;

// Requirements for future preference data, not answers or scoring weights.
export const experienceLevels = ['intermediate', 'advanced'] as const;
export const toleranceLevels = ['moderate', 'high'] as const;
export const useCases = [
  'security-testing',
  'general-desktop',
  'development',
  'gaming',
] as const;
export const interests = [
  'minimalism',
  'declarative-configuration',
  'traditional-unix',
  'technical-learning',
] as const;

export type RecommendationCondition =
  | { kind: 'experience'; minimum: (typeof experienceLevels)[number] }
  | { kind: 'maintenance-tolerance'; minimum: (typeof toleranceLevels)[number] }
  | { kind: 'learning-tolerance'; minimum: (typeof toleranceLevels)[number] }
  | { kind: 'system-control'; minimum: (typeof toleranceLevels)[number] }
  | { kind: 'use-case'; value: (typeof useCases)[number] }
  | { kind: 'interest'; value: (typeof interests)[number] };

export type RecommendationConstraint = Readonly<{
  effect: 'require' | 'strongly-prefer';
  // Every condition in a constraint is conjunctive (ALL must match).
  allOf: readonly RecommendationCondition[];
}>;

export type DistroProfile = Readonly<{
  id: DistroId;
  slug: string;
  capabilities: DistroCapabilities;
  traits: DistroTraits;
  recommendation: {
    breadth: Score;
    constraints: readonly RecommendationConstraint[];
  };
  // Internal provenance, never a capability or scoring input.
  assessment: {
    reviewedOn: string;
    sources: readonly string[];
  };
}>;

export type DistroContent = Readonly<{
  name: string;
  archetype: { name: string; description: string };
  summary: string;
  strengths: readonly string[];
  cautions: readonly string[];
  idealFor: readonly string[];
  // Names the edition/configuration actually assessed; also translatable.
  assessmentBasis: string;
}>;
export type DistroDictionary = Readonly<Record<DistroId, DistroContent>>;
export type Distro = DistroProfile & DistroContent;
