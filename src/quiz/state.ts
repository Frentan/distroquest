import { questions } from '../data/questions.ts';
import type { AnswerSet, QuestionId } from '../domain/preferences.ts';
import type { RecommendationResult } from '../domain/recommendations.ts';
import type { PlatformResult } from '../domain/platform.ts';
import { validateAnswers } from '../preferences/profile.ts';
import { recommend } from '../recommendations/engine.ts';
import {
  applyPlatform,
  getPlatformFollowup,
  resolvePlatform,
} from '../platforms/compatibility.ts';

const gpuIndex = questions.findIndex((q) => q.id === 'gpu');
export type QuizState = Readonly<{
  current: number;
  answers: Partial<AnswerSet>;
  followup: boolean;
  platformAnswer: string | null;
  completed: boolean;
  result: RecommendationResult | null;
  platformResult: PlatformResult | null;
  error: boolean;
}>;
export const startQuiz = (): QuizState => ({
  current: 0,
  answers: {},
  followup: false,
  platformAnswer: null,
  completed: false,
  result: null,
  platformResult: null,
  error: false,
});
/** Include selections not yet submitted, retained answers and Mac follow-ups. */
export function hasQuizProgress(state: QuizState): boolean {
  return (
    state.platformAnswer !== null ||
    Object.values(state.answers).some(
      (answers) => answers && answers.length > 0,
    )
  );
}
export function getQuizProgress(state: QuizState) {
  const branch = !!getPlatformFollowup(state.answers);
  return {
    current:
      state.current +
      1 +
      (branch && (state.followup || state.current > gpuIndex) ? 1 : 0),
    total: questions.length + Number(branch),
  };
}
function validPlatformAnswer(state: QuizState) {
  const followup = getPlatformFollowup(state.answers);
  return (
    !followup ||
    followup.options.some((option) => option.id === state.platformAnswer)
  );
}
export function hasValidAnswer(state: QuizState): boolean {
  if (state.followup) return validPlatformAnswer(state);
  const id = questions[state.current].id;
  return !validateAnswers(state.answers).some((issue) => issue.question === id);
}
export function selectAnswer(state: QuizState, optionId: string): QuizState {
  if (state.followup) {
    const followup = getPlatformFollowup(state.answers);
    if (!followup?.options.some((option) => option.id === optionId))
      return state;
    return {
      ...state,
      platformAnswer: optionId,
      completed: false,
      result: null,
      platformResult: null,
      error: false,
    };
  }
  const question = questions[state.current];
  if (!question.options.some((option) => option.id === optionId)) return state;
  const previous = state.answers[question.id] ?? [];
  const selected =
    question.selection === 'single'
      ? [optionId]
      : previous.includes(optionId)
        ? previous.filter((id) => id !== optionId)
        : previous.length < question.maxSelections
          ? [...previous, optionId]
          : previous;
  return {
    ...state,
    answers: { ...state.answers, [question.id]: selected },
    platformAnswer:
      question.id === 'gpu' && previous[0] !== optionId
        ? null
        : state.platformAnswer,
    completed: false,
    result: null,
    platformResult: null,
    error: false,
  };
}
export function goToQuestion(state: QuizState, current: number): QuizState {
  if (!Number.isInteger(current) || current < 0 || current >= questions.length)
    return state;
  const issues = validateAnswers(state.answers);
  if (
    questions
      .slice(0, current)
      .some((question) =>
        issues.some((issue) => issue.question === question.id),
      ) ||
    (current > gpuIndex && !validPlatformAnswer(state))
  )
    return state;
  return { ...state, current, followup: false, completed: false, error: false };
}
export function previousQuestion(state: QuizState): QuizState {
  if (state.followup) return goToQuestion(state, gpuIndex);
  if (state.current === gpuIndex + 1 && getPlatformFollowup(state.answers))
    return {
      ...state,
      current: gpuIndex,
      followup: true,
      completed: false,
      error: false,
    };
  return goToQuestion(state, state.current - 1);
}
export function nextQuestion(
  state: QuizState,
  compute: (answers: AnswerSet) => RecommendationResult = recommend,
  reportError?: (error: unknown) => void,
): QuizState {
  if (!hasValidAnswer(state)) return state;
  if (
    !state.followup &&
    state.current === gpuIndex &&
    getPlatformFollowup(state.answers)
  )
    return { ...state, followup: true };
  if (state.current < questions.length - 1)
    return goToQuestion(state, state.current + 1);
  if (validateAnswers(state.answers).length || !validPlatformAnswer(state))
    return { ...state, error: true };
  try {
    const answers = Object.fromEntries(
      questions.map((q) => [q.id, [...state.answers[q.id]!]]),
    ) as Record<QuestionId, string[]>;
    const result = compute(answers);
    const platformResult = applyPlatform(
      result,
      resolvePlatform(answers, state.platformAnswer),
    );
    return { ...state, result, platformResult, completed: true, error: false };
  } catch (error) {
    reportError?.(error);
    return {
      ...state,
      completed: false,
      result: null,
      platformResult: null,
      error: true,
    };
  }
}
