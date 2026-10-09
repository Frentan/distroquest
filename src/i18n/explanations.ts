import type { Capability } from '../domain/distro.ts';
import type { Messages } from './index.ts';

// Codes remain domain data. Only their presentation is supplied by a locale.
export function createExplanations(copy: Messages['explanations']) {
  function explainReason(code: string): string | undefined {
    if (code.startsWith('capability.')) {
      const [, capability, outcome] = code.split('.');
      return outcome === 'near'
        ? copy.near[capability as Capability]
        : copy.capability[capability as Capability]?.reason;
    }
    return copy.reasons[code];
  }
  function explainCaution(code: string): string | undefined {
    if (code.startsWith('capability.'))
      return copy.capability[code.split('.')[1] as Capability]?.caution;
    if (code.startsWith('constraint.')) return copy.cautions.constraint;
    return copy.cautions[code];
  }
  return { explainReason, explainCaution };
}
