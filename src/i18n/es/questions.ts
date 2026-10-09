import type { QuestionDictionary } from '../../domain/preferences.ts';

// Draft for human review. IDs and answer order mirror the domain schema.
export const questionContentEs: QuestionDictionary = {
  experience: {
    prompt: '¿Qué tanta experiencia tienes con Linux?',
    options: {
      new: { label: 'Nunca lo he usado. Con calma, por favor.' },
      tried: { label: 'He probado Linux algunas veces.' },
      regular: { label: 'Me manejo bien usando Linux habitualmente.' },
      terminal: {
        label: 'Me manejo bien con la terminal y la configuración del sistema.',
      },
      init: { label: 'Tengo opiniones sobre los sistemas de inicio.' },
    },
  },
  setup: {
    prompt: '¿Qué debería pasar después de la instalación?',
    options: {
      ready: { label: '¿Lo ideal? Ponerme a usar el equipo.' },
      little: { label: 'No me importa configurar un poco.' },
      configure: { label: 'Me gusta configurar las cosas.' },
      build: { label: 'Construir el sistema es la mitad de la diversión.' },
    },
  },
  freshness: {
    prompt: '¿Qué tan actualizado quieres tener tu software?',
    options: {
      proven: { label: 'Probado y aburrido, por favor.' },
      balanced: { label: 'Lo bastante reciente, pero fiable.' },
      modern: {
        label: 'Me gustan los kernels, controladores y escritorios modernos.',
      },
      newest: { label: 'Dame lo último; ya me encargo yo del resto.' },
    },
  },
  maintenance: {
    prompt: '¿Cuánto mantenimiento estás dispuesto a tolerar?',
    options: {
      minimal: {
        label: 'Muy poco. Las actualizaciones deberían pasar sin incidentes.',
      },
      occasional: {
        label:
          'Puedo hacer algo de limpieza o resolver algún problema puntual.',
      },
      sometimes: {
        label:
          'Estoy dispuesto a investigar y solucionar problemas cuando surjan.',
      },
      hobby: { label: 'Romper y reparar cosas es parte de la afición.' },
    },
  },
  control: {
    prompt: '¿Cuánto control quieres sobre el propio sistema?',
    helper:
      'Piensa en los componentes y la configuración del sistema. La decoración del escritorio tiene su propia pregunta.',
    options: {
      drive: { label: 'Sobre todo, quiero usarlo.' },
      understand: { label: 'Me gusta saber qué ocurre por debajo.' },
      components: {
        label: 'Quiero elegir los componentes principales del sistema.',
      },
      everything: { label: 'Quiero control hasta el último detalle.' },
    },
  },
  customization: {
    prompt: '¿Y cuánto te gusta personalizar el escritorio?',
    options: {
      defaults: {
        label: 'Dame una configuración inicial cuidada y déjala como está.',
      },
      touches: { label: 'Unos toques personales.' },
      familiar: { label: 'Paneles y menús familiares, con mucho que ajustar.' },
      workflow: {
        label: 'Me gusta reorganizar los flujos de trabajo, paneles y atajos.',
      },
      castle: { label: 'En 48 horas, nadie reconocerá mi escritorio.' },
    },
  },
  release: {
    prompt:
      '¿Qué te parece el modelo de actualización continua (rolling release)?',
    helper:
      'Este modelo renueva las versiones de forma continua, en lugar de publicar grandes versiones del sistema operativo. Ambos modelos reciben actualizaciones.',
    options: {
      fixed: {
        label: 'No, gracias. Prefiero versiones bien definidas y estables.',
      },
      either: { label: 'Cualquiera de los dos me sirve.' },
      appealing: { label: 'La actualización continua me atrae.' },
      rolling: { label: 'Sin duda. Que todo siga avanzando.' },
    },
  },
  'system-model': {
    prompt:
      '¿Cómo prefieres gestionar el sistema que hay debajo de tus aplicaciones?',
    helper:
      'Los sistemas atómicos actualizan la base como una unidad y a menudo permiten volver a un estado anterior. Las aplicaciones y herramientas suelen estar separadas, mediante Flatpak o contenedores. Modificar la base funciona de forma distinta a un sistema tradicional gestionado con paquetes.',
    options: {
      traditional: {
        label:
          'Quiero un sistema tradicional que pueda modificar directamente.',
      },
      either: { label: 'No tengo preferencia.' },
      protected: {
        label: 'Una base atómica me atrae; puedo aprender a manejarla.',
      },
      containers: {
        label: 'Prefiero el enfoque atómico, centrado en contenedores.',
      },
    },
  },
  'use-cases': {
    prompt: '¿Para qué usarás principalmente este equipo?',
    helper:
      'Algunos planes orientan la afinidad; otros te ayudan a preparar el equipo para la aventura. Los videojuegos tienen su propia pregunta.',
    options: {
      everyday: { label: 'Navegar, trabajar con documentos y el día a día.' },
      development: { label: 'Programación y desarrollo.' },
      gaming: { label: 'Videojuegos.' },
      creative: { label: 'Trabajo creativo y multimedia.' },
      learning: { label: 'Aprender Linux.' },
      security: { label: 'Ciberseguridad y pruebas de penetración.' },
      homelab: { label: 'Servidores, contenedores y laboratorio doméstico.' },
      'old-hardware': { label: 'Mantener con vida el hardware antiguo.' },
    },
  },
  gaming: {
    prompt: '¿Qué importancia tienen los videojuegos?',
    options: {
      none: { label: 'No son relevantes.' },
      occasional: { label: 'Juego de vez en cuando.' },
      important: { label: 'Son importantes.' },
      main: {
        label: 'Son uno de los principales motivos por los que estoy aquí.',
      },
    },
  },
  hardware: {
    prompt: '¿Con qué tipo de hardware contamos?',
    helper:
      'Piensa en la potencia y la memoria disponibles, no solo en la edad del equipo.',
    options: {
      powerful: { label: 'Moderno y potente.' },
      recent: {
        label: 'Un portátil o PC de escritorio relativamente reciente.',
      },
      aging: { label: 'Ya tiene sus años, pero aún se defiende.' },
      limited: { label: 'Este equipo recuerda las conexiones por módem.' },
      handheld: { label: 'Una consola portátil tipo PC.' },
    },
  },
  gpu: {
    prompt: '¿Qué hardware gráfico o tipo de Mac usas?',
    helper:
      'Si usas un Mac, elige su tipo. En otro equipo, elige el hardware gráfico que usas para tareas exigentes.',
    options: {
      nvidia: { label: 'NVIDIA' },
      'open-driver': { label: 'Gráficos AMD o Intel' },
      'apple-silicon': { label: 'Mac con Apple Silicon' },
      'intel-mac': { label: 'Mac con Intel' },
      unknown: { label: 'No tengo ni idea.' },
    },
  },
  'software-freedom': {
    prompt: '¿Cuánto te importa el software libre y de código abierto?',
    options: {
      pragmatic: { label: 'Lo que funcione.' },
      prefer: { label: 'Prefiero el código abierto cuando resulta práctico.' },
      important: { label: 'Me importa bastante.' },
      strong: {
        label: 'Lo más orientado al software libre posible, por favor.',
      },
    },
  },
  troubleshooting: {
    prompt: 'Cuando algo falla, ¿cuál es tu primera reacción?',
    options: {
      distress: { label: '¿Por qué me hace esto el equipo?' },
      search: { label: 'Buscar el error y seguir las instrucciones.' },
      investigate: { label: 'Abrir la terminal e investigar.' },
      learn: { label: 'Excelente. Una oportunidad para aprender.' },
    },
  },
  identity: {
    prompt: '¿Qué frase te describe mejor?',
    options: {
      background: { label: 'Quiero que Linux pase desapercibido.' },
      dependable: { label: 'Quiero algo moderno y fiable.' },
      shape: { label: 'Quiero un sistema que pueda adaptar a mi manera.' },
      understand: { label: 'Quiero entender cómo funciona todo.' },
      declarative: {
        label:
          'Quiero una receta de configuración que pueda reconstruir todo mi sistema.',
      },
      minimal: {
        label: 'Quiero un sistema pequeño, solo con lo que necesito.',
      },
      unix: {
        label:
          'Me gustan las formas tradicionales de Unix y hacer las cosas a mano.',
      },
    },
  },
  path: {
    prompt: 'Elige tu camino',
    helper: 'El camino se divide más adelante. ¿Por dónde sigues?',
    options: {
      comfortable: {
        label: 'El Camino Cómodo',
        description: 'Fiable, acogedor y fácil de llevar.',
      },
      modern: {
        label: 'El Camino Moderno',
        description: 'Tecnología reciente sin dramas innecesarios.',
      },
      artisan: {
        label: 'El Camino del Artesano',
        description: 'Haz que el sistema sea de verdad tuyo.',
      },
      explorer: {
        label: 'El Camino del Explorador',
        description: 'Aprende, experimenta y acepta algunas sorpresas.',
      },
      forbidden: {
        label: 'El Camino Prohibido',
        description: 'Control máximo. Acepto las consecuencias.',
      },
    },
  },
};
