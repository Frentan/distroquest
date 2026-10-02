import { distroContentEn } from './en/distros.ts';
import { questionContentEn } from './en/questions.ts';
import { quizCopy } from './en/quiz.ts';
import { QUESTION_COUNT } from '../data/questions.ts';

// All English UI copy, including metadata and accessible labels, lives here.
// Preserve whole sentences; future translations can choose their own line breaks.
export const en = {
  distros: distroContentEn,
  questions: questionContentEn,
  site: {
    name: 'DistroQuest',
    wordmark: ['Distro', 'Quest'],
    homeLabel: 'DistroQuest home',
    skipLink: 'Skip to content',
    navigationLabel: 'Main navigation',
    howLink: 'How it works',
    footer: 'A small quest. A fresh start.',
    footerCredit: 'Made for the Linux-curious.',
  },
  theme: {
    light: 'Light mode',
    dark: 'Dark mode',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
  },
  home: {
    title: 'DistroQuest | Find your Linux distribution',
    description:
      'Stop distro-hopping before it starts. A short, private quiz to help you find a Linux distribution that fits how you use your computer.',
    eyebrow: 'THE LINUX DISTRO FINDER',
    tagline: ['Stop distro-hopping', 'before it starts.'],
    introduction:
      'Find the Linux distribution that fits the way you use your computer. A few questions now. Fewer installation sidequests later.',
    begin: 'Begin Quest',
    factsLabel: 'Quiz format',
    facts: [
      `${QUESTION_COUNT} questions (+1 for Macs)`,
      '~3 minutes',
      'No signup',
    ],
    preview: 'Your answers stay in this tab. No account needed.',
    howEyebrow: 'A LITTLE SELF-DISCOVERY',
    howTitle: 'Less hopping. More doing.',
    howIntroduction:
      'There’s no single best distro. There’s a good fit for you.',
    steps: [
      {
        title: 'Choose your path',
        description:
          'A few questions about your habits, hardware, and appetite for tinkering.',
      },
      {
        title: 'Meet your match',
        description:
          'A recommendation, its tradeoffs, and a couple of alternatives to explore.',
      },
      {
        title: 'Start your adventure',
        description:
          'Spend less time choosing your Linux distribution and more time enjoying it.',
      },
    ],
    privacyLabel: 'Privacy',
    privacyTitle: 'Your quest is yours.',
    privacyDescription:
      'No accounts, cookies, or tracking. Only your theme preference is saved in your browser.',
    privacyBadge: 'SMALL BY DESIGN',
  },
  scene: {
    heading: 'YOUR NEXT ADVENTURE',
    title: 'A new path awaits',
    description:
      'A pixel landscape with forested mountains, a winding golden path and a small computer at the end of the trail.',
    caption: 'Find your starting point.',
    captionDetail: 'Every good quest starts with the right kit.',
  },
  quiz: quizCopy,
};
