import { dictionaryIssues } from '../../src/i18n/validation.ts';
import { pagePath } from '../../src/routing.ts';
import { plannedLocales, type Locale } from '../../src/i18n/locales.ts';
import {
  contentUnits,
  reviewReport,
  type ReviewRecords,
} from './translation-review.ts';

export interface PublicationReview {
  approved: boolean;
  approvedBy: string | null;
  units: ReviewRecords;
}

/** Pure, injectable gate; enabling a locale in the registry cannot bypass it. */
export function publicationIssues(
  locale: string,
  source: unknown,
  dictionary: unknown,
  review: PublicationReview | undefined,
): string[] {
  if (!dictionary) return [`${locale}: complete dictionary missing`];
  const issues = dictionaryIssues(dictionary, source).map(
    (path) => `${locale}: incomplete or invalid ${path}`,
  );
  for (const [path, unit] of Object.entries(contentUnits(dictionary)))
    if (unit.kind === 'message' && unit.locale !== locale)
      issues.push(`${locale}: incorrect message locale ${path}`);
  if (!plannedLocales.some((planned) => planned === locale))
    issues.push(`${locale}: locale is not actively planned`);
  if (locale === 'en') return issues;
  if (
    review?.approved !== true ||
    typeof review.approvedBy !== 'string' ||
    !review.approvedBy.trim()
  )
    issues.push(`${locale}: explicit publication approval missing`);
  const report = reviewReport(source, dictionary, review?.units ?? {});
  for (const [reason, paths] of Object.entries(report))
    for (const path of paths) issues.push(`${locale}: ${reason} ${path}`);
  return issues;
}

/** Both equivalents must exist, and unfinished or unrelated HTML must not ship. */
export function pageOutputIssues(
  files: readonly string[],
  locales: readonly Locale[],
): string[] {
  const expected = locales.flatMap((locale) =>
    (['home', 'quiz'] as const).map(
      (page) => `${pagePath(page, locale).slice(1)}index.html`,
    ),
  );
  return [
    ...expected
      .filter((file) => !files.includes(file))
      .map((file) => `Missing published page: ${file}`),
    ...files
      .filter((file) => !expected.includes(file))
      .map((file) => `Unexpected page: ${file}`),
  ].sort();
}
