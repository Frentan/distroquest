import assert from 'node:assert/strict';
import { test } from 'node:test';
import { questions } from '../src/data/questions.ts';
import { distroIds } from '../src/domain/distro.ts';
import type { Platform } from '../src/domain/platform.ts';
import { recommend } from '../src/recommendations/engine.ts';
import {
  applyPlatform,
  getPlatformFollowup,
  resolvePlatform,
} from '../src/platforms/compatibility.ts';
import { platformShortlist } from '../src/quiz/platform-presentation.ts';
import { percentMatch } from '../src/quiz/presentation.ts';
import {
  startQuiz,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  hasValidAnswer,
  getQuizProgress,
  goToQuestion,
} from '../src/quiz/state.ts';
import { recommendationPersonas as personas } from '../scripts/recommendation-personas.ts';

const result = recommend(personas.beginner);
const gpuIndex = questions.findIndex((q) => q.id === 'gpu');
const atGpu = (choice: string) =>
  selectAnswer(
    { ...startQuiz(), current: gpuIndex, answers: personas.beginner },
    choice,
  );

test('graphics intake merges the open-driver path and keeps explicit Mac branches', () => {
  assert.deepEqual(
    questions[gpuIndex].options.map((o) => o.id),
    ['nvidia', 'open-driver', 'apple-silicon', 'intel-mac', 'unknown'],
  );
  assert.equal(getPlatformFollowup({ gpu: ['open-driver'] }), undefined);
  assert.equal(resolvePlatform({ gpu: ['open-driver'] }, null), 'x86-standard');
  assert.equal(resolvePlatform({ gpu: ['nvidia'] }, null), 'x86-standard');
  assert.equal(resolvePlatform({ gpu: ['unknown'] }, null), 'unknown');
  assert.equal(
    resolvePlatform({ gpu: ['apple-silicon'] }, 'invalid'),
    'apple-silicon-unknown',
  );
  assert.equal(
    resolvePlatform({ gpu: ['intel-mac'] }, 'unknown'),
    'intel-mac-unknown-t2',
  );
  assert.equal(distroIds.length, 25);
});
test('ordinary PCs and Intel Macs retain the original eligible preference order and scores', () => {
  for (const platform of ['x86-standard', 'intel-mac'] as const) {
    const view = applyPlatform(result, platform);
    assert.deepEqual(
      view.practical.map((row) => row.recommendation),
      result.ranking.filter((row) => row.eligible),
    );
    assert.ok(view.practical.every((row) => row.support === 'native'));
  }
});
test('M1/M2 only exposes Fedora Asahi variants as verified practical paths', () => {
  const snapshot = JSON.stringify(result);
  const view = applyPlatform(result, 'apple-silicon-m1-m2');
  assert.equal(view.practical.length, 2);
  assert.ok(
    view.practical.every(
      (row) =>
        row.variant?.id === 'fedora-asahi-remix' &&
        row.support === 'supported-with-special-path',
    ),
  );
  assert.deepEqual(
    new Set(view.practical.map((row) => row.variant!.edition)),
    new Set(['kde', 'gnome']),
  );
  assert.equal(view.preferenceWinner, result.ranking[0]);
  assert.equal(JSON.stringify(result), snapshot);
  const shortlist = platformShortlist(view);
  assert.ok(shortlist.sameEdition);
  assert.equal(shortlist.alternatives.length, 0);
  assert.equal(shortlist.comparisons.length, 2);
  assert.ok(shortlist.comparisons.every((row) => row.support === 'unknown'));
});
test('Fedora Asahi desktop selection follows Fedora preference order, not a UI bonus', () => {
  const kde = result.ranking.find((row) => row.distroId === 'fedora-kde')!;
  const gnome = result.ranking.find(
    (row) => row.distroId === 'fedora-workstation',
  )!;
  for (const [first, second] of [
    [kde, gnome],
    [gnome, kde],
  ]) {
    const ordered = {
      ...result,
      ranking: [
        first,
        second,
        ...result.ranking.filter((row) => row !== first && row !== second),
      ],
    };
    const view = platformShortlist(
      applyPlatform(ordered, 'apple-silicon-m1-m2'),
    );
    assert.equal(view.primary.variant!.baseDistroId, first.distroId);
    assert.equal(view.primary.recommendation.rawScore, first.rawScore);
  }
});
test('M3 is experimental; newer and unidentified chips never claim a supported installer', () => {
  for (const platform of [
    'apple-silicon-m3',
    'apple-silicon-m4-plus',
    'apple-silicon-unknown',
  ] as const) {
    const view = applyPlatform(result, platform);
    assert.equal(view.practical.length, 0);
    assert.equal(platformShortlist(view).preferenceOnly, true);
    const fedora = view.candidates.filter((row) => row.variant);
    assert.ok(
      fedora.every(
        (row) =>
          row.support ===
          (platform === 'apple-silicon-m3' ? 'experimental' : 'unknown'),
      ),
    );
    assert.ok(
      view.candidates.every(
        (row) =>
          !['native', 'supported-with-special-path'].includes(row.support),
      ),
    );
  }
});
test('T2 tiers prioritize maintained paths, preserve preference order inside each tier, and never change scores', () => {
  const ranked = {
    ...result,
    ranking: [...result.ranking].sort(
      (a, b) =>
        Number(b.distroId === 'debian') - Number(a.distroId === 'debian'),
    ),
  };
  const snapshot = JSON.stringify(ranked);
  const view = applyPlatform(ranked, 'intel-mac-t2');
  const firstManual = view.practical.findIndex(
    (row) => row.installation === 'manual',
  );
  assert.ok(firstManual > 0);
  assert.ok(
    view.practical
      .slice(0, firstManual)
      .every((row) => row.installation === 'guided'),
  );
  assert.ok(
    view.practical
      .slice(firstManual)
      .every((row) => row.installation === 'manual'),
  );
  for (const installation of ['guided', 'manual']) {
    assert.deepEqual(
      view.practical
        .filter((row) => row.installation === installation)
        .map((row) => row.recommendation),
      view.candidates
        .filter((row) => row.installation === installation)
        .map((row) => row.recommendation),
    );
  }
  assert.equal(view.preferenceWinner.distroId, 'debian');
  assert.equal(view.practical[firstManual].recommendation.distroId, 'debian');
  assert.equal(JSON.stringify(ranked), snapshot);
  assert.ok(
    view.practical.every((row) => row.recommendation.eligible && row.url),
  );
  assert.ok(view.candidates.some((row) => row.support === 'unknown'));
});
test('unknown T2 status never silently becomes a non-T2 Mac', () => {
  const view = applyPlatform(result, 'intel-mac-unknown-t2');
  assert.equal(view.practical.length, 0);
  assert.ok(view.candidates.every((row) => row.support === 'unknown'));
  assert.equal(
    platformShortlist(view).primary.recommendation,
    result.ranking[0],
  );
});
test('each Mac follow-up is required, counted, retained on Back, and resolves the right platform', () => {
  const cases: [string, string, Platform][] = [
    ['apple-silicon', 'm1-m2', 'apple-silicon-m1-m2'],
    ['apple-silicon', 'm3', 'apple-silicon-m3'],
    ['apple-silicon', 'm4-plus', 'apple-silicon-m4-plus'],
    ['apple-silicon', 'unknown', 'apple-silicon-unknown'],
    ['intel-mac', 'yes', 'intel-mac-t2'],
    ['intel-mac', 'no', 'intel-mac'],
    ['intel-mac', 'unknown', 'intel-mac-unknown-t2'],
  ];
  for (const [choice, answer, platform] of cases) {
    let state = atGpu(choice);
    assert.deepEqual(getQuizProgress(state), { current: 12, total: 17 });
    state = nextQuestion(state);
    assert.equal(state.followup, true);
    assert.deepEqual(getQuizProgress(state), { current: 13, total: 17 });
    assert.equal(hasValidAnswer(state), false);
    assert.equal(nextQuestion(state), state);
    assert.equal(selectAnswer(state, 'invalid'), state);
    state = selectAnswer(state, answer);
    assert.equal(hasValidAnswer(state), true);
    state = nextQuestion(state);
    assert.equal(state.followup, false);
    assert.deepEqual(getQuizProgress(state), { current: 14, total: 17 });
    state = previousQuestion(state);
    assert.equal(state.followup, true);
    assert.equal(state.platformAnswer, answer);
    state = previousQuestion(state);
    assert.equal(state.followup, false);
    assert.equal(state.current, gpuIndex);
    assert.equal(state.answers.gpu![0], choice);
    state = nextQuestion(state);
    state = nextQuestion(state);
    state = goToQuestion(state, questions.length - 1);
    state = nextQuestion(state, (answers) => {
      assert.equal(Object.keys(answers).length, 16);
      assert.equal('platformAnswer' in answers, false);
      return recommend(answers);
    });
    assert.equal(state.completed, true);
    assert.equal(state.platformResult!.platform, platform);
  }
});
test('changing Mac type discards stale branch answers and computed platform results', () => {
  let state = nextQuestion(atGpu('apple-silicon'));
  state = selectAnswer(state, 'm1-m2');
  state = previousQuestion(state);
  state = selectAnswer(state, 'intel-mac');
  assert.equal(state.platformAnswer, null);
  state = nextQuestion(state);
  assert.equal(hasValidAnswer(state), false);
  state = selectAnswer(state, 'yes');
  state = previousQuestion(state);
  state = selectAnswer(state, 'open-driver');
  assert.equal(state.platformAnswer, null);
  assert.equal(state.platformResult, null);
  assert.deepEqual(getQuizProgress(state), { current: 12, total: 16 });
  state = nextQuestion(state);
  assert.equal(state.current, gpuIndex + 1);
  assert.equal(state.followup, false);
  assert.equal(startQuiz().platformAnswer, null);
});
test('missing conditional answers cannot be bypassed at final completion', () => {
  const state = { ...atGpu('apple-silicon'), current: questions.length - 1 };
  assert.equal(nextQuestion(state).completed, false);
  assert.equal(nextQuestion(state).error, true);
});
test('percent display rounds to tenths without changing ranking precision', () => {
  const row = result.ranking[0];
  for (const [score, expected] of [
    [88, 88],
    [88.2, 88.2],
    [88.25, 88.3],
    [88.5, 88.5],
    [88.74, 88.7],
    [88.75, 88.8],
  ]) {
    assert.equal(percentMatch({ ...row, normalizedScore: score }), expected);
  }
  for (const recommendation of result.ranking)
    assert.equal(
      percentMatch(recommendation),
      Math.round(recommendation.normalizedScore * 10) / 10,
    );
});
