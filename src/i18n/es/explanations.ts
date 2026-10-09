import type { Messages } from '../index.ts';

export const explanationsEs = {
  capability: {
    beginnerFriendly: {
      reason:
        'La orientación para principiantes te ofrece la ayuda que buscas.',
      caution:
        'Puede que necesites aprender más en la práctica de lo que preferirías.',
    },
    lowMaintenance: {
      reason:
        'El mantenimiento encaja con el tiempo que quieres dedicar a ajustar el sistema.',
      caution:
        'El mantenimiento habitual puede requerir más tiempo del que tenías previsto.',
    },
    stability: {
      reason:
        'La previsibilidad del software te ofrece la estabilidad que buscas.',
      caution: 'El software es menos previsible de lo que buscas.',
    },
    freshness: {
      reason:
        'El nivel de actualización del software coincide con tu preferencia.',
      caution:
        'El nivel de actualización del software difiere de tu preferencia.',
    },
    customization: {
      reason:
        'Las opciones de personalización te permiten hacer los cambios que planeas para tu escritorio.',
      caution: 'La personalización que buscas puede requerir más trabajo aquí.',
    },
    systemControl: {
      reason:
        'El control sobre el sistema te da la libertad para experimentar que buscas.',
      caution:
        'Ofrece menos control directo sobre el sistema del que prefieres.',
    },
    gaming: {
      reason:
        'Su preparación para videojuegos encaja con la importancia que tienen para ti.',
      caution:
        'Preparar el equipo para jugar puede requerir más trabajo aquí. Comprueba la compatibilidad de tus juegos y tu hardware.',
    },
    developerExperience: {
      reason:
        'Sus herramientas de desarrollo te dan un buen punto de partida para programar.',
      caution:
        'Tu entorno de desarrollo puede necesitar configuración adicional.',
    },
    oldHardware: {
      reason:
        'Su consumo de recursos deja el margen que buscas para tu equipo.',
      caution:
        'Su consumo de recursos puede dejar menos margen del que quieres para tu equipo.',
    },
    desktopPolish: {
      reason:
        'El pulido del escritorio cumple tus expectativas de un entorno listo para usar.',
      caution: 'El escritorio requiere más retoques de los que preferirías.',
    },
  },
  near: {
    beginnerFriendly:
      'Su orientación para principiantes se acerca al nivel de ayuda que buscas.',
    lowMaintenance:
      'Su mantenimiento habitual requiere un poco más de tiempo del que quieres dedicar.',
    stability: 'La previsibilidad de su software se acerca a lo que buscas.',
    freshness:
      'El nivel de actualización de su software se acerca al que prefieres.',
    customization:
      'Sus opciones de personalización te dan casi toda la libertad que buscas.',
    systemControl:
      'Su control sobre el sistema te da un poco menos de libertad para experimentar de la que buscas.',
    gaming: 'Su preparación para videojuegos se acerca al nivel que buscas.',
    developerExperience:
      'Sus herramientas de desarrollo cubren casi todo lo que buscas para empezar.',
    oldHardware:
      'Su consumo de recursos deja un poco menos de margen del que quieres para tu equipo.',
    desktopPolish:
      'El pulido de su escritorio cumple casi todas tus expectativas.',
  },
  reasons: {
    'release.match':
      'Su modelo de versiones fijas o actualización continua coincide con tu preferencia.',
    'atomic.match':
      'Su modelo de actualización del sistema base coincide con tu preferencia.',
    'containers.transactional':
      'Un sistema anfitrión protegido con actualizaciones transaccionales encaja con tu interés por los contenedores.',
    'containers.image-based':
      'Un flujo de trabajo basado en imágenes encaja con tu interés por los contenedores.',
    'focus.gaming':
      'Su enfoque en videojuegos pone tus partidas en el centro de la aventura.',
    'creative.documented-integration':
      'Sus facilidades documentadas de configuración para tareas creativas te ayudan a preparar tus proyectos.',
    'focus.development':
      'Su enfoque en desarrollo pone la programación en el centro.',
    'focus.security':
      'Su enfoque en herramientas de seguridad encaja con las pruebas que has elegido.',
    'specialist.security-testing':
      'Su especialización encaja con las pruebas de seguridad que has elegido.',
    'specialist.handheld-gaming':
      'Ofrece una opción documentada para jugar en consolas portátiles tipo PC que encaja con tus planes.',
    'specialist.minimalist-self-build':
      'Su enfoque minimalista encaja con tus planes de construir y configurar tu propio sistema.',
    'specialist.traditional-unix':
      'Su estilo de administración tradicional encaja con el camino de Unix que has elegido.',
    'specialist.container-development':
      'Sus herramientas de desarrollo basadas en contenedores encajan con el flujo de trabajo que has elegido.',
    'nvidia.integrated':
      'Sus facilidades de configuración para NVIDIA encajan con tu elección de gráficos.',
    'software-policy.free-software-first':
      'Su política de priorizar el software libre coincide con tu preferencia.',
    'focus.minimalism':
      'Su enfoque minimalista mantiene el sistema ligero, como buscas.',
    'workflow.declarative':
      'Su modelo declarativo encaja con tus planes de construir el sistema a partir de su configuración.',
    'desktop-layout.match':
      'Sus paneles y menús encajan con tu preferencia por una disposición familiar.',
    'handheld.documented-support':
      'Ofrece una opción documentada para jugar en consolas portátiles tipo PC que encaja con tu dispositivo.',
  },
  cautions: {
    'focus.gaming-mismatch':
      'Su enfoque en videojuegos encaja menos con tus planes de jugar poco.',
    'release.conflict':
      'Su modelo de versiones fijas o actualización continua difiere de tu preferencia.',
    'atomic.conflict':
      'Su modelo de actualización del sistema base difiere de tu preferencia.',
    'containers.other-model':
      'Su flujo de trabajo está menos centrado en herramientas basadas en imágenes y contenedores.',
    'nvidia.manual':
      'Los controladores NVIDIA pueden necesitar configuración manual.',
    'software-policy.pragmatic':
      'Su política pragmática de software puede incluir componentes propietarios.',
    'handheld.check-device-compatibility':
      'Comprueba el modelo exacto de tu consola portátil tipo PC, la imagen de instalación y las funciones compatibles antes de instalar.',
    'handheld.support-unassessed':
      'No se ha evaluado la compatibilidad de esta distribución con consolas portátiles tipo PC.',
    constraint:
      'Esta opción requiere más experiencia o interés especializado del que indican tus respuestas. Revisa lo que necesitas aprender y el mantenimiento que exige.',
  },
} satisfies Messages['explanations'];
