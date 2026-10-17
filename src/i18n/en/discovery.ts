import { message } from '../message.ts';

export const discoveryEn = {
  directoryLink: 'Explore the distributions',
  directoryTitle: 'Linux distributions | DistroQuest',
  directoryHeading: 'Meet the distributions',
  directoryDescription:
    'Explore 29 Linux distributions: their strengths, trade-offs, typical users and assessed editions. Find your starting point with DistroQuest.',
  directoryIntroduction:
    'Explore the distributions in the quiz. These summaries describe their assessed editions; they are not personalized recommendations.',
  suitable: 'Who it suits',
  strengths: 'Strengths',
  cautions: 'Trade-offs',
  considerations: 'Edition and technical considerations',
  official: 'Official website',
  back: 'All distributions',
  quizHeading: 'Find your starting point',
  quizIntroduction:
    'Answer a few questions about your habits, hardware and appetite for tinkering.',
  quizLink: 'Begin Quest',
  characterAlt: message(
    'Pixel-art fantasy character representing {name}: {archetype}.',
    [
      { name: 'name', kind: 'text' },
      { name: 'archetype', kind: 'text' },
    ],
    'en',
  ),
  profileTitle: message(
    '{name}: strengths and trade-offs | DistroQuest',
    [{ name: 'name', kind: 'text' }],
    'en',
  ),
  profileLink: message('About {name}', [{ name: 'name', kind: 'text' }], 'en'),
  support: 'Support the project',
  shareAlt: 'DistroQuest shield and terminal mark on a dark green background.',
  compatibilityNote:
    'Hardware support depends on the exact device and edition. The quiz checks installation paths separately from preference matching.',
};
