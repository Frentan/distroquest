import type {
  Capability,
  DistroId,
  DistroTraits,
  RecommendationCondition,
} from './distro.ts';
import type { UserPreferenceProfile } from './preferences.ts';

export type Preference = Readonly<{ target: number; weight: number }>;
export type RecommendationProfile = Readonly<{
  version: 1;
  capabilities: Readonly<Record<Capability, Preference>>;
  traits: UserPreferenceProfile['traits'];
  eligibility: UserPreferenceProfile['eligibility'];
}>;
export type Adjustment = Readonly<{ code: string; points: number }>;
export type ConstraintOutcome = Readonly<{
  effect: 'require' | 'strongly-prefer';
  conditions: readonly Readonly<{
    condition: RecommendationCondition;
    matched: boolean;
  }>[];
  matched: boolean;
  adjustment: number;
}>;
export type CapabilityMatch = Preference &
  Readonly<{
    capability: Capability;
    actual: number;
    distance: number;
    effectiveDistance: number;
    similarity: number;
    contribution: number;
  }>;
export type Recommendation = Readonly<{
  distroId: DistroId;
  family: DistroTraits['family'];
  // Official upstream paths share a family group; derivatives remain distinct.
  presentationGroup: string;
  workflow:
    | 'conventional-desktop'
    | 'atomic-desktop'
    | 'gaming-appliance'
    | 'declarative-system';
  eligible: boolean;
  rawScore: number;
  normalizedScore: number;
  capabilityScore: number;
  traitAdjustment: number;
  specialistAdjustment: number;
  eligibilityAdjustment: number;
  breadthAdjustment: number;
  capabilityMatches: readonly CapabilityMatch[];
  traitModifiers: readonly Adjustment[];
  specialistModifiers: readonly Adjustment[];
  constraints: readonly ConstraintOutcome[];
  // Stable machine codes, not localized UI text.
  reasons: readonly string[];
  cautions: readonly string[];
}>;
export type RecommendationResult = Readonly<{
  modelVersion: 11;
  profile: RecommendationProfile;
  ranking: readonly Recommendation[];
}>;
