import type { DistroDictionary } from '../../domain/distro.ts';

export const distroContentIt = {
  'linux-mint': {
    name: 'Linux Mint',
    archetype: {
      name: 'Il Pragmatico',
      description:
        'Il Pragmatico sceglie un layout familiare e impostazioni sensate, accorciando la strada tra l’installazione e il lavoro concreto. Linux Mint premia chi preferisce usare il computer anziché fare della sua manutenzione un hobby.',
    },
    summary:
      'Un desktop accogliente basato su Ubuntu, con aggiornamenti conservativi e pratici strumenti grafici.',
    strengths: [
      'Layout familiare',
      'Strumenti accessibili per aggiornamenti e driver',
      'Base conservativa Ubuntu LTS',
      'Ampia disponibilità di applicazioni per l’uso quotidiano',
    ],
    cautions: [
      'I pacchetti di base possono essere meno recenti delle versioni upstream.',
      'Cinnamon richiede più risorse rispetto agli ambienti desktop leggeri.',
      'L’hardware da gioco più recente potrebbe richiedere driver e componenti grafici più aggiornati.',
    ],
    idealFor: [
      'Chi usa Linux per la prima volta',
      'Uso quotidiano del computer a casa',
      'Chi preferisce modalità di lavoro familiari',
    ],
    assessmentBasis:
      'Edizione Cinnamon basata su Ubuntu; MATE e Xfce possono ridurre il consumo di risorse dell’ambiente desktop.',
  },
  ubuntu: {
    name: 'Ubuntu',
    archetype: {
      name: 'L’Emissario',
      description:
        'L’Emissario si muove a suo agio tra Linux e il resto del mondo del software. Ubuntu è ideale per chi apprezza strumenti e procedure ben documentati, un ampio supporto da parte dei produttori hardware e software e un percorso chiaro per avvicinarsi a Linux.',
    },
    summary:
      'Un desktop Linux ampiamente supportato, con un vasto ecosistema software e un’opzione LTS.',
    strengths: [
      'Documentazione estesa e aiuto della comunità',
      'Ampio supporto da parte dei produttori di software commerciale',
      'Opzione con supporto a lungo termine',
      'Solido ecosistema di sviluppo',
    ],
    cautions: [
      'GNOME può risultare poco familiare a chi proviene da Windows.',
      'Il formato Snap potrebbe non adattarsi a ogni flusso di lavoro.',
      'I pacchetti di base LTS privilegiano la continuità rispetto alle versioni più recenti.',
    ],
    idealFor: [
      'Chi si avvicina a Linux',
      'Sviluppatori che usano strumenti supportati dai fornitori',
      'Chi cerca un desktop affermato',
    ],
    assessmentBasis:
      'Ubuntu Desktop LTS con GNOME; i rilasci intermedi offrono un diverso equilibrio tra software recente e supporto.',
  },
  'fedora-workstation': {
    name: 'Fedora Workstation',
    archetype: {
      name: 'L’Avanguardia',
      description:
        'L’Avanguardia abbraccia presto le nuove idee di Linux, mantenendo una base gestita con rigore. Fedora Workstation si adatta a sviluppatori e utenti desktop che apprezzano tecnologie recenti e un ambiente GNOME orientato alla concentrazione.',
    },
    summary:
      'Una workstation GNOME moderna che unisce tecnologie Linux recenti a un ciclo di rilascio regolare.',
    strengths: [
      'Kernel e strumenti di sviluppo recenti',
      'Ottimo supporto ai flussi di lavoro con container',
      'Impostazioni GNOME predefinite coerenti',
      'Collaborazione consolidata con i progetti upstream',
    ],
    cautions: [
      'I frequenti passaggi a nuove versioni della distribuzione vanno pianificati.',
      'Alcuni codec e driver proprietari richiedono una configurazione aggiuntiva.',
      'Le estensioni GNOME possono complicare il passaggio a nuove versioni.',
    ],
    idealFor: [
      'Sviluppatori software',
      'Chi vuole un desktop moderno per uso generale',
      'Chi è a proprio agio con passaggi regolari a nuove versioni',
    ],
    assessmentBasis: 'Installazione standard di Fedora Workstation con GNOME.',
  },
  'fedora-kde': {
    name: 'Fedora KDE',
    archetype: {
      name: 'Lo Smanettone',
      description:
        'Lo Smanettone ama personalizzare pannelli, scorciatoie e modalità di lavoro partendo da una base moderna. Fedora KDE incoraggia questa curiosità nell’uso quotidiano, senza trasformare la personalizzazione in un lavoro a tempo pieno.',
    },
    summary:
      'Un desktop KDE Plasma aggiornato sulla versatile base workstation di Fedora.',
    strengths: [
      'Impostazioni flessibili dell’ambiente desktop Plasma',
      'Kernel, driver e componenti grafici recenti',
      'Eccellente ecosistema per sviluppo e container',
      'Ampia versatilità come workstation per uso generale',
    ],
    cautions: [
      'I frequenti passaggi a nuove versioni della distribuzione vanno pianificati.',
      'Alcuni codec e driver proprietari richiedono una configurazione aggiuntiva.',
      'La quantità di impostazioni del desktop può disorientare chi è alle prime armi.',
    ],
    idealFor: [
      'Chi vuole un desktop quotidiano personalizzabile',
      'Sviluppatori software',
      'Chi cerca software moderno con un’amministrazione tradizionale',
    ],
    assessmentBasis:
      'Fedora KDE Plasma Desktop; grazie alle impostazioni integrate, ottiene un punteggio di personalizzazione superiore a GNOME.',
  },
  'fedora-silverblue': {
    name: 'Fedora Silverblue',
    archetype: {
      name: 'L’Artefice',
      description:
        'L’Artefice costruisce in libertà all’interno di un laboratorio protetto con cura. Fedora Silverblue si adatta a chi vuole le moderne tecnologie Fedora e strumenti basati su container, mantenendo il sistema sottostante prevedibile e facile da ripristinare.',
    },
    summary:
      'Un desktop Fedora Atomic ufficiale che unisce GNOME, aggiornamenti basati su immagini, rollback, applicazioni Flatpak e sviluppo orientato ai container.',
    strengths: [
      'Aggiornamenti atomici del sistema e rollback',
      'Solidi flussi di sviluppo con Toolbx e container',
      'Base software Fedora moderna',
      'Netta separazione tra sistema di base e applicazioni',
    ],
    cautions: [
      'La gestione dei pacchetti del sistema host è diversa da quella di Fedora tradizionale; Flatpak e Toolbx richiedono abitudini diverse.',
      'Codec proprietari e driver NVIDIA richiedono una configurazione aggiuntiva; il supporto dei driver potrebbe arrivare in ritardo rispetto ai nuovi kernel.',
      'La personalizzazione di GNOME è meno estesa rispetto a KDE Plasma.',
      'Anche qui i regolari passaggi a nuove versioni di Fedora vanno pianificati.',
    ],
    idealFor: [
      'Sviluppatori che usano container',
      'Utenti Fedora interessati ai desktop atomici',
      'Chi dà priorità al rollback e a un sistema host protetto',
    ],
    assessmentBasis:
      'GNOME Atomic Desktop ufficiale di Fedora, con OSTree/rpm-ostree, Flatpak e Toolbx e la normale cadenza dei rilasci Fedora. Fedora Kinoite è la controparte ufficiale con KDE Plasma, non un profilo valutato separatamente.',
    editionNote:
      'Preferisci KDE Plasma? Fedora Kinoite offre il percorso Atomic Desktop ufficiale equivalente.',
  },
  debian: {
    name: 'Debian',
    archetype: {
      name: 'Il Custode',
      description:
        'Il Custode dà al software maturo una vita lunga e utile. Debian si adatta a chi apprezza cambiamenti prevedibili, la cura della comunità e un sistema da mantenere affidabile nel tempo.',
    },
    summary:
      'Una distribuzione mantenuta dalla comunità, il cui ramo stable privilegia la continuità e offre un vasto archivio di pacchetti.',
    strengths: [
      'Base conservativa del ramo stable',
      'Vasto archivio di pacchetti',
      'Supporto per numerose architetture',
      'Sviluppo governato dalla comunità',
    ],
    cautions: [
      'Pacchetti di base, driver e componenti grafici meno recenti.',
      'La configurazione del desktop può richiedere più scelte rispetto alle derivate rivolte ai principianti.',
      'L’hardware nuovo potrebbe richiedere backport o attenzione al firmware.',
    ],
    idealFor: [
      'Chi dà priorità a cambiamenti prevedibili',
      'Workstation da usare a lungo',
      'Hardware modesto con un ambiente desktop leggero',
    ],
    assessmentBasis:
      'Debian stable con un desktop Xfce leggero; testing e unstable non rientrano in questo profilo.',
  },
  'pop-os': {
    name: 'Pop!_OS',
    archetype: {
      name: 'Il Pilota',
      description:
        'Il Pilota cerca una workstation che lo aiuti a mantenere la rotta anche nelle attività più impegnative. Pop!_OS unisce la visione di System76 a una gestione delle finestre pensata per la produttività di sviluppatori, creativi e utenti che apprezzano strumenti progettati con uno scopo preciso.',
    },
    summary:
      'Una workstation basata su Ubuntu, progettata attorno al desktop COSMIC di System76 e a flussi di lavoro orientati alla produttività.',
    strengths: [
      'Funzioni di affiancamento delle finestre e spazi di lavoro per la produttività',
      'Ecosistema software Ubuntu',
      'Integrazione hardware sui computer System76',
      'Configurazione semplificata per giochi e grafica',
    ],
    cautions: [
      'La maturità di COSMIC e l’integrazione delle app meritano una prova diretta.',
      'Le istruzioni per Ubuntu possono differire nei dettagli del desktop e del sistema.',
      'Non è pensato per computer con pochissime risorse.',
    ],
    idealFor: [
      'Sviluppatori e creativi',
      'Chi apprezza i flussi di lavoro con finestre affiancate',
      'Proprietari di hardware System76',
    ],
    assessmentBasis:
      'Attuale impostazione basata sul desktop COSMIC; le stime sulla rifinitura e sulla manutenzione vanno riviste con il maturare del desktop.',
  },
  'zorin-os': {
    name: 'Zorin OS',
    archetype: {
      name: 'L’Iniziato',
      description:
        'L’Iniziato muove i primi passi in Linux in un ambiente accogliente. Il layout familiare e la presentazione curata di Zorin lasciano spazio per imparare, mantenendo accessibili le attività quotidiane.',
    },
    summary:
      'Un desktop curato basato su Ubuntu, progettato per facilitare il passaggio da Windows o macOS.',
    strengths: [
      'Layout familiare',
      'Configurazione grafica accessibile',
      'Ecosistema di applicazioni Ubuntu',
      'Aspetto predefinito curato',
    ],
    cautions: [
      'Il software di base può essere meno recente delle versioni upstream.',
      'Alcuni layout del desktop e funzionalità aggiuntive sono riservate all’edizione a pagamento.',
      'Il desktop predefinito richiede più risorse delle alternative minimali.',
    ],
    idealFor: [
      'Chi arriva da Windows o macOS',
      'Chi dà valore alla presentazione',
      'Uso quotidiano del computer a casa e in ufficio',
    ],
    assessmentBasis:
      'Zorin OS Core; le disposizioni del desktop dell’edizione Pro a pagamento non aumentano i punteggi delle capacità.',
  },
  'elementary-os': {
    name: 'elementary OS',
    archetype: {
      name: 'L’Esteta',
      description:
        'L’Esteta apprezza l’armonia visiva e la sobrietà delle scelte deliberate. elementary OS offre un ambiente Pantheon curato nei dettagli, per chi preferisce un’interfaccia coerente a un’infinità di opzioni di personalizzazione.',
    },
    summary:
      'Un desktop basato su Ubuntu, incentrato su Pantheon, un design coerente e una selezione curata di applicazioni.',
    strengths: [
      'Design coerente dell’interfaccia',
      'Applicazioni desktop selezionate con cura',
      'Semplicità nelle attività quotidiane',
      'Base Ubuntu',
    ],
    cautions: [
      'Personalizzazione integrata del desktop limitata.',
      'Selezione più limitata di applicazioni ben integrate.',
      'Giochi e strumenti specialistici richiedono più configurazione.',
    ],
    idealFor: [
      'Utenti desktop attenti al design',
      'Chi preferisce un’interfaccia sobria',
      'Chi apprezza impostazioni predefinite curate',
    ],
    assessmentBasis: 'Desktop Pantheon predefinito.',
  },
  'opensuse-aeon': {
    name: 'openSUSE Aeon',
    archetype: {
      name: 'Il Cronomante',
      description:
        'Il Cronomante lascia avanzare il sistema, tenendo il passato a portata di mano. Aeon si adatta a chi vuole software recente, aggiornamenti transazionali automatici e un desktop che richieda pochissimi interventi di routine.',
    },
    summary:
      'Un desktop GNOME transazionale di openSUSE, basato su aggiornamenti automatici, snapshot, rollback e un sistema host protetto per scelta.',
    strengths: [
      'Aggiornamenti transazionali del sistema e ripristino tramite snapshot',
      'Base software aggiornata continuamente',
      'Poca manutenzione di routine grazie agli aggiornamenti automatici',
      'Desktop GNOME essenziale con Flatpak e Distrobox',
    ],
    cautions: [
      'Aeon è ancora una release candidate; verifica i requisiti hardware e di ripristino prima di farci affidamento.',
      'Le modifiche tradizionali al sistema host non sono supportate; usa Flatpak o Distrobox dove possibile.',
      'L’integrazione dei driver proprietari NVIDIA non è supportata come soluzione pronta all’uso; il supporto grafico va verificato caso per caso.',
      'L’installer richiede UEFI, sostituisce il contenuto del disco selezionato e ha requisiti specifici per la cifratura.',
    ],
    idealFor: [
      'Chi vuole un desktop rolling con pochi interventi manuali',
      'Chi dà priorità al rollback e al ripristino',
      'Chi è a proprio agio con un sistema host protetto e modalità d’uso ben definite',
    ],
    assessmentBasis:
      'Attuale desktop GNOME di Aeon in fase release candidate, nell’ecosistema openSUSE: pacchetti Tumbleweed, snapshot transazionali Btrfs, rollback con systemd-boot, Flatpak e Distrobox basato su Podman. I frequenti aggiornamenti rolling restano automatici; le modifiche al sistema host non sono supportate.',
  },
  'opensuse-tumbleweed': {
    name: 'openSUSE Tumbleweed',
    archetype: {
      name: 'La Sentinella',
      description:
        'La Sentinella esplora nuovi territori senza rinunciare alle proprie difese. Tumbleweed è pensato per chi vuole aggiornamenti continui, snapshot sottoposti a test e strumenti di ripristino che rendono più gestibile un sistema in continua evoluzione.',
    },
    summary:
      'Una distribuzione rolling release che unisce software recente, test automatici e strumenti di ripristino tramite snapshot.',
    strengths: [
      'Software recente con aggiornamenti continui',
      'Test automatici della distribuzione',
      'Ripristino tramite snapshot Btrfs',
      'Ampie possibilità di configurazione del desktop e del sistema',
    ],
    cautions: [
      'Aggiornamenti frequenti e talvolta voluminosi.',
      'Codec e driver proprietari richiedono attenzione.',
      'Il ripristino tramite snapshot richiede comunque conoscenze e spazio su disco.',
    ],
    idealFor: [
      'Chi vuole un desktop rolling con strumenti di gestione',
      'Sviluppatori che hanno bisogno di strumenti recenti',
      'Smanettoni che apprezzano le possibilità di ripristino',
    ],
    assessmentBasis:
      'Desktop KDE con installazione standard Btrfs/Snapper; il ripristino non equivale agli aggiornamenti atomici basati su immagini.',
  },
  endeavouros: {
    name: 'EndeavourOS',
    archetype: {
      name: 'L’Esploratore',
      description:
        'L’Esploratore entra nel mondo Arch da un punto di partenza più accessibile. EndeavourOS offre una comunità accogliente e un’installazione grafica, lasciando però all’utente l’amministrazione e la manutenzione del sistema.',
    },
    summary:
      'Una derivata di Arch orientata al terminale, con un installer guidato e una configurazione desktop relativamente essenziale.',
    strengths: [
      'Ingresso guidato nell’ecosistema Arch',
      'Pacchetti recenti',
      'Comunità accogliente per chi impara',
      'Installazione essenziale e adattabile',
    ],
    cautions: [
      'Gli aggiornamenti continui possono richiedere interventi manuali.',
      'È previsto l’uso del terminale per l’amministrazione.',
      'I pacchetti AUR richiedono verifiche e manutenzione autonome.',
    ],
    idealFor: [
      'Utenti Linux che vogliono avvicinarsi ad Arch',
      'Chi impara mettendo mano al sistema',
      'Chi è a proprio agio nel farsi carico della manutenzione del sistema',
    ],
    assessmentBasis:
      'Installazione KDE predefinita; scegliere altri ambienti desktop cambia il consumo di risorse.',
  },
  'arch-linux': {
    name: 'Arch Linux',
    archetype: {
      name: 'L’Artigiano',
      description:
        'L’Artigiano assembla il sistema pezzo per pezzo, comprendendo ogni scelta lungo il percorso. Arch premia gli utenti esperti che amano costruire il proprio ambiente e assumersi la responsabilità della sua manutenzione.',
    },
    summary:
      'Una distribuzione rolling release minimale che lascia all’utente la costruzione dell’ambiente desktop e la configurazione del sistema.',
    strengths: [
      'Controllo eccezionale sulla composizione del sistema',
      'Pacchetti e toolchain recenti',
      "Documentazione completa nell'Arch Wiki",
      'Vasto ecosistema di compilazione e pacchettizzazione della comunità',
    ],
    cautions: [
      'L’installazione e la costruzione dell’ambiente desktop richiedono scelte consapevoli.',
      'Gli aggiornamenti possono richiedere interventi manuali.',
      'I pacchetti della comunità non equivalgono ai pacchetti ufficiali verificati.',
    ],
    idealFor: [
      'Utenti Linux esperti',
      'Chi costruisce un ambiente personale',
      'Chi impara mettendo mano al sistema',
    ],
    assessmentBasis:
      'Base minimale con un desktop leggero costruito dall’utente; il punteggio di rifinitura riguarda le impostazioni predefinite fornite, non una configurazione personalizzata completa.',
  },
  cachyos: {
    name: 'CachyOS',
    archetype: {
      name: 'Il Viandante',
      description:
        'Il Viandante ama muoversi con agilità e sfruttare al meglio un equipaggiamento moderno. CachyOS rende più accessibili gli strumenti di ottimizzazione delle prestazioni di Arch, senza richiedere di assemblare il sistema da zero.',
    },
    summary:
      'Un desktop basato su Arch, con pacchetti ottimizzati, una scelta di kernel e strumenti orientati alle prestazioni.',
    strengths: [
      'Driver, componenti grafici e kernel recenti',
      'Pacchetti compilati con ottimizzazioni per le prestazioni',
      'Installazione grafica',
      'Scelta di kernel e scheduler',
    ],
    cautions: [
      'I requisiti della CPU variano tra le diverse build ottimizzate.',
      'Gli aggiornamenti continui del sistema e quelli dei kernel personalizzati richiedono attenzione.',
      'I guadagni di prestazioni dipendono dall’hardware e dal carico di lavoro.',
    ],
    idealFor: [
      'Appassionati di videogiochi con hardware moderno',
      'Chi vuole ottimizzare le prestazioni',
      'Chi è a proprio agio con la manutenzione di Arch',
    ],
    assessmentBasis:
      'Desktop KDE su hardware x86-64 moderno e compatibile; le ottimizzazioni non garantiscono miglioramenti di prestazioni in ogni situazione.',
  },
  nobara: {
    name: 'Nobara',
    archetype: {
      name: 'Il Campione',
      description:
        'Il Campione arriva equipaggiato per affrontare giochi impegnativi e progetti creativi. Nobara aggiunge a una workstation derivata da Fedora strumenti e configurazioni pensati per il gaming e la multimedialità, riducendo i preparativi prima di entrare in azione.',
    },
    summary:
      'Una derivata di Fedora con strumenti che semplificano la configurazione per giochi, grafica e creazione di contenuti.',
    strengths: [
      'Configurazione semplificata di dipendenze e driver per i giochi',
      'Strumenti multimediali e di acquisizione',
      'Base recente derivata da Fedora',
      'Strumenti grafici di configurazione e aggiornamento',
    ],
    cautions: [
      'Le modifiche specifiche possono rendere diverse le istruzioni rispetto a Fedora.',
      'Il supporto viene da un progetto amatoriale più piccolo.',
      'I passaggi a nuove versioni principali richiedono attenzione alle istruzioni del progetto.',
    ],
    idealFor: [
      'Chi gioca su PC desktop',
      'Streamer e creatori di contenuti',
      'Chi cerca una configurazione più semplice per i videogiochi',
    ],
    assessmentBasis:
      'Desktop KDE di Nobara Official; segui gli strumenti di aggiornamento e le istruzioni di Nobara.',
  },
  bazzite: {
    name: 'Bazzite',
    archetype: {
      name: 'Il Giocatore',
      description:
        'Il Giocatore vede il computer sia come piattaforma da gioco sia come desktop. Bazzite combina strumenti già predisposti per il gaming con un sistema basato su immagini, per chi cerca sessioni affidabili e vuole tornare a giocare senza perdere tempo in configurazioni.',
    },
    summary:
      'Un desktop da gioco basato su Fedora Atomic, con aggiornamenti tramite immagini e varianti specifiche per l’hardware.',
    strengths: [
      'Ambiente da gioco già predisposto',
      'Aggiornamenti atomici tramite immagini e rollback',
      'Opzioni per desktop e PC portatili in formato console supportati',
      'Applicazioni separate dal sistema di base',
    ],
    cautions: [
      'Le modifiche al sistema host funzionano diversamente rispetto a Linux tradizionale.',
      'Il supporto della modalità gioco dipende dall’hardware e dall’immagine.',
      'I flussi di lavoro con Flatpak e container richiedono un adattamento.',
    ],
    idealFor: [
      'Chi gioca su PC desktop',
      'Proprietari di PC portatili in formato console supportati',
      'Chi preferisce una base gestita per i videogiochi',
    ],
    assessmentBasis:
      'Immagine desktop KDE su hardware supportato; la compatibilità con PC portatili in formato console e modalità gioco va verificata separatamente.',
  },
  bluefin: {
    name: 'Bluefin',
    archetype: {
      name: 'Il Navigatore',
      description:
        'Il Navigatore mantiene la rotta con una base gestita e strumenti ben separati. Bluefin è ideale per chi apprezza gli aggiornamenti automatici tramite immagini e un approccio incentrato sulle applicazioni, in particolare per gli sviluppatori che hanno già familiarità con i container.',
    },
    summary:
      'Una workstation basata su Fedora e gestita tramite immagini, con impostazioni GNOME curate e flussi di sviluppo orientati ai container.',
    strengths: [
      'Aggiornamenti automatici basati su immagini',
      'Solida modalità sviluppatore incentrata sui container',
      'Esperienza GNOME curata',
      'Applicazioni desktop e da riga di comando separate',
    ],
    cautions: [
      'L’installazione di pacchetti sul sistema host segue un modello diverso.',
      'Homebrew, Flatpak e container richiedono nuove abitudini.',
      'La personalizzazione di GNOME resta più limitata rispetto a Plasma.',
    ],
    idealFor: [
      'Sviluppatori che lavorano con i container',
      'Chi cerca poca manutenzione di routine',
      'Chi apprezza una workstation gestita',
    ],
    assessmentBasis:
      'Immagine GNOME standard con modalità sviluppatore disponibile; il canale di rilascio influisce sulla disponibilità di software recente.',
  },
  nixos: {
    name: 'NixOS',
    archetype: {
      name: 'L’Architetto',
      description:
        'L’Architetto definisce il sistema attraverso la configurazione, così da poterlo ricostruire e comprenderne il funzionamento. NixOS premia chi è disposto a imparare un modello diverso, in cambio di ambienti riproducibili e modifiche al sistema gestite in modo consapevole.',
    },
    summary:
      'Una distribuzione configurata in modo dichiarativo, basata su pacchetti Nix, generazioni del sistema e riproducibilità.',
    strengths: [
      'Configurazione dichiarativa del sistema',
      'Ambienti di sviluppo riproducibili',
      'Generazioni del sistema e rollback',
      'Vasto ecosistema di pacchetti',
    ],
    cautions: [
      'Linguaggio di configurazione particolare che richiede tempo per essere appreso.',
      'Il software che si aspetta un’organizzazione tradizionale del filesystem potrebbe non funzionare o richiedere configurazione aggiuntiva.',
      'La riproducibilità richiede di fissare le versioni con rigore.',
    ],
    idealFor: [
      'Utenti tecnici interessati ai sistemi dichiarativi',
      'Sviluppatori che gestiscono ambienti ricreabili',
      'Chi mantiene la configurazione come codice',
    ],
    assessmentBasis:
      'Canale stable di NixOS con un desktop KDE configurato; unstable comporta un diverso compromesso sulla disponibilità di software recente.',
  },
  gentoo: {
    name: 'Gentoo',
    archetype: {
      name: 'L’Alchimista',
      description:
        'L’Alchimista trasforma ingredienti scelti in un sistema calibrato con cura. Gentoo si adatta agli appassionati pazienti che amano scegliere le opzioni di compilazione e capire come il software si combina, accettando il lavoro che questa libertà comporta.',
    },
    summary:
      'Una distribuzione altamente configurabile, incentrata su Portage, sulle scelte di compilazione e su una composizione del sistema guidata dall’utente.',
    strengths: [
      'Scelta dettagliata delle funzionalità dei pacchetti',
      'Controllo profondo sulla composizione del sistema',
      'Gestione flessibile di pacchetti sorgente e binari',
      'Documentazione dettagliata del sistema',
    ],
    cautions: [
      'Configurazione e aggiornamenti richiedono molta attenzione.',
      'La compilazione dai sorgenti può richiedere tempo e mettere al lavoro l’hardware.',
      'L’integrazione del desktop è responsabilità dell’utente.',
    ],
    idealFor: [
      'Appassionati esperti di sistemi',
      'Chi ha bisogno di opzioni di compilazione specifiche',
      'Chi impara con pazienza e cerca un controllo profondo',
    ],
    assessmentBasis:
      'Desktop costruito dall’utente con keyword stabili per i pacchetti; i pacchetti binari possono ridurre il lavoro di compilazione.',
  },
  'void-linux': {
    name: 'Void Linux',
    archetype: {
      name: 'L’Errante',
      description:
        'L’Errante segue una strada indipendente, con pochi livelli di astrazione tra l’utente e il sistema. runit e XBPS attirano chi ama mettere mano al sistema, apprezza la semplicità e sa orientarsi al di fuori delle convenzioni delle distribuzioni più diffuse.',
    },
    summary:
      'Una distribuzione rolling release indipendente che usa runit e XBPS, con varianti glibc e musl.',
    strengths: [
      'Design essenziale del sistema',
      'Supervisione semplice dei servizi con runit',
      'Strumenti nativi rapidi per i pacchetti',
      'Opzioni alternative per la libc',
    ],
    cautions: [
      'Ecosistema più piccolo rispetto alle principali famiglie di distro.',
      'Più lavoro manuale per integrare desktop e driver.',
      'Molte istruzioni diffuse danno per scontato systemd.',
    ],
    idealFor: [
      'Utenti esperti che cercano un desktop essenziale',
      'Chi è interessato a runit',
      'Chi è a proprio agio con un ecosistema indipendente',
    ],
    assessmentBasis:
      'Desktop Xfce con glibc; musl comporta ulteriori compromessi di compatibilità.',
  },
  'kali-linux': {
    name: 'Kali Linux',
    archetype: {
      name: 'Lo Specialista',
      description:
        'Lo Specialista conosce la propria missione e possiede le competenze necessarie per usare i suoi strumenti. Kali è una distribuzione specializzata nel penetration testing e nello studio della sicurezza, con obiettivi più specifici rispetto a un sistema desktop per uso quotidiano.',
    },
    summary:
      'Una distribuzione basata su Debian per i test di sicurezza, destinata a penetration tester e specialisti della sicurezza.',
    strengths: [
      'Ampia raccolta di strumenti per il penetration testing',
      'Documentazione dedicata alla sicurezza',
      'Procedure di analisi della sicurezza studiate per lo scopo',
      'Opzioni per macchine virtuali e uso live',
    ],
    cautions: [
      'Non è adatta come normale raccomandazione desktop per principianti.',
      'Repository estranei possono danneggiare il sistema supportato.',
      'Lo sviluppo generico e i videogiochi non rientrano nel suo ambito principale.',
    ],
    idealFor: [
      'Penetration tester',
      'Studenti di sicurezza con esperienza Linux',
      'Laboratori per analisi di sicurezza autorizzate',
    ],
    assessmentBasis:
      'Installazione standard Xfce con strumenti di sicurezza; valutata come ambiente specialistico, non come desktop per uso generale.',
  },
  'mx-linux': {
    name: 'MX Linux',
    archetype: {
      name: 'Il Sopravvissuto',
      description:
        'Il Sopravvissuto tiene al lavoro i computer ancora utili, anche con risorse modeste. MX unisce una base Debian stabile a pratici strumenti desktop, per chi apprezza l’efficienza e un computer che ha ancora qualcosa da dare.',
    },
    summary:
      'Un desktop basato su Debian stable, con pratici strumenti di amministrazione e requisiti di risorse relativamente modesti.',
    strengths: [
      'Desktop Xfce relativamente leggero',
      'Base Debian conservativa',
      'Pratici strumenti di amministrazione MX',
      'Utili modalità d’uso live e di ripristino',
    ],
    cautions: [
      'I pacchetti di base privilegiano la stabilità rispetto alle versioni più recenti.',
      'L’hardware grafico più recente potrebbe richiedere kernel e componenti grafici differenti.',
      'La presentazione del desktop è meno coerente rispetto alle alternative incentrate sul design.',
    ],
    idealFor: [
      'Chi vuole mantenere produttivo hardware modesto',
      'Chi vuole strumenti grafici di amministrazione',
      'Chi cerca un desktop quotidiano affidabile',
    ],
    assessmentBasis:
      'Edizione Xfce standard; non è una promessa di supporto per ogni CPU o GPU obsoleta.',
  },
  'garuda-linux': {
    name: 'Garuda Linux',
    archetype: {
      name: 'Il Berserker',
      description:
        'Il Berserker ama uno stile audace e non nasconde la propria sete di potenza. Garuda arricchisce l’esperienza Arch con strumenti per il gaming e il ripristino, rivolgendosi a chi apprezza un desktop ricco di funzionalità e con scelte progettuali ben definite.',
    },
    summary:
      'Una derivata di Arch rivolta agli appassionati, con un desktop dall’aspetto audace e strumenti di ripristino tramite snapshot.',
    strengths: [
      'Software Arch recente',
      'Strumenti di configurazione orientati ai videogiochi',
      'Ripristino tramite snapshot integrato',
      'Desktop ampiamente personalizzabile',
    ],
    cautions: [
      'Gli aggiornamenti continui richiedono comunque attenzione.',
      'La ricca configurazione predefinita consuma più risorse.',
      'Il tema dal carattere marcato e gli strumenti aggiuntivi potrebbero non piacere a tutti.',
    ],
    idealFor: [
      'Appassionati di videogiochi',
      'Chi apprezza un desktop dallo stile audace',
      'Smanettoni a proprio agio con gli strumenti di ripristino',
    ],
    assessmentBasis:
      'Installazione KDE orientata ai videogiochi con snapshot Btrfs; le edizioni più leggere sono diverse.',
  },
  solus: {
    name: 'Solus',
    archetype: {
      name: 'Il Curatore',
      description:
        'Il Curatore compone un desktop seguendo una visione coerente. Solus segue una strada indipendente, pensata per chi preferisce integrazione e pacchetti selezionati con cura a un catalogo il più ampio possibile.',
    },
    summary:
      'Una distribuzione desktop rolling release indipendente, con un ecosistema di pacchetti selezionati con cura.',
    strengths: [
      'Integrazione incentrata sul desktop',
      'Selezione curata del software',
      'Aggiornamenti continui delle applicazioni',
      'Progettazione indipendente della distribuzione',
    ],
    cautions: [
      'Catalogo di pacchetti più piccolo rispetto alle principali famiglie di distro.',
      'I pacchetti dei fornitori potrebbero essere destinati ad altre distribuzioni.',
      'I cambiamenti introdotti dagli aggiornamenti continui e la direzione del progetto richiedono verifiche periodiche.',
    ],
    idealFor: [
      'Chi vuole un desktop quotidiano curato',
      'Chi è a proprio agio con un ecosistema più piccolo',
      'Chi apprezza il modo di lavorare di Budgie',
    ],
    assessmentBasis:
      "Edizione Budgie; altre edizioni desktop offrono livelli diversi di rifinitura dell'interfaccia e personalizzazione.",
  },
  pikaos: {
    name: 'PikaOS',
    archetype: {
      name: 'Lo Sfidante',
      description:
        'Lo Sfidante porta nuove ambizioni nel mondo del gaming su Linux. PikaOS si rivolge agli appassionati che cercano driver recenti e strumenti di ottimizzazione accessibili, e sono disposti a seguire l’evoluzione di un progetto ancora giovane.',
    },
    summary:
      'Un desktop rolling basato su Debian Sid, con una selezione curata di build ottimizzate per le prestazioni e strumenti per videogiochi e grafica.',
    strengths: [
      'Driver e componenti recenti per giochi e grafica',
      'Strumenti grafici per driver e kernel',
      'Pacchetti compilati con ottimizzazioni per le prestazioni',
      'Strumenti per la creazione di contenuti e carichi di calcolo',
    ],
    cautions: [
      'Un progetto più giovane ha meno esperienze pregresse di risoluzione dei problemi a cui attingere.',
      'La base ottimizzata richiede CPU moderne compatibili.',
      'I repository rolling specifici del progetto possono richiedere una manutenzione più attenta.',
    ],
    idealFor: [
      'Chi gioca con hardware moderno compatibile',
      'Creativi che vogliono strumenti recenti per la GPU',
      'Appassionati disposti a seguire un progetto più recente',
    ],
    assessmentBasis:
      'Desktop KDE su hardware compatibile con x86-64-v3; le stime relative a un progetto più recente richiedono verifiche più attente.',
  },
  'alpine-linux': {
    name: 'Alpine Linux',
    archetype: {
      name: 'L’Asceta',
      description:
        'L’Asceta sceglie un sistema piccolo e accetta le conseguenze del viaggiare leggero. La base musl e BusyBox di Alpine si adatta a utenti avanzati che hanno una ragione tecnica precisa per abbandonare le convenzioni del desktop tradizionale.',
    },
    summary:
      'Una distribuzione minimale attenta alla sicurezza, basata su musl e BusyBox, con notevoli compromessi nella compatibilità desktop.',
    strengths: [
      'Sistema di base di dimensioni molto ridotte',
      'Strumenti semplici per pacchetti e servizi',
      'Utile ecosistema per container e dispositivi dedicati',
      'Composizione esplicita di un sistema minimale',
    ],
    cautions: [
      'musl può complicare l’uso di software proprietario e di software progettato per glibc.',
      'L’integrazione del desktop richiede lavoro manuale.',
      'Poco adatta ai videogiochi desktop più diffusi.',
    ],
    idealFor: [
      'Utenti avanzati di sistemi minimali',
      'Sperimentazione tecnica con musl',
      'Computer leggeri per scopi specifici',
    ],
    assessmentBasis:
      'Base Alpine stable con un desktop leggero assemblato manualmente; i punti di forza nei container non implicano comodità nell’uso desktop.',
  },
  'vanilla-os': {
    name: 'Vanilla OS',
    archetype: {
      name: 'Il Viaggiatore',
      description:
        'Il Viaggiatore mantiene una base ordinata e porta con sé ambienti diversi per viaggi diversi. Vanilla OS si adatta a chi preferisce una base immutabile e spazi isolati per le applicazioni, senza vincolare tutto il proprio lavoro a un solo ecosistema.',
    },
    summary:
      'Un desktop immutabile per uso generale, con gestione del sistema basata su immagini e ambienti isolati per applicazioni e attività da riga di comando.',
    strengths: [
      'Sistema host protetto con aggiornamenti atomici ABRoot e rollback',
      'Ambienti Apx che supportano più userspace Linux',
      'Applicazioni Flatpak separate dal sistema host',
      'Opzioni integrate per immagini NVIDIA',
    ],
    cautions: [
      'Apx, VSO e ABRoot introducono un flusso di lavoro non convenzionale; prevedi almeno 50 GB di spazio su disco.',
      'Un piccolo progetto con una revisione principale appena rilasciata ha un supporto meno consolidato rispetto a Fedora o Ubuntu.',
      'Reunion cambia il funzionamento dei sottosistemi; gli aggiornamenti da configurazioni precedenti richiedono attenzione.',
      'Le immagini NVIDIA usano moduli non firmati; Secure Boot e generazione della GPU vanno verificati.',
    ],
    idealFor: [
      'Chi è incuriosito dai desktop immutabili ed è disposto a imparare',
      'Sviluppatori che usano più ambienti Linux',
      'Chi vuole ambienti applicativi separati dal sistema host',
    ],
    assessmentBasis:
      'Desktop GNOME di Vanilla OS 3 Reunion, rilasciato ad agosto 2026; sistema host OCI ibrido derivato da Debian, con ABRoot, Apx v3, un ambiente VSO basato su Debian testing e app Flatpak. Le immagini aggiornate continuamente, con revisioni principali dotate di un nome, sono modellate come rolling, non come Ubuntu LTS. Incluso con cautela per l’ecosistema piccolo e i recenti cambiamenti nel flusso di lavoro.',
  },
  'rhino-linux': {
    name: 'Rhino Linux',
    archetype: {
      name: 'Il Pioniere',
      description:
        'Il Pioniere traccia una nuova via nel mondo Ubuntu, senza aspettare il prossimo rilascio. Rhino Linux si adatta a chi vuole un flusso rolling di software recente, mantenendo la cultura dei pacchetti e le fondamenta del mondo Ubuntu.',
    },
    summary:
      'Un desktop rolling della famiglia Ubuntu che unisce pacchetti recenti, strumenti Pacstall e un’esperienza desktop leggera dalle scelte ben definite.',
    strengths: [
      'Pacchetti aggiornati continuamente dal ramo di sviluppo di Ubuntu',
      'Kernel e software di sviluppo molto recenti',
      'Pacchetti della comunità Pacstall e integrazione con Rhino PKG',
      'Desktop Unicorn leggero e personalizzabile, basato su Xfce',
    ],
    cautions: [
      'I pacchetti di sviluppo di Ubuntu e gli aggiornamenti rolling possono causare malfunzionamenti che richiedono correzioni manuali.',
      'Progetto e comunità di supporto più piccoli rispetto a Ubuntu standard.',
      'I pacchetti della comunità Pacstall richiedono valutazioni autonome; non sono tutti mantenuti da Ubuntu.',
      'I kernel non firmati influiscono sulla configurazione di Secure Boot; le versioni dei driver NVIDIA vanno verificate.',
    ],
    idealFor: [
      'Utenti Ubuntu esperti che cercano una rolling release',
      'Sviluppatori che vogliono toolchain recenti',
      'Utenti desktop a proprio agio con la manutenzione che preferiscono sistemi della famiglia Debian ad Arch',
    ],
    assessmentBasis:
      'Snapshot del desktop Unicorn di Rhino Linux 2026.1: base Ubuntu devel modificabile, Xfce, Pacstall e Rhino PKG (RPK2), con configurazione NVIDIA guidata. I desktop UBXI come Lomiri sono scelte separate. Incluso con cautela; la correzione di emergenza di Pacstall di febbraio 2026 dimostra un rischio concreto di manutenzione.',
  },
  slackware: {
    name: 'Slackware',
    archetype: {
      name: 'Il Tradizionalista',
      description:
        'Il Tradizionalista preserva le convenzioni Unix e comprende le modifiche apportate al sistema. Slackware si rivolge a utenti esperti che apprezzano la continuità, il software dei progetti originali e l’amministrazione manuale come parte della conoscenza del proprio sistema.',
    },
    summary:
      'Una distribuzione indipendente di lunga tradizione, che privilegia rilasci conservativi e un’amministrazione diretta e tradizionale.',
    strengths: [
      'Filosofia di rilascio conservativa',
      'Configurazione diretta tramite file di testo',
      'Modifiche limitate al software upstream',
      'Modalità di lavoro Unix consolidate',
    ],
    cautions: [
      'Gli strumenti ufficiali per i pacchetti lasciano a te la risoluzione delle dipendenze.',
      'Il software del ramo stable può essere molto meno recente.',
      'L’uso di desktop moderni e delle soluzioni dei fornitori richiede ulteriore lavoro manuale.',
    ],
    idealFor: [
      'Utenti esperti orientati a Unix',
      'Chi preferisce l’amministrazione manuale',
      'Chi apprezza convenzioni di sistema durature',
    ],
    assessmentBasis:
      'Slackware stable con Xfce; il ramo di sviluppo non rientra in questo profilo.',
  },
} satisfies DistroDictionary;
