import type { Messages } from '../catalog.ts';

export const explanationsIt = {
  capability: {
    beginnerFriendly: {
      reason: 'La guida per principianti ti offre l’aiuto che hai chiesto.',
      caution:
        'Potresti dover imparare più cose sul campo di quanto preferiresti.',
    },
    lowMaintenance: {
      reason:
        'La manutenzione rientra nel tempo che vuoi dedicare a smanettare.',
      caution:
        'La manutenzione di routine potrebbe richiedere più tempo del previsto.',
    },
    stability: {
      reason:
        'La prevedibilità del software soddisfa il tuo bisogno di una base affidabile.',
      caution: 'Aspettati un software meno prevedibile di quanto hai chiesto.',
    },
    freshness: {
      reason:
        'La disponibilità di versioni recenti del software rispecchia le tue preferenze.',
      caution:
        'La disponibilità di versioni recenti del software è diversa da quella che preferisci.',
    },
    customization: {
      reason:
        'Le possibilità di personalizzazione lasciano spazio alle modifiche che hai in mente per il desktop.',
      caution:
        'La personalizzazione che desideri potrebbe richiedere più lavoro qui.',
    },
    systemControl: {
      reason:
        'Il controllo del sistema ti lascia lo spazio per smanettare che hai chiesto.',
      caution:
        'Offre meno controllo diretto sul sistema di quanto preferiresti.',
    },
    gaming: {
      reason:
        "La preparazione per il gaming rispecchia l'importanza che i videogiochi hanno per te.",
      caution:
        'La configurazione per i videogiochi potrebbe richiedere più preparazione qui. Verifica il supporto dei tuoi giochi e del tuo hardware.',
    },
    developerExperience: {
      reason:
        'Gli strumenti di sviluppo offrono un utile punto di partenza ai tuoi progetti di programmazione.',
      caution:
        'Il tuo flusso di sviluppo potrebbe richiedere una configurazione aggiuntiva.',
    },
    oldHardware: {
      reason:
        'Il consumo di risorse lascia al tuo computer il margine di prestazioni che cerchi.',
      caution:
        'I requisiti di risorse potrebbero lasciare meno margine di quanto desideri.',
    },
    desktopPolish: {
      reason:
        'La rifinitura del desktop risponde alle tue aspettative per un ambiente pronto all’uso.',
      caution:
        'Potresti dover dedicare più tempo del previsto a sistemare e personalizzare il desktop.',
    },
  },
  near: {
    beginnerFriendly:
      'La guida per principianti offre quasi tutto il supporto che hai chiesto.',
    lowMaintenance:
      'La manutenzione di routine supera di poco il tempo che vuoi dedicare a smanettare.',
    stability:
      'La prevedibilità del software si avvicina a quella che hai chiesto.',
    freshness:
      'La disponibilità di versioni recenti del software è vicina a quella che preferisci.',
    customization:
      'Le possibilità di personalizzazione offrono quasi tutto lo spazio che desideri.',
    systemControl:
      'Il controllo del sistema lascia un po’ meno spazio per smanettare di quanto hai chiesto.',
    gaming: 'La predisposizione al gaming è quasi al livello che hai chiesto.',
    developerExperience:
      'Gli strumenti di sviluppo coprono quasi tutta la configurazione iniziale che desideri.',
    oldHardware:
      'I requisiti di risorse lasciano un po’ meno margine di quanto desideri.',
    desktopPolish:
      'La rifinitura del desktop soddisfa quasi tutte le tue aspettative.',
  },
  reasons: {
    'release.match':
      'Il modello di rilascio, a versioni fisse o rolling release, rispecchia le tue preferenze.',
    'atomic.match':
      'Il modello di aggiornamento del sistema di base rispecchia le tue preferenze.',
    'containers.transactional':
      'Un sistema host protetto e transazionale è adatto al tuo interesse per i container.',
    'containers.image-based':
      'Un flusso di lavoro basato su immagini è adatto al tuo interesse per i container.',
    'focus.gaming':
      'L’attenzione al gaming mette il gioco al centro della tua avventura.',
    'creative.documented-integration':
      'Le soluzioni documentate per configurare gli strumenti creativi facilitano i tuoi progetti.',
    'focus.development':
      'L’attenzione allo sviluppo mette la programmazione al centro dell’ambiente di lavoro.',
    'focus.security':
      'L’attenzione agli strumenti di sicurezza è adatta ai test che hai indicato.',
    'specialist.security-testing':
      'La specializzazione risponde alle attività di test di sicurezza che hai indicato.',
    'specialist.handheld-gaming':
      'Un percorso documentato per il gaming su PC portatili in formato console è adatto ai tuoi progetti di gioco.',
    'specialist.minimalist-self-build':
      'L’approccio minimale è adatto ai tuoi progetti di costruzione e personalizzazione del sistema.',
    'specialist.traditional-unix':
      'Lo stile di amministrazione tradizionale è adatto al percorso Unix che hai scelto.',
    'specialist.container-development':
      'Gli strumenti di sviluppo basati su container sono adatti al flusso di lavoro che hai scelto.',
    'nvidia.integrated':
      'La configurazione semplificata per NVIDIA è adatta alla tua scelta grafica.',
    'software-policy.free-software-first':
      'La priorità data al software libero rispecchia le tue preferenze.',
    'focus.minimalism':
      'L’approccio minimale mantiene essenziale l’equipaggiamento, come hai chiesto.',
    'workflow.declarative':
      'Il modello dichiarativo è adatto al tuo obiettivo di costruire il sistema a partire dalla configurazione.',
    'desktop-layout.match':
      'Pannelli e menu rispecchiano la tua preferenza per un layout familiare.',
    'handheld.documented-support':
      'Un percorso documentato per il gaming su PC portatili in formato console è adatto al dispositivo che hai scelto.',
  },
  cautions: {
    'focus.gaming-mismatch':
      'Il suo orientamento al gaming è meno adatto a chi, come te, prevede di giocare poco.',
    'release.conflict':
      'Il modello di rilascio, a versioni fisse o rolling release, è diverso da quello che preferisci.',
    'atomic.conflict':
      'Il modello di aggiornamento del sistema di base è diverso da quello che preferisci.',
    'containers.other-model':
      'Il flusso di lavoro è meno incentrato su strumenti basati su immagini e sull’uso prioritario dei container.',
    'nvidia.manual':
      'I driver NVIDIA potrebbero richiedere una configurazione manuale.',
    'software-policy.pragmatic':
      'La politica pragmatica sul software può includere componenti proprietari.',
    'handheld.check-device-compatibility':
      'Verifica il modello esatto del PC portatile in formato console, l’immagine di installazione e le funzionalità supportate prima di installare.',
    'handheld.support-unassessed':
      'Il supporto per i PC portatili in formato console non è stato valutato per questa distribuzione.',
    constraint:
      'Questo percorso richiede più esperienza o interesse specialistico di quanto indicano le tue risposte. Valuta l’apprendimento e la manutenzione necessari.',
  },
} satisfies Messages['explanations'];
