import assert from 'node:assert/strict';
import { test } from 'node:test';
import { message, messageUnit } from '../src/i18n/message.ts';
import { dictionaryIssues } from '../src/i18n/validation.ts';
import {
  contentUnits,
  unitHash,
  reviewReport,
  type ReviewRecords,
} from '../scripts/lib/translation-review.ts';
import {
  publicationIssues,
  pageOutputIssues,
} from '../scripts/lib/publication.ts';
import { en } from '../src/i18n/en.ts';
import { draftEs } from '../src/i18n/es/draft.ts';
import { quizCopyEs } from '../src/i18n/es/quiz.ts';
import { validatePublication } from '../scripts/check-i18n.ts';

function accept(source: unknown, translation: unknown): ReviewRecords {
  const s = contentUnits(source),
    t = contentUnits(translation);
  return Object.fromEntries(
    Object.keys(s).map((path) => [
      path,
      {
        status: 'reviewed',
        sourceHash: unitHash(s[path]),
        translationHash: unitHash(t[path]),
        reviewedBy: 'test fixture only',
      },
    ]),
  );
}

test('source hashes are deterministic and paths avoid domain-key collisions', () => {
  const a = contentUnits({ b: 'B', a: 'A', 'x/y~z': 'C', 'a.b': 'D' });
  const b = contentUnits({ 'a.b': 'D', 'x/y~z': 'C', a: 'A', b: 'B' });
  assert.deepEqual(a, b);
  assert.ok(a['/x~1y~0z']);
  assert.ok(a['/a.b']);
  assert.equal(unitHash(a['/a']), unitHash(b['/a']));
  assert.notEqual(unitHash(a['/a']), unitHash({ kind: 'text', text: 'A ' }));
});

test('English edits flag only affected units; translation edits also invalidate review', () => {
  const source = { a: 'A', b: 'B' },
    translated = { a: 'Uno', b: 'Dos' };
  const reviews = accept(source, translated);
  assert.deepEqual(
    reviewReport({ ...source, a: 'Updated A' }, translated, reviews)
      .staleSource,
    ['/a'],
  );
  assert.deepEqual(
    reviewReport(source, { ...translated, b: 'Editado' }, reviews)
      .changedTranslation,
    ['/b'],
  );
  const report = reviewReport({ a: 'A', c: 'New' }, { a: 'Uno' }, reviews);
  assert.deepEqual(report.missing, ['/c']);
  assert.deepEqual(report.orphaned, ['/b']);
  assert.deepEqual(reviewReport(source, translated, {}).unreviewed, [
    '/a',
    '/b',
  ]);
});

test('parameterized source includes wording, number precision, and every choice branch', () => {
  const make = (template: string, digits: number) =>
    message(template, [{ name: 'n', kind: 'number', digits }]);
  const hash = (value: unknown) => unitHash(contentUnits({ value })['/value']);
  assert.notEqual(hash(make('{n} points', 1)), hash(make('{n} marks', 1)));
  assert.notEqual(hash(make('{n} points', 1)), hash(make('{n} points', 2)));
  const choice = (label: string) =>
    message('{edition}', [
      { name: 'edition', kind: 'choice', values: { kde: 'KDE', gnome: label } },
    ]);
  assert.notEqual(hash(choice('GNOME')), hash(choice('Updated GNOME')));
  assert.throws(
    () => contentUnits({ value: (n: number) => `${n}` }),
    /no explicit source template/,
  );
  assert.ok(messageUnit(en.quiz.match));
});

test('templates reject missing/unknown parameters and preserve literal replacement values', () => {
  assert.throws(
    () => message('{unknown}', [{ name: 'name', kind: 'text' }]),
    /Invalid message/,
  );
  assert.throws(
    () =>
      message('{name}', [
        { name: 'name', kind: 'text' },
        { name: 'name', kind: 'text' },
      ]),
    /Invalid message/,
  );
  const value = message('{name}: {name}', [{ name: 'name', kind: 'text' }]);
  assert.equal(value('$& {name}'), '$& {name}: $& {name}');
  assert.throws(
    () => en.platform.asahiName('invalid' as 'kde'),
    /Invalid message choice/,
  );
  assert.equal(en.platform.asahiName('gnome'), 'Fedora Asahi Remix GNOME');
});

test('Spanish can reorder parameters but cannot omit or alter the call contract', () => {
  assert.deepEqual(dictionaryIssues(quizCopyEs, en.quiz), []);
  assert.deepEqual(
    dictionaryIssues(
      {
        progress: message(
          '{total} {current}',
          [
            { name: 'current', kind: 'number' },
            { name: 'total', kind: 'number' },
          ],
          'es',
        ),
      },
      { progress: en.quiz.progress },
    ),
    [],
  );
  assert.deepEqual(
    dictionaryIssues(
      {
        match: message(
          '{percentage}',
          [{ name: 'percentage', kind: 'text' }],
          'es',
        ),
      },
      { match: en.quiz.match },
    ),
    ['match'],
  );
});

test('locale number formatting changes presentation only', () => {
  const score = 87.54;
  assert.equal(en.quiz.match(score), '87.5% preference fit');
  assert.equal(
    quizCopyEs.match(score),
    '87,5% de afinidad con tus preferencias',
  );
  assert.equal(quizCopyEs.statValue(3.5), '3,5 de 5');
  assert.equal(quizCopyEs.statScore(3.5), '3,5/5');
  assert.equal(en.quiz.statScore(3.5), '3.5/5');
  assert.equal(score, 87.54);
  assert.equal(
    quizCopyEs.capabilityComparison('Juegos', 3.5, 4.5, 'Fedora'),
    'Juegos: 3,5/5 frente a 4,5/5 de Fedora',
  );
});

test('publication rejects empty choice labels even with matching accepted hashes', () => {
  const source = { asahiName: en.platform.asahiName };
  for (const label of ['', ' \n\t']) {
    const translated = {
      asahiName: message(
        'Fedora Asahi Remix {edition}',
        [
          {
            name: 'edition',
            kind: 'choice',
            values: { kde: 'KDE', gnome: label },
          },
        ],
        'es',
      ),
    };
    assert.deepEqual(dictionaryIssues(translated, source), ['asahiName']);
    assert.ok(
      publicationIssues('es', source, translated, {
        approved: true,
        approvedBy: 'test fixture only',
        units: accept(source, translated),
      }).includes('es: incomplete or invalid asahiName'),
    );
  }
  assert.deepEqual(
    dictionaryIssues(
      { title: message(' \n', [], 'es') },
      { title: message('Title', []) },
    ),
    ['title'],
  );
});

test('publication requires complete, reviewed, current copy and separate authorization', () => {
  const source = { title: 'Title' },
    translated = { title: 'Título' };
  const review = {
    approved: true,
    approvedBy: 'test fixture only',
    units: accept(source, translated),
  };
  assert.deepEqual(publicationIssues('es', source, translated, review), []);
  assert.ok(publicationIssues('es', source, undefined, review).length);
  assert.ok(publicationIssues('es', source, {}, review).length);
  assert.ok(
    publicationIssues('es', source, translated, {
      ...review,
      approved: false,
    }).some((i) => i.includes('approval missing')),
  );
  assert.ok(
    publicationIssues('es', source, translated, { ...review, units: {} }).some(
      (i) => i.includes('unreviewed'),
    ),
  );
  assert.ok(
    publicationIssues('es', { title: 'Changed' }, translated, review).some(
      (i) => i.includes('staleSource'),
    ),
  );
  assert.ok(
    publicationIssues('es', source, { title: 'Cambio' }, review).some((i) =>
      i.includes('changedTranslation'),
    ),
  );
  assert.ok(
    publicationIssues('es', source, translated, {
      ...review,
      units: { '/title': { ...review.units['/title'], reviewedBy: '' } },
    }).some((i) => i.includes('invalidReview')),
  );
  assert.deepEqual(validatePublication(), ['en']);
});

test('Spanish draft covers supplied sections, all option IDs, Mac follow-ups and distro fields', () => {
  const source = Object.fromEntries(
    Object.keys(draftEs).map((key) => [key, en[key as keyof typeof en]]),
  );
  assert.deepEqual(dictionaryIssues(draftEs, source), []);
  assert.deepEqual(
    Object.keys(draftEs.distros).sort(),
    Object.keys(en.distros).sort(),
  );
  assert.equal(
    new Set(
      Object.values(draftEs.distros).map((distro) => distro.archetype.name),
    ).size,
    29,
  );
  assert.ok(dictionaryIssues(draftEs).includes('explanations'));
  assert.ok(draftEs.home.introduction.includes('Algunas preguntas ahora.'));
});

test('output gate rejects unfinished routes and missing published equivalents', () => {
  const english = ['index.html', 'quiz/index.html'];
  assert.deepEqual(pageOutputIssues(english, ['en']), []);
  assert.deepEqual(pageOutputIssues([...english, 'es/index.html'], ['en']), [
    'Unexpected page: es/index.html',
  ]);
  assert.deepEqual(
    pageOutputIssues([...english, 'es/index.html'], ['en', 'es']),
    ['Missing published page: es/quiz/index.html'],
  );
  assert.deepEqual(
    pageOutputIssues(
      [...english, 'es/index.html', 'es/quiz/index.html'],
      ['en', 'es'],
    ),
    [],
  );
});

test('message formatting locale is part of review content and must match publication', () => {
  const source = { value: message('{n}', [{ name: 'n', kind: 'number' }]) };
  const translated = {
    value: message('{n}', [{ name: 'n', kind: 'number' }], 'es'),
  };
  const reviews = accept(source, translated);
  const incorrect = { value: source.value };
  assert.deepEqual(
    reviewReport(source, incorrect, reviews).changedTranslation,
    ['/value'],
  );
  assert.ok(
    publicationIssues('es', source, incorrect, {
      approved: true,
      approvedBy: 'fixture only',
      units: accept(source, incorrect),
    }).some((i) => i.includes('incorrect message locale')),
  );
});

test('parameter object key order does not change the translation contract', () => {
  const source = { count: message('{n}', [{ name: 'n', kind: 'number' }]) };
  const translation = {
    count: message('{n}', [{ kind: 'number', name: 'n' }], 'es'),
  };
  assert.deepEqual(dictionaryIssues(translation, source), []);
});

test('reserved deferred locales cannot bypass the active publication plan', () => {
  for (const locale of ['fr', 'de'])
    assert.ok(
      publicationIssues(
        locale,
        {},
        {},
        { approved: true, approvedBy: 'fixture only', units: {} },
      ).some((issue) => issue.includes('not actively planned')),
    );
});
