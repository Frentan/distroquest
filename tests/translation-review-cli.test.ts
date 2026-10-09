import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
function run(args: string[], cwd = root) {
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_NO_WARNINGS: '1' };
  // Run a normal CLI subprocess rather than inheriting Node's test-runner protocol.
  delete env.NODE_TEST_CONTEXT;
  return spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      join(cwd, 'scripts/review-translations.ts'),
      ...args,
    ],
    { cwd, encoding: 'utf8', env },
  );
}

test('review CLI defaults to Spanish and preserves every explicit-locale output mode', () => {
  for (const mode of [[], ['--json'], ['--markdown'], ['--hashes']]) {
    const implicit = run(mode),
      explicit = run(['--locale', 'es', ...mode]);
    assert.equal(implicit.status, 0, implicit.stderr);
    assert.equal(explicit.status, 0, explicit.stderr);
    assert.equal(implicit.stdout, explicit.stdout);
    if (mode[0] === '--json') {
      const report = JSON.parse(explicit.stdout);
      assert.equal(report.locale, 'es');
      assert.equal(report.summary.translatedUnits, report.units.length);
      assert.ok(report.summary.translatedUnits > 0);
    }
  }
});

test('review CLI clearly rejects missing drafts and malformed arguments', () => {
  for (const locale of ['it', 'pt']) {
    const result = run(['--locale', locale]);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.ok(
      result.stderr.includes(`No draft dictionary for locale "${locale}"`),
    );
    assert.ok(result.stderr.includes(`src/i18n/${locale}/draft.ts`));
  }
  for (const args of [
    ['--locale'],
    ['--locale', '../../outside'],
    ['--json', '--hashes'],
    ['--unknown'],
    ['es'],
  ]) {
    const result = run(args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Usage: npm run i18n:review/);
  }
});

test('review CLI loads a requested draft and its records without Spanish-specific output', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'distroquest-i18n-cli-'));
  try {
    cpSync(join(root, 'scripts'), join(fixture, 'scripts'), {
      recursive: true,
    });
    cpSync(join(root, 'src'), join(fixture, 'src'), { recursive: true });
    writeFileSync(join(fixture, 'package.json'), '{"type":"module"}');
    // Test-only data in a disposable checkout; no Italian translation is authored.
    const localeDir = join(fixture, 'src/i18n/it');
    mkdirSync(localeDir);
    writeFileSync(
      join(localeDir, 'draft.ts'),
      "import { en } from '../en.ts'; export const draftIt = { capabilityLabels: en.capabilityLabels };",
    );
    writeFileSync(join(localeDir, 'reviews.json'), '{"units":{}}');
    const json = run(['--json', '--locale', 'it'], fixture);
    assert.equal(json.status, 0, json.stderr);
    const report = JSON.parse(json.stdout);
    assert.equal(report.locale, 'it');
    assert.equal(report.summary.translatedUnits, 10);
    assert.equal(report.summary.unreviewed, 10);
    const hashes = run(['--locale', 'it', '--hashes'], fixture);
    assert.equal(hashes.status, 0, hashes.stderr);
    assert.equal(JSON.parse(hashes.stdout).locale, 'it');
    assert.equal(Object.keys(JSON.parse(hashes.stdout).units).length, 10);
    const markdown = run(['--locale', 'it', '--markdown'], fixture);
    assert.equal(markdown.status, 0, markdown.stderr);
    assert.match(markdown.stdout, /^# Italian translation review/);
    assert.match(markdown.stdout, /src\/i18n\/it\/reviews\.json/);
    assert.match(markdown.stdout, /\| Key \| English \| Italian \|/);
    assert.doesNotMatch(markdown.stdout, /Spanish|src\/i18n\/es\//);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
