import { message } from '../message.ts';

export const discoveryIt = {
  directoryLink: 'Esplora le distribuzioni',
  directoryTitle: 'Distribuzioni Linux | DistroQuest',
  directoryHeading: 'Conosci le distribuzioni',
  directoryDescription:
    'Esplora 29 distribuzioni Linux: punti di forza, limiti, utenti a cui si rivolgono ed edizioni valutate. Trova il tuo punto di partenza con DistroQuest.',
  directoryIntroduction:
    'Esplora le distribuzioni del quiz. Queste sintesi descrivono le edizioni valutate; non sono consigli personalizzati.',
  suitable: 'A chi può essere adatta',
  strengths: 'Punti di forza',
  cautions: 'Limiti',
  considerations: 'Edizione e aspetti tecnici',
  official: 'Sito ufficiale',
  back: 'Tutte le distribuzioni',
  quizHeading: 'Trova il tuo punto di partenza',
  quizIntroduction:
    'Rispondi a qualche domanda sulle tue abitudini, il tuo hardware e la tua voglia di sperimentare.',
  quizLink: 'Inizia l’avventura',
  profileTitle: message(
    '{name}: punti di forza e limiti | DistroQuest',
    [{ name: 'name', kind: 'text' }],
    'it',
  ),
  profileLink: message(
    'Informazioni su {name}',
    [{ name: 'name', kind: 'text' }],
    'it',
  ),
  support: 'Sostieni il progetto',
  shareAlt: 'Lo scudo e il terminale di DistroQuest su uno sfondo verde scuro.',
  compatibilityNote:
    'La compatibilità hardware dipende dal dispositivo e dall’edizione. Il quiz valuta i percorsi di installazione separatamente dalla corrispondenza con le tue preferenze.',
};
