import type { Messages } from '../index.ts';
import { QUESTION_COUNT } from '../../data/questions.ts';
import { questionContentEs } from './questions.ts';
import { quizCopyEs, capabilityLabelsEs } from './quiz.ts';

// Deliberately incomplete; never registered as a runtime/published dictionary.
export const draftEs = {
  site: {
    name: 'DistroQuest',
    wordmark: ['Distro', 'Quest'],
    homeLabel: 'Inicio de DistroQuest',
    skipLink: 'Saltar al contenido',
    navigationLabel: 'Navegación principal',
    howLink: 'Cómo funciona',
    footer: 'Una pequeña aventura. Un nuevo comienzo.',
    footerCredit: 'Para quienes sienten curiosidad por Linux.',
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
    dark: 'Modo oscuro',
    switchToLight: 'Cambiar al modo claro',
    switchToDark: 'Cambiar al modo oscuro',
  },
  home: {
    title: 'DistroQuest | Encuentra tu distribución de Linux',
    description:
      'Evita saltar de distro en distro antes de empezar. Un breve cuestionario privado para encontrar una distribución de Linux que encaje con tu forma de usar el equipo.',
    eyebrow: 'ENCUENTRA TU DISTRO DE LINUX',
    tagline: ['Evita saltar de distro en distro', 'antes de empezar.'],
    introduction:
      'Encuentra la distribución de Linux que encaja con tu forma de usar el equipo. Algunas preguntas ahora. Menos aventuras de instalación después.',
    begin: 'Empieza tu aventura',
    factsLabel: 'Formato del cuestionario',
    facts: [
      `${new Intl.NumberFormat('es').format(QUESTION_COUNT)} preguntas (+1 para Mac)`,
      '~3 minutos',
    ],
    preview:
      'Tus respuestas se quedan en esta pestaña. No necesitas una cuenta.',
    howEyebrow: 'CONÓCETE UN POCO MEJOR',
    howTitle: 'Menos saltos. Más acción.',
    howIntroduction:
      'No hay una distro que sea la mejor para todo. Hay una que encaja contigo.',
    steps: [
      {
        title: 'Elige tu camino',
        description:
          'Algunas preguntas sobre tus hábitos, tu hardware y tus ganas de experimentar.',
      },
      {
        title: 'Descubre cuál encaja contigo',
        description:
          'Una recomendación, sus ventajas y limitaciones, y un par de alternativas por explorar.',
      },
      {
        title: 'Empieza tu aventura',
        description:
          'Dedica menos tiempo a elegir tu distribución de Linux y más a disfrutarla.',
      },
    ],
    privacyLabel: 'Privacidad',
    privacyTitle: 'Tu aventura te pertenece.',
    privacyDescription:
      'Sin cuentas, cookies ni seguimiento. Solo se guarda tu preferencia de tema en el navegador.',
    privacyBadge: 'PEQUEÑO A PROPÓSITO',
  },
  scene: {
    heading: 'TU PRÓXIMA AVENTURA',
    title: 'Te espera un nuevo camino',
    description:
      'Un paisaje de píxeles con montañas arboladas, un sendero dorado y sinuoso, y un pequeño equipo al final del recorrido.',
    caption: 'Encuentra tu punto de partida.',
    captionDetail: 'Toda buena aventura empieza con el equipo adecuado.',
  },
  questions: questionContentEs,
  quiz: quizCopyEs,
  capabilityLabels: capabilityLabelsEs,
  platformQuestions: {
    'apple-generation': {
      prompt: '¿Qué chip de Apple tiene tu Mac?',
      helper:
        'Puedes encontrar el chip en el menú Apple, en Acerca de este Mac.',
      options: {
        'm1-m2': { label: 'M1 / M2' },
        m3: { label: 'M3' },
        'm4-plus': { label: 'M4 o posterior.' },
        unknown: { label: 'No estoy seguro.' },
      },
    },
    'intel-t2': {
      prompt: '¿Tu Mac tiene el chip de seguridad T2 de Apple?',
      helper:
        'Está presente en muchos Mac con Intel lanzados aproximadamente entre 2018 y 2020. El modelo exacto importa; el año por sí solo no basta.',
      options: {
        yes: { label: 'Sí' },
        no: { label: 'No' },
        unknown: { label: 'No lo sé.' },
      },
    },
  },
} satisfies Pick<
  Messages,
  | 'site'
  | 'theme'
  | 'home'
  | 'scene'
  | 'questions'
  | 'quiz'
  | 'capabilityLabels'
  | 'platformQuestions'
>;
