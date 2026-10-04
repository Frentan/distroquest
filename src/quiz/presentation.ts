import type {
  RecommendationResult,
  Recommendation,
} from '../domain/recommendations.ts';
import type { UseCase } from '../domain/preferences.ts';

export function strongestReasons(row: Recommendation): string[] {
  const capabilities = [...row.capabilityMatches]
    .sort((a, b) => b.contribution - a.contribution)
    .flatMap((match) =>
      row.reasons.filter((code) =>
        code.startsWith(`capability.${match.capability}.`),
      ),
    );
  const traits = row.reasons.filter(
    (code) =>
      !code.startsWith('capability.') &&
      !code.startsWith('constraint.') &&
      code !== 'breadth.prior',
  );
  const signals = [...traits.slice(0, 2), ...capabilities];
  const topics = new Set<string>();
  return signals
    .filter((code) => {
      const topic =
        code === 'focus.development' ||
        code === 'specialist.container-development'
          ? 'developerExperience'
          : code === 'specialist.handheld-gaming' ||
              code === 'handheld.documented-support'
            ? 'handheld'
            : code === 'focus.gaming'
              ? 'gaming'
              : code === 'focus.security' ||
                  code === 'specialist.security-testing'
                ? 'security-testing'
                : code.startsWith('capability.')
                  ? code.split('.')[1]
                  : code;
      if (topics.has(topic)) return false;
      topics.add(topic);
      return true;
    })
    .slice(0, 5);
}

// Presentation rounding only; the engine's ranking always uses unrounded scores.
export function percentMatch(row: Recommendation): number {
  return Math.round(row.normalizedScore * 10) / 10;
}

// Preparation advice adds no scores or specialist eligibility; the engine
// separately evaluates explicit intent. Numeric gaming evidence remains authoritative.
export function preparationTopics(
  result: RecommendationResult,
): readonly UseCase[] {
  return result.profile.traits.useCases.filter(
    (useCase) =>
      useCase !== 'gaming' || result.profile.capabilities.gaming.target > 0,
  );
}
