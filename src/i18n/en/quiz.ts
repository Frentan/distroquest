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
    'This distribution ranked highest across your answers. Consider its strengths and tradeoffs before choosing.',
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
    'Gaming kit: check your actual games, anti-cheat requirements, and controllers before installing.',
  development:
    'Developer kit: check your language runtimes, editor, and project dependencies.',
  homelab: 'Homelab kit: check your containers, services, and backup workflow.',
  'technical-learning':
    'Learning kit: keep a live USB or virtual machine handy for experiments.',
  'security-testing':
    'Security kit: use an isolated, authorized practice lab for your tools.',
  'old-hardware':
    'Revival kit: test the live desktop on the machine you want to keep using.',
};
export const capabilityCopy: Record<
  Capability,
  { reason: string; caution: string }
> = {
  beginnerFriendly: {
    reason: 'Its beginner support fits the guidance you asked for.',
    caution: 'You may need more hands-on learning than you preferred.',
  },
  lowMaintenance: {
    reason:
      'Its upkeep fits how much time you want to spend maintaining your system.',
    caution: 'Expect more routine upkeep than your answers preferred.',
  },
  stability: {
    reason:
      'Its emphasis on predictability fits your preference for dependable software.',
    caution: 'Its predictability may fall short of what you asked for.',
  },
  freshness: {
    reason: 'Its software freshness is close to the pace you chose.',
    caution: 'Its software update pace differs from your preferred balance.',
  },
  customization: {
    reason: 'Its customization options fit the desktop changes you want.',
    caution: 'Your preferred customization may take more work here.',
  },
  systemControl: {
    reason: 'Its system control fits the access you asked for.',
    caution: 'It offers less direct system control than you preferred.',
  },
  gaming: {
    reason: 'Its gaming readiness fits the role games play in your setup.',
    caution:
      'Your gaming setup may need more preparation here. Check support for your games and hardware.',
  },
  developerExperience: {
    reason: 'Its development tools fit your plans for coding and building.',
    caution: 'Your development workflow may need extra setup.',
  },
  oldHardware: {
    reason: 'Its resource requirements fit your hardware preferences.',
    caution: 'A lighter desktop may be a better fit for your hardware.',
  },
  desktopPolish: {
    reason: 'Its desktop polish fits your appetite for ready-to-use defaults.',
    caution: 'You may need to finish more desktop setup yourself.',
  },
};
// A near match can also carry a shortfall caution. Describe it as close,
// rather than saying it fully meets the preference on the same result screen.
const capabilityNearCopy: Record<Capability, string> = {
  beginnerFriendly: 'Its beginner guidance comes close to what you asked for.',
  lowMaintenance: 'Its routine upkeep comes close to your preferred balance.',
  stability: 'Its software predictability comes close to what you asked for.',
  freshness: 'Its software freshness comes close to the pace you chose.',
  customization: 'Its desktop customization comes close to what you asked for.',
  systemControl: 'Its system control comes close to what you asked for.',
  gaming: 'Its gaming readiness comes close to what you asked for.',
  developerExperience:
    'Its development tools come close to what you asked for.',
  oldHardware: 'Its resource requirements come close to what you asked for.',
  desktopPolish: 'Its desktop polish comes close to what you asked for.',
};
export const reasonCopy: Record<string, string> = {
  'release.match': 'Its release model matches the update style you chose.',
  'atomic.match': 'Its system update model matches your preferred approach.',
  'containers.image-based':
    'Its image-based workflow suits your interest in container-based tools.',
  'focus.gaming': 'Its gaming focus matches your plans.',
  'creative.documented-integration':
    'Its creative setup conveniences are documented; check your apps, plugins, media formats, and peripherals.',
  'focus.development': 'Its development focus fits your coding use case.',
  'focus.security':
    'Its security-tool focus fits your security-testing use case.',
  'specialist.security-testing':
    'Its specialist focus matches the security-testing work you selected.',
  'nvidia.integrated':
    'Its integrated NVIDIA support fits the GPU you selected.',
  'software-policy.free-software-first':
    'Its free-software-first policy aligns with your preference.',
  'focus.minimalism':
    'Its minimal approach fits your interest in a lean system.',
  'workflow.declarative':
    'Its declarative system model fits your configuration interests.',
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
    'This path expects experience or specialist interests beyond some of your answers. Review its learning and maintenance demands.',
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
