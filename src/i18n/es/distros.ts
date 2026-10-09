import type { DistroDictionary } from '../../domain/distro.ts';

export const distroContentEs = {
  'linux-mint': {
    name: 'Linux Mint',
    archetype: {
      name: 'El Pragmático',
      description:
        'El Pragmático elige un escritorio familiar y una configuración inicial sensata para pasar de la instalación al trabajo útil sin rodeos. Linux Mint recompensa a quienes prefieren usar su equipo antes que convertir su mantenimiento en una afición.',
    },
    summary:
      'Un escritorio acogedor basado en Ubuntu, con actualizaciones conservadoras y herramientas gráficas prácticas.',
    strengths: [
      'Distribución familiar del escritorio',
      'Herramientas accesibles para actualizaciones y controladores',
      'Base conservadora de Ubuntu LTS',
      'Amplia disponibilidad de aplicaciones de uso cotidiano',
    ],
    cautions: [
      'Los paquetes base pueden ir por detrás de las versiones actuales de los proyectos originales.',
      'Cinnamon consume más recursos que otras alternativas de escritorio ligeras.',
      'El hardware más reciente para videojuegos puede necesitar componentes gráficos más nuevos.',
    ],
    idealFor: [
      'Quienes usan Linux por primera vez',
      'Uso cotidiano del equipo en casa',
      'Quienes prefieren formas de trabajar familiares',
    ],
    assessmentBasis:
      'Edición Cinnamon basada en Ubuntu; MATE y Xfce pueden reducir el consumo de recursos del escritorio.',
  },
  ubuntu: {
    name: 'Ubuntu',
    archetype: {
      name: 'El Emisario',
      description:
        'El Emisario se mueve con soltura entre Linux y el resto del mundo del software. Ubuntu encaja con quienes valoran las formas de trabajar bien documentadas, la compatibilidad con software de proveedores y un camino bien señalizado para entrar en Linux.',
    },
    summary:
      'Un escritorio Linux con amplio soporte, un extenso ecosistema de software y una opción LTS.',
    strengths: [
      'Amplia documentación y ayuda de la comunidad',
      'Amplio soporte de software comercial',
      'Opción de versiones con soporte a largo plazo',
      'Sólido ecosistema de desarrollo',
    ],
    cautions: [
      'GNOME puede resultar poco familiar a quienes vienen de Windows.',
      'Los paquetes Snap pueden no encajar con todas las formas de trabajar.',
      'Los paquetes base de LTS priorizan la continuidad sobre las novedades.',
    ],
    idealFor: [
      'Quienes empiezan con Linux',
      'Desarrolladores que usan herramientas con soporte de sus proveedores',
      'Quienes buscan un escritorio consolidado',
    ],
    assessmentBasis:
      'Ubuntu Desktop LTS con GNOME; las versiones intermedias tienen un equilibrio distinto entre novedades y soporte.',
  },
  'fedora-workstation': {
    name: 'Fedora Workstation',
    archetype: {
      name: 'El Vanguardista',
      description:
        'El Vanguardista adopta pronto las nuevas ideas de Linux sobre un sistema bien organizado. Fedora Workstation encaja con desarrolladores y usuarios de escritorio que disfrutan de la tecnología actual y de un espacio de trabajo GNOME centrado en lo esencial.',
    },
    summary:
      'Una estación de trabajo GNOME moderna que combina tecnología Linux actual con un ciclo regular de versiones.',
    strengths: [
      'Kernels y herramientas de desarrollo actuales',
      'Sólidos flujos de trabajo con contenedores',
      'Configuración inicial coherente de GNOME',
      'Colaboración consolidada con los proyectos originales',
    ],
    cautions: [
      'Las actualizaciones a nuevas versiones requieren planificación.',
      'Algunos códecs y controladores propietarios necesitan configuración adicional.',
      'Las extensiones de GNOME pueden complicar los cambios de versión.',
    ],
    idealFor: [
      'Desarrolladores de software',
      'Quienes quieren un escritorio moderno de uso general',
      'Quienes se sienten cómodos con cambios regulares de versión',
    ],
    assessmentBasis: 'Instalación estándar de Fedora Workstation con GNOME.',
  },
  'fedora-kde': {
    name: 'Fedora KDE',
    archetype: {
      name: 'El Experimentador',
      description:
        'El Experimentador disfruta de una base moderna con paneles, atajos y formas de trabajar que puede adaptar. Fedora KDE permite experimentar en el día a día sin convertir la personalización en una tarea permanente de mantenimiento.',
    },
    summary:
      'Un escritorio KDE Plasma actualizado sobre la base versátil de Fedora.',
    strengths: [
      'Ajustes flexibles del escritorio Plasma',
      'Kernels y componentes gráficos actuales',
      'Excelente ecosistema de desarrollo y contenedores',
      'Buen encaje como estación de trabajo de uso general',
    ],
    cautions: [
      'Las actualizaciones a nuevas versiones requieren planificación.',
      'Los controladores propietarios y algunos códecs necesitan configuración adicional.',
      'La abundancia de ajustes del escritorio puede abrumar a quienes empiezan.',
    ],
    idealFor: [
      'Quienes quieren un escritorio cotidiano que puedan adaptar',
      'Desarrolladores de software',
      'Quienes buscan software moderno con administración convencional',
    ],
    assessmentBasis:
      'Fedora KDE Plasma Desktop; sus ajustes integrados permiten una personalización del escritorio superior a la de GNOME.',
  },
  'fedora-silverblue': {
    name: 'Fedora Silverblue',
    archetype: {
      name: 'El Artífice',
      description:
        'El Artífice construye con libertad dentro de un taller cuidadosamente protegido. Fedora Silverblue encaja con quienes quieren tecnología moderna de Fedora y herramientas basadas en contenedores, manteniendo el sistema subyacente predecible y fácil de restaurar.',
    },
    summary:
      'Un escritorio oficial de Fedora Atomic que combina GNOME, actualizaciones basadas en imágenes, vuelta a estados anteriores, aplicaciones Flatpak y desarrollo orientado a contenedores.',
    strengths: [
      'Actualizaciones atómicas del sistema y vuelta a estados anteriores',
      'Sólidos flujos de desarrollo con Toolbx y contenedores',
      'Base de software moderno de Fedora',
      'Separación clara entre el sistema base y las aplicaciones',
    ],
    cautions: [
      'La gestión de paquetes del sistema anfitrión difiere de la de Fedora convencional; Flatpak y Toolbx requieren otros hábitos.',
      'Los códecs propietarios y los controladores NVIDIA necesitan configuración adicional; el soporte de los controladores puede tardar en adaptarse a kernels nuevos.',
      'La personalización de GNOME es menos amplia que la de KDE Plasma.',
      'Las actualizaciones regulares a nuevas versiones de Fedora siguen requiriendo planificación.',
    ],
    idealFor: [
      'Desarrolladores que usan contenedores',
      'Usuarios de Fedora interesados en escritorios atómicos',
      'Quienes priorizan poder volver a estados anteriores y tener un sistema anfitrión protegido',
    ],
    assessmentBasis:
      'Escritorio atómico oficial de Fedora con GNOME, que usa OSTree/rpm-ostree, Flatpak y Toolbx con el ritmo habitual de versiones de Fedora. Fedora Kinoite es su equivalente oficial con KDE Plasma, no un perfil con puntuación independiente.',
    editionNote:
      '¿Prefieres KDE Plasma? Fedora Kinoite ofrece la alternativa oficial equivalente de escritorio atómico.',
  },
  debian: {
    name: 'Debian',
    archetype: {
      name: 'El Custodio',
      description:
        'El Custodio da al software maduro una vida larga y útil. Debian encaja con quienes valoran los cambios predecibles, la gestión comunitaria y un sistema que puedan mantener estable con el paso del tiempo.',
    },
    summary:
      'Una distribución mantenida por la comunidad cuya rama estable favorece la continuidad y un gran archivo de paquetes.',
    strengths: [
      'Base conservadora de la versión estable',
      'Gran archivo de paquetes',
      'Soporte para numerosas arquitecturas',
      'Desarrollo gobernado por la comunidad',
    ],
    cautions: [
      'Paquetes base y componentes gráficos más antiguos.',
      'La configuración del escritorio puede exigir más decisiones que en las derivadas orientadas a principiantes.',
      'El hardware nuevo puede necesitar paquetes de backports o atención al firmware.',
    ],
    idealFor: [
      'Quienes priorizan los cambios predecibles',
      'Estaciones de trabajo de larga vida útil',
      'Hardware modesto con un escritorio ligero',
    ],
    assessmentBasis:
      'Debian estable con un escritorio Xfce ligero; las ramas testing y unstable quedan fuera de este perfil.',
  },
  'pop-os': {
    name: 'Pop!_OS',
    archetype: {
      name: 'El Piloto',
      description:
        'El Piloto quiere una estación de trabajo que ayude a mantener el rumbo en tareas exigentes. Pop!_OS combina la propuesta de escritorio de System76 con una gestión de ventanas productiva para desarrolladores, creadores y quienes disfrutan de controles con una función clara.',
    },
    summary:
      'Una estación de trabajo basada en Ubuntu, centrada en el escritorio COSMIC de System76 y en formas de trabajar productivas.',
    strengths: [
      'Funciones productivas de organización de ventanas en mosaico y espacios de trabajo',
      'Ecosistema de software de Ubuntu',
      'Integración del hardware en equipos System76',
      'Facilidades de configuración para videojuegos y gráficos',
    ],
    cautions: [
      'La madurez de COSMIC y la integración de aplicaciones merecen una evaluación práctica.',
      'Las instrucciones para Ubuntu pueden diferir en detalles del escritorio y del sistema.',
      'No está orientado a equipos con pocos recursos.',
    ],
    idealFor: [
      'Desarrolladores y creadores',
      'Quienes disfrutan de trabajar con ventanas en mosaico',
      'Propietarios de equipos System76',
    ],
    assessmentBasis:
      'Propuesta actual del escritorio COSMIC; las estimaciones de pulido y mantenimiento necesitan revisión a medida que madure el escritorio.',
  },
  'zorin-os': {
    name: 'Zorin OS',
    archetype: {
      name: 'El Iniciado',
      description:
        'El Iniciado encuentra una entrada acogedora a Linux. Las disposiciones familiares y la presentación cuidada de Zorin dejan espacio para aprender sin complicar las tareas cotidianas.',
    },
    summary:
      'Un escritorio pulido basado en Ubuntu, diseñado para facilitar la transición desde Windows o macOS.',
    strengths: [
      'Disposiciones familiares del escritorio',
      'Configuración gráfica acogedora',
      'Ecosistema de aplicaciones de Ubuntu',
      'Apariencia inicial cuidadosamente diseñada',
    ],
    cautions: [
      'El software base puede ir por detrás de los proyectos originales.',
      'Algunas disposiciones y extras pertenecen a la edición de pago.',
      'El escritorio predeterminado consume más recursos que las alternativas mínimas.',
    ],
    idealFor: [
      'Quienes llegan de Windows y macOS',
      'Quienes valoran la presentación',
      'Uso cotidiano del equipo en casa y en la oficina',
    ],
    assessmentBasis:
      'Zorin OS Core; las disposiciones de la edición Pro de pago no aumentan las puntuaciones de capacidades.',
  },
  'elementary-os': {
    name: 'elementary OS',
    archetype: {
      name: 'El Esteta',
      description:
        'El Esteta valora la coherencia visual y la sobriedad deliberada. elementary OS ofrece un escritorio Pantheon cuidadosamente seleccionado para quienes prefieren decisiones de diseño consistentes a un sinfín de controles de interfaz.',
    },
    summary:
      'Un escritorio basado en Ubuntu, centrado en Pantheon, un diseño coherente y aplicaciones cuidadosamente seleccionadas.',
    strengths: [
      'Diseño de interfaz coherente',
      'Aplicaciones de escritorio cuidadosamente seleccionadas',
      'Formas sencillas de trabajar en el día a día',
      'Base de Ubuntu',
    ],
    cautions: [
      'Personalización integrada del escritorio limitada.',
      'Menos aplicaciones plenamente integradas con el escritorio.',
      'Los videojuegos y las herramientas especializadas requieren más configuración.',
    ],
    idealFor: [
      'Usuarios de escritorio atentos al diseño',
      'Quienes prefieren una interfaz sobria',
      'Quienes están a gusto con una configuración inicial cuidadosamente seleccionada',
    ],
    assessmentBasis: 'Escritorio Pantheon predeterminado.',
  },
  'opensuse-aeon': {
    name: 'openSUSE Aeon',
    archetype: {
      name: 'El Guardián del Tiempo',
      description:
        'El Guardián del Tiempo deja avanzar al sistema sin perder de vista el ayer. Aeon encaja con quienes quieren software actual, actualizaciones transaccionales automáticas y un escritorio que pida muy poca intervención habitual.',
    },
    summary:
      'Un escritorio GNOME transaccional de openSUSE, centrado en actualizaciones automáticas, instantáneas, vuelta a estados anteriores y un sistema anfitrión deliberadamente protegido.',
    strengths: [
      'Actualizaciones transaccionales del sistema y recuperación mediante instantáneas',
      'Base de software con actualización continua',
      'Poco mantenimiento habitual gracias a las actualizaciones automáticas',
      'Escritorio GNOME centrado en lo esencial, con Flatpak y Distrobox',
    ],
    cautions: [
      'Aeon sigue siendo una versión candidata; comprueba los requisitos de hardware y recuperación antes de depender de él.',
      'No se admite modificar el sistema anfitrión de la forma tradicional; usa Flatpak o Distrobox siempre que sea posible.',
      'La integración de controladores propietarios NVIDIA no cuenta con una solución lista para usar con soporte oficial. Comprueba la compatibilidad gráfica de tu equipo.',
      'El instalador requiere UEFI, reemplaza el contenido del disco seleccionado y tiene requisitos específicos de cifrado.',
    ],
    idealFor: [
      'Quienes quieren un escritorio de actualización continua con poca intervención',
      'Quienes priorizan volver a estados anteriores y recuperar el sistema',
      'Quienes se sienten cómodos con una forma de trabajar definida alrededor de un sistema anfitrión protegido',
    ],
    assessmentBasis:
      'Escritorio GNOME actual de Aeon en versión candidata, dentro del ecosistema openSUSE: paquetes de Tumbleweed, instantáneas transaccionales Btrfs, vuelta a estados anteriores mediante systemd-boot, Flatpak y Distrobox con Podman. Las actualizaciones continuas y frecuentes siguen automatizadas; no se admite modificar el sistema anfitrión.',
  },
  'opensuse-tumbleweed': {
    name: 'openSUSE Tumbleweed',
    archetype: {
      name: 'El Centinela',
      description:
        'El Centinela explora con medidas de protección a mano. Tumbleweed encaja con quienes quieren software de actualización continua, instantáneas probadas y herramientas de recuperación que faciliten gestionar un escritorio aventurero.',
    },
    summary:
      'Una distribución de actualización continua que combina software reciente con pruebas automatizadas y herramientas de recuperación mediante instantáneas.',
    strengths: [
      'Software con actualización continua',
      'Pruebas automatizadas de la distribución',
      'Recuperación mediante instantáneas Btrfs',
      'Amplias opciones de configuración del escritorio y del sistema',
    ],
    cautions: [
      'Actualizaciones frecuentes y, a veces, grandes.',
      'Los códecs y controladores propietarios requieren atención.',
      'La recuperación mediante instantáneas sigue requiriendo conocimientos técnicos y espacio en disco.',
    ],
    idealFor: [
      'Quienes quieren un escritorio de actualización continua con herramientas de gestión',
      'Desarrolladores que necesitan herramientas actuales',
      'Quienes disfrutan ajustando el sistema y valoran las opciones de recuperación',
    ],
    assessmentBasis:
      'Escritorio KDE con la instalación estándar Btrfs/Snapper; la recuperación no equivale a actualizaciones atómicas mediante imágenes.',
  },
  endeavouros: {
    name: 'EndeavourOS',
    archetype: {
      name: 'El Explorador',
      description:
        'El Explorador entra en el mundo de Arch por un camino más iluminado. EndeavourOS te recibe con una comunidad acogedora y una instalación gráfica; aprender a gestionar y mantener el sistema queda en tus manos.',
    },
    summary:
      'Una derivada de Arch orientada a la terminal, con un instalador guiado y una configuración de escritorio relativamente ligera.',
    strengths: [
      'Entrada guiada al ecosistema Arch',
      'Paquetes actuales',
      'Comunidad acogedora para aprender',
      'Instalación ligera y adaptable',
    ],
    cautions: [
      'Las actualizaciones continuas pueden necesitar intervención manual.',
      'Se espera que administres el sistema desde la terminal.',
      'Los paquetes de AUR requieren revisión y mantenimiento independientes.',
    ],
    idealFor: [
      'Usuarios de Linux que quieren acercarse a Arch',
      'Quienes aprenden con la práctica',
      'Quienes se sienten cómodos asumiendo el mantenimiento del sistema',
    ],
    assessmentBasis:
      'Instalación predeterminada de KDE; otras opciones de escritorio cambian el consumo de recursos.',
  },
  'arch-linux': {
    name: 'Arch Linux',
    archetype: {
      name: 'El Artesano',
      description:
        'El Artesano monta un sistema pieza a pieza, entendiendo cada decisión por el camino. Arch recompensa a usuarios con experiencia que disfrutan construyendo su propio entorno y asumiendo la responsabilidad de mantenerlo.',
    },
    summary:
      'Una distribución mínima de actualización continua que deja en manos del usuario el montaje del escritorio y la configuración del sistema.',
    strengths: [
      'Control excepcional sobre la composición del sistema',
      'Paquetes y herramientas de desarrollo actuales',
      'Extensa Arch Wiki',
      'Gran ecosistema comunitario de compilación de paquetes',
    ],
    cautions: [
      'La instalación y el montaje del escritorio requieren decisiones deliberadas.',
      'Las actualizaciones pueden necesitar intervención manual.',
      'Los paquetes comunitarios no equivalen a paquetes oficiales revisados.',
    ],
    idealFor: [
      'Usuarios de Linux con experiencia',
      'Quienes construyen un entorno personal',
      'Quienes aprenden sobre el sistema con la práctica',
    ],
    assessmentBasis:
      'Base mínima con un escritorio ligero montado por el usuario; el pulido se valora sobre la configuración inicial suministrada, no sobre un entorno personalizado ya terminado.',
  },
  cachyos: {
    name: 'CachyOS',
    archetype: {
      name: 'El Andariego',
      description:
        'El Andariego avanza con paso ágil y equipo moderno. CachyOS acerca las herramientas de Arch orientadas al rendimiento a quienes quieren afinar su sistema sin montarlo todo desde cero.',
    },
    summary:
      'Un escritorio basado en Arch, con paquetes optimizados, opciones de kernel y herramientas orientadas al rendimiento.',
    strengths: [
      'Componentes gráficos y kernels actuales',
      'Paquetes compilados con énfasis en el rendimiento',
      'Instalación gráfica',
      'Opciones de kernel y planificador',
    ],
    cautions: [
      'Los requisitos de CPU varían entre las compilaciones optimizadas.',
      'Las actualizaciones continuas y kernels personalizados requieren atención.',
      'Las mejoras de rendimiento dependen del hardware y de la carga de trabajo.',
    ],
    idealFor: [
      'Entusiastas de los videojuegos con hardware moderno',
      'Quienes quieren ajustar el rendimiento en detalle',
      'Quienes se sienten cómodos con el mantenimiento de Arch',
    ],
    assessmentBasis:
      'Escritorio KDE en hardware x86-64 moderno y compatible; las optimizaciones no garantizan mejoras de rendimiento en todos los casos.',
  },
  nobara: {
    name: 'Nobara',
    archetype: {
      name: 'El Campeón',
      description:
        'El Campeón llega equipado para partidas exigentes y trabajo creativo. Nobara incorpora facilidades para videojuegos y multimedia a una estación de trabajo derivada de Fedora, para quienes quieren menos tareas de configuración antes del uso cotidiano.',
    },
    summary:
      'Una derivada de Fedora con facilidades de configuración para videojuegos, gráficos y creación de contenido.',
    strengths: [
      'Dependencias para videojuegos y facilidades para controladores',
      'Herramientas multimedia y de captura',
      'Base actual derivada de Fedora',
      'Herramientas gráficas de configuración y actualización',
    ],
    cautions: [
      'Sus modificaciones pueden diferir de las indicaciones de Fedora.',
      'El soporte procede de un proyecto aficionado más pequeño.',
      'Los cambios de versión principales requieren atención a las instrucciones del proyecto.',
    ],
    idealFor: [
      'Quienes juegan en equipos de escritorio',
      'Streamers y creadores de contenido',
      'Quienes quieren facilidades de configuración para videojuegos',
    ],
    assessmentBasis:
      'Escritorio KDE de Nobara Official; sigue las herramientas de actualización y las indicaciones de Nobara.',
  },
  bazzite: {
    name: 'Bazzite',
    archetype: {
      name: 'El Jugador',
      description:
        'El Jugador trata el equipo como una plataforma de videojuegos y también como un escritorio. Bazzite combina herramientas de juego preparadas con una base gestionada mediante imágenes para quienes valoran sesiones fiables y un camino corto de vuelta a la partida.',
    },
    summary:
      'Un escritorio para videojuegos basado en Fedora Atomic, con actualizaciones mediante imágenes y variantes para hardware específico.',
    strengths: [
      'Entorno preparado para videojuegos',
      'Actualizaciones atómicas mediante imágenes y vuelta a estados anteriores',
      'Opciones para equipos de escritorio y consolas portátiles tipo PC compatibles',
      'Aplicaciones separadas del sistema base',
    ],
    cautions: [
      'Modificar el sistema anfitrión funciona de forma distinta a Linux convencional.',
      'El soporte del modo de juego depende del hardware y de la imagen.',
      'Los flujos de trabajo con Flatpak y contenedores requieren adaptación.',
    ],
    idealFor: [
      'Quienes juegan en equipos de escritorio',
      'Propietarios de consolas portátiles tipo PC compatibles',
      'Quienes prefieren una base gestionada para videojuegos',
    ],
    assessmentBasis:
      'Imagen de escritorio KDE en hardware compatible; la compatibilidad de consolas portátiles y del modo de juego debe comprobarse por separado.',
  },
  bluefin: {
    name: 'Bluefin',
    archetype: {
      name: 'El Navegante',
      description:
        'El Navegante mantiene el rumbo con una base gestionada y herramientas claramente separadas. Bluefin encaja con quienes prefieren actualizaciones automáticas de la imagen del sistema y flujos de trabajo centrados en aplicaciones, especialmente con desarrolladores que ya se manejan bien con contenedores.',
    },
    summary:
      'Una estación de trabajo basada en Fedora y gestionada mediante imágenes, con una configuración GNOME cuidadosamente seleccionada y flujos de desarrollo orientados a contenedores.',
    strengths: [
      'Actualizaciones automáticas basadas en imágenes',
      'Potente modo de desarrollo centrado en contenedores',
      'Experiencia GNOME cuidadosamente seleccionada',
      'Aplicaciones de escritorio y de línea de comandos separadas',
    ],
    cautions: [
      'La instalación de paquetes en el sistema anfitrión sigue otro modelo.',
      'Homebrew, Flatpak y los contenedores traen nuevos hábitos que aprender.',
      'La personalización de GNOME sigue siendo más limitada que la de Plasma.',
    ],
    idealFor: [
      'Desarrolladores que trabajan con contenedores',
      'Quienes buscan poco mantenimiento habitual',
      'Quienes están a gusto con una estación de trabajo gestionada',
    ],
    assessmentBasis:
      'Imagen estándar de GNOME con modo de desarrollo disponible; el canal de versiones afecta lo reciente que es el software.',
  },
  nixos: {
    name: 'NixOS',
    archetype: {
      name: 'El Arquitecto',
      description:
        'El Arquitecto describe una máquina para poder reconstruirla y comprender cómo funciona. NixOS recompensa a usuarios técnicos dispuestos a aprender un modelo de configuración distinto a cambio de entornos reproducibles y ajustes de sistema deliberados.',
    },
    summary:
      'Una distribución configurada de forma declarativa, centrada en paquetes Nix, generaciones del sistema y reproducibilidad.',
    strengths: [
      'Configuración declarativa del sistema',
      'Entornos de desarrollo reproducibles',
      'Generaciones del sistema y vuelta a estados anteriores',
      'Extenso ecosistema de paquetes',
    ],
    cautions: [
      'Lenguaje de configuración y curva de aprendizaje propios.',
      'El software que espera una estructura de archivos convencional puede fallar o necesitar ajustes.',
      'La reproducibilidad requiere fijar versiones de forma disciplinada.',
    ],
    idealFor: [
      'Usuarios técnicos interesados en sistemas declarativos',
      'Desarrolladores que gestionan entornos repetibles',
      'Quienes mantienen la configuración como código',
    ],
    assessmentBasis:
      'Canal estable de NixOS con un escritorio KDE configurado; el canal unstable ofrece otro equilibrio respecto a las novedades.',
  },
  gentoo: {
    name: 'Gentoo',
    archetype: {
      name: 'El Alquimista',
      description:
        'El Alquimista transforma ingredientes seleccionados en un sistema cuidadosamente construido. Gentoo encaja con entusiastas pacientes que disfrutan eligiendo opciones de compilación y entendiendo cómo encajan las piezas del software, y que aceptan el trabajo que trae esa libertad.',
    },
    summary:
      'Una distribución muy configurable, centrada en Portage, las opciones de compilación y la composición del sistema dirigida por el usuario.',
    strengths: [
      'Selección detallada de funciones de los paquetes',
      'Control profundo sobre la composición del sistema',
      'Flujos flexibles con paquetes de código fuente y binarios',
      'Documentación detallada del sistema',
    ],
    cautions: [
      'La configuración y los cambios de versión exigen bastante atención.',
      'Compilar desde el código fuente puede llevar tiempo y demandar mucho trabajo de tu hardware.',
      'La integración del escritorio es responsabilidad del usuario.',
    ],
    idealFor: [
      'Entusiastas del sistema con experiencia',
      'Quienes necesitan funciones de compilación específicas',
      'Quienes aprenden con paciencia y buscan un control profundo',
    ],
    assessmentBasis:
      'Escritorio montado por el usuario con palabras clave de paquetes estables; los paquetes binarios pueden reducir el trabajo de compilación.',
  },
  'void-linux': {
    name: 'Void Linux',
    archetype: {
      name: 'El Errante',
      description:
        'El Errante sigue una ruta independiente, con pocas capas entre el usuario y el sistema. runit y XBPS, las herramientas de Void, atraen a quienes prefieren una estructura ligera, se implican en el manejo del sistema y saben orientarse fuera de las convenciones de las distros más habituales.',
    },
    summary:
      'Una distribución independiente de actualización continua que usa runit y XBPS, con variantes glibc y musl.',
    strengths: [
      'Diseño de sistema ligero',
      'Supervisión sencilla de servicios con runit',
      'Herramientas nativas de paquetes rápidas',
      'Opciones alternativas de libc',
    ],
    cautions: [
      'Ecosistema más pequeño que el de las principales familias de distros.',
      'Más integración manual del escritorio y los controladores.',
      'Muchas instrucciones habituales dan por hecho el uso de systemd.',
    ],
    idealFor: [
      'Usuarios con experiencia que buscan un escritorio ligero',
      'Quienes tienen interés en runit',
      'Quienes se sienten cómodos con un ecosistema independiente',
    ],
    assessmentBasis:
      'Escritorio Xfce con glibc; musl añade otras limitaciones de compatibilidad.',
  },
  'kali-linux': {
    name: 'Kali Linux',
    archetype: {
      name: 'El Especialista',
      description:
        'El Especialista sabe exactamente cuál es su misión y cuenta con las herramientas y los conocimientos necesarios para cumplirla. Kali es tu aliado para las pruebas de penetración y el análisis de seguridad, no una distribución pensada para el uso cotidiano.',
    },
    summary:
      'Una distribución basada en Debian, diseñada para profesionales de la ciberseguridad y especializada en pruebas de penetración y auditorías de seguridad.',
    strengths: [
      'Amplio conjunto de herramientas para pruebas de penetración',
      'Documentación centrada en seguridad',
      'Flujos de trabajo diseñados para evaluaciones de seguridad',
      'Opciones de máquina virtual y uso en vivo',
    ],
    cautions: [
      'No es adecuado como recomendación de escritorio habitual para principiantes.',
      'Añadir repositorios de terceros puede comprometer la estabilidad del sistema y dificultar su mantenimiento.',
      'El desarrollo general y los videojuegos quedan fuera de su enfoque.',
    ],
    idealFor: [
      'Profesionales de pruebas de penetración',
      'Estudiantes de seguridad con experiencia en Linux',
      'Laboratorios de evaluación de seguridad autorizada',
    ],
    assessmentBasis:
      'Instalación estándar con Xfce y herramientas de seguridad; se evalúa como entorno especializado, no como escritorio de uso general.',
  },
  'mx-linux': {
    name: 'MX Linux',
    archetype: {
      name: 'El Superviviente',
      description:
        'El Superviviente mantiene útiles los equipos con recursos modestos. MX combina la estabilidad de Debian con herramientas prácticas para quienes prefieren aprovechar al máximo sus recursos y darle una nueva vida a equipos que aún tienen mucho que ofrecer.',
    },
    summary:
      'Un escritorio basado en Debian estable, con herramientas prácticas de administración y necesidades de recursos relativamente modestas.',
    strengths: [
      'Escritorio Xfce relativamente ligero',
      'Base conservadora de Debian',
      'Herramientas prácticas de administración de MX',
      'Herramientas prácticas para usar el sistema sin instalarlo y recuperarlo cuando sea necesario',
    ],
    cautions: [
      'Los paquetes base priorizan la estabilidad sobre las novedades.',
      'El hardware gráfico más reciente puede necesitar un conjunto distinto de kernel y componentes asociados.',
      'La presentación del escritorio es menos coherente que la de alternativas centradas en el diseño.',
    ],
    idealFor: [
      'Quienes quieren mantener productivo un hardware modesto',
      'Quienes quieren herramientas gráficas de administración',
      'Quienes buscan un escritorio cotidiano estable',
    ],
    assessmentBasis:
      'Edición estándar con Xfce. La compatibilidad con procesadores y tarjetas gráficas muy antiguos no es garantizada.',
  },
  'garuda-linux': {
    name: 'Garuda Linux',
    archetype: {
      name: 'El Berserker',
      description:
        'El Berserker no conoce la moderación: quiere potencia, personalidad y un escritorio que destaque. Garuda combina la base de Arch con herramientas para videojuegos, opciones de recuperación y un escritorio lleno de posibilidades para quienes disfrutan personalizando su sistema.',
    },
    summary:
      'Una derivada de Arch orientada a entusiastas, con una configuración de escritorio atrevida y herramientas de recuperación mediante instantáneas.',
    strengths: [
      'Software actual de Arch',
      'Herramientas de configuración orientadas a videojuegos',
      'Recuperación mediante instantáneas integrada',
      'Escritorio muy ajustable',
    ],
    cautions: [
      'Las actualizaciones continuas siguen requiriendo atención.',
      'La configuración inicial consume más recursos.',
      'El estilo visual marcado y las herramientas adicionales pueden no gustar a todo el mundo.',
    ],
    idealFor: [
      'Entusiastas de los videojuegos',
      'Quienes disfrutan de un estilo de escritorio atrevido',
      'Quienes disfrutan personalizando el sistema y se manejan bien con herramientas de recuperación',
    ],
    assessmentBasis:
      'Instalación KDE orientada a videojuegos con instantáneas Btrfs; las ediciones más ligeras difieren.',
  },
  solus: {
    name: 'Solus',
    archetype: {
      name: 'El Curador',
      description:
        'El Curador compone un escritorio con un criterio coherente. Solus sigue un camino independiente y centrado en el escritorio para quienes valoran la integración y la selección deliberada de paquetes por encima del catálogo más grande posible.',
    },
    summary:
      'Una distribución de escritorio independiente y de actualización continua, con un ecosistema de paquetes cuidadosamente seleccionado.',
    strengths: [
      'Integración centrada en el escritorio',
      'Selección cuidada de software',
      'Actualizaciones continuas de aplicaciones',
      'Diseño de distribución independiente',
    ],
    cautions: [
      'Catálogo de paquetes más pequeño que el de las principales familias de distros.',
      'Los paquetes de proveedores pueden estar dirigidos a otras distribuciones.',
      'Los cambios continuos y el rumbo del proyecto requieren revisión periódica.',
    ],
    idealFor: [
      'Quienes quieren un escritorio cotidiano con una selección cuidadosa',
      'Quienes se sienten cómodos con un ecosistema más pequeño',
      'Aficionados a la forma de trabajar de Budgie',
    ],
    assessmentBasis:
      'Edición Budgie; otras ediciones de escritorio cambian el pulido y la personalización.',
  },
  pikaos: {
    name: 'PikaOS',
    archetype: {
      name: 'El Desafiante',
      description:
        'El Desafiante llega con nuevas ambiciones al terreno de los escritorios para videojuegos. PikaOS encaja con entusiastas que quieren controladores actuales y herramientas accesibles de ajuste, y que están dispuestos a seguir un proyecto joven mientras evoluciona.',
    },
    summary:
      'Un escritorio basado en Debian Sid, con actualización continua, compilaciones orientadas al rendimiento y herramientas para videojuegos y gráficos.',
    strengths: [
      'Componentes actuales para videojuegos y gráficos',
      'Herramientas gráficas para controladores y kernels',
      'Paquetes compilados con énfasis en el rendimiento',
      'Herramientas para creación de contenido y tareas de cómputo',
    ],
    cautions: [
      'Un proyecto más joven tiene menos historial de resolución de problemas al que recurrir.',
      'La base optimizada requiere CPU modernas compatibles.',
      'Los repositorios propios de actualización continua pueden necesitar un mantenimiento más atento.',
    ],
    idealFor: [
      'Quienes juegan con hardware moderno compatible',
      'Creadores que quieren herramientas actuales para GPU',
      'Entusiastas dispuestos a seguir un proyecto más nuevo',
    ],
    assessmentBasis:
      'Escritorio KDE en hardware compatible con x86-64-v3; al ser un proyecto relativamente reciente, las valoraciones sobre su estabilidad y mantenimiento deben tomarse con cierta cautela.',
  },
  'alpine-linux': {
    name: 'Alpine Linux',
    archetype: {
      name: 'El Asceta',
      description:
        'El Asceta elige un sistema pequeño y acepta las consecuencias de viajar ligero. La base musl y BusyBox de Alpine encaja con usuarios avanzados que tienen una razón técnica concreta para dejar atrás las suposiciones del escritorio convencional.',
    },
    summary:
      'Una distribución mínima y atenta a la seguridad que usa musl y BusyBox, con limitaciones importantes de compatibilidad en el escritorio.',
    strengths: [
      'Base que ocupa muy poco espacio',
      'Herramientas sencillas para paquetes y servicios',
      'Ecosistema útil para contenedores y equipos dedicados',
      'Composición explícita de un sistema mínimo',
    ],
    cautions: [
      'musl puede complicar el uso de software propietario y de software dirigido a glibc.',
      'La integración del escritorio requiere trabajo manual.',
      'Poco adecuado para los videojuegos.',
    ],
    idealFor: [
      'Usuarios avanzados de sistemas mínimos',
      'Experimentación técnica con musl',
      'Equipos ligeros para fines específicos',
    ],
    assessmentBasis:
      'Base estable de Alpine con un escritorio ligero que requiere configuración manual; su buen desempeño en contenedores no garantiza la misma facilidad de uso en el escritorio.',
  },
  'vanilla-os': {
    name: 'Vanilla OS',
    archetype: {
      name: 'El Viajero',
      description:
        'El Viajero mantiene su base intacta mientras explora distintos entornos según lo que necesite. Vanilla OS es ideal para quienes prefieren un sistema base inmutable y aplicaciones aisladas, sin tener que depender de un único ecosistema para todo.',
    },
    summary:
      'Un escritorio inmutable de uso general con gestión del sistema basada en imágenes y entornos aislados para aplicaciones y tareas de línea de comandos.',
    strengths: [
      'Sistema anfitrión protegido con actualizaciones atómicas ABRoot y vuelta a estados anteriores',
      'Entornos Apx compatibles con los espacios de usuario de varias distribuciones Linux',
      'Aplicaciones Flatpak separadas del sistema anfitrión',
      'Opciones de imágenes NVIDIA integradas',
    ],
    cautions: [
      'Apx, VSO y ABRoot introducen una forma de trabajar poco convencional; reserva al menos 50 GB de espacio en disco.',
      'Un proyecto pequeño con una revisión principal recién publicada tiene un soporte menos consolidado que Fedora o Ubuntu.',
      'Reunion cambia los flujos de trabajo de los subsistemas; los cambios de versión desde configuraciones anteriores requieren atención.',
      'Las imágenes NVIDIA usan módulos sin firmar; hay que comprobar Secure Boot y la generación de GPU.',
    ],
    idealFor: [
      'Quienes sienten curiosidad por los escritorios inmutables y están dispuestos a aprender',
      'Desarrolladores que usan varios entornos Linux',
      'Quienes quieren entornos de aplicaciones separados del sistema anfitrión',
    ],
    assessmentBasis:
      'Escritorio GNOME de Vanilla OS 3 Reunion, publicado en agosto de 2026; sistema anfitrión OCI híbrido derivado de Debian, con ABRoot, Apx v3, un entorno VSO basado en Debian testing y aplicaciones Flatpak. Las imágenes con actualización continua y revisiones principales con nombre se modelan como actualización continua, no como Ubuntu LTS. Incluido con cautela por su ecosistema pequeño y los cambios recientes en la forma de trabajar.',
  },
  'rhino-linux': {
    name: 'Rhino Linux',
    archetype: {
      name: 'El Pionero',
      description:
        'El Pionero conoce bien el territorio de Ubuntu, pero prefiere abrir su propio camino antes que seguir las rutas establecidas. Rhino Linux combina la familiaridad de Ubuntu con actualizaciones continuas y software reciente, sin abandonar su base ni su ecosistema de paquetes.',
    },
    summary:
      'Un escritorio de la familia Ubuntu con actualización continua que combina paquetes actuales, herramientas Pacstall y una experiencia de escritorio ligera con decisiones de diseño propias.',
    strengths: [
      'Base de paquetes de desarrollo de Ubuntu con actualización continua',
      'Kernels y software de desarrollo muy actuales',
      'Paquetes comunitarios de Pacstall e integración con Rhino PKG',
      'Escritorio Unicorn ligero y personalizable, basado en Xfce',
    ],
    cautions: [
      'Los paquetes de desarrollo de Ubuntu y las actualizaciones continuas pueden provocar fallos que requieran correcciones manuales.',
      'Proyecto y comunidad de soporte más pequeños que los de Ubuntu estándar.',
      'Los paquetes comunitarios de Pacstall requieren criterio propio; no todos están mantenidos por Ubuntu.',
      'Los kernels sin firmar afectan a la configuración de Secure Boot; hay que comprobar las versiones de los controladores NVIDIA.',
    ],
    idealFor: [
      'Usuarios de Ubuntu con experiencia que quieren software de actualización continua',
      'Desarrolladores que quieren herramientas de desarrollo actuales',
      'Usuarios de escritorio cómodos con el mantenimiento que prefieren sistemas de la familia Debian a Arch',
    ],
    assessmentBasis:
      'Instantánea del escritorio Unicorn de Rhino Linux 2026.1: base mutable de Ubuntu devel, Xfce, Pacstall y Rhino PKG (RPK2), con configuración guiada de NVIDIA. Los escritorios UBXI, como Lomiri, son opciones separadas. Incluido con cautela; la corrección de emergencia de Pacstall de febrero de 2026 ilustra un riesgo real de mantenimiento.',
  },
  slackware: {
    name: 'Slackware',
    archetype: {
      name: 'El Tradicionalista',
      description:
        'El Tradicionalista respeta las convenciones de Unix y sabe exactamente qué cambia en su sistema y por qué. Slackware es para quienes tienen experiencia con Linux y valoran la continuidad, el software fiel a sus proyectos originales y la administración manual como forma de conocer su sistema a fondo.',
    },
    summary:
      'Una distribución independiente con una larga trayectoria, centrada en versiones conservadoras y una administración directa y tradicional.',
    strengths: [
      'Filosofía de versiones conservadora',
      'Configuración directa mediante texto',
      'Pocas modificaciones del software de los proyectos originales',
      'Formas de trabajar consolidadas al estilo Unix',
    ],
    cautions: [
      'Las herramientas oficiales de paquetes dejan la resolución de dependencias en tus manos.',
      'El software de la versión estable puede ser bastante más antiguo.',
      'Los flujos modernos de escritorio y de software de proveedores necesitan más trabajo manual.',
    ],
    idealFor: [
      'Usuarios con experiencia y afinidad por Unix',
      'Quienes prefieren la administración manual',
      'Quienes valoran convenciones de sistema duraderas',
    ],
    assessmentBasis:
      'Slackware estable con Xfce; la rama de desarrollo queda fuera de este perfil.',
  },
} satisfies DistroDictionary;
