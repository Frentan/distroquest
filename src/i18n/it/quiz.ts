import { message } from '../message.ts';
import type { Capability } from '../../domain/distro.ts';
import type { UseCase } from '../../domain/preferences.ts';

export const quizCopyIt = {
  title: 'Trova il tuo percorso | DistroQuest',
  description:
    'Un breve quiz su Linux che rispetta la tua privacy. Trova una distribuzione adatta alle tue abitudini, al tuo hardware e alla tua voglia di smanettare.',
  eyebrow: 'LA TUA AVVENTURA',
  progress: message(
    'Domanda {current} di {total}',
    [
      { name: 'current', kind: 'number' },
      { name: 'total', kind: 'number' },
    ],
    'it',
  ),
  progressLabel: 'Risposte confermate',
  submitted: message(
    '{count} di {total} risposte confermate',
    [
      { name: 'count', kind: 'number' },
      { name: 'total', kind: 'number' },
    ],
    'it',
  ),
  macStep: 'Include una domanda sull’hardware del Mac.',
  selectionCount: message(
    '{count} di {max} risposte selezionate',
    [
      { name: 'count', kind: 'number' },
      { name: 'max', kind: 'number' },
    ],
    'it',
  ),
  selectionLimit:
    'Limite raggiunto. Deseleziona una risposta per sceglierne un’altra.',
  relevantStats: 'Capacità rilevanti per le tue priorità',
  statsNote:
    'Valutazioni editoriali delle capacità su 5 punti, non punteggi di compatibilità hardware o di affinità con le tue preferenze.',
  comparedWith: message(
    'Confronto con {name}',
    [{ name: 'name', kind: 'text' }],
    'it',
  ),
  capabilityComparison: message(
    '{label}: {value}/5 rispetto a {primary}/5 di {name}',
    [
      { name: 'label', kind: 'text' },
      { name: 'value', kind: 'number' },
      { name: 'primary', kind: 'number' },
      { name: 'name', kind: 'text' },
    ],
    'it',
  ),
  workflow: {
    'conventional-desktop': 'Desktop tradizionale',
    'atomic-desktop': 'Desktop atomico',
    'gaming-appliance': 'Sistema dedicato al gaming',
    'declarative-system': 'Sistema dichiarativo',
  },
  release: { fixed: 'Rilasci a versioni fisse', rolling: 'Rolling release' },
  singleHint: 'Scegli una risposta.',
  finalHint: 'Scegli una risposta per scoprire il tuo percorso.',
  multipleHint: message(
    'Scegli da 1 a {max} risposte.',
    [{ name: 'max', kind: 'number' }],
    'it',
  ),
  back: 'Indietro',
  next: 'Continua',
  retry: 'Riprova',
  finish: 'Scopri il mio percorso',
  match: message(
    '{percentage}% di corrispondenza con le preferenze',
    [{ name: 'percentage', kind: 'number', digits: 1 }],
    'it',
  ),
  matchNote: 'Verifica il supporto hardware separatamente.',
  fitContext:
    'Le percentuali di affinità sono stime del modello, non probabilità. Differenze molto piccole indicano opzioni quasi altrettanto adatte alle tue preferenze.',
  restart: 'Ricomincia l’avventura',
  restartPrompt: 'Vuoi ricominciare? Le risposte attuali verranno cancellate.',
  confirmRestart: 'Ricomincia',
  cancel: 'Mantieni le mie risposte',
  retake: 'Ripeti l’avventura',
  revise: 'Modifica le risposte',
  noScript:
    'Questa avventura richiede JavaScript per conservare le risposte e calcolare il risultato nel browser. Attivalo e ricarica la pagina per iniziare.',
  error:
    'Non è stato possibile rivelare il tuo percorso. Le risposte sono ancora qui. Riprova oppure torna indietro per rivederle.',
  path: 'IL TUO PERCORSO',
  stats: 'Profilo completo delle capacità',
  installationGuidance: 'Indicazioni per l’installazione',
  variantStatsNote:
    'Capacità della base Fedora su 5; Asahi non è valutato separatamente.',
  statScore: message('{value}/5', [{ name: 'value', kind: 'number' }], 'it'),
  statValue: message('{value} su 5', [{ name: 'value', kind: 'number' }], 'it'),
  preparation: 'Preparati alle missioni secondarie',
  why: 'Perché fa per te',
  tradeoffs: 'Prima di partire',
  edition: 'Un altro percorso ufficiale in questa famiglia',
  alternatives: 'Altri percorsi da esplorare',
  sameFamily:
    'Stessa famiglia della raccomandazione principale, con un percorso diverso.',
  alternativeDetails: 'Limiti',
  resultFallback:
    'Un percorso da esplorare in base alle tue risposte. Valuta i suoi punti di forza e i compromessi prima di partire.',
};

export const capabilityLabelsIt: Record<Capability, string> = {
  beginnerFriendly: 'Guida per principianti',
  lowMaintenance: 'Poca manutenzione',
  stability: 'Prevedibilità',
  freshness: 'Versioni recenti del software',
  customization: 'Personalizzazione',
  systemControl: 'Controllo del sistema',
  gaming: 'Predisposizione al gaming',
  developerExperience: 'Strumenti di sviluppo',
  oldHardware: 'Hardware datato',
  desktopPolish: 'Rifinitura del desktop',
};

export const preparationCopyIt: Record<UseCase, string> = {
  'general-desktop':
    'Equipaggiamento quotidiano: verifica browser, documenti d’ufficio, chiamate e stampante. Usa una sessione live se il percorso di installazione lo consente.',
  creative:
    'Equipaggiamento creativo: verifica le app indispensabili, i plugin, i formati multimediali e le periferiche prima di trasferire i tuoi progetti.',
  gaming:
    'Equipaggiamento da gioco: verifica il supporto dei tuoi giochi, i requisiti anti-cheat e i controller prima di installare.',
  development:
    'Equipaggiamento da sviluppatore: prepara i runtime dei tuoi linguaggi, l’editor e le dipendenze dei progetti.',
  homelab:
    'Equipaggiamento per il laboratorio domestico: metti alla prova i tuoi container, i servizi e la procedura di backup.',
  'technical-learning':
    'Equipaggiamento per imparare: prepara una chiavetta USB live o una macchina virtuale per i tuoi esperimenti.',
  'security-testing':
    'Equipaggiamento per la sicurezza: usa i tuoi strumenti in un laboratorio di esercitazione isolato e autorizzato.',
  'old-hardware':
    'Equipaggiamento di rinascita: verifica il supporto hardware e i requisiti di risorse; prova il desktop in modalità live sul vecchio computer, se questa opzione è disponibile.',
};
