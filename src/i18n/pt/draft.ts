import type { Messages } from '../catalog.ts';
import { QUESTION_COUNT } from '../../data/questions.ts';
import { formattingLocale } from '../locales.ts';
import { questionContentPt } from './questions.ts';
import { quizCopyPt, capabilityLabelsPt } from './quiz.ts';

// Review tooling only. Missing sections are intentional; no English fallback.
export const draftPt = {
  site: {
    name: 'DistroQuest',
    wordmark: ['Distro', 'Quest'],
    homeLabel: 'Página inicial do DistroQuest',
    skipLink: 'Pular para o conteúdo',
    navigationLabel: 'Navegação principal',
    howLink: 'Como funciona',
    footer: 'Uma pequena aventura. Um novo começo.',
    footerCredit: 'Para quem tem curiosidade sobre Linux.',
    github: 'GitHub',
    languageLabel: 'Idioma',
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
    light: 'Modo claro',
    dark: 'Modo escuro',
    switchToLight: 'Mudar para o modo claro',
    switchToDark: 'Mudar para o modo escuro',
  },
  home: {
    title: 'DistroQuest | Encontre sua distribuição Linux',
    description:
      'Pare de trocar de distro antes mesmo de começar. Um questionário curto e privado para encontrar uma distribuição Linux que combine com a forma como você usa o computador.',
    eyebrow: 'ENCONTRE SUA DISTRO LINUX',
    tagline: ['Pare de trocar de distro', 'antes mesmo de começar.'],
    introduction:
      'Encontre a distribuição Linux que combina com a forma como você usa o computador. Algumas perguntas agora. Menos aventuras de instalação depois.',
    begin: 'Comece sua aventura',
    factsLabel: 'Formato do questionário',
    facts: [
      `${new Intl.NumberFormat(formattingLocale('pt')).format(QUESTION_COUNT)} perguntas (+1 para Macs)`,
      '~3 minutos',
    ],
    preview: 'Suas respostas ficam nesta aba. Não é preciso criar uma conta.',
    howEyebrow: 'CONHEÇA UM POUCO MAIS SOBRE VOCÊ',
    howTitle: 'Menos trocas. Mais ação.',
    howIntroduction:
      'Não existe uma distro que seja a melhor para tudo. Existe uma que combina com você.',
    steps: [
      {
        title: 'Escolha seu caminho',
        description:
          'Algumas perguntas sobre seus hábitos, hardware e vontade de experimentar.',
      },
      {
        title: 'Encontre a distro que combina com você',
        description:
          'Uma recomendação, suas vantagens e limitações, e algumas alternativas para explorar.',
      },
      {
        title: 'Comece sua aventura',
        description:
          'Passe menos tempo escolhendo sua distribuição Linux e mais tempo aproveitando o que ela oferece.',
      },
    ],
    privacyLabel: 'Privacidade',
    privacyTitle: 'Sua aventura é sua.',
    privacyDescription:
      'Sem contas, cookies ou rastreamento. Apenas sua preferência de tema é salva no navegador.',
    privacyBadge: 'PEQUENO POR ESCOLHA',
  },
  scene: {
    heading: 'SUA PRÓXIMA AVENTURA',
    title: 'Um novo caminho espera por você',
    description:
      'Uma paisagem em pixel art com montanhas cobertas de árvores, um caminho dourado e sinuoso e um pequeno computador no fim da trilha.',
    caption: 'Encontre seu ponto de partida.',
    captionDetail: 'Toda boa aventura começa com o equipamento certo.',
  },
  questions: questionContentPt,
  platformQuestions: {
    'apple-generation': {
      prompt: 'Qual chip da Apple o seu Mac usa?',
      helper: 'Você encontra o chip no menu Apple, em Sobre Este Mac.',
      options: {
        'm1-m2': { label: 'M1 / M2' },
        m3: { label: 'M3' },
        'm4-plus': { label: 'M4 ou mais recente.' },
        unknown: { label: 'Não tenho certeza.' },
      },
    },
    'intel-t2': {
      prompt: 'Seu Mac tem o chip de segurança T2 da Apple?',
      helper:
        'Presente em muitos Macs com Intel lançados por volta de 2018 a 2020. O modelo exato importa; o ano sozinho não basta.',
      options: {
        yes: { label: 'Sim.' },
        no: { label: 'Não.' },
        unknown: { label: 'Não sei.' },
      },
    },
  },
  quiz: quizCopyPt,
  capabilityLabels: capabilityLabelsPt,
} satisfies Partial<Messages>;
