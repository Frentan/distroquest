import assert from 'node:assert/strict';
import { test } from 'node:test';
import { questions } from '../src/data/questions.ts';
import {
  startQuiz,
  hasValidAnswer,
  selectAnswer,
  goToQuestion,
  nextQuestion,
} from '../src/quiz/state.ts';
import {
  percentMatch,
  preparationTopics,
  shortlist,
  strongestReasons,
} from '../src/quiz/presentation.ts';
import { recommend } from '../src/recommendations/engine.ts';
import { recommendationPersonas as personas } from '../scripts/recommendation-personas.ts';
import { explainReason, explainCaution } from '../src/i18n/en/quiz.ts';
import type { Recommendation } from '../src/domain/recommendations.ts';

test('starts unanswered; cannot advance or skip; ignores unknown options', () => {
  const state = startQuiz();
  assert.equal(state.current, 0);
  assert.deepEqual(state.answers, {});
  assert.equal(hasValidAnswer(state), false);
  assert.equal(state.completed, false);
  assert.equal(nextQuestion(state), state);
  assert.equal(goToQuestion(state, 5), state);
  assert.equal(selectAnswer(state, 'unknown'), state);
});
test('stores answers, retains them going back, and replaces a single answer', () => {
  let state = selectAnswer(startQuiz(), questions[0].options[0].id);
  assert.equal(hasValidAnswer(state), true);
  state = nextQuestion(state);
  assert.equal(state.current, 1);
  state = goToQuestion(state, 0);
  assert.deepEqual(state.answers.experience, [questions[0].options[0].id]);
  state = selectAnswer(state, questions[0].options[1].id);
  assert.deepEqual(state.answers.experience, [questions[0].options[1].id]);
});
test('multi-select toggles and enforces the domain limit', () => {
  let state = {
    ...startQuiz(),
    current: questions.findIndex((q) => q.selection === 'multiple'),
  };
  const question = questions[state.current];
  for (const option of question.options.slice(0, question.maxSelections + 1))
    state = selectAnswer(state, option.id);
  assert.equal(state.answers[question.id]!.length, question.maxSelections);
  state = selectAnswer(state, question.options[0].id);
  assert.equal(state.answers[question.id]!.length, question.maxSelections - 1);
  state = selectAnswer(state, question.options[question.maxSelections].id);
  assert.ok(
    state.answers[question.id]!.includes(
      question.options[question.maxSelections].id,
    ),
  );
});
test('complete questionnaire passes the full exact answers to the real engine', () => {
  let state = startQuiz();
  for (const question of questions) {
    for (const id of personas.beginner[question.id])
      state = selectAnswer(state, id);
    state = nextQuestion(state, (answers) => {
      assert.deepEqual(answers, personas.beginner);
      return recommend(answers);
    });
  }
  assert.equal(state.completed, true);
  assert.equal(state.result!.ranking.length, 25);
  assert.deepEqual(state.result, recommend(personas.beginner));
  state = goToQuestion(state, 0);
  assert.equal(state.completed, false);
  assert.deepEqual(state.answers, personas.beginner);
  state = selectAnswer(state, questions[0].options[3].id);
  assert.equal(state.result, null);
  state = goToQuestion(state, questions.length - 1);
  state = nextQuestion(state);
  assert.equal(state.completed, true);
  assert.notDeepEqual(
    state.result!.profile,
    recommend(personas.beginner).profile,
  );
  state = startQuiz();
  assert.deepEqual(state.answers, {});
  assert.equal(state.result, null);
});
test('computation failure keeps answers and permits a retry', () => {
  const state = {
    ...startQuiz(),
    current: questions.length - 1,
    answers: personas.beginner,
  };
  const failed = nextQuestion(state, () => {
    throw new Error('test failure');
  });
  assert.equal(failed.error, true);
  assert.equal(failed.completed, false);
  assert.deepEqual(failed.answers, personas.beginner);
  assert.equal(nextQuestion(failed).completed, true);
});
test('shortlist preserves the winner and groups editions without changing scores', () => {
  const result = recommend(personas.customizableDeveloper);
  const rows = result.ranking;
  const byId = (id: string) => rows.find((row) => row.distroId === id)!;
  const ordered = {
    ...result,
    ranking: [
      byId('fedora-kde'),
      byId('fedora-workstation'),
      byId('opensuse-tumbleweed'),
      byId('cachyos'),
      ...rows.filter(
        (row) =>
          ![
            'fedora-kde',
            'fedora-workstation',
            'opensuse-tumbleweed',
            'cachyos',
          ].includes(row.distroId),
      ),
    ],
  };
  const view = shortlist(ordered);
  assert.equal(view.primary, ordered.ranking[0]);
  assert.equal(view.sameEdition!.distroId, 'fedora-workstation');
  assert.deepEqual(
    view.alternatives.map((row) => row.distroId),
    ['opensuse-tumbleweed', 'cachyos'],
  );
  assert.deepEqual(rows, result.ranking);
  const withExcluded = {
    ...ordered,
    ranking: [
      { ...byId('fedora-workstation'), eligible: false },
      ...ordered.ranking.filter((row) => row.distroId !== 'fedora-workstation'),
    ],
  };
  assert.equal(shortlist(withExcluded).sameEdition, undefined);
});
test('all public engine signals are translated, internal diagnostics stay out', () => {
  for (const answers of Object.values(personas)) {
    const result = recommend(answers);
    for (const row of result.ranking) {
      for (const code of strongestReasons(row))
        assert.ok(explainReason(code), code);
      for (const code of row.cautions)
        if (code !== 'eligibility.excluded')
          assert.ok(explainCaution(code), code);
    }
    assert.ok(strongestReasons(shortlist(result).primary).length >= 3);
  }
  assert.equal(explainReason('breadth.prior'), undefined);
});
test('same-family derivatives remain distinct when their edition groups differ', () => {
  const result = recommend(personas.windowsGamer);
  const ranking: Recommendation[] = [
    'bazzite',
    'bluefin',
    'fedora-workstation',
  ].map((id) => result.ranking.find((row) => row.distroId === id)!);
  const view = shortlist({ ...result, ranking });
  assert.equal(view.sameEdition, undefined);
  assert.deepEqual(
    view.alternatives.map((row) => row.distroId),
    ['bluefin', 'fedora-workstation'],
  );
});

test('near-fit explanations preserve the remaining tradeoff', () => {
  const reason = explainReason('capability.stability.near')!;
  assert.match(reason, /comes close/);
  assert.notEqual(reason, explainReason('capability.stability.met'));
  assert.ok(explainCaution('capability.stability.shortfall'));
});

test('one-decimal fit separates rounding collisions while retaining real engine ties', () => {
  const result = recommend(personas.customizableDeveloper);
  const kdeAlternative = result.ranking.find(
    (row) => row.distroId === 'fedora-workstation',
  )!;
  const rollingAlternative = result.ranking.find(
    (row) => row.distroId === 'opensuse-tumbleweed',
  )!;
  assert.equal(
    Math.round(kdeAlternative.normalizedScore * 2),
    Math.round(rollingAlternative.normalizedScore * 2),
  );
  assert.notEqual(
    percentMatch(kdeAlternative),
    percentMatch(rollingAlternative),
  );
  const tied = recommend(personas.rollingEnthusiast).ranking.filter((row) =>
    ['cachyos', 'endeavouros'].includes(row.distroId),
  );
  assert.equal(tied[0].rawScore, tied[1].rawScore);
  assert.equal(tied[0].normalizedScore, tied[1].normalizedScore);
  assert.equal(percentMatch(tied[0]), percentMatch(tied[1]));
});

test('broad purposes tailor preparation without changing ranking, expertise, or gaming evidence', () => {
  const base = { ...personas.beginner, gaming: ['none'] };
  const everyday = recommend({ ...base, 'use-cases': ['everyday'] });
  const creative = recommend({ ...base, 'use-cases': ['creative'] });
  const combined = recommend({
    ...base,
    'use-cases': ['everyday', 'creative', 'gaming'],
  });
  assert.deepEqual(creative.ranking, everyday.ranking);
  assert.deepEqual(combined.ranking, everyday.ranking);
  assert.deepEqual(combined.profile.eligibility, everyday.profile.eligibility);
  assert.equal(combined.profile.capabilities.gaming.target, 0);
  assert.equal(combined.profile.capabilities.gaming.weight, 0);
  assert.deepEqual(preparationTopics(everyday), ['general-desktop']);
  assert.deepEqual(preparationTopics(creative), ['creative']);
  assert.deepEqual(preparationTopics(combined), [
    'general-desktop',
    'creative',
  ]);
  const activeGamer = recommend({
    ...base,
    gaming: ['important'],
    'use-cases': ['gaming'],
  });
  assert.deepEqual(preparationTopics(activeGamer), ['gaming']);
  assert.notDeepEqual(activeGamer.ranking, combined.ranking);
});
