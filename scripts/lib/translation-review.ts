import { createHash } from 'node:crypto';
import type { Locale } from '../../src/i18n/locales.ts';
import { messageUnit } from '../../src/i18n/message.ts';

export type ContentUnit =
  | { kind: 'text'; text: string }
  | { kind: 'message'; template: string; parameters: unknown; locale: Locale };
export type Review = {
  status: 'reviewed';
  sourceHash: string;
  translationHash: string;
  reviewedBy: string;
};
export type ReviewRecords = Record<string, Review>;

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`)
      .join(',')}}`;
  if (value === undefined)
    throw new Error('Undefined content cannot be hashed');
  return JSON.stringify(value);
}
export function unitHash(unit: ContentUnit): string {
  return createHash('sha256').update(canonical(unit), 'utf8').digest('hex');
}

/** JSON Pointer paths avoid collisions with dots/slashes inside domain IDs. */
export function contentUnits(dictionary: unknown): Record<string, ContentUnit> {
  const units: Record<string, ContentUnit> = {};
  function visit(value: unknown, path: string) {
    if (typeof value === 'string') units[path] = { kind: 'text', text: value };
    else if (typeof value === 'function') {
      const unit = messageUnit(value);
      if (!unit)
        throw new Error(`Message has no explicit source template: ${path}`);
      units[path] = { kind: 'message', ...unit };
    } else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value))
        visit(
          child,
          `${path}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`,
        );
    } else throw new Error(`Unsupported content at ${path}`);
  }
  visit(dictionary, '');
  return units;
}

export function reviewReport(
  source: unknown,
  translation: unknown,
  reviews: ReviewRecords,
) {
  const sourceUnits = contentUnits(source);
  const translatedUnits = contentUnits(translation);
  const missing: string[] = [],
    unreviewed: string[] = [],
    staleSource: string[] = [],
    changedTranslation: string[] = [],
    invalidReview: string[] = [];
  for (const [path, unit] of Object.entries(sourceUnits)) {
    const translated = translatedUnits[path];
    if (!translated) {
      missing.push(path);
      continue;
    }
    const review = reviews[path];
    if (!review) {
      unreviewed.push(path);
      continue;
    }
    if (
      review.status !== 'reviewed' ||
      typeof review.reviewedBy !== 'string' ||
      !review.reviewedBy.trim() ||
      !/^[a-f0-9]{64}$/.test(review.sourceHash) ||
      !/^[a-f0-9]{64}$/.test(review.translationHash)
    ) {
      invalidReview.push(path);
      continue;
    }
    if (review.sourceHash !== unitHash(unit)) staleSource.push(path);
    if (review.translationHash !== unitHash(translated))
      changedTranslation.push(path);
  }
  const orphaned = Object.keys(reviews).filter(
    (path) => !sourceUnits[path] || !translatedUnits[path],
  );
  const extra = Object.keys(translatedUnits).filter(
    (path) => !sourceUnits[path],
  );
  const result = {
    missing,
    unreviewed,
    staleSource,
    changedTranslation,
    invalidReview,
    orphaned,
    extra,
  };
  for (const entries of Object.values(result)) entries.sort();
  return result;
}
