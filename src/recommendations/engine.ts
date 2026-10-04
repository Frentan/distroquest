import { capabilityKeys } from '../domain/distro.ts';
import type {
  Capability,
  DistroProfile,
  RecommendationCondition,
} from '../domain/distro.ts';
import type { UserPreferenceProfile } from '../domain/preferences.ts';
import type {
  Adjustment,
  Recommendation,
  RecommendationProfile,
  RecommendationResult,
} from '../domain/recommendations.ts';
import { distroProfiles } from '../data/distros.ts';
import { buildPreferenceProfile } from '../preferences/profile.ts';

// All adjustments use the same points as the 0–100 capability score.
export const scoringRules = Object.freeze({
  traitLimit: 12,
  gamingDistanceMultiplier: 2,
  gamingFocusNoInterestPenalty: 6,
  gamingFocusOccasionalPenalty: 3,
  balancedFreshnessAllowance: 1,
  layoutMatch: 2,
  handheldMatch: 3,
  creativeIntegrationMatch: 2,
  specialistIntentMatch: 4,
  handheldSpecialistMatch: 2,
  containerDeveloperSpecialistMatch: 2,
  breadthMaximum: 2,
  normalizationMaximum: 116,
  unmetSoftCondition: 8,
  softConstraintLimit: 24,
  satisfiedSoftConstraint: 2,
  excludedAdjustment: -100,
});
const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

// Adapter preserves Milestone 3's targets and relative importance exactly.
export function normalizePreferenceProfile(
  profile: UserPreferenceProfile,
): RecommendationProfile {
  return {
    version: 1,
    capabilities: Object.fromEntries(
      capabilityKeys.map((key) => [
        key,
        {
          target: profile.targets[key],
          weight: profile.importance[key] / 5,
        },
      ]),
    ) as RecommendationProfile['capabilities'],
    traits: structuredClone(profile.traits),
    eligibility: { ...profile.eligibility },
  };
}

function capabilityDistance(
  capability: Capability,
  target: number,
  actual: number,
): number {
  return capability === 'freshness'
    ? Math.abs(target - actual)
    : Math.max(0, target - actual);
}

function effectiveDistance(
  capability: Capability,
  target: number,
  actual: number,
  freshnessIntent?: RecommendationProfile['traits']['freshnessIntent'],
): number {
  const distance = capabilityDistance(capability, target, actual);
  if (capability === 'gaming')
    return Math.min(5, scoringRules.gamingDistanceMultiplier * distance);
  if (
    capability === 'freshness' &&
    freshnessIntent === 'balanced' &&
    actual > target
  )
    return Math.max(0, distance - scoringRules.balancedFreshnessAllowance);
  return distance;
}

export function capabilitySimilarity(
  capability: Capability,
  target: number,
  actual: number,
  freshnessIntent?: RecommendationProfile['traits']['freshnessIntent'],
): number {
  return 1 - effectiveDistance(capability, target, actual, freshnessIntent) / 5;
}

export function matchesCondition(
  profile: RecommendationProfile,
  condition: RecommendationCondition,
): boolean {
  const tolerance = { low: 0, moderate: 1, high: 2 };
  switch (condition.kind) {
    case 'experience': {
      const experience = { new: 0, beginner: 1, intermediate: 2, advanced: 3 };
      return (
        experience[profile.eligibility.experience] >=
        experience[condition.minimum]
      );
    }
    case 'maintenance-tolerance':
      return (
        tolerance[profile.eligibility.maintenanceTolerance] >=
        tolerance[condition.minimum]
      );
    case 'learning-tolerance':
      return (
        tolerance[profile.eligibility.learningTolerance] >=
        tolerance[condition.minimum]
      );
    case 'system-control':
      return (
        tolerance[profile.eligibility.systemControl] >=
        tolerance[condition.minimum]
      );
    case 'use-case':
      return profile.traits.useCases.includes(condition.value);
    case 'interest':
      return profile.traits.interests.includes(condition.value);
  }
}

function traitModifiers(
  profile: RecommendationProfile,
  distro: DistroProfile,
): Adjustment[] {
  const user = profile.traits;
  const traits = distro.traits;
  const adjustments: Adjustment[] = [];
  const add = (code: string, points: number) => {
    if (points !== 0) adjustments.push({ code, points });
  };
  if (user.wantsRolling !== undefined)
    add(
      `release.${(traits.release === 'rolling') === user.wantsRolling ? 'match' : 'conflict'}`,
      ((traits.release === 'rolling') === user.wantsRolling ? 2 : -2) *
        user.rollingStrength,
    );
  if (user.wantsAtomic !== undefined)
    add(
      `atomic.${traits.atomicUpdates === user.wantsAtomic ? 'match' : 'conflict'}`,
      (traits.atomicUpdates === user.wantsAtomic ? 2 : -2) *
        user.atomicStrength,
    );
  if (user.containerFirst)
    add(
      traits.systemModel === 'transactional'
        ? 'containers.transactional'
        : traits.systemModel === 'image-based'
          ? 'containers.image-based'
          : 'containers.other-model',
      traits.systemModel === 'image-based' ||
        traits.systemModel === 'transactional'
        ? 3
        : -2,
    );
  const gaming = profile.capabilities.gaming;
  if (traits.focus.gaming) {
    // The direct gaming answer owns this target (none 0, occasional 2).
    // Penalize purpose mismatch, never surplus gaming capability.
    if (!user.useCases.includes('gaming') && gaming.target <= 2)
      add(
        'focus.gaming-mismatch',
        -(gaming.target === 0
          ? scoringRules.gamingFocusNoInterestPenalty
          : scoringRules.gamingFocusOccasionalPenalty),
      );
    else if (gaming.target > 0) add('focus.gaming', 3 * gaming.weight);
  }
  if (user.useCases.includes('development') && traits.focus.development)
    add('focus.development', 2);
  if (
    user.useCases.includes('creative') &&
    traits.creativeIntegration === 'documented'
  )
    add(
      'creative.documented-integration',
      scoringRules.creativeIntegrationMatch,
    );
  if (user.useCases.includes('security-testing') && traits.focus.security)
    add('focus.security', 8);
  if (user.gpu === 'nvidia')
    add(
      `nvidia.${traits.nvidiaSupport}`,
      { integrated: 2, guided: 0, manual: -2 }[traits.nvidiaSupport],
    );
  if (user.fossPreference > 0)
    add(
      `software-policy.${traits.softwarePolicy}`,
      ((traits.softwarePolicy === 'free-software-first' ? 3 : -1) *
        user.fossPreference) /
        5,
    );
  if (user.interests.includes('minimalism') && traits.focus.minimal)
    add('focus.minimalism', 3);
  if (
    user.interests.includes('declarative-configuration') &&
    traits.systemModel === 'declarative'
  )
    add('workflow.declarative', 6);
  if (
    user.desktopLayoutPreference === 'panel-menu' &&
    traits.desktopLayout === 'panel-menu'
  )
    add('desktop-layout.match', scoringRules.layoutMatch);
  if (user.deviceType === 'handheld' && traits.handheldSupport === 'documented')
    add('handheld.documented-support', scoringRules.handheldMatch);
  return adjustments;
}

// Specific intent and assessed purpose must coincide; eligibility still applies.
function specialistModifiers(
  profile: RecommendationProfile,
  distro: DistroProfile,
  eligible: boolean,
): Adjustment[] {
  if (!eligible) return [];
  const modifiers: Adjustment[] = [];
  if (
    profile.traits.useCases.includes('security-testing') &&
    distro.traits.focus.security
  )
    modifiers.push({
      code: 'specialist.security-testing',
      points: scoringRules.specialistIntentMatch,
    });
  if (
    profile.traits.deviceType === 'handheld' &&
    profile.capabilities.gaming.target > 0 &&
    distro.traits.focus.gaming &&
    distro.traits.handheldSupport === 'documented'
  )
    modifiers.push({
      code: 'specialist.handheld-gaming',
      points: scoringRules.handheldSpecialistMatch,
    });
  if (
    profile.traits.containerFirst &&
    profile.traits.useCases.includes('development') &&
    distro.traits.systemModel === 'image-based' &&
    distro.traits.focus.development
  )
    modifiers.push({
      code: 'specialist.container-development',
      points: scoringRules.containerDeveloperSpecialistMatch,
    });
  return modifiers;
}

export function scoreDistro(
  profile: RecommendationProfile,
  distro: DistroProfile,
): Recommendation {
  const totalWeight = capabilityKeys.reduce(
    (sum, key) => sum + profile.capabilities[key].weight,
    0,
  );
  const capabilityMatches = capabilityKeys.map((capability) => {
    const { target, weight } = profile.capabilities[capability];
    const actual = distro.capabilities[capability];
    const similarity = capabilitySimilarity(
      capability,
      target,
      actual,
      profile.traits.freshnessIntent,
    );
    return {
      capability,
      target,
      weight,
      actual,
      distance: capabilityDistance(capability, target, actual),
      effectiveDistance: effectiveDistance(
        capability,
        target,
        actual,
        profile.traits.freshnessIntent,
      ),
      similarity,
      contribution: totalWeight ? (100 * weight * similarity) / totalWeight : 0,
    };
  });
  const capabilityScore = capabilityMatches.reduce(
    (sum, match) => sum + match.contribution,
    0,
  );
  const constraints = distro.recommendation.constraints.map((constraint) => {
    const conditions = constraint.allOf.map((condition) => ({
      condition: { ...condition },
      matched: matchesCondition(profile, condition),
    }));
    const unmet = conditions.filter((condition) => !condition.matched).length;
    const adjustment =
      constraint.effect === 'require'
        ? unmet
          ? scoringRules.excludedAdjustment
          : 0
        : unmet
          ? -Math.min(
              scoringRules.softConstraintLimit,
              unmet * scoringRules.unmetSoftCondition,
            )
          : scoringRules.satisfiedSoftConstraint;
    return {
      effect: constraint.effect,
      conditions,
      matched: unmet === 0,
      adjustment,
    };
  });
  const eligible = constraints.every(
    (constraint) => constraint.effect !== 'require' || constraint.matched,
  );
  const eligibilityAdjustment = constraints.reduce(
    (sum, constraint) => sum + constraint.adjustment,
    0,
  );
  const modifiers = traitModifiers(profile, distro);
  const uncapped = modifiers.reduce(
    (sum, modifier) => sum + modifier.points,
    0,
  );
  const traitAdjustment = clamp(
    uncapped,
    -scoringRules.traitLimit,
    scoringRules.traitLimit,
  );
  if (uncapped !== traitAdjustment)
    modifiers.push({ code: 'traits.cap', points: traitAdjustment - uncapped });
  const specialists = specialistModifiers(profile, distro, eligible);
  const specialistAdjustment = specialists.reduce(
    (sum, modifier) => sum + modifier.points,
    0,
  );
  const breadthAdjustment =
    (scoringRules.breadthMaximum * distro.recommendation.breadth) / 5;
  const rawScore =
    capabilityScore +
    traitAdjustment +
    specialistAdjustment +
    eligibilityAdjustment +
    breadthAdjustment;
  return {
    distroId: distro.id,
    family: distro.traits.family,
    // Upstream paths share an ecosystem; derivatives keep their own identity.
    // Independent upstream projects have no shared parent.
    presentationGroup:
      distro.traits.lineage === 'upstream' &&
      distro.traits.family !== 'independent'
        ? `${distro.traits.family}-desktop`
        : distro.id,
    workflow:
      distro.traits.systemModel === 'declarative'
        ? 'declarative-system'
        : distro.traits.atomicUpdates &&
            distro.traits.baseMutability === 'protected'
          ? distro.traits.focus.gaming
            ? 'gaming-appliance'
            : 'atomic-desktop'
          : 'conventional-desktop',
    eligible,
    rawScore,
    // Fixed scale; never relative to the other candidates. Not a probability.
    normalizedScore: eligible
      ? 100 * clamp(rawScore / scoringRules.normalizationMaximum, 0, 1)
      : 0,
    capabilityScore,
    traitAdjustment,
    specialistAdjustment,
    eligibilityAdjustment,
    breadthAdjustment,
    capabilityMatches,
    traitModifiers: modifiers,
    specialistModifiers: specialists,
    constraints,
    reasons: [
      ...specialists.map((modifier) => modifier.code),
      ...capabilityMatches
        .filter((match) => match.weight > 0 && match.similarity >= 0.9)
        .map(
          (match) =>
            `capability.${match.capability}.${match.effectiveDistance === 0 ? 'met' : 'near'}`,
        ),
      ...modifiers
        .filter(
          (modifier) => modifier.points > 0 && modifier.code !== 'traits.cap',
        )
        .map((modifier) => modifier.code),
      ...constraints.flatMap((constraint, index) =>
        constraint.matched ? [`constraint.${index}.met`] : [],
      ),
      ...(breadthAdjustment ? ['breadth.prior'] : []),
    ],
    cautions: [
      ...capabilityMatches
        .filter((match) => match.weight > 0 && match.effectiveDistance > 0)
        .map(
          (match) =>
            `capability.${match.capability}.${match.capability === 'freshness' ? 'distance' : 'shortfall'}`,
        ),
      ...modifiers
        .filter(
          (modifier) => modifier.points < 0 && modifier.code !== 'traits.cap',
        )
        .map((modifier) => modifier.code),
      ...constraints.flatMap((constraint, index) =>
        constraint.conditions.flatMap((condition, conditionIndex) =>
          condition.matched
            ? []
            : [`constraint.${index}.${conditionIndex}.unmet`],
        ),
      ),
      ...(profile.traits.deviceType === 'handheld'
        ? [
            'handheld.check-device-compatibility',
            ...(distro.traits.handheldSupport === 'unassessed'
              ? ['handheld.support-unassessed']
              : []),
          ]
        : []),
      ...(!eligible ? ['eligibility.excluded'] : []),
    ],
  };
}

export function rankDistros(
  profile: RecommendationProfile,
): readonly Recommendation[] {
  return distroProfiles
    .map((distro) => scoreDistro(profile, distro))
    .sort(
      (a, b) =>
        Number(b.eligible) - Number(a.eligible) ||
        b.rawScore - a.rawScore ||
        (a.distroId < b.distroId ? -1 : a.distroId > b.distroId ? 1 : 0),
    );
}

// Public boundary: accepts untrusted answers; existing validation rejects omissions.
export function recommend(input: unknown): RecommendationResult {
  const profile = normalizePreferenceProfile(buildPreferenceProfile(input));
  return { modelVersion: 9, profile, ranking: rankDistros(profile) };
}
