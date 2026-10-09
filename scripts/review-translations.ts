import { existsSync, readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { en } from '../src/i18n/en.ts';
import { knownLocales } from '../src/i18n/locales.ts';
import { dictionaryIssues } from '../src/i18n/validation.ts';
import {
  contentUnits,
  unitHash,
  reviewReport,
} from './lib/translation-review.ts';
import type { PublicationReview } from './lib/publication.ts';

const usage =
  'Usage: npm run i18n:review -- [--locale <code>] [--json | --markdown | --hashes]';
try {
  const { values: options } = parseArgs({
    options: {
      locale: { type: 'string', default: 'es' },
      json: { type: 'boolean' },
      markdown: { type: 'boolean' },
      hashes: { type: 'boolean' },
    },
    allowPositionals: false,
  });
  const locale = options.locale!;
  if (
    [options.json, options.markdown, options.hashes].filter(Boolean).length > 1
  )
    throw new Error('Choose only one output mode.');
  if (!knownLocales.some((known) => known === locale))
    throw new Error(`Unknown locale "${locale}".`);
  const draftPath = new URL(`../src/i18n/${locale}/draft.ts`, import.meta.url);
  const reviewPath = new URL(
    `../src/i18n/${locale}/reviews.json`,
    import.meta.url,
  );
  if (!existsSync(draftPath))
    throw new Error(
      `No draft dictionary for locale "${locale}". Expected src/i18n/${locale}/draft.ts.`,
    );
  const exportName = `draft${locale[0].toUpperCase()}${locale.slice(1)}`;
  const draft = (await import(draftPath.href))[exportName] as
    Partial<typeof en> | undefined;
  if (!draft)
    throw new Error(`Draft for locale "${locale}" must export ${exportName}.`);
  if (!existsSync(reviewPath))
    throw new Error(
      `No review records for locale "${locale}". Expected src/i18n/${locale}/reviews.json.`,
    );
  const reviews = JSON.parse(
    readFileSync(reviewPath, 'utf8'),
  ) as PublicationReview;
  const language = new Intl.DisplayNames(['en'], { type: 'language' }).of(
    locale,
  )!;
  const source = contentUnits(en),
    translated = contentUnits(draft);
  // Validate each supplied section fully; omissions elsewhere remain explicit.
  const batchSource = Object.fromEntries(
    Object.keys(draft).map((key) => [key, en[key as keyof typeof en]]),
  );
  const invalid = dictionaryIssues(draft, batchSource);
  if (invalid.length)
    throw new Error(
      `Invalid ${language} draft sections:\n${invalid.join('\n')}`,
    );
  const report = reviewReport(en, draft, reviews.units);
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
  if (options.hashes)
    console.log(
      JSON.stringify(
        {
          locale,
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
  else if (options.json)
    console.log(JSON.stringify({ locale, summary, report, units }, null, 2));
  else if (options.markdown) {
    const escape = (value: string) =>
      value.replaceAll('|', '\\|').replaceAll('\n', ' ');
    console.log(
      `# ${language} translation review\n\nGenerated with \`npm run --silent i18n:review -- --locale ${locale} --markdown\`.\nDraft for human review; no units are automatically accepted.\nStore editorial Markdown and proposal snapshots under ignored \`docs/\`. Accepted unit hashes belong in \`src/i18n/${locale}/reviews.json\`.\n`,
    );
    console.log(
      `${summary.translatedUnits} drafted units of ${summary.sourceUnits} total English units.\n`,
    );
    console.log(
      `Text in braces marks named parameters. ${language} numeric output uses its locale (for example, \`${new Intl.NumberFormat(locale, { useGrouping: false }).format(87.5)}%\`); names and numeric calculations are preserved.\n`,
    );
    let section = '';
    // Keep question/answer intensity in the authored domain order for human review.
    for (const path of Object.keys(translated)) {
      const unit = units.find((candidate) => candidate.path === path)!;
      const group = unit.path.split('/')[1];
      if (group !== section) {
        section = group;
        console.log(
          `\n## ${section}\n\n| Key | English | ${language} |\n| --- | --- | --- |`,
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
    console.log(`${language} draft review (not publication approval):`);
    console.log(JSON.stringify(summary, null, 2));
    console.log(
      'Use --markdown for bilingual copy; --json for paths and proposed hashes.',
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error(usage);
  process.exitCode = 1;
}
