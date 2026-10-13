import { message } from '../message.ts';
import type { Platform } from '../../domain/platform.ts';

export const platformCopyIt = {
  title: 'IL PERCORSO PER IL TUO HARDWARE',
  preferencePath: 'LA CORRISPONDENZA CON LE TUE PREFERENZE',
  preferenceTop:
    'Corrisponde alle tue preferenze; il supporto per l’installazione va verificato',
  asahiName: message(
    'Fedora Asahi Remix {edition}',
    [
      {
        name: 'edition',
        kind: 'choice',
        values: { kde: 'KDE', gnome: 'GNOME' },
      },
    ],
    'it',
  ),
  asahiSummary:
    'Il percorso Fedora per Apple Silicon, con il supporto hardware del progetto Asahi.',
  baseMatch: message(
    'La corrispondenza si basa su {name}. Il supporto hardware e le app disponibili possono essere diversi su questo Mac.',
    [{ name: 'name', kind: 'text' }],
    'it',
  ),
  originalWinner: message(
    'Le tue risposte portano a {name}. Il tuo hardware restringe i percorsi di installazione indicati qui sotto.',
    [{ name: 'name', kind: 'text' }],
    'it',
  ),
  originalFit: message(
    'Le tue risposte portano a {name}. Qui sotto vengono prima i percorsi di installazione T2 mantenuti.',
    [{ name: 'name', kind: 'text' }],
    'it',
  ),
  sameFit:
    'La distribuzione che corrisponde alle tue preferenze ha un percorso di installazione documentato per questa piattaforma.',
  asahiInstall:
    'Usa l’installer di Fedora Asahi Remix adatto al modello esatto del tuo Mac.',
  asahiIntro:
    'Installa tramite Fedora Asahi Remix, anziché con un normale installer per PC. KDE è il desktop principale; è disponibile anche GNOME.',
  alternatives: 'Altri percorsi praticabili',
  preferenceAlternatives: 'Altre distribuzioni adatte alle tue preferenze',
  preferenceOnly:
    'Queste distribuzioni sono adatte alle tue preferenze; il supporto per l’installazione nativa su questo Mac resta da verificare.',
  edition: 'Un altro desktop Fedora Asahi',
  install: 'Esplora il percorso di installazione',
  supportGuide: 'Verifica il supporto del tuo modello',
  identifyChip: 'Identifica il tuo chip Apple',
  identifyT2: 'Verifica se il tuo Mac ha il chip T2',
  effort: {
    guided:
      "Usa l'installer T2 o il modulo dedicato alla piattaforma, entrambi mantenuti dal progetto.",
    manual:
      'È disponibile un percorso T2 documentato che richiede più configurazione manuale.',
    standard:
      'Usa l’immagine x86_64 appropriata; verifica prima il tuo hardware esatto.',
    unverified:
      'Il supporto per l’installazione nativa su questa piattaforma resta da verificare.',
  },
  standardInstallation: 'Percorso di installazione standard',
  notes: {
    'x86-standard':
      'Segui il percorso di installazione standard per PC. Verifica il tuo hardware esatto e i requisiti dei driver prima di installare.',
    'intel-mac':
      'Mac Intel senza T2: si applica la normale classifica delle distribuzioni per x86_64, basata sulle tue preferenze. Wi-Fi, grafica, trackpad e comportamento all’avvio variano in base al modello.',
    'intel-mac-t2':
      'I Mac con T2 richiedono un supporto specifico per i dispositivi interni. I percorsi di installazione mantenuti vengono prima; restano disponibili i percorsi manuali documentati. Verifica le limitazioni del tuo modello prima di installare.',
    'intel-mac-unknown-t2':
      'Verifica se il tuo Mac Intel ha il chip T2 prima di scegliere un installer. Questi percorsi rispecchiano le tue preferenze; il supporto per l’installazione non è ancora confermato.',
    'apple-silicon-m1-m2':
      'Per i Mac M1/M2 esiste un percorso documentato con Fedora Asahi Remix. Verifica il modello esatto e le funzionalità di cui hai bisogno prima di installare.',
    'apple-silicon-m3':
      'Il supporto per M3 è ancora sperimentale, con funzionalità importanti in fase di sviluppo. Questa avventura non può confermare un percorso di installazione nativa adatto all’uso quotidiano. Consulta prima l’attuale tabella di supporto di Asahi.',
    'apple-silicon-m4-plus':
      'Questa avventura non dispone di un percorso verificato per l’installazione nativa sui Mac con M4 o successivi. L’attuale tabella di supporto per M4 non indica alcun installer; per i chip più recenti serve una verifica del supporto specifica. La corrispondenza con le tue preferenze resta utile per esplorare le alternative.',
    'apple-silicon-unknown':
      'Identifica prima il tuo chip Apple; il supporto varia molto tra le generazioni. La corrispondenza con le preferenze non dimostra la compatibilità.',
    unknown:
      'La tua piattaforma non è confermata. Questi risultati indicano la corrispondenza con le preferenze; verifica l’architettura della CPU, la grafica e il supporto per l’installazione prima di scegliere un’immagine.',
  } satisfies Record<Platform, string>,
};
