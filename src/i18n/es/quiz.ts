import { message } from '../message.ts';
import type { Messages } from '../index.ts';

export const quizCopyEs = {
  title: 'Encuentra tu camino | DistroQuest',
  description:
    'Un breve cuestionario privado sobre Linux. Encuentra una distribución que encaje con tus hábitos, tu hardware y tus ganas de experimentar.',
  eyebrow: 'TU AVENTURA',
  progress: message(
    'Pregunta {current} de {total}',
    [
      { name: 'current', kind: 'number' },
      { name: 'total', kind: 'number' },
    ],
    'es',
  ),
  progressLabel: 'Respuestas enviadas',
  submitted: message(
    '{count} de {total} enviadas',
    [
      { name: 'count', kind: 'number' },
      { name: 'total', kind: 'number' },
    ],
    'es',
  ),
  macStep: 'Incluye una pregunta sobre el hardware del Mac.',
  selectionCount: message(
    '{count} de {max} seleccionadas',
    [
      { name: 'count', kind: 'number' },
      { name: 'max', kind: 'number' },
    ],
    'es',
  ),
  selectionLimit:
    'Has alcanzado el límite. Desmarca una respuesta para elegir otra.',
  relevantStats: 'Capacidades según tus prioridades',
  statsNote:
    'Valoraciones de capacidades sobre 5, no puntuaciones de afinidad ni de compatibilidad del hardware.',
  comparedWith: message(
    'En comparación con {name}',
    [{ name: 'name', kind: 'text' }],
    'es',
  ),
  capabilityComparison: message(
    '{label}: {value}/5 frente a {primary}/5 de {name}',
    [
      { name: 'label', kind: 'text' },
      { name: 'value', kind: 'number' },
      { name: 'primary', kind: 'number' },
      { name: 'name', kind: 'text' },
    ],
    'es',
  ),
  workflow: {
    'conventional-desktop': 'Escritorio tradicional',
    'atomic-desktop': 'Escritorio atómico',
    'gaming-appliance': 'Sistema dedicado a videojuegos',
    'declarative-system': 'Sistema declarativo',
  },
  release: { fixed: 'Versiones fijas', rolling: 'Actualización continua' },
  singleHint: 'Elige una opción.',
  finalHint: 'Elige una opción para descubrir tu camino.',
  multipleHint: message(
    'Elige entre 1 y {max}.',
    [{ name: 'max', kind: 'number' }],
    'es',
  ),
  back: 'Atrás',
  next: 'Continuar',
  retry: 'Volver a intentarlo',
  finish: 'Descubrir mi camino',
  match: message(
    '{percentage}% de afinidad con tus preferencias',
    [{ name: 'percentage', kind: 'number', digits: 1 }],
    'es',
  ),
  matchNote: 'La compatibilidad del hardware se comprueba por separado.',
  restart: 'Reiniciar la aventura',
  restartPrompt: '¿Empezar de nuevo? Se borrarán tus respuestas actuales.',
  confirmRestart: 'Empezar de nuevo',
  cancel: 'Conservar mis respuestas',
  retake: 'Repetir la aventura',
  revise: 'Cambiar respuestas',
  noScript:
    'Esta aventura necesita JavaScript para conservar tus respuestas y calcular el resultado en tu navegador. Actívalo y recarga la página para empezar.',
  loading: 'Preparando tu aventura…',
  error:
    'No se ha podido descubrir tu camino. Tus respuestas siguen aquí. Vuelve a intentarlo o retrocede para revisarlas.',
  path: 'TU CAMINO',
  stats: 'Perfil completo de capacidades',
  installationGuidance: 'Orientación para la instalación',
  variantStatsNote:
    'Capacidades de Fedora base sobre 5; Asahi no tiene una valoración independiente.',
  statScore: message('{value}/5', [{ name: 'value', kind: 'number' }], 'es'),
  statValue: message('{value} de 5', [{ name: 'value', kind: 'number' }], 'es'),
  preparation: 'Prepárate para la aventura',
  why: 'Por qué encaja contigo',
  tradeoffs: 'Antes de ponerte en camino',
  edition: 'Otro camino oficial de esta familia',
  alternatives: 'Otros caminos por explorar',
  sameFamily:
    'Comparte familia con tu recomendación principal, pero sigue otro camino.',
  alternativeDetails: 'Ventajas y limitaciones',
  resultFallback:
    'Un camino que merece la pena explorar según tus respuestas. Sopesa sus puntos fuertes y sus limitaciones antes de partir.',
} satisfies Messages['quiz'];

export const capabilityLabelsEs: Messages['capabilityLabels'] = {
  beginnerFriendly: 'Orientación para principiantes',
  lowMaintenance: 'Poco mantenimiento',
  stability: 'Previsibilidad',
  freshness: 'Actualidad del software',
  customization: 'Personalización',
  systemControl: 'Control del sistema',
  gaming: 'Preparación para videojuegos',
  developerExperience: 'Herramientas de desarrollo',
  oldHardware: 'Hardware antiguo',
  desktopPolish: 'Pulido del escritorio',
};
