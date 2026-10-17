import { message } from '../message.ts';

export const discoveryEs = {
  directoryLink: 'Explora las distribuciones',
  directoryTitle: 'Distribuciones de Linux | DistroQuest',
  directoryHeading: 'Conoce las distribuciones',
  directoryDescription:
    'Explora 29 distribuciones de Linux: sus puntos fuertes, limitaciones, usuarios habituales y ediciones evaluadas. Encuentra tu punto de partida con DistroQuest.',
  directoryIntroduction:
    'Explora las distribuciones del cuestionario. Estos resúmenes describen las ediciones evaluadas; no son recomendaciones personalizadas.',
  suitable: 'A quién le puede encajar',
  strengths: 'Puntos fuertes',
  cautions: 'Limitaciones',
  considerations: 'Edición y consideraciones técnicas',
  official: 'Sitio web oficial',
  back: 'Todas las distribuciones',
  quizHeading: 'Encuentra tu punto de partida',
  quizIntroduction:
    'Responde algunas preguntas sobre tus hábitos, tu hardware y tus ganas de experimentar.',
  quizLink: 'Empieza tu aventura',
  characterAlt: message(
    'Personaje fantástico en pixel art que representa a {name}: {archetype}.',
    [
      { name: 'name', kind: 'text' },
      { name: 'archetype', kind: 'text' },
    ],
    'es',
  ),
  profileTitle: message(
    '{name}: puntos fuertes y limitaciones | DistroQuest',
    [{ name: 'name', kind: 'text' }],
    'es',
  ),
  profileLink: message(
    'Acerca de {name}',
    [{ name: 'name', kind: 'text' }],
    'es',
  ),
  support: 'Apoya el proyecto',
  shareAlt: 'El escudo y terminal de DistroQuest sobre un fondo verde oscuro.',
  compatibilityNote:
    'La compatibilidad con el hardware depende del dispositivo y de la edición. El cuestionario evalúa las opciones de instalación por separado de la afinidad con tus preferencias.',
};
