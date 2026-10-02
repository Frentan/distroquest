import {
  platformFollowups,
  platformSources,
  t2Paths,
} from '../data/platforms.ts';
import type { AnswerSet } from '../domain/preferences.ts';
import type {
  Platform,
  PlatformCandidate,
  PlatformFollowup,
  PlatformResult,
} from '../domain/platform.ts';
import type {
  Recommendation,
  RecommendationResult,
} from '../domain/recommendations.ts';

export function getPlatformFollowup(
  answers: Partial<AnswerSet>,
): PlatformFollowup | undefined {
  const option = answers.gpu?.[0];
  if (option === 'apple-silicon' || option === 'intel-mac')
    return platformFollowups[option];
}
export function resolvePlatform(
  answers: Partial<AnswerSet>,
  followupAnswer: string | null,
): Platform {
  const followup = getPlatformFollowup(answers);
  if (followup)
    return (
      followup.options.find((option) => option.id === followupAnswer)
        ?.platform ??
      (followup.id === 'apple-generation'
        ? 'apple-silicon-unknown'
        : 'intel-mac-unknown-t2')
    );
  return ['nvidia', 'open-driver'].includes(answers.gpu?.[0] ?? '')
    ? 'x86-standard'
    : 'unknown';
}
function candidate(
  recommendation: Recommendation,
  platform: Platform,
): PlatformCandidate {
  const fedora =
    recommendation.distroId === 'fedora-kde' ||
    recommendation.distroId === 'fedora-workstation';
  if (platform.startsWith('apple-silicon')) {
    if (!fedora)
      return { recommendation, support: 'unknown', installation: 'unverified' };
    const variant = {
      id: 'fedora-asahi-remix',
      baseDistroId: recommendation.distroId,
      edition: recommendation.distroId === 'fedora-kde' ? 'kde' : 'gnome',
    } as const;
    if (platform === 'apple-silicon-m1-m2')
      return {
        recommendation,
        support: 'supported-with-special-path',
        installation: 'guided',
        url: platformSources.asahi,
        variant,
      };
    if (platform === 'apple-silicon-m3')
      return {
        recommendation,
        support: 'experimental',
        installation: 'unverified',
        url: platformSources.m3,
        variant,
      };
    // M4/newer and unidentified chips have no verified supported path in this
    // dataset. Unknown is safer than extending an M4 assertion to future chips.
    return {
      recommendation,
      support: 'unknown',
      installation: 'unverified',
      url:
        platform === 'apple-silicon-m4-plus'
          ? platformSources.m4
          : platformSources.appleChip,
      variant,
    };
  }
  if (platform === 'intel-mac-t2') {
    const path = t2Paths[recommendation.distroId];
    return path
      ? { recommendation, support: 'supported-with-special-path', ...path }
      : {
          recommendation,
          support: 'unknown',
          installation: 'unverified',
          url: platformSources.t2,
        };
  }
  if (platform === 'x86-standard' || platform === 'intel-mac')
    return { recommendation, support: 'native', installation: 'standard' };
  return {
    recommendation,
    support: 'unknown',
    installation: 'unverified',
    ...(platform === 'intel-mac-unknown-t2'
      ? { url: platformSources.t2Chip }
      : {}),
  };
}
export function applyPlatform(
  result: RecommendationResult,
  platform: Platform,
): PlatformResult {
  const eligible = result.ranking.filter((row) => row.eligible);
  if (!eligible.length) throw new Error('No eligible recommendations');
  const candidates = eligible.map((row) => candidate(row, platform));
  const supported = (row: PlatformCandidate) =>
    row.support === 'native' || row.support === 'supported-with-special-path';
  let practical = candidates.filter(supported);
  if (platform === 'intel-mac-t2') {
    // Stable support-tier ordering: maintained paths first, manual paths second;
    // original preference order breaks ties. No numeric hardware penalties.
    practical = [...practical].sort(
      (a, b) =>
        Number(a.installation === 'manual') -
        Number(b.installation === 'manual'),
    );
  }
  return { platform, preferenceWinner: eligible[0], candidates, practical };
}
