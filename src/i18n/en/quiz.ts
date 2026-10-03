import type { Capability } from '../../domain/distro.ts';
import type { UseCase } from '../../domain/preferences.ts';

export const quizCopy = {
  title: 'Find your path | DistroQuest',
  description:
    'A short, private Linux quiz. Find a distribution that fits your habits, hardware, and appetite for tinkering.',
  eyebrow: 'YOUR QUEST',
  progress: (current: number, total: number) =>
    `Question ${current} of ${total}`,
  progressLabel: 'Quest progress',
  singleHint: 'Choose one, then continue. You can always go back.',
  finalHint: 'Choose one, then reveal your path. You can always go back.',
  multipleHint: (max: number) => `Choose up to ${max}, then continue.`,
  back: 'Back',
  next: 'Continue',
  retry: 'Try again',
  finish: 'Reveal my path',
  match: (percentage: number) => `${percentage.toFixed(1)}% preference fit`,
  matchNote:
    'Fit follows your answers; hardware support is checked separately.',
  restart: 'Restart quest',
  restartPrompt: 'Start over? Your current answers will be cleared.',
  confirmRestart: 'Start over',
  cancel: 'Keep my answers',
  retake: 'Retake the quest',
  revise: 'Change answers',
  noScript:
    'This quest needs JavaScript to keep your answers and calculate your result in your browser. Enable it and reload to begin.',
  loading: 'Preparing your quest…',
  error:
    'Your path could not be revealed. Your answers are still here. Try again, or go back to review them.',
  path: 'YOUR PATH',
  stats: 'Distro stats',
  variantStatsNote:
    'Base Fedora capabilities out of 5; Asahi is not rated separately.',
  statValue: (value: number) => `${value} out of 5`,
  preparation: 'Pack for your sidequests',
  why: 'Why this fits you',
  tradeoffs: 'Before you set out',
  edition: 'Another edition of this path',
  alternatives: 'Other paths to explore',
  sameFamily: 'Shared family with your top recommendation; a different path.',
  alternativeDetails: 'Tradeoffs',
  resultFallback:
    'A path worth exploring based on your answers. Weigh its strengths and tradeoffs before setting out.',
};
export const capabilityLabels: Record<Capability, string> = {
  beginnerFriendly: 'Beginner guidance',
  lowMaintenance: 'Low upkeep',
  stability: 'Predictability',
  freshness: 'Software freshness',
  customization: 'Customization',
  systemControl: 'System control',
  gaming: 'Gaming readiness',
  developerExperience: 'Developer tools',
  oldHardware: 'Older hardware',
  desktopPolish: 'Desktop polish',
};
export const preparationCopy: Record<UseCase, string> = {
  'general-desktop':
    'Everyday kit: try your browser, office files, calls, and printer in a live session.',
  creative:
    'Creative kit: check your must-have apps, plugins, media formats, and peripherals before moving your projects.',
  gaming:
    'Gaming kit: scout support for your games, anti-cheat requirements, and controllers before installing.',
  development:
    'Developer kit: line up your language runtimes, editor, and project dependencies.',
  homelab:
    'Homelab kit: give your containers, services, and backup workflow a trial run.',
  'technical-learning':
    'Learning kit: pack a live USB or virtual machine for your experiments.',
  'security-testing':
    'Security kit: use an isolated, authorized practice lab for your tools.',
  'old-hardware':
    'Revival kit: let the old machine try the live desktop before its next adventure.',
};
export const capabilityCopy: Record<
  Capability,
  { reason: string; caution: string }
> = {
  beginnerFriendly: {
    reason: 'Its beginner guidance gives you the helping hand you asked for.',
    caution: 'You may need more hands-on learning than you preferred.',
  },
  lowMaintenance: {
    reason: 'Its upkeep stays within your chosen tinkering budget.',
    caution: 'Budget more time for routine upkeep than you planned.',
  },
  stability: {
    reason: 'Its software predictability meets your need for steady ground.',
    caution: 'Expect less software predictability than you asked for.',
  },
  freshness: {
    reason: 'Its software freshness matches your preferred pace.',
    caution: 'Its software update pace differs from your preferred balance.',
  },
  customization: {
    reason:
      'Its customization options leave room for the desktop changes you have in mind.',
    caution: 'Your preferred customization may take more work here.',
  },
  systemControl: {
    reason: 'Its system control gives you the room to tinker you asked for.',
    caution: 'It offers less direct system control than you preferred.',
  },
  gaming: {
    reason: 'Its gaming readiness suits the place games have in your setup.',
    caution:
      'Your gaming setup may need more preparation here. Check support for your games and hardware.',
  },
  developerExperience: {
    reason:
      'Its development tools are a good foundation for your coding plans.',
    caution: 'Your development workflow may need extra setup.',
  },
  oldHardware: {
    reason: 'Its resource needs leave the breathing room you asked for.',
    caution:
      'Its resource needs may leave less breathing room than you wanted.',
  },
  desktopPolish: {
    reason: 'Its desktop polish ticks your boxes for ready-to-use defaults.',
    caution: 'Expect more desktop finishing touches than you asked for.',
  },
};
// A near match can also carry a shortfall caution. Describe it as close,
// rather than saying it fully meets the preference on the same result screen.
const capabilityNearCopy: Record<Capability, string> = {
  beginnerFriendly:
    'Its beginner guidance offers nearly the support you asked for.',
  lowMaintenance:
    'Its routine upkeep is just outside your chosen tinkering budget.',
  stability: 'Its software predictability comes close to what you asked for.',
  freshness: 'Its software freshness is near your preferred pace.',
  customization:
    'Its customization options cover almost all the room you wanted.',
  systemControl:
    'Its system control leaves slightly less room to tinker than you requested.',
  gaming: 'Its gaming readiness is nearly at the level you asked for.',
  developerExperience:
    'Its development tools nearly cover the starting setup you wanted.',
  oldHardware:
    'Its resource needs leave slightly less breathing room than you wanted.',
  desktopPolish: 'Its desktop polish covers almost all your wishlist.',
};
export const reasonCopy: Record<string, string> = {
  'release.match': 'Its release model matches the update style you chose.',
  'atomic.match': 'Its system update model matches your preferred approach.',
  'containers.image-based':
    'Its image-based workflow suits your interest in container-based tools.',
  'focus.gaming': 'Its gaming focus puts your playtime on the main quest.',
  'creative.documented-integration':
    'Its creative setup conveniences are documented; check your apps, plugins, media formats, and peripherals.',
  'focus.development':
    'Its development focus puts coding at the heart of the setup.',
  'focus.security':
    'Its security-tool focus suits the testing work you selected.',
  'specialist.security-testing':
    'Its specialist focus matches the security-testing work you selected.',
  'specialist.handheld-gaming':
    'Its documented handheld gaming path matches your gaming plans; check your specific device before installing.',
  'specialist.container-development':
    'Its developer mode is built for the container-first development workflow you selected.',
  'nvidia.integrated':
    'Its NVIDIA setup conveniences suit your graphics choice.',
  'software-policy.free-software-first':
    'Its free-software-first policy aligns with your preference.',
  'focus.minimalism':
    'Its minimal approach keeps the kit lean, as you requested.',
  'workflow.declarative':
    'Its declarative system model suits your plans to build from configuration.',
  'desktop-layout.match':
    'Its panels and menus fit your preference for a familiar layout.',
  'handheld.documented-support':
    'Its documented handheld gaming path fits your device choice; check your specific device before installing.',
};
export const cautionCopy: Record<string, string> = {
  'release.conflict':
    'Its release model differs from the update style you chose.',
  'atomic.conflict':
    'Its update model differs from your preferred system approach.',
  'containers.other-model':
    'Its workflow is less centered on image-based, container-first tools.',
  'nvidia.manual': 'NVIDIA drivers may require manual setup.',
  'software-policy.pragmatic':
    'Its pragmatic software policy may include proprietary components.',
  'handheld.check-device-compatibility':
    'Check the exact handheld model, installation image, and supported features before installing.',
  'handheld.support-unassessed':
    'Handheld support has not been assessed for this distribution.',
  constraint:
    'This path asks for more experience or specialist interest than your answers suggest. Review the learning and upkeep it needs.',
};
export function explainReason(code: string): string | undefined {
  if (code.startsWith('capability.')) {
    const [, capability, outcome] = code.split('.');
    return outcome === 'near'
      ? capabilityNearCopy[capability as Capability]
      : capabilityCopy[capability as Capability]?.reason;
  }
  return reasonCopy[code];
}
export function explainCaution(code: string): string | undefined {
  if (code.startsWith('capability.'))
    return capabilityCopy[code.split('.')[1] as Capability]?.caution;
  if (code.startsWith('constraint.')) return cautionCopy.constraint;
  return cautionCopy[code];
}
