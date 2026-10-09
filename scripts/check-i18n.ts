import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { en } from '../src/i18n/en.ts';
import { dictionaries } from '../src/i18n/catalog.ts';
import { publishedLocales, type Locale } from '../src/i18n/locales.ts';
import {
  publicationIssues,
  type PublicationReview,
} from './lib/publication.ts';
import { contentUnits } from './lib/translation-review.ts';

export function validatePublication() {
  // Also reject untracked English callable messages, even with no translation yet.
  contentUnits(en);
  const issues: string[] = [];
  for (const locale of publishedLocales as readonly Locale[]) {
    const path = new URL(`../src/i18n/${locale}/reviews.json`, import.meta.url);
    const review =
      locale !== 'en' && existsSync(path)
        ? (JSON.parse(readFileSync(path, 'utf8')) as PublicationReview)
        : undefined;
    issues.push(...publicationIssues(locale, en, dictionaries[locale], review));
  }
  if (issues.length)
    throw new Error(
      `Internationalization publication gate failed:\n${issues.join('\n')}`,
    );
  return publishedLocales;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validatePublication();
  console.log(`Publication gate passed: ${publishedLocales.join(', ')}`);
}
