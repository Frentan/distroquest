import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { recommend } from '../src/recommendations/engine.ts';
import type { RecommendationResult } from '../src/domain/recommendations.ts';
import {
  examplePersonaNames,
  recommendationPersonas,
} from './recommendation-personas.ts';

// Internal development output; no browser dependencies or application UI copy.
export function formatRankingTable(result: RecommendationResult): string {
  return [
    '| # | Distro | Eligible | Raw | Normalized | Capability | Traits | Specialist | Eligibility | Breadth |',
    '| ---: | :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...result.ranking.map(
      (row, index) =>
        `| ${index + 1} | ${row.distroId} | ${row.eligible} | ${[row.rawScore, row.normalizedScore, row.capabilityScore, row.traitAdjustment, row.specialistAdjustment, row.eligibilityAdjustment, row.breadthAdjustment].map((value) => value.toFixed(2)).join(' | ')} |`,
    ),
  ].join('\n');
}

export function formatExampleRankings(): string {
  return [
    '# Example rankings, model v9',
    '',
    `All ${examplePersonaNames.length} complete answer fixtures from`,
    '[`scripts/recommendation-personas.ts`](../../scripts/recommendation-personas.ts).',
    'Values are development score points, not match probabilities. Tables round for',
    'readability; the engine sorts unrounded raw scores. Each persona is also',
    'available through the CLI and tests.',
    '',
    'Regenerate with `npm run --silent recommendations:review -- --examples > src/recommendations/EXAMPLES.md`, then run `npm run format`.',
    '',
    ...examplePersonaNames.map((name) => `- [${name}](#${name.toLowerCase()})`),
    '',
    ...examplePersonaNames.map(
      (name) =>
        `## ${name}\n\n${formatRankingTable(recommend(recommendationPersonas[name]))}\n`,
    ),
  ].join('\n');
}

export function reviewRecommendations(args: readonly string[]): string {
  if (args.includes('--examples')) {
    if (args.length !== 1)
      throw new Error('--examples cannot be combined with other arguments');
    return formatExampleRankings();
  }
  let json = false;
  let persona: string | undefined;
  let answerFile: string | undefined;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--json' && !json) json = true;
    else if (
      (arg === '--persona' && !persona) ||
      (arg === '--answers' && !answerFile)
    ) {
      const value = args[++index];
      if (!value || value.startsWith('--'))
        throw new Error(`Missing value for ${arg}`);
      if (arg === '--persona') persona = value;
      else answerFile = value;
    } else throw new Error(`Unknown or duplicate argument: ${arg}`);
  }
  if (persona && answerFile)
    throw new Error('Choose either --persona or --answers');
  const examples: Record<string, unknown> = recommendationPersonas;
  if (persona && !Object.hasOwn(examples, persona))
    throw new Error(
      `Unknown persona: ${persona}. Available: ${Object.keys(examples).join(', ')}`,
    );
  const inputs = answerFile
    ? { supplied: JSON.parse(readFileSync(answerFile, 'utf8')) as unknown }
    : persona
      ? { [persona]: examples[persona] }
      : examples;
  const results = Object.fromEntries(
    Object.entries(inputs).map(([name, answers]) => [name, recommend(answers)]),
  );
  return json
    ? JSON.stringify(results, null, 2)
    : Object.entries(results)
        .map(([name, result]) => `### ${name}\n\n${formatRankingTable(result)}`)
        .join('\n\n');
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    console.log(reviewRecommendations(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
