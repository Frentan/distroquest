import type { Messages } from '../catalog.ts';
import { QUESTION_COUNT } from '../../data/questions.ts';
import { questionContentIt } from './questions.ts';
import { distroContentIt } from './distros.ts';
import { quizCopyIt, capabilityLabelsIt, preparationCopyIt } from './quiz.ts';
import { explanationsIt } from './explanations.ts';
import { platformCopyIt } from './platforms.ts';

// Complete reviewed draft; publication remains separate from runtime registration.
export const draftIt = {
  distros: distroContentIt,
  site: {
    name: 'DistroQuest',
    wordmark: ['Distro', 'Quest'],
    homeLabel: 'Pagina iniziale di DistroQuest',
    skipLink: 'Vai al contenuto',
    navigationLabel: 'Navigazione principale',
    howLink: 'Come funziona',
    footer: 'Una piccola avventura. Un nuovo inizio.',
    footerCredit: 'Per chi vuole scoprire Linux.',
    github: 'GitHub',
    languageLabel: 'Lingua',
    languageNames: {
      en: 'English',
      it: 'Italiano',
      es: 'Español',
      pt: 'Português',
      fr: 'Français',
      de: 'Deutsch',
    },
  },
  theme: {
    light: 'Tema chiaro',
    dark: 'Tema scuro',
    switchToLight: 'Passa al tema chiaro',
    switchToDark: 'Passa al tema scuro',
  },
  home: {
    title: 'DistroQuest | Trova la tua distribuzione Linux',
    description:
      'Evita di saltare da una distro all’altra prima ancora di iniziare. Un breve quiz che rispetta la tua privacy per trovare una distribuzione Linux adatta al tuo modo di usare il computer.',
    eyebrow: 'TROVA LA TUA DISTRO LINUX',
    tagline: [
      'Basta saltare da una distro all’altra',
      'prima ancora di iniziare.',
    ],
    introduction:
      'Trova la distribuzione Linux adatta al tuo modo di usare il computer. Qualche domanda adesso. Meno missioni secondarie dopo.',
    begin: 'Inizia l’avventura',
    factsLabel: 'Formato del quiz',
    facts: [
      `${new Intl.NumberFormat('it').format(QUESTION_COUNT)} domande (+1 per i Mac)`,
      '~3 minuti',
    ],
    preview: 'Le tue risposte restano in questa scheda. Non serve un account.',
    howEyebrow: 'ALLA SCOPERTA DI TE',
    howTitle: 'Meno cambi di distro. Più spazio per fare.',
    howIntroduction:
      'Non esiste una distro migliore in assoluto. Esiste quella adatta a te.',
    steps: [
      {
        title: 'Scegli il tuo percorso',
        description:
          'Qualche domanda sulle tue abitudini, sul tuo hardware e sulla tua voglia di smanettare.',
      },
      {
        title: 'Scopri la distro che fa per te',
        description:
          'Una raccomandazione, i suoi vantaggi e compromessi, e un paio di alternative da esplorare.',
      },
      {
        title: 'Parti per la tua avventura',
        description:
          'Dedica meno tempo a scegliere la tua distribuzione Linux e più tempo a godertela.',
      },
    ],
    privacyLabel: 'Privacy',
    privacyTitle: 'La tua avventura è solo tua.',
    privacyDescription:
      'Niente account, cookie o tracciamento. Nel browser viene salvata solo la tua preferenza per il tema.',
    privacyBadge: 'PICCOLO PER SCELTA',
  },
  scene: {
    heading: 'LA TUA PROSSIMA AVVENTURA',
    title: 'Ti aspetta un nuovo percorso',
    description:
      'Un paesaggio in pixel art con montagne coperte di boschi, un sentiero dorato e tortuoso e un piccolo computer alla fine del percorso.',
    caption: 'Trova il tuo punto di partenza.',
    captionDetail: 'Ogni grande avventura inizia con l’equipaggiamento giusto.',
  },
  questions: questionContentIt,
  platformQuestions: {
    'apple-generation': {
      prompt: 'Quale chip Apple usa il tuo Mac?',
      helper:
        'Trovi il nome del chip nel menu Apple, in Informazioni su questo Mac.',
      options: {
        'm1-m2': { label: 'M1 / M2' },
        m3: { label: 'M3' },
        'm4-plus': { label: 'M4 o successivo.' },
        unknown: { label: 'Non ne sono sicuro.' },
      },
    },
    'intel-t2': {
      prompt: 'Il tuo Mac ha il chip di sicurezza Apple T2?',
      helper:
        'È presente in molti Mac Intel usciti all’incirca tra il 2018 e il 2020. Conta il modello esatto; l’anno da solo non basta.',
      options: {
        yes: { label: 'Sì.' },
        no: { label: 'No.' },
        unknown: { label: 'Non lo so.' },
      },
    },
  },
  quiz: quizCopyIt,
  capabilityLabels: capabilityLabelsIt,
  preparationCopy: preparationCopyIt,
  explanations: explanationsIt,
  platform: platformCopyIt,
} satisfies Messages;
