import { capabilityKeys, interests } from '../domain/distro.ts';
import type { Capability } from '../domain/distro.ts';
import { preferenceUseCases } from '../domain/preferences.ts';
import type {
  AnswerSet,
  PreferenceEffect,
  UserPreferenceProfile,
  UserTraits,
} from '../domain/preferences.ts';
import { questions } from '../data/questions.ts';

export type AnswerIssue = Readonly<{
  question: string;
  code:
    | 'not-object'
    | 'unknown-question'
    | 'missing-answer'
    | 'invalid-count'
    | 'duplicate-option'
    | 'unknown-option';
}>;

// Validate unknown input from a future UI or import. Never fill missing answers.
export function validateAnswers(input: unknown): AnswerIssue[] {
  if (typeof input !== 'object' || input === null || Array.isArray(input))
    return [{ question: '', code: 'not-object' }];
  const answers = input as Record<string, unknown>;
  const issues: AnswerIssue[] = [];
  for (const id of Object.keys(answers))
    if (!questions.some((question) => question.id === id))
      issues.push({ question: id, code: 'unknown-question' });
  for (const question of questions) {
    const selected = Object.hasOwn(answers, question.id)
      ? answers[question.id]
      : undefined;
    if (!Array.isArray(selected) || selected.length === 0) {
      issues.push({ question: question.id, code: 'missing-answer' });
      continue;
    }
    if (selected.length > question.maxSelections)
      issues.push({ question: question.id, code: 'invalid-count' });
    if (new Set(selected).size !== selected.length)
      issues.push({ question: question.id, code: 'duplicate-option' });
    if (
      [...selected].some(
        (id) =>
          typeof id !== 'string' ||
          !question.options.some((option) => option.id === id),
      )
    )
      issues.push({ question: question.id, code: 'unknown-option' });
  }
  return issues;
}

export class InvalidAnswersError extends Error {
  readonly issues: readonly AnswerIssue[];
  constructor(issues: readonly AnswerIssue[]) {
    super(
      `Invalid quiz answers: ${issues.map((issue) => `${issue.question}:${issue.code}`).join(', ')}`,
    );
    this.name = 'InvalidAnswersError';
    this.issues = issues;
  }
}

export function buildPreferenceProfile(input: unknown): UserPreferenceProfile {
  const issues = validateAnswers(input);
  if (issues.length) throw new InvalidAnswersError(issues);
  const answers = input as AnswerSet;
  const sums = Object.fromEntries(
    capabilityKeys.map((key) => [key, 0]),
  ) as Record<Capability, number>;
  const weights = { ...sums };
  const traits: NonNullable<PreferenceEffect['traits']> = {};
  const eligibility: Partial<UserPreferenceProfile['eligibility']> = {};
  const useCases = new Set<UserTraits['useCases'][number]>();
  const selectedInterests = new Set<UserTraits['interests'][number]>();
  // Traverse schema order, never submission order; checkbox order has no effect.
  for (const question of questions) {
    for (const option of question.options) {
      if (!answers[question.id].includes(option.id)) continue;
      const effect = option.effects;
      for (const key of capabilityKeys) {
        const signal = effect.capabilities?.[key];
        if (signal) {
          sums[key] += signal.target * signal.weight;
          weights[key] += signal.weight;
        }
      }
      Object.assign(traits, effect.traits);
      Object.assign(eligibility, effect.eligibility);
      if (effect.traits?.useCase) useCases.add(effect.traits.useCase);
      if (effect.traits?.interest)
        selectedInterests.add(effect.traits.interest);
    }
  }
  const targets = { ...sums };
  const importance = { ...sums };
  for (const key of capabilityKeys) {
    targets[key] = weights[key] ? sums[key] / weights[key] : 0;
    // Freshness is a directional choice: wanting older software still matters.
    // Other axes express wanted benefits; low need must not become an aversion.
    importance[key] = key === 'freshness' ? 4 : targets[key];
  }
  if (
    !eligibility.experience ||
    !eligibility.maintenanceTolerance ||
    !eligibility.learningTolerance ||
    !eligibility.systemControl ||
    !traits.gpu ||
    !traits.hardware ||
    traits.fossPreference === undefined
  )
    throw new Error('Question schema is missing required profile evidence');
  return {
    version: 1,
    targets,
    importance,
    eligibility: {
      experience: eligibility.experience,
      maintenanceTolerance: eligibility.maintenanceTolerance,
      learningTolerance: eligibility.learningTolerance,
      systemControl: eligibility.systemControl,
    },
    traits: {
      ...(traits.wantsRolling === undefined
        ? {}
        : { wantsRolling: traits.wantsRolling }),
      rollingStrength: traits.rollingStrength ?? 0,
      ...(traits.wantsAtomic === undefined
        ? {}
        : { wantsAtomic: traits.wantsAtomic }),
      atomicStrength: traits.atomicStrength ?? 0,
      containerFirst: traits.containerFirst ?? false,
      fossPreference: traits.fossPreference,
      securityUseCase: useCases.has('security-testing'),
      gpu: traits.gpu,
      hardware: traits.hardware,
      useCases: preferenceUseCases.filter((value) => useCases.has(value)),
      interests: interests.filter((value) => selectedInterests.has(value)),
    },
  };
}
