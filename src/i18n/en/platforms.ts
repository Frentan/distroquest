import type {
  Platform,
  PlatformSupport,
  PlatformFollowupId,
} from '../../domain/platform.ts';
export const platformQuestions: Record<
  PlatformFollowupId,
  {
    prompt: string;
    helper: string;
    options: Record<string, { label: string; description?: string }>;
  }
> = {
  'apple-generation': {
    prompt: 'Which Apple chip powers your Mac?',
    helper: 'You can find the chip in the Apple menu under About This Mac.',
    options: {
      'm1-m2': { label: 'M1 / M2' },
      m3: { label: 'M3' },
      'm4-plus': { label: 'M4 or newer' },
      unknown: { label: 'Not sure' },
    },
  },
  'intel-t2': {
    prompt: 'Does your Mac have Apple’s T2 security chip?',
    helper:
      'Found in many Intel Macs released around 2018–2020. The exact model matters; the year alone is not enough.',
    options: {
      yes: { label: 'Yes' },
      no: { label: 'No' },
      unknown: { label: 'I don’t know' },
    },
  },
};
export const platformCopy = {
  title: 'YOUR HARDWARE PATH',
  preferencePath: 'YOUR PREFERENCE MATCH',
  preferenceTop: 'Preference match; installation needs a support check',
  asahiName: (edition: 'kde' | 'gnome') =>
    `Fedora Asahi Remix ${edition === 'kde' ? 'KDE' : 'GNOME'}`,
  asahiSummary:
    'Fedora’s Apple Silicon path, with the Asahi project’s hardware support.',
  baseMatch: (name: string) =>
    `Preference match uses the ${name} profile. Hardware support and available applications can differ on this Mac.`,
  originalWinner: (name: string) =>
    `Your preferences point first to ${name}. Your hardware narrows the practical installation paths below.`,
  originalFit: (name: string) =>
    `Your preferences point first to ${name}. Maintained T2 installation paths lead the practical shortlist.`,
  sameFit:
    'Your preference match has a documented installation path for this platform.',
  asahiInstall:
    'Use the Fedora Asahi Remix installer for your exact Mac model.',
  asahiIntro:
    'Install through Fedora Asahi Remix, not a regular PC installer. KDE is the flagship desktop; GNOME is also available.',
  alternatives: 'Other practical paths',
  preferenceAlternatives: 'Other preference matches',
  preferenceOnly:
    'These reflect your preferences. They are not verified native installation recommendations for this Mac.',
  edition: 'Another Fedora Asahi desktop',
  install: 'Explore the installation path',
  supportGuide: 'Check your model’s support',
  identifyChip: 'Identify your Apple chip',
  identifyT2: 'Check whether your Mac has T2',
  effort: {
    guided: 'Use its maintained T2 installer or platform module.',
    manual: 'A documented T2 path is available, with more manual setup.',
    standard:
      'Use the appropriate x86_64 image; check your exact hardware first.',
    unverified:
      'This quiz has not verified a native installation path for this platform.',
  },
  statuses: {
    native: 'Standard installation path',
    'supported-with-special-path': 'Supported with a special installation path',
    experimental: 'Experimental support',
    unsupported: 'No supported path',
    unknown: 'Support needs checking',
  } satisfies Record<PlatformSupport, string>,
  notes: {
    'x86-standard':
      'Your graphics choice follows the standard PC installation path. Check the exact hardware and driver requirements before installing.',
    'intel-mac':
      'Intel Mac without T2: the usual x86_64 preference ranking applies. Wi-Fi, graphics, trackpad, and boot behavior vary by model.',
    'intel-mac-t2':
      'T2 Macs need special support for internal devices. Maintained installation paths come first; documented manual paths remain available. Check model-specific limitations before installing.',
    'intel-mac-unknown-t2':
      'Check whether your Intel Mac has T2 before choosing an installer. The recommendations below show preference fit; their installation support is not yet confirmed.',
    'apple-silicon-m1-m2':
      'M1/M2 Macs have a documented Fedora Asahi Remix path. Check your exact model and the features you need before installing.',
    'apple-silicon-m3':
      'M3 support is still experimental, with important features under development. This quest cannot confirm an everyday native installation path. Check the current Asahi support table first.',
    'apple-silicon-m4-plus':
      'This quest has no verified native installation path for M4 or newer Macs. The current M4 support table lists no installer; newer chips need their own support check. Your preference match remains useful for exploration.',
    'apple-silicon-unknown':
      'Identify your Apple chip before choosing a Linux installation path. Support differs substantially by generation. Your preference matches do not establish compatibility.',
    unknown:
      'Your platform is unconfirmed. These results show preference fit; check CPU architecture, graphics, and installation support before choosing an image.',
  } satisfies Record<Platform, string>,
};
