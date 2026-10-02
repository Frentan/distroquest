import type { PlatformCandidate, PlatformResult } from '../domain/platform.ts';
export function platformShortlist(result: PlatformResult) {
  const preferenceOnly = result.practical.length === 0;
  const pool = preferenceOnly ? result.candidates : result.practical;
  const primary = pool[0];
  if (!primary) throw new Error('Empty platform shortlist');
  const group = primary.recommendation.presentationGroup;
  const sameEdition = pool.find(
    (row) => row !== primary && row.recommendation.presentationGroup === group,
  );
  const groups = new Set([group]);
  const alternatives: PlatformCandidate[] = [];
  for (const row of pool) {
    if (groups.has(row.recommendation.presentationGroup)) continue;
    groups.add(row.recommendation.presentationGroup);
    alternatives.push(row);
    if (alternatives.length === 2) break;
  }
  // On supported Apple Silicon the two Fedora desktops are installation paths;
  // retain other personality matches explicitly as preference-only comparisons.
  const comparisons =
    result.platform.startsWith('apple-silicon') && !preferenceOnly
      ? result.candidates
          .filter((row) => row.recommendation.presentationGroup !== group)
          .slice(0, 2)
      : [];
  return { primary, sameEdition, alternatives, comparisons, preferenceOnly };
}
