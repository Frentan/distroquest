import { message } from '../message.ts';
import type { Messages } from '../index.ts';

export const platformCopyEs = {
  title: 'TU OPCIÓN SEGÚN EL HARDWARE',
  preferencePath: 'TU OPCIÓN SEGÚN TUS PREFERENCIAS',
  preferenceTop:
    'Encaja con tus preferencias; la instalación requiere comprobar la compatibilidad',
  asahiName: message(
    'Fedora Asahi Remix {edition}',
    [
      {
        name: 'edition',
        kind: 'choice',
        values: { kde: 'KDE', gnome: 'GNOME' },
      },
    ],
    'es',
  ),
  asahiSummary:
    'La opción de Fedora para Apple Silicon, con la compatibilidad de hardware del proyecto Asahi.',
  baseMatch: message(
    'La afinidad se basa en {name}. La compatibilidad del hardware y las aplicaciones disponibles pueden ser distintas en este Mac.',
    [{ name: 'name', kind: 'text' }],
    'es',
  ),
  originalWinner: message(
    'Tus respuestas apuntan a {name}. Tu hardware limita las opciones de instalación que se muestran a continuación.',
    [{ name: 'name', kind: 'text' }],
    'es',
  ),
  originalFit: message(
    'Tus respuestas apuntan a {name}. Las opciones de instalación para T2 con mantenimiento activo aparecen a continuación.',
    [{ name: 'name', kind: 'text' }],
    'es',
  ),
  sameFit:
    'La distribución que encaja con tus preferencias tiene una opción de instalación documentada para esta plataforma.',
  asahiInstall:
    'Usa el instalador de Fedora Asahi Remix para tu modelo exacto de Mac.',
  asahiIntro:
    'Instala mediante Fedora Asahi Remix, no con un instalador habitual para PC. KDE es el escritorio principal; GNOME también está disponible.',
  alternatives: 'Otras opciones prácticas',
  preferenceAlternatives: 'Otras opciones según tus preferencias',
  preferenceOnly:
    'Estas opciones encajan con tus preferencias; su compatibilidad con la instalación nativa en este Mac sigue sin verificarse.',
  edition: 'Otro escritorio de Fedora Asahi',
  install: 'Explora cómo instalarlo',
  supportGuide: 'Comprueba la compatibilidad de tu modelo',
  identifyChip: 'Identifica tu chip de Apple',
  identifyT2: 'Comprueba si tu Mac tiene T2',
  effort: {
    guided:
      'Usa su instalador para T2 o módulo de plataforma con mantenimiento activo.',
    manual:
      'Hay una opción de instalación para T2 documentada, con más configuración manual.',
    standard:
      'Usa la imagen x86_64 adecuada; comprueba primero tu hardware exacto.',
    unverified:
      'La compatibilidad con la instalación nativa en esta plataforma sigue sin verificarse.',
  },
  standardInstallation: 'Instalación estándar',
  notes: {
    'x86-standard':
      'Sigue el procedimiento de instalación estándar para PC. Comprueba tu hardware exacto y los controladores necesarios antes de instalar.',
    'intel-mac':
      'Mac con Intel sin T2: se aplica la clasificación habitual de afinidad para x86_64. El funcionamiento del Wi-Fi, los gráficos, el panel táctil y el arranque varía según el modelo.',
    'intel-mac-t2':
      'Los Mac con T2 necesitan soporte específico para sus dispositivos internos. Las opciones de instalación con mantenimiento activo aparecen primero; las opciones manuales documentadas siguen disponibles. Comprueba las limitaciones de tu modelo antes de instalar.',
    'intel-mac-unknown-t2':
      'Comprueba si tu Mac con Intel tiene T2 antes de elegir un instalador. Estas opciones encajan con tus preferencias; la compatibilidad de instalación aún no está confirmada.',
    'apple-silicon-m1-m2':
      'Los Mac con M1/M2 tienen una opción de instalación documentada de Fedora Asahi Remix. Comprueba tu modelo exacto y las funciones que necesitas antes de instalar.',
    'apple-silicon-m3':
      'La compatibilidad con M3 sigue siendo experimental, con funciones importantes en desarrollo. Esta aventura no puede confirmar una opción de instalación nativa para el uso cotidiano. Consulta primero la tabla de compatibilidad actual de Asahi.',
    'apple-silicon-m4-plus':
      'Esta aventura no tiene una opción de instalación nativa verificada para Mac con M4 o posterior. La tabla de compatibilidad actual de M4 no incluye un instalador; los chips posteriores necesitan su propia comprobación. La afinidad con tus preferencias sigue siendo útil para explorar opciones.',
    'apple-silicon-unknown':
      'Identifica primero tu chip de Apple; la compatibilidad varía considerablemente entre generaciones. La afinidad con tus preferencias no garantiza compatibilidad.',
    unknown:
      'Tu plataforma no está confirmada. Estos resultados indican afinidad con tus preferencias; comprueba la arquitectura del procesador, los gráficos y la compatibilidad de instalación antes de elegir una imagen.',
  },
} satisfies Messages['platform'];
