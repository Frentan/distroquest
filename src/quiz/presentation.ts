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

/** Use the same translated, truncated primary reasons that the card renders. */
export function reasonsForCard(
  row: Recommendation,
  explainReason: (code: string) => string | undefined,
  primary?: Recommendation,
): string[] {
  const topic = (code: string) =>
    code.startsWith('capability.')
      ? code.split('.').slice(0, 2).join('.')
      : code;
  const primaryTopics = new Set(
    primary ? reasonsForCard(primary, explainReason).map(topic) : [],
  );
  return strongestReasons(row)
    .filter((code) => !primaryTopics.has(topic(code)) && !!explainReason(code))
    .slice(0, primary ? 2 : 4);
}

/** Select one substantial existing caution; this never changes the ranking. */
export function primaryCaution(
  row: Recommendation,
  availableCautions: readonly string[],
): string | undefined {
  const totalWeight = row.capabilityMatches.reduce(
    (sum, match) => sum + match.weight,
    0,
  );
  const candidates = [
    ...row.capabilityMatches.flatMap((match) => {
      // Ignore near matches and gaps costing less than three capability points.
      const loss = totalWeight
        ? (100 * match.weight * (1 - match.similarity)) / totalWeight
        : 0;
      return match.effectiveDistance >= 1 && loss >= 3
        ? [
            {
              code: `capability.${match.capability}.${match.capability === 'freshness' ? 'distance' : 'shortfall'}`,
              loss,
            },
          ]
        : [];
    }),
    // Strong release/workflow/focus conflicts already have concrete cautions.
    ...row.traitModifiers
      .filter(
        (modifier) => modifier.points <= -4 && modifier.code !== 'traits.cap',
      )
      .map((modifier) => ({ code: modifier.code, loss: -modifier.points })),
  ];
  return candidates
    .filter((candidate) => availableCautions.includes(candidate.code))
    .sort((a, b) => b.loss - a.loss)[0]?.code;
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
