import {
  capabilityKeys,
  distroIds,
  experienceLevels,
  interests,
  scores,
  toleranceLevels,
  traitValues,
  useCases,
} from '../domain/distro.ts';

type ObjectValue = Record<string, unknown>;
const isObject = (value: unknown): value is ObjectValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const isScore = (value: unknown) =>
  typeof value === 'number' && (scores as readonly number[]).includes(value);

// Accept unknown so tests and future import tools can validate malformed data.
// Return every issue with a path; validation never silently repairs the model.
export function validateDataset(profiles: unknown, content: unknown): string[] {
  const errors: string[] = [];
  const check = (ok: boolean, path: string, message: string) => {
    if (!ok) errors.push(`${path}: ${message}`);
  };
  const object = (
    value: unknown,
    path: string,
    keys: readonly string[],
  ): ObjectValue => {
    if (!isObject(value)) {
      errors.push(`${path}: expected an object`);
      return {};
    }
    check(
      Object.keys(value).length === keys.length &&
        keys.every((key) => key in value),
      path,
      'unexpected or missing fields',
    );
    return value;
  };
  const text = (value: unknown, path: string) =>
    check(isText(value), path, 'required nonempty text');
  const list = (value: unknown, path: string, min: number, max: number) => {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected an array`);
      return;
    }
    check(
      value.length >= min && value.length <= max,
      path,
      `expected ${min}–${max} entries`,
    );
    value.forEach((item, index) => text(item, `${path}[${index}]`));
    check(new Set(value).size === value.length, path, 'duplicate entries');
  };
  const oneOf = (value: unknown, allowed: readonly string[], path: string) =>
    check(
      typeof value === 'string' && allowed.includes(value),
      path,
      `expected ${allowed.join(' | ')}`,
    );

  if (!Array.isArray(profiles)) return ['profiles: expected an array'];
  check(
    profiles.length === distroIds.length,
    'profiles',
    `expected exactly ${distroIds.length} records`,
  );
  const dictionary = object(content, 'content', distroIds);
  const ids = new Set<unknown>();
  const slugs = new Set<unknown>();

  profiles.forEach((raw, index) => {
    const path = `profiles[${index}]`;
    const profile = object(raw, path, [
      'id',
      'slug',
      'capabilities',
      'traits',
      'recommendation',
      'assessment',
    ]);
    oneOf(profile.id, distroIds, `${path}.id`);
    check(!ids.has(profile.id), `${path}.id`, 'duplicate ID');
    ids.add(profile.id);
    check(
      isText(profile.slug) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.slug),
      `${path}.slug`,
      'expected a URL-safe slug',
    );
    check(!slugs.has(profile.slug), `${path}.slug`, 'duplicate slug');
    slugs.add(profile.slug);

    const capabilities = object(
      profile.capabilities,
      `${path}.capabilities`,
      capabilityKeys,
    );
    capabilityKeys.forEach((key) =>
      check(
        isScore(capabilities[key]),
        `${path}.capabilities.${key}`,
        'expected 0–5 in half steps',
      ),
    );
    const traits = object(profile.traits, `${path}.traits`, [
      ...Object.keys(traitValues),
      'atomicUpdates',
      'focus',
    ]);
    for (const [key, allowed] of Object.entries(traitValues))
      oneOf(traits[key], allowed, `${path}.traits.${key}`);
    check(
      typeof traits.atomicUpdates === 'boolean',
      `${path}.traits.atomicUpdates`,
      'expected boolean',
    );
    const focus = object(traits.focus, `${path}.traits.focus`, [
      'gaming',
      'security',
      'minimal',
      'development',
    ]);
    for (const key of ['gaming', 'security', 'minimal', 'development'])
      check(
        typeof focus[key] === 'boolean',
        `${path}.traits.focus.${key}`,
        'expected boolean',
      );
    if (
      traits.systemModel === 'image-based' ||
      traits.systemModel === 'transactional'
    ) {
      check(
        traits.baseMutability === 'protected' && traits.atomicUpdates === true,
        `${path}.traits`,
        `${traits.systemModel} profiles require protected base and atomic updates`,
      );
    }

    const recommendation = object(
      profile.recommendation,
      `${path}.recommendation`,
      ['breadth', 'constraints'],
    );
    check(
      isScore(recommendation.breadth),
      `${path}.recommendation.breadth`,
      'expected 0–5 in half steps',
    );
    if (!Array.isArray(recommendation.constraints)) {
      errors.push(`${path}.recommendation.constraints: expected an array`);
    } else {
      recommendation.constraints.forEach((rawConstraint, constraintIndex) => {
        const cp = `${path}.recommendation.constraints[${constraintIndex}]`;
        const constraint = object(rawConstraint, cp, ['effect', 'allOf']);
        oneOf(
          constraint.effect,
          ['require', 'strongly-prefer'],
          `${cp}.effect`,
        );
        if (!Array.isArray(constraint.allOf) || constraint.allOf.length === 0) {
          errors.push(`${cp}.allOf: expected at least one condition`);
          return;
        }
        constraint.allOf.forEach((rawCondition, conditionIndex) => {
          const conditionPath = `${cp}.allOf[${conditionIndex}]`;
          const condition = isObject(rawCondition) ? rawCondition : {};
          switch (condition.kind) {
            case 'experience':
            case 'maintenance-tolerance':
            case 'learning-tolerance':
            case 'system-control':
              object(rawCondition, conditionPath, ['kind', 'minimum']);
              oneOf(
                condition.minimum,
                condition.kind === 'experience'
                  ? experienceLevels
                  : toleranceLevels,
                `${conditionPath}.minimum`,
              );
              break;
            case 'use-case':
            case 'interest':
              object(rawCondition, conditionPath, ['kind', 'value']);
              oneOf(
                condition.value,
                condition.kind === 'use-case' ? useCases : interests,
                `${conditionPath}.value`,
              );
              break;
            default:
              errors.push(`${conditionPath}.kind: unknown condition`);
          }
        });
      });
    }

    const assessment = object(profile.assessment, `${path}.assessment`, [
      'reviewedOn',
      'sources',
    ]);
    const date = assessment.reviewedOn;
    check(
      typeof date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        Number.isFinite(Date.parse(date)) &&
        new Date(date).toISOString().slice(0, 10) === date,
      `${path}.assessment.reviewedOn`,
      'expected a real ISO date',
    );
    list(assessment.sources, `${path}.assessment.sources`, 1, 10);
    if (Array.isArray(assessment.sources))
      assessment.sources.forEach((source, sourceIndex) => {
        let valid = false;
        try {
          valid =
            typeof source === 'string' && new URL(source).protocol === 'https:';
        } catch {
          /* Report invalid URLs below. */
        }
        check(
          valid,
          `${path}.assessment.sources[${sourceIndex}]`,
          'expected an HTTPS source URL',
        );
      });
  });
  distroIds.forEach((id) => {
    check(ids.has(id), 'profiles', `missing frozen roster ID ${id}`);
    const path = `content.${id}`;
    const rawContent = dictionary[id];
    const entry = object(rawContent, path, [
      'name',
      'archetype',
      'summary',
      'strengths',
      'cautions',
      'idealFor',
      'assessmentBasis',
      ...(isObject(rawContent) && 'editionNote' in rawContent
        ? ['editionNote']
        : []),
    ]);
    if ('editionNote' in entry) text(entry.editionNote, `${path}.editionNote`);
    for (const key of ['name', 'summary', 'assessmentBasis'])
      text(entry[key], `${path}.${key}`);
    const archetype = object(entry.archetype, `${path}.archetype`, [
      'name',
      'description',
    ]);
    text(archetype.name, `${path}.archetype.name`);
    text(archetype.description, `${path}.archetype.description`);
    list(entry.strengths, `${path}.strengths`, 3, 5);
    list(entry.cautions, `${path}.cautions`, 2, 4);
    list(entry.idealFor, `${path}.idealFor`, 3, 6);
  });
  return errors;
}
