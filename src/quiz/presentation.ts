import type {
  RecommendationResult,
  Recommendation,
} from '../domain/recommendations.ts';
import type { UseCase } from '../domain/preferences.ts';

// Shortlist presentation only: preserve engine ordering and scores. Editions
// share a group; derivatives with different workflows remain distinct paths.
export function shortlist(result: RecommendationResult) {
  const eligible = result.ranking.filter((row) => row.eligible);
  const primary = eligible[0];
  if (!primary) throw new Error('No eligible recommendations');
  const sameEdition = eligible.find(
    (row) =>
      row !== primary && row.presentationGroup === primary.presentationGroup,
  );
  const groups = new Set([primary.presentationGroup]);
  const alternatives = eligible
    .filter((row) => {
      if (groups.has(row.presentationGroup)) return false;
      groups.add(row.presentationGroup);
      return true;
    })
    .slice(0, 2);
  return { primary, sameEdition, alternatives };
}
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
        code === 'focus.development'
          ? 'developerExperience'
          : code === 'focus.gaming'
            ? 'gaming'
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
