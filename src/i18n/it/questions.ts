import type { QuestionDictionary } from '../../domain/preferences.ts';

export const questionContentIt: QuestionDictionary = {
  experience: {
    prompt: 'Quanta esperienza hai già con Linux?',
    options: {
      new: { label: 'Mai usato. Vacci piano.' },
      tried: { label: 'Ho provato Linux qualche volta.' },
      regular: { label: 'Uso regolarmente Linux senza difficoltà.' },
      terminal: {
        label: 'Me la cavo con il terminale e la configurazione del sistema.',
      },
      init: { label: 'Ho le mie opinioni sui sistemi di init.' },
    },
  },
  setup: {
    prompt: 'Cosa vorresti fare dopo l’installazione?',
    options: {
      ready: { label: 'Idealmente? Iniziare a usare il computer.' },
      little: { label: 'Un po’ di configurazione iniziale va bene.' },
      configure: { label: 'Mi piace configurare le cose.' },
      build: { label: 'Metà del divertimento sta nel costruire il sistema.' },
    },
  },
  freshness: {
    prompt: 'Quanto ti interessa avere software recente?',
    options: {
      proven: { label: 'Collaudato e noioso, grazie.' },
      balanced: { label: 'Abbastanza recente, ma affidabile.' },
      modern: {
        label: 'Mi piacciono kernel, driver e ambienti desktop moderni.',
      },
      newest: { label: 'Voglio le ultime novità. Al resto ci penso io.' },
    },
  },
  maintenance: {
    prompt: 'Quanta manutenzione sei disposto a fare?',
    options: {
      minimal: {
        label: 'Pochissima. Gli aggiornamenti dovrebbero filare lisci.',
      },
      occasional: {
        label: 'Ogni tanto va bene fare pulizia o risolvere qualche problema.',
      },
      sometimes: {
        label:
          'Mi sento a mio agio nel fare manutenzione regolare e risolvere i problemi in autonomia.',
      },
      hobby: { label: 'Rompere e riparare le cose fa parte dell’hobby.' },
    },
  },
  control: {
    prompt: 'Quanto controllo vuoi sul sistema vero e proprio?',
    helper:
      'Pensa ai componenti e alla configurazione del sistema. L’aspetto del desktop ha una domanda tutta sua.',
    options: {
      drive: { label: 'Mi interessa soprattutto usarlo.' },
      understand: { label: 'Mi piace sapere cosa succede dietro le quinte.' },
      components: {
        label:
          'Voglio scegliere personalmente i principali componenti del sistema.',
      },
      everything: { label: 'Voglio controllare il sistema fino in fondo.' },
    },
  },
  customization: {
    prompt: 'E quanto ti piace personalizzare l’ambiente desktop?',
    options: {
      defaults: {
        label: 'Voglio un ambiente già curato, da lasciare così com’è.',
      },
      touches: { label: 'Qualche tocco personale.' },
      familiar: {
        label:
          'Pannelli e menu familiari, con tante possibilità di personalizzazione.',
      },
      workflow: {
        label:
          'Mi piace riorganizzare flussi di lavoro, pannelli e scorciatoie.',
      },
      castle: { label: 'Entro 48 ore il mio desktop sarà irriconoscibile.' },
    },
  },
  release: {
    prompt: 'Cosa ne pensi delle rolling release?',
    helper:
      'Una rolling release introduce nuove versioni in modo continuo, senza attendere grandi rilasci del sistema operativo. Entrambi i modelli ricevono aggiornamenti.',
    options: {
      fixed: {
        label: 'No, grazie. Preferisco rilasci stabili e ben definiti.',
      },
      either: { label: 'Mi vanno bene entrambi i modelli.' },
      appealing: { label: 'Il modello rolling mi attira.' },
      rolling: { label: 'Assolutamente sì. Che tutto continui a evolversi.' },
    },
  },
  'system-model': {
    prompt: 'Come preferiresti gestire il sistema su cui girano le tue app?',
    helper:
      'I sistemi atomici aggiornano il sistema di base come un’unica unità, spesso con la possibilità di un rollback. App e strumenti sono di solito separati dalla base, tramite Flatpak o container. Modificare la base funziona diversamente rispetto a un sistema tradizionale gestito tramite pacchetti.',
    options: {
      traditional: {
        label:
          'Voglio un sistema tradizionale che posso modificare direttamente.',
      },
      either: { label: 'Non ho preferenze.' },
      protected: {
        label: 'Una base atomica mi attira; posso imparare a usarla.',
      },
      containers: {
        label: 'Voglio un sistema atomico che metta i container al centro.',
      },
    },
  },
  'use-cases': {
    prompt: 'Per cosa userai principalmente questo computer?',
    helper:
      'Alcuni usi orientano la raccomandazione; altri aiutano a preparare l’equipaggiamento. I videogiochi hanno una domanda tutta loro.',
    options: {
      everyday: {
        label: 'Navigazione, lavoro d’ufficio e attività quotidiane.',
      },
      development: { label: 'Programmazione e sviluppo.' },
      gaming: { label: 'Videogiochi.' },
      creative: { label: 'Lavoro creativo e contenuti multimediali.' },
      learning: { label: 'Imparare a usare Linux.' },
      security: { label: 'Sicurezza informatica e pentesting.' },
      homelab: { label: 'Server, container e laboratorio domestico.' },
      'old-hardware': { label: 'Tenere in vita hardware datato.' },
    },
  },
  gaming: {
    prompt: 'Quanto contano i videogiochi per te?',
    options: {
      none: { label: 'Non mi interessano.' },
      occasional: { label: 'Gioco ogni tanto.' },
      important: { label: 'Sono importanti.' },
      main: { label: 'Uno dei motivi principali per cui sono qui.' },
    },
  },
  hardware: {
    prompt: 'Con che tipo di hardware abbiamo a che fare?',
    helper:
      'Pensa alla potenza e alla memoria disponibili, non solo all’età del computer.',
    options: {
      powerful: { label: 'Moderno e potente.' },
      recent: { label: 'Un normale portatile o PC desktop recente.' },
      aging: { label: 'Inizia ad avere i suoi anni, ma si difende ancora.' },
      limited: { label: 'Questo computer si ricorda i modem a 56k.' },
      handheld: { label: 'Un PC da gioco portatile in formato console.' },
    },
  },
  gpu: {
    prompt: 'Che hardware grafico usi, o che tipo di Mac hai?',
    helper:
      'Se hai un Mac, scegli il tipo di Mac. Su un altro computer, scegli l’hardware grafico che usi per le attività più impegnative.',
    options: {
      nvidia: { label: 'NVIDIA' },
      'open-driver': { label: 'Grafica AMD o Intel' },
      'apple-silicon': { label: 'Mac con Apple Silicon' },
      'intel-mac': { label: 'Mac Intel' },
      unknown: { label: 'Non ne ho la minima idea.' },
    },
  },
  'software-freedom': {
    prompt: 'Quanto conta per te il software libero e open source?',
    options: {
      pragmatic: { label: 'Basta che funzioni.' },
      prefer: {
        label: 'Preferisco l’open source quando è una scelta pratica.',
      },
      important: { label: 'Conta parecchio.' },
      strong: {
        label: 'Il più possibile orientato al software libero, grazie.',
      },
    },
  },
  troubleshooting: {
    prompt:
      'Quando qualcosa smette di funzionare, qual è il tuo primo istinto?',
    options: {
      distress: { label: 'Perché il computer mi fa questo?' },
      search: { label: 'Cercare l’errore e seguire le istruzioni.' },
      investigate: { label: 'Aprire il terminale e indagare.' },
      learn: { label: 'Ottimo. Un’occasione per imparare.' },
    },
  },
  identity: {
    prompt: 'Quale frase ti rappresenta di più?',
    options: {
      background: { label: 'Voglio che Linux lavori senza farsi notare.' },
      dependable: { label: 'Voglio qualcosa di moderno e affidabile.' },
      shape: {
        label: 'Voglio un sistema che posso modellare sulle mie esigenze.',
      },
      understand: { label: 'Voglio capire come funziona l’intero sistema.' },
      declarative: {
        label:
          'Voglio una ricetta di configurazione che possa ricostruire tutto il sistema.',
      },
      minimal: {
        label: 'Voglio un sistema piccolo, con solo ciò che mi serve.',
      },
      unix: {
        label: 'Mi piacciono i metodi Unix tradizionali e fare le cose a mano.',
      },
    },
  },
  path: {
    prompt: 'Scegli il tuo percorso',
    helper: 'Il sentiero si divide. Da che parte vai?',
    options: {
      comfortable: {
        label: 'La via comoda',
        description: 'Affidabile, accogliente, facile da usare ogni giorno.',
      },
      modern: {
        label: 'La via moderna',
        description: 'Tecnologie recenti senza complicazioni inutili.',
      },
      artisan: {
        label: 'La via dell’artigiano',
        description: 'Rendi il sistema davvero tuo.',
      },
      explorer: {
        label: 'La via dell’esploratore',
        description: 'Impara, sperimenta e accetta qualche sorpresa.',
      },
      forbidden: {
        label: 'La via proibita',
        description: 'Massimo controllo. Accetto le conseguenze.',
      },
    },
  },
};
