import assert from 'node:assert/strict';
import { test } from 'node:test';
import { questions } from '../src/data/questions.ts';
import { getMessages, publishedLocales } from '../src/i18n/index.ts';
import { recommendationPersonas } from '../scripts/recommendation-personas.ts';
import {
  startQuiz,
  selectAnswer,
  nextQuestion,
  hasQuizProgress,
} from '../src/quiz/state.ts';
import { platformShortlist } from '../src/quiz/platform-presentation.ts';
import type { AnswerSet } from '../src/domain/preferences.ts';

function complete(
  locale: (typeof publishedLocales)[number],
  answers: AnswerSet,
  mac: string | null = null,
) {
  const copy = getMessages(locale);
  let state = startQuiz();
  for (const question of questions) {
    assert.equal(questions[state.current].id, question.id);
    for (const option of answers[question.id]) {
      assert.ok(copy.questions[question.id].options[option].label);
      state = selectAnswer(state, option);
    }
    state = nextQuestion(state);
    if (state.followup) {
      const followup =
        answers.gpu[0] === 'apple-silicon' ? 'apple-generation' : 'intel-t2';
      assert.ok(mac && copy.platformQuestions[followup].options[mac].label);
      state = nextQuestion(selectAnswer(state, mac!));
    }
  }
  assert.equal(state.completed, true);
  return state;
}

test('identical localized answer IDs produce identical complete scores and platform outputs', () => {
  const cases: [AnswerSet, string | null][] = Object.values(
    recommendationPersonas,
  ).map((answers) => [answers, null]);
  for (const gpu of ['apple-silicon', 'intel-mac']) {
    for (const mac of gpu === 'apple-silicon'
      ? ['m1-m2', 'm3', 'm4-plus', 'unknown']
      : ['yes', 'no', 'unknown']) {
      cases.push([{ ...recommendationPersonas.beginner, gpu: [gpu] }, mac]);
    }
  }
  // Every individual answer crosses the real selection/completion boundary.
  for (const question of questions) {
    for (const option of question.options) {
      const answers = {
        ...recommendationPersonas.beginner,
        [question.id]: [option.id],
      };
      cases.push([
        answers,
        question.id === 'gpu' &&
        ['apple-silicon', 'intel-mac'].includes(option.id)
          ? 'unknown'
          : null,
      ]);
    }
  }
  for (const [answers, mac] of cases) {
    const en = complete('en', answers, mac);
    const es = complete('es', answers, mac);
    assert.deepEqual(es.answers, en.answers);
    assert.deepEqual(es.result, en.result);
    assert.deepEqual(es.platformResult, en.platformResult);
    assert.deepEqual(
      platformShortlist(es.platformResult!),
      platformShortlist(en.platformResult!),
    );
  }
});

test('progress-loss guard includes unsubmitted, retained and Mac answers but ignores empty selections', () => {
  assert.equal(hasQuizProgress(startQuiz()), false);
  const selected = selectAnswer(startQuiz(), questions[0].options[0].id);
  assert.equal(hasQuizProgress(selected), true);
  assert.equal(
    hasQuizProgress({ ...startQuiz(), answers: { 'use-cases': [] } }),
    false,
  );
  assert.equal(hasQuizProgress({ ...startQuiz(), platformAnswer: 'm3' }), true);
  assert.equal(
    hasQuizProgress({
      ...startQuiz(),
      answers: { maintenance: ['sometimes'] },
    }),
    true,
  );
});
