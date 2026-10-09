import { en } from './en.ts';
import { messageUnit, parameterContract } from './message.ts';

/** Development/build check, never an English fallback or a review approval.
 * Require every English field, including optional domain descriptions present
 * in the source, and preserve array coverage and stable record/option IDs.
 */
export function dictionaryIssues(
  candidate: unknown,
  source: unknown = en,
): string[] {
  const issues: string[] = [];
  function visit(expected: unknown, actual: unknown, path: string) {
    if (typeof expected === 'string') {
      if (typeof actual !== 'string' || !actual.trim()) issues.push(path);
    } else if (typeof expected === 'function') {
      const expectedUnit = messageUnit(expected);
      const actualUnit = messageUnit(actual);
      if (
        !expectedUnit ||
        !actualUnit ||
        JSON.stringify(parameterContract(expectedUnit)) !==
          JSON.stringify(parameterContract(actualUnit))
      )
        issues.push(path);
    } else if (Array.isArray(expected)) {
      if (!Array.isArray(actual) || actual.length !== expected.length) {
        issues.push(path);
        return;
      }
      expected.forEach((value, index) =>
        visit(value, actual[index], `${path}.${index}`),
      );
    } else if (expected && typeof expected === 'object') {
      if (!actual || typeof actual !== 'object' || Array.isArray(actual)) {
        issues.push(path);
        return;
      }
      const record = actual as Record<string, unknown>;
      for (const [key, value] of Object.entries(expected))
        visit(value, record[key], path ? `${path}.${key}` : key);
      for (const key of Object.keys(record))
        if (!Object.hasOwn(expected, key))
          issues.push(path ? `${path}.${key}` : key);
    }
  }
  visit(source, candidate, '');
  return issues.sort();
}
