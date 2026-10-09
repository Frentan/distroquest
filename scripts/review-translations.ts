import { readFileSync } from 'node:fs';
import { en } from '../src/i18n/en.ts';
import { draftEs } from '../src/i18n/es/draft.ts';
import { dictionaryIssues } from '../src/i18n/validation.ts';
import {
  contentUnits,
  unitHash,
  reviewReport,
} from './lib/translation-review.ts';
import type { PublicationReview } from './lib/publication.ts';

const args = process.argv.slice(2);
if (
  args.some((arg) => !['--json', '--markdown', '--hashes'].includes(arg)) ||
  args.length > 1
) {
  console.error(
    'Usage: npm run i18n:review -- [--json | --markdown | --hashes]',
  );
  process.exitCode = 1;
} else {
  const reviews = JSON.parse(
    readFileSync(
      new URL('../src/i18n/es/reviews.json', import.meta.url),
      'utf8',
    ),
  ) as PublicationReview;
  const source = contentUnits(en),
    translated = contentUnits(draftEs);
  // Validate each supplied section fully; omissions elsewhere remain explicit.
  const batchSource = Object.fromEntries(
    Object.keys(draftEs).map((key) => [key, en[key as keyof typeof en]]),
  );
  const invalid = dictionaryIssues(draftEs, batchSource);
  if (invalid.length)
    throw new Error(`Invalid Spanish draft sections:\n${invalid.join('\n')}`);
  const report = reviewReport(en, draftEs, reviews.units);
  const units = Object.keys(translated)
    .sort()
    .map((path) => ({
      path,
      source: source[path],
      translation: translated[path],
      sourceHash: source[path] ? unitHash(source[path]) : null,
      translationHash: unitHash(translated[path]),
      reviewed:
        !!reviews.units[path] &&
        !Object.values(report).some((paths) => paths.includes(path)),
    }));
  const summary = {
    sourceUnits: Object.keys(source).length,
    translatedUnits: units.length,
    ...Object.fromEntries(
      Object.entries(report).map(([key, paths]) => [key, paths.length]),
    ),
  };
  if (args.includes('--hashes'))
    console.log(
      JSON.stringify(
        {
          locale: 'es',
          status: 'proposed',
          units: Object.fromEntries(
            units.map((unit) => [
              unit.path,
              {
                sourceHash: unit.sourceHash,
                translationHash: unit.translationHash,
              },
            ]),
          ),
        },
        null,
        2,
      ),
    );
  else if (args.includes('--json'))
    console.log(
      JSON.stringify({ locale: 'es', summary, report, units }, null, 2),
    );
  else if (args.includes('--markdown')) {
    const escape = (value: string) =>
      value.replaceAll('|', '\\|').replaceAll('\n', ' ');
    console.log(
      '# Spanish translation review\n\nGenerated with `npm run --silent i18n:review -- --markdown`.\nDraft for human review; no units are automatically accepted.\nStore editorial Markdown and proposal snapshots under ignored `docs/`. Accepted unit hashes belong in `src/i18n/es/reviews.json`.\n',
    );
    console.log(
      `${summary.translatedUnits} drafted units of ${summary.sourceUnits} total English units.\n`,
    );
    console.log(
      'Text in braces marks named parameters. Spanish numeric output uses its locale (for example, `87,5%`); names and numeric calculations are preserved.\n',
    );
    let section = '';
    // Keep question/answer intensity in the authored domain order for human review.
    for (const path of Object.keys(translated)) {
      const unit = units.find((candidate) => candidate.path === path)!;
      const group = unit.path.split('/')[1];
      if (group !== section) {
        section = group;
        console.log(
          `\n## ${section}\n\n| Key | English | Spanish |\n| --- | --- | --- |`,
        );
      }
      const text = (value: typeof unit.source) =>
        value?.kind === 'message'
          ? value.template
          : (value?.text ?? '[missing source]');
      console.log(
        `| \`${unit.path}\` | ${escape(text(unit.source))} | ${escape(text(unit.translation))} |`,
      );
    }
  } else {
    console.log('Spanish draft review (not publication approval):');
    console.log(JSON.stringify(summary, null, 2));
    console.log(
      'Use --markdown for bilingual copy; --json for paths and proposed hashes.',
    );
  }
}
