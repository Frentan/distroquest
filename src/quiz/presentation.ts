import type {
  RecommendationResult,
  Recommendation,
} from '../domain/recommendations.ts';
import type { UseCase } from '../domain/preferences.ts';

export function strongestReasons(row: Recommendation): string[] {
  const points = new Map(
    [...row.traitModifiers, ...row.specialistModifiers].map(
      ({ code, points }) => [code, points],
    ),
  );
  const capabilities = [...row.capabilityMatches]
    .sort((a, b) => b.contribution - a.contribution)
    .flatMap((match) =>
      row.reasons.filter((code) =>
        code.startsWith(`capability.${match.capability}.`),
      ),
    );
  // Specialists retain priority; other traits use their existing contribution.
  // Stable ties retain engine order. Selection never changes scoring or ranking.
  const traits = row.reasons
    .filter(
      (code) =>
        !code.startsWith('capability.') &&
        !code.startsWith('constraint.') &&
        code !== 'breadth.prior',
    )
    .sort(
      (a, b) =>
        Number(b.startsWith('specialist.')) -
          Number(a.startsWith('specialist.')) ||
        (points.get(b) ?? 0) - (points.get(a) ?? 0),
    );
  const topics = new Set<string>();
  function takeDistinct(codes: readonly string[], limit: number): string[] {
    const selected: string[] = [];
    for (const code of codes) {
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
                : code === 'focus.minimalism' ||
                    code === 'specialist.minimalist-self-build'
                  ? 'minimalism'
                  : code.startsWith('capability.')
                    ? code.split('.')[1]
                    : code;
      if (topics.has(topic)) continue;
      topics.add(topic);
      selected.push(code);
      if (selected.length === limit) break;
    }
    return selected;
  }
  const selectedTraits = takeDistinct(traits, 2);
  return [
    ...selectedTraits,
    ...takeDistinct(capabilities, 5 - selectedTraits.length),
  ];
}

/** Pass only reasons actually rendered on this card, after filtering/truncation. */
export function cautionsForVisibleReasons(
  cautions: readonly string[],
  visibleReasons: readonly string[],
): string[] {
  const nearCapabilities = new Set(
    visibleReasons.flatMap((code) => {
      const match = /^capability\.([^.]+)\.near$/.exec(code);
      return match ? [match[1]] : [];
    }),
  );
  return cautions.filter((code) => {
    const match = /^capability\.([^.]+)\.(shortfall|distance)$/.exec(code);
    // Gaming's caution also asks for game/hardware support checks; retain it.
    return !match || match[1] === 'gaming' || !nearCapabilities.has(match[1]);
  });
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
