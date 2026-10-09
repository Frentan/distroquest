import type { Locale } from './locales.ts';

export type Parameter =
  | { name: string; kind: 'text' }
  | { name: string; kind: 'number'; digits?: number }
  | { name: string; kind: 'choice'; values: Record<string, string> };
type Argument<P extends Parameter> = P extends { kind: 'number' }
  ? number
  : P extends { kind: 'choice'; values: infer V }
    ? keyof V & string
    : string;
type Arguments<P extends readonly Parameter[]> = {
  -readonly [K in keyof P]: Argument<P[K]>;
};
export interface MessageUnit {
  locale: Locale;
  template: string;
  parameters: readonly Parameter[];
}

/** Explicit content, independent of function source or bundler output. */
export function message<const P extends readonly Parameter[]>(
  template: string,
  parameters: P,
  locale: Locale = 'en',
) {
  const names = parameters.map((p) => p.name);
  const placeholders = [...template.matchAll(/\{([^{}]+)\}/g)].map((m) => m[1]);
  if (
    new Set(names).size !== names.length ||
    names.some((name) => !/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) ||
    names.some((name) => !placeholders.includes(name)) ||
    placeholders.some((name) => !names.includes(name)) ||
    /[{}]/.test(template.replace(/\{([^{}]+)\}/g, ''))
  )
    throw new Error(`Invalid message parameters: ${template}`);
  const formatters = parameters.map((parameter) =>
    parameter.kind === 'number'
      ? new Intl.NumberFormat(locale, {
          useGrouping: false,
          minimumFractionDigits: parameter.digits ?? 0,
          maximumFractionDigits: parameter.digits ?? 20,
        })
      : undefined,
  );
  const render = (...args: Arguments<P>): string => {
    if (args.length !== parameters.length)
      throw new Error('Missing message argument');
    const values = parameters.map((parameter, index) => {
      const value = args[index];
      if (parameter.kind === 'number') {
        if (typeof value !== 'number' || !Number.isFinite(value))
          throw new Error('Invalid numeric message argument');
        return formatters[index]!.format(value);
      }
      if (typeof value !== 'string')
        throw new Error('Invalid text message argument');
      if (parameter.kind === 'choice') {
        if (!Object.hasOwn(parameter.values, value))
          throw new Error('Invalid message choice');
        return parameter.values[value];
      }
      return value;
    });
    // Callback replacement keeps user/product names containing $ or braces literal.
    return template.replace(
      /\{([^{}]+)\}/g,
      (_, name: string) => values[names.indexOf(name)],
    );
  };
  return Object.assign(render, {
    unit: { template, parameters, locale } satisfies MessageUnit,
  });
}

export function messageUnit(value: unknown): MessageUnit | undefined {
  if (typeof value !== 'function' || !('unit' in value)) return undefined;
  return value.unit as MessageUnit;
}

/** Translation may reorder placeholders, but not change the call contract. */
export function parameterContract(unit: MessageUnit) {
  return unit.parameters.map((p) => {
    if (p.kind === 'choice')
      return {
        name: p.name,
        kind: p.kind,
        choices: Object.keys(p.values).sort(),
      };
    if (p.kind === 'number')
      return { name: p.name, kind: p.kind, digits: p.digits ?? null };
    return { name: p.name, kind: p.kind };
  });
}
