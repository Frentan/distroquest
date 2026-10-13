import type { DistroDictionary } from '../../domain/distro.ts';

// Unpublished batch 2 draft. Only explicitly approved units are reviewed.
export const distroContentPt = {
  'linux-mint': {
    name: 'Linux Mint',
    archetype: {
      name: 'O Pragmático',
      description:
        'O Pragmático prefere um ambiente familiar e configurações sensatas, encurtando o caminho entre instalar o sistema e começar a trabalhar. O Linux Mint favorece quem quer usar o computador sem transformar a manutenção em hobby.',
    },
    summary:
      'Um ambiente de trabalho acolhedor, baseado no Ubuntu, com atualizações conservadoras e ferramentas gráficas práticas.',
    strengths: [
      'Organização familiar da área de trabalho',
      'Ferramentas acessíveis para atualizações e drivers',
      'Base conservadora do Ubuntu LTS',
      'Ampla disponibilidade de aplicativos para o dia a dia',
    ],
    cautions: [
      'Os pacotes da base podem ficar atrás das versões mais recentes dos projetos de origem.',
      'O Cinnamon é mais pesado que outras opções de ambientes leves.',
      'Hardware de última geração para jogos pode exigir drivers e componentes gráficos mais atualizados.',
    ],
    idealFor: [
      'Quem usa Linux pela primeira vez',
      'Uso cotidiano do computador em casa',
      'Quem prefere fluxos de trabalho familiares',
    ],
    assessmentBasis:
      'Edição Cinnamon baseada no Ubuntu; MATE e Xfce podem reduzir o consumo de recursos do ambiente de trabalho.',
  },
  ubuntu: {
    name: 'Ubuntu',
    archetype: {
      name: 'O Emissário',
      description:
        'O Emissário transita com facilidade entre o Linux e o universo mais amplo do software. O Ubuntu combina com quem valoriza ferramentas e processos bem documentados, amplo suporte de fabricantes e fornecedores e um caminho claro para começar a usar Linux.',
    },
    summary:
      'Um ambiente de trabalho Linux amplamente suportado, com um vasto ecossistema de software e uma opção LTS.',
    strengths: [
      'Documentação extensa e ajuda da comunidade',
      'Amplo suporte a software comercial',
      'Opção de versão com suporte de longo prazo',
      'Ecossistema sólido para desenvolvimento',
    ],
    cautions: [
      'O GNOME pode causar estranhamento a quem vem do Windows.',
      'O empacotamento Snap pode não se adequar a todos os fluxos de trabalho.',
      'Os pacotes da base LTS priorizam continuidade em vez de versões recentes.',
    ],
    idealFor: [
      'Quem está começando no Linux',
      'Desenvolvedores que usam ferramentas com suporte comercial',
      'Quem procura um ambiente de trabalho consolidado',
    ],
    assessmentBasis:
      'Ubuntu Desktop LTS com GNOME; as versões intermediárias oferecem um equilíbrio diferente entre atualizações de software e tempo de suporte.',
  },
  'fedora-workstation': {
    name: 'Fedora Workstation',
    archetype: {
      name: 'A Vanguarda',
      description:
        'A Vanguarda adota cedo as novas ideias do Linux, mantendo uma base bem organizada. O Fedora Workstation combina com desenvolvedores e usuários que gostam de tecnologia atual e de um ambiente GNOME com foco no essencial.',
    },
    summary:
      'Uma estação de trabalho moderna com GNOME, que combina tecnologias Linux atuais com um ciclo regular de lançamentos.',
    strengths: [
      'Kernels e ferramentas de desenvolvimento atuais',
      'Bons fluxos de trabalho com contêineres',
      'Configurações padrão coesas do GNOME',
      'Colaboração consolidada com os projetos de origem',
    ],
    cautions: [
      'As atualizações frequentes entre versões precisam de planejamento.',
      'Alguns codecs e drivers proprietários precisam de configuração adicional.',
      'As extensões do GNOME podem complicar as atualizações entre versões.',
    ],
    idealFor: [
      'Desenvolvedores de software',
      'Quem quer um ambiente de trabalho moderno para uso geral',
      'Quem lida bem com atualizações regulares entre versões',
    ],
    assessmentBasis: 'Instalação padrão do Fedora Workstation com GNOME.',
  },
  'fedora-kde': {
    name: 'Fedora KDE',
    archetype: {
      name: 'O Inventor',
      description:
        'O Inventor gosta de uma base moderna com painéis, atalhos e fluxos de trabalho que pode moldar. O Fedora KDE abre espaço para essa curiosidade no uso diário, sem transformar a personalização em um trabalho de tempo integral.',
    },
    summary: 'Um ambiente KDE Plasma atual sobre a base versátil do Fedora.',
    strengths: [
      'Configurações flexíveis do ambiente Plasma',
      'Kernels e stack gráfico atuais',
      'Excelente ecossistema de desenvolvimento e contêineres',
      'Boa adequação a estações de trabalho de uso geral',
    ],
    cautions: [
      'As atualizações frequentes entre versões precisam de planejamento.',
      'Alguns codecs e drivers proprietários precisam de configuração adicional.',
      'A quantidade de configurações do ambiente pode confundir iniciantes.',
    ],
    idealFor: [
      'Quem quer um ambiente de trabalho ajustável para o dia a dia',
      'Desenvolvedores de software',
      'Quem procura software moderno com administração convencional',
    ],
    assessmentBasis:
      'Fedora KDE Plasma Desktop; as configurações integradas do Plasma recebem uma nota de personalização superior às do GNOME.',
  },
  'fedora-silverblue': {
    name: 'Fedora Silverblue',
    archetype: {
      name: 'O Artífice',
      description:
        'O Artífice cria com liberdade dentro de uma oficina bem protegida. O Fedora Silverblue combina com quem quer a tecnologia moderna do Fedora e ferramentas baseadas em contêineres, mantendo o sistema de base previsível e fácil de restaurar.',
    },
    summary:
      'Um ambiente Fedora Atomic oficial que combina GNOME, atualizações por imagem, retorno a estados anteriores, aplicativos Flatpak e desenvolvimento com contêineres.',
    strengths: [
      'Atualizações atômicas do sistema e retorno a estados anteriores',
      'Bons fluxos de desenvolvimento com Toolbx e contêineres',
      'Base de software moderno do Fedora',
      'Separação clara entre o sistema de base e os aplicativos',
    ],
    cautions: [
      'O gerenciamento de pacotes do sistema anfitrião é diferente do Fedora convencional; Flatpak e Toolbx exigem outros hábitos.',
      'Codecs proprietários e drivers NVIDIA precisam de configuração adicional; o suporte dos drivers pode demorar a acompanhar kernels novos.',
      'A personalização do GNOME é menos ampla que a do KDE Plasma.',
      'As atualizações regulares entre versões do Fedora ainda precisam de planejamento.',
    ],
    idealFor: [
      'Desenvolvedores que usam contêineres',
      'Usuários do Fedora interessados em ambientes de trabalho atômicos',
      'Quem prioriza o retorno a estados anteriores e um sistema anfitrião protegido',
    ],
    assessmentBasis:
      'Ambiente GNOME Atomic Desktop oficial do Fedora, com OSTree/rpm-ostree, Flatpak e Toolbx no ciclo normal de lançamentos do Fedora. O Fedora Kinoite é o equivalente oficial com KDE Plasma, sem um perfil avaliado separadamente.',
    editionNote:
      'Prefere KDE Plasma? O Fedora Kinoite oferece o caminho oficial equivalente de Atomic Desktop.',
  },
  debian: {
    name: 'Debian',
    archetype: {
      name: 'O Guardião',
      description:
        'O Guardião dá uma vida longa e útil ao software maduro. O Debian combina com quem valoriza mudanças previsíveis, suporte da comunidade e um sistema que pode manter estável ao longo do tempo.',
    },
    summary:
      'Uma distribuição mantida pela comunidade, cuja versão estável prioriza continuidade e um grande acervo de pacotes.',
    strengths: [
      'Base conservadora de versão estável',
      'Grande acervo de pacotes',
      'Suporte a diversas arquiteturas',
      'Desenvolvimento governado pela comunidade',
    ],
    cautions: [
      'Pacotes da base e stack gráfico mais antigos.',
      'A configuração do ambiente pode exigir mais escolhas que em distribuições derivadas voltadas a iniciantes.',
      'Hardware novo pode precisar de backports ou atenção ao firmware.',
    ],
    idealFor: [
      'Quem prioriza mudanças previsíveis',
      'Estações de trabalho mantidas por muitos anos',
      'Hardware modesto com um ambiente de trabalho leve',
    ],
    assessmentBasis:
      'Debian stable com o ambiente leve Xfce; testing e unstable estão fora deste perfil.',
  },
  'pop-os': {
    name: 'Pop!_OS',
    archetype: {
      name: 'O Piloto',
      description:
        'O Piloto busca uma estação de trabalho que facilite até as tarefas mais exigentes. O Pop!_OS combina a proposta da System76 com recursos de organização de janelas que favorecem a produtividade de desenvolvedores, criadores de conteúdo e quem prefere um ambiente pensado para trabalhar.',
    },
    summary:
      'Uma estação de trabalho baseada no Ubuntu, organizada em torno do ambiente COSMIC da System76 e de fluxos de produtividade.',
    strengths: [
      'Organização de janelas em mosaico e espaços de trabalho',
      'Ecossistema de software do Ubuntu',
      'Integração de hardware nos computadores System76',
      'Facilidades de configuração para jogos e gráficos',
    ],
    cautions: [
      'A maturidade do COSMIC e a integração dos aplicativos merecem uma avaliação prática.',
      'As instruções para Ubuntu podem diferir em detalhes do ambiente e do sistema.',
      'Não é voltado a computadores com recursos muito limitados.',
    ],
    idealFor: [
      'Desenvolvedores e criadores',
      'Quem gosta de fluxos de trabalho com janelas em mosaico',
      'Proprietários de hardware System76',
    ],
    assessmentBasis:
      'Proposta atual de ambiente COSMIC; as estimativas de acabamento e manutenção precisam de revisão conforme o ambiente amadurece.',
  },
  'zorin-os': {
    name: 'Zorin OS',
    archetype: {
      name: 'O Iniciado',
      description:
        'O Iniciado encontra no Zorin um caminho mais acessível para começar a usar Linux. Sua interface familiar e seu visual bem-acabado permitem aprender aos poucos, sem complicar as tarefas do dia a dia.',
    },
    summary:
      'Um ambiente de trabalho bem-acabado, baseado no Ubuntu, feito para facilitar a transição do Windows ou macOS.',
    strengths: [
      'Organização familiar da área de trabalho',
      'Configuração gráfica acolhedora',
      'Ecossistema de aplicativos do Ubuntu',
      'Configurações iniciais com apresentação cuidadosa',
    ],
    cautions: [
      'O software da base pode ficar atrás das versões dos projetos de origem.',
      'Algumas opções de organização da área de trabalho e recursos extras pertencem à edição paga.',
      'O ambiente padrão é mais pesado que as opções minimalistas.',
    ],
    idealFor: [
      'Quem vem do Windows ou macOS',
      'Quem valoriza a apresentação',
      'Uso cotidiano em casa e no escritório',
    ],
    assessmentBasis:
      'Zorin OS Core; as opções de organização da edição paga Pro não aumentam as notas de capacidade.',
  },
  'elementary-os': {
    name: 'elementary OS',
    archetype: {
      name: 'O Esteta',
      description:
        'O Esteta valoriza a harmonia visual e acredita que menos pode ser mais. O elementary OS oferece um ambiente Pantheon cuidadosamente projetado para quem prefere uma interface consistente a uma infinidade de opções de personalização.',
    },
    summary:
      'Um ambiente de trabalho baseado no Ubuntu, centrado no Pantheon, em um design coeso e em aplicativos selecionados.',
    strengths: [
      'Design de interface coerente',
      'Aplicativos selecionados para o ambiente de trabalho',
      'Fluxos simples para o dia a dia',
      'Base Ubuntu',
    ],
    cautions: [
      'Personalização integrada limitada do ambiente.',
      'Seleção mais limitada de aplicativos bem integrados.',
      'Jogos e ferramentas especializadas exigem mais configuração.',
    ],
    idealFor: [
      'Quem se importa com o design do ambiente de trabalho',
      'Quem prefere uma interface contida',
      'Quem fica à vontade com configurações padrão selecionadas',
    ],
    assessmentBasis: 'Ambiente Pantheon padrão.',
  },
  'opensuse-aeon': {
    name: 'openSUSE Aeon',
    archetype: {
      name: 'O Cronomante',
      description:
        'O Cronomante mantém o sistema em movimento sem perder o controle do tempo. O Aeon combina software atualizado, atualizações transacionais automáticas e opções de recuperação para quem prefere um ambiente que exige pouca manutenção no dia a dia.',
    },
    summary:
      'Um ambiente GNOME transacional do openSUSE, organizado em torno de atualizações automáticas, snapshots, retorno a estados anteriores e um sistema anfitrião protegido por projeto.',
    strengths: [
      'Atualizações transacionais do sistema e recuperação por snapshots',
      'Base de software com atualizações contínuas',
      'Pouca manutenção de rotina graças às atualizações automáticas',
      'Ambiente GNOME focado no essencial, com Flatpak e Distrobox',
    ],
    cautions: [
      'O Aeon ainda é uma versão candidata a lançamento; verifique os requisitos de hardware e recuperação antes de depender dele.',
      'Modificações tradicionais no sistema anfitrião não são suportadas; use Flatpak ou Distrobox sempre que possível.',
      'A integração com drivers proprietários NVIDIA não é uma opção pronta para uso com suporte; o suporte gráfico precisa ser verificado caso a caso.',
      'O instalador exige UEFI, substitui o conteúdo do disco selecionado e tem requisitos específicos de criptografia.',
    ],
    idealFor: [
      'Quem quer atualizações contínuas com pouca intervenção',
      'Quem prioriza o retorno a estados anteriores e a recuperação',
      'Quem lida bem com um fluxo de trabalho com escolhas predefinidas e sistema anfitrião protegido',
    ],
    assessmentBasis:
      'Ambiente GNOME do Aeon, atualmente em versão candidata a lançamento, do ecossistema openSUSE: pacotes Tumbleweed, snapshots transacionais Btrfs, retorno a estados anteriores com systemd-boot, Flatpak e Distrobox com Podman. As atualizações contínuas frequentes permanecem automatizadas; modificar o sistema anfitrião não é suportado.',
  },
  'opensuse-tumbleweed': {
    name: 'openSUSE Tumbleweed',
    archetype: {
      name: 'O Sentinela',
      description:
        'O Sentinela avança por novos territórios sem deixar a segurança de lado. O Tumbleweed combina software atualizado continuamente, testes automatizados e ferramentas de recuperação para quem busca novidades sem abrir mão de mecanismos de proteção.',
    },
    summary:
      'Uma distribuição de atualização contínua que combina software atual com testes automatizados e ferramentas de recuperação por snapshots.',
    strengths: [
      'Software atual com atualizações contínuas',
      'Testes automatizados da distribuição',
      'Recuperação por snapshots Btrfs',
      'Amplas opções de configuração do ambiente e do sistema',
    ],
    cautions: [
      'Atualizações frequentes e, às vezes, grandes.',
      'Codecs e drivers proprietários exigem atenção.',
      'A recuperação por snapshots ainda exige conhecimento e espaço em disco.',
    ],
    idealFor: [
      'Quem quer um ambiente de atualização contínua com ferramentas de gerenciamento',
      'Desenvolvedores que precisam de ferramentas atuais',
      'Quem gosta de ajustar o sistema e valoriza opções de recuperação',
    ],
    assessmentBasis:
      'Ambiente KDE com a instalação padrão Btrfs/Snapper; a recuperação não equivale a atualizações atômicas por imagem.',
  },
  endeavouros: {
    name: 'EndeavourOS',
    archetype: {
      name: 'O Explorador',
      description:
        'O Explorador entra no mundo Arch por uma trilha mais clara. O EndeavourOS oferece uma comunidade acolhedora e instalação gráfica, deixando a administração e a manutenção do sistema nas mãos de quem o usa.',
    },
    summary:
      'Uma distribuição derivada do Arch, voltada ao uso do terminal, com instalador guiado e um ambiente de trabalho relativamente enxuto.',
    strengths: [
      'Entrada guiada no ecossistema Arch',
      'Pacotes atuais',
      'Comunidade acolhedora para aprender',
      'Instalação enxuta e adaptável',
    ],
    cautions: [
      'As atualizações contínuas podem exigir intervenção manual.',
      'Espera-se que a administração seja feita pelo terminal.',
      'Pacotes do AUR precisam de revisão e manutenção independentes.',
    ],
    idealFor: [
      'Usuários de Linux que querem se aproximar do Arch',
      'Quem aprende colocando a mão na massa',
      'Quem aceita assumir a manutenção do sistema',
    ],
    assessmentBasis:
      'Instalação padrão com KDE; outras escolhas de ambiente alteram o consumo de recursos.',
  },
  'arch-linux': {
    name: 'Arch Linux',
    archetype: {
      name: 'O Artesão',
      description:
        'O Artesão monta o sistema peça por peça, entendendo cada escolha pelo caminho. O Arch recompensa quem já tem experiência, gosta de construir o próprio ambiente e assume a responsabilidade pela manutenção.',
    },
    summary:
      'Uma distribuição minimalista de atualização contínua que deixa a montagem do ambiente de trabalho e a configuração do sistema a cargo do usuário.',
    strengths: [
      'Controle excepcional sobre a composição do sistema',
      'Pacotes e conjuntos de ferramentas atuais',
      'Extensa Arch Wiki',
      'Grande ecossistema de compilação mantido pela comunidade',
    ],
    cautions: [
      'A instalação e a montagem do ambiente exigem escolhas conscientes.',
      'As atualizações podem exigir intervenção manual.',
      'Pacotes da comunidade não equivalem a pacotes oficiais verificados.',
    ],
    idealFor: [
      'Usuários experientes de Linux',
      'Quem monta um ambiente pessoal',
      'Quem aprende sobre sistemas na prática',
    ],
    assessmentBasis:
      'Base mínima com um ambiente leve montado pelo usuário; a nota de acabamento considera as configurações fornecidas, não uma instalação personalizada já concluída.',
  },
  cachyos: {
    name: 'CachyOS',
    archetype: {
      name: 'O Andarilho',
      description:
        'O Andarilho prefere avançar com agilidade e aproveitar ao máximo seu equipamento. O CachyOS oferece ferramentas de otimização e desempenho baseadas no Arch, sem exigir que o usuário monte tudo do zero.',
    },
    summary:
      'Um ambiente de trabalho baseado no Arch, com pacotes otimizados, opções de kernel e ferramentas voltadas ao desempenho.',
    strengths: [
      'Stack gráfico e kernels atuais',
      'Pacotes compilados com foco em desempenho',
      'Instalação gráfica',
      'Opções de kernel e escalonador',
    ],
    cautions: [
      'Os requisitos de CPU variam entre as compilações otimizadas.',
      'As atualizações contínuas e dos kernels personalizados exigem atenção.',
      'Os ganhos de desempenho dependem do hardware e da carga de trabalho.',
    ],
    idealFor: [
      'Entusiastas de jogos com hardware moderno',
      'Quem quer ajustar o desempenho',
      'Quem lida bem com a manutenção do Arch',
    ],
    assessmentBasis:
      'Ambiente KDE em hardware x86-64 moderno e compatível; as otimizações não garantem ganhos de desempenho em todos os casos.',
  },
  nobara: {
    name: 'Nobara',
    archetype: {
      name: 'O Campeão',
      description:
        'O Campeão chega preparado para jogos exigentes e criação de conteúdo. O Nobara reúne recursos para jogos, multimídia e trabalho criativo sobre uma base derivada do Fedora, reduzindo as configurações necessárias antes de entrar em ação.',
    },
    summary:
      'Uma distribuição derivada do Fedora com facilidades de configuração para jogos, gráficos e criação de conteúdo.',
    strengths: [
      'Facilidades para dependências de jogos e drivers',
      'Ferramentas de multimídia e captura',
      'Base atual derivada do Fedora',
      'Ferramentas gráficas de configuração e atualização',
    ],
    cautions: [
      'As alterações próprias podem divergir das orientações do Fedora.',
      'O suporte vem de um projeto menor, mantido como hobby.',
      'As grandes atualizações entre versões exigem atenção às instruções do projeto.',
    ],
    idealFor: [
      'Quem joga no computador de mesa',
      'Quem faz transmissões e cria conteúdo',
      'Quem quer facilidades na configuração para jogos',
    ],
    assessmentBasis:
      'Ambiente KDE do Nobara Official; siga as ferramentas e orientações de atualização do Nobara.',
  },
  bazzite: {
    name: 'Bazzite',
    archetype: {
      name: 'O Jogador',
      description:
        'O Jogador quer um computador pronto tanto para jogar quanto para as tarefas do dia a dia. O Bazzite combina ferramentas pré-configuradas para jogos com um sistema baseado em imagens, pensado para quem prefere passar menos tempo configurando e mais tempo jogando.',
    },
    summary:
      'Um ambiente de trabalho para jogos baseado no Fedora Atomic, com atualizações por imagem e variantes específicas de hardware.',
    strengths: [
      'Ambiente preparado para jogos',
      'Atualizações atômicas por imagem e retorno a estados anteriores',
      'Opções para computadores de mesa e portáteis de jogos compatíveis',
      'Aplicativos separados do sistema de base',
    ],
    cautions: [
      'As modificações no sistema anfitrião diferem do Linux convencional.',
      'O suporte ao modo de jogo depende do hardware e da imagem.',
      'Os fluxos com Flatpak e contêineres exigem adaptação.',
    ],
    idealFor: [
      'Quem joga no computador de mesa',
      'Proprietários de portáteis de jogos compatíveis',
      'Quem prefere uma base de jogos gerenciada',
    ],
    assessmentBasis:
      'Imagem KDE para computadores de mesa em hardware compatível; a compatibilidade com portáteis de jogos e modo de jogo deve ser verificada separadamente.',
  },
  bluefin: {
    name: 'Bluefin',
    archetype: {
      name: 'O Navegador',
      description:
        'O Navegador mantém o rumo com uma base gerenciada e ferramentas bem organizadas. O Bluefin combina atualizações automáticas por imagem e um ambiente voltado a aplicativos, especialmente para desenvolvedores que já trabalham com contêineres.',
    },
    summary:
      'Uma estação de trabalho baseada em imagens do Fedora, com configurações GNOME selecionadas e fluxos de desenvolvimento com contêineres.',
    strengths: [
      'Atualizações automáticas por imagem',
      'Modo de desenvolvimento robusto, focado em contêineres',
      'Experiência GNOME cuidadosamente configurada',
      'Separação entre aplicativos gráficos e de linha de comando',
    ],
    cautions: [
      'A instalação de pacotes no sistema anfitrião segue outro modelo.',
      'Homebrew, Flatpak e contêineres trazem novos hábitos para aprender.',
      'A personalização do GNOME continua mais limitada que a do Plasma.',
    ],
    idealFor: [
      'Desenvolvedores que trabalham com contêineres',
      'Quem procura pouca manutenção de rotina',
      'Quem fica à vontade com uma estação de trabalho gerenciada',
    ],
    assessmentBasis:
      'Imagem GNOME padrão com modo de desenvolvimento disponível; o canal de lançamento afeta a atualidade do software.',
  },
  nixos: {
    name: 'NixOS',
    archetype: {
      name: 'O Arquiteto',
      description:
        'O Arquiteto planeja o sistema em detalhes para poder reconstruí-lo sempre que necessário. O NixOS recompensa quem está disposto a aprender um modelo diferente de configuração em troca de ambientes reproduzíveis e maior controle sobre as mudanças.',
    },
    summary:
      'Uma distribuição configurada de forma declarativa, organizada em torno de pacotes Nix, gerações do sistema e reprodutibilidade.',
    strengths: [
      'Configuração declarativa do sistema',
      'Ambientes de desenvolvimento reproduzíveis',
      'Gerações do sistema e retorno a estados anteriores',
      'Vasto ecossistema de pacotes',
    ],
    cautions: [
      'Linguagem própria de configuração que exige aprendizado.',
      'Software que espera uma organização convencional do sistema de arquivos pode falhar ou precisar de configuração adicional.',
      'A reprodutibilidade exige disciplina na fixação de versões.',
    ],
    idealFor: [
      'Usuários técnicos interessados em sistemas declarativos',
      'Desenvolvedores que gerenciam ambientes reproduzíveis',
      'Quem mantém a configuração como código',
    ],
    assessmentBasis:
      'Canal estável do NixOS com um ambiente KDE configurado; o canal unstable representa outra escolha entre atualidade e limitações.',
  },
  gentoo: {
    name: 'Gentoo',
    archetype: {
      name: 'O Alquimista',
      description:
        'O Alquimista transforma ingredientes escolhidos em um sistema cuidadosamente ajustado. O Gentoo combina com entusiastas pacientes que gostam de escolher os recursos de compilação e entender como o software se encaixa, aceitando o trabalho que essa liberdade traz.',
    },
    summary:
      'Uma distribuição altamente configurável, centrada no Portage, nas escolhas de compilação e na composição do sistema pelo usuário.',
    strengths: [
      'Seleção detalhada de recursos dos pacotes',
      'Controle profundo sobre a composição do sistema',
      'Fluxos flexíveis com pacotes de código-fonte e binários',
      'Documentação detalhada do sistema',
    ],
    cautions: [
      'A configuração e as atualizações exigem bastante atenção.',
      'Compilar a partir do código-fonte pode levar tempo e exigir bastante do hardware.',
      'A integração do ambiente de trabalho é responsabilidade do usuário.',
    ],
    idealFor: [
      'Entusiastas experientes em sistemas',
      'Quem precisa de recursos específicos de compilação',
      'Quem tem paciência para aprender e busca controle profundo',
    ],
    assessmentBasis:
      'Ambiente montado pelo usuário com pacotes marcados como estáveis; pacotes binários podem reduzir o trabalho de compilação.',
  },
  'void-linux': {
    name: 'Void Linux',
    archetype: {
      name: 'O Errante',
      description:
        'O Errante segue uma rota independente, com poucas camadas entre o usuário e o sistema. O runit e o XBPS do Void atraem quem gosta de pôr a mão na massa, valoriza um projeto enxuto e se orienta bem fora das convenções das distros mais populares.',
    },
    summary:
      'Uma distribuição independente de atualização contínua que usa runit e XBPS, com variantes glibc e musl.',
    strengths: [
      'Projeto de sistema enxuto',
      'Supervisão simples de serviços com runit',
      'Ferramentas nativas de pacotes rápidas',
      'Opções alternativas de libc',
    ],
    cautions: [
      'Ecossistema menor que o das grandes famílias de distros.',
      'Mais trabalho manual para integrar o ambiente de trabalho e os drivers.',
      'Muitas instruções de uso geral pressupõem systemd.',
    ],
    idealFor: [
      'Usuários experientes que procuram um ambiente de trabalho enxuto',
      'Quem tem interesse em runit',
      'Quem lida bem com um ecossistema independente',
    ],
    assessmentBasis:
      'Ambiente Xfce com glibc; musl traz limitações adicionais de compatibilidade.',
  },
  'kali-linux': {
    name: 'Kali Linux',
    archetype: {
      name: 'O Especialista',
      description:
        'O Especialista conhece sua missão e domina as ferramentas necessárias para cumpri-la. O Kali é voltado a testes de intrusão e estudos de segurança, não ao uso cotidiano como uma distribuição de propósito geral.',
    },
    summary:
      'Uma distribuição de testes de segurança baseada no Debian, voltada a profissionais de testes de intrusão e especialistas em segurança.',
    strengths: [
      'Amplo conjunto de ferramentas para testes de intrusão',
      'Documentação focada em segurança',
      'Fluxos de avaliação feitos para esse propósito',
      'Opções de máquina virtual e uso sem instalação',
    ],
    cautions: [
      'Inadequado como recomendação de ambiente de trabalho comum para iniciantes.',
      'Repositórios alheios à distribuição podem danificar o sistema suportado.',
      'Desenvolvimento de uso geral e jogos estão fora do seu foco.',
    ],
    idealFor: [
      'Profissionais de testes de intrusão',
      'Estudantes de segurança com experiência em Linux',
      'Laboratórios autorizados de avaliação de segurança',
    ],
    assessmentBasis:
      'Instalação padrão das ferramentas de segurança com Xfce; avaliada como ambiente especializado, não como ambiente de trabalho de uso geral.',
  },
  'mx-linux': {
    name: 'MX Linux',
    archetype: {
      name: 'O Sobrevivente',
      description:
        'O Sobrevivente sabe aproveitar ao máximo os recursos disponíveis. O MX combina a estabilidade do Debian com ferramentas práticas para quem valoriza a eficiência e quer continuar usando computadores que ainda têm muito a oferecer.',
    },
    summary:
      'Um ambiente de trabalho baseado no Debian stable, com ferramentas práticas de administração e consumo relativamente modesto de recursos.',
    strengths: [
      'Ambiente Xfce relativamente leve',
      'Base conservadora do Debian',
      'Ferramentas práticas de administração do MX',
      'Fluxos úteis de uso sem instalação e recuperação',
    ],
    cautions: [
      'Os pacotes da base priorizam estabilidade em vez de versões recentes.',
      'Hardware gráfico de última geração pode precisar de outra stack de kernel.',
      'A apresentação do ambiente é menos coesa que a das opções focadas em design.',
    ],
    idealFor: [
      'Quem mantém hardware modesto produtivo',
      'Quem quer ferramentas gráficas de administração',
      'Quem procura um ambiente estável para o dia a dia',
    ],
    assessmentBasis:
      'Edição Xfce padrão; não é uma promessa de suporte a toda CPU ou GPU obsoleta.',
  },
  'garuda-linux': {
    name: 'Garuda Linux',
    archetype: {
      name: 'O Berserker',
      description:
        'O Berserker não passa despercebido: gosta de potência, personalidade e um visual marcante. O Garuda combina a base do Arch com ferramentas para jogos e opções de recuperação, ideal para quem gosta de explorar e personalizar um sistema cheio de possibilidades.',
    },
    summary:
      'Uma distribuição derivada do Arch voltada a entusiastas, com visual marcante por padrão e ferramentas de recuperação por snapshots.',
    strengths: [
      'Software atual do Arch',
      'Ferramentas de configuração voltadas a jogos',
      'Integração da recuperação por snapshots',
      'Ambiente de trabalho altamente ajustável',
    ],
    cautions: [
      'As atualizações contínuas ainda exigem atenção.',
      'As configurações padrão mais completas consomem mais recursos.',
      'Os temas com estilo próprio e as ferramentas extras podem não agradar a todos.',
    ],
    idealFor: [
      'Entusiastas de jogos',
      'Quem gosta de um visual marcante no ambiente de trabalho',
      'Quem gosta de ajustar o sistema e lida bem com ferramentas de recuperação',
    ],
    assessmentBasis:
      'Instalação KDE voltada a jogos com snapshots Btrfs; as edições mais leves são diferentes.',
  },
  solus: {
    name: 'Solus',
    archetype: {
      name: 'O Curador',
      description:
        'O Curador monta um ambiente de trabalho com uma visão consistente. O Solus segue um caminho independente e focado no uso do computador, para quem valoriza a integração e a escolha cuidadosa dos pacotes mais que o maior catálogo possível.',
    },
    summary:
      'Uma distribuição independente de atualização contínua, focada no ambiente de trabalho e com um ecossistema de pacotes selecionados.',
    strengths: [
      'Integração focada no ambiente de trabalho',
      'Seleção cuidadosa de software',
      'Atualizações contínuas dos aplicativos',
      'Projeto independente de distribuição',
    ],
    cautions: [
      'Catálogo de pacotes menor que o das grandes famílias de distros.',
      'Pacotes de fornecedores podem ter outras distribuições como alvo.',
      'As mudanças contínuas e o rumo do projeto precisam de revisão periódica.',
    ],
    idealFor: [
      'Quem quer um ambiente com curadoria para o dia a dia',
      'Quem lida bem com um ecossistema menor',
      'Quem gosta do fluxo de trabalho do Budgie',
    ],
    assessmentBasis:
      'Edição Budgie; outras edições de ambiente alteram o acabamento e a personalização.',
  },
  pikaos: {
    name: 'PikaOS',
    archetype: {
      name: 'O Desafiante',
      description:
        'O Desafiante chega com novas ideias para o mundo dos jogos no Linux. O PikaOS combina drivers recentes e ferramentas de otimização acessíveis para entusiastas dispostos a acompanhar a evolução de um projeto relativamente jovem.',
    },
    summary:
      'Um ambiente de atualização contínua baseado no Debian Sid, com compilações selecionadas para desempenho e ferramentas para jogos e gráficos.',
    strengths: [
      'Stack atual de jogos e gráficos',
      'Ferramentas gráficas para drivers e kernels',
      'Pacotes compilados com foco em desempenho',
      'Ferramentas para criação de conteúdo e cargas de trabalho computacionais',
    ],
    cautions: [
      'Um projeto mais jovem tem menos histórico de resolução de problemas para consultar.',
      'A base otimizada exige CPUs modernas compatíveis.',
      'Repositórios personalizados de atualização contínua podem exigir manutenção mais cuidadosa.',
    ],
    idealFor: [
      'Quem joga em hardware moderno compatível',
      'Criadores que querem ferramentas atuais para GPU',
      'Entusiastas dispostos a acompanhar um projeto mais novo',
    ],
    assessmentBasis:
      'Ambiente KDE em hardware compatível com x86-64-v3; as estimativas de um projeto mais novo precisam de revisão mais cuidadosa.',
  },
  'alpine-linux': {
    name: 'Alpine Linux',
    archetype: {
      name: 'O Asceta',
      description:
        'O Asceta escolhe um sistema pequeno e aceita as consequências de viajar leve. A base musl e BusyBox do Alpine combina com usuários avançados que têm uma razão técnica específica para deixar de lado as convenções dos ambientes de trabalho tradicionais.',
    },
    summary:
      'Uma distribuição minimalista, atenta à segurança, que usa musl e BusyBox e traz limitações consideráveis de compatibilidade no uso como ambiente de trabalho.',
    strengths: [
      'Base que ocupa pouquíssimo espaço',
      'Ferramentas simples de pacotes e serviços',
      'Ecossistema útil de contêineres e sistemas dedicados',
      'Composição explícita de um sistema mínimo',
    ],
    cautions: [
      'musl pode complicar o uso de software proprietário e de software feito para glibc.',
      'A integração do ambiente de trabalho exige trabalho manual.',
      'Pouco adequado aos jogos mais comuns no computador.',
    ],
    idealFor: [
      'Usuários avançados de sistemas mínimos',
      'Experimentação técnica com musl',
      'Computadores leves para finalidades específicas',
    ],
    assessmentBasis:
      'Base estável do Alpine com um ambiente leve montado manualmente; as vantagens em contêineres não implicam facilidade no ambiente de trabalho.',
  },
  'vanilla-os': {
    name: 'Vanilla OS',
    archetype: {
      name: 'O Viajante',
      description:
        'O Viajante mantém uma base organizada enquanto leva ambientes diferentes para jornadas diferentes. O Vanilla OS combina com quem prefere uma base imutável e espaços isolados para aplicativos, sem prender todo o fluxo de trabalho a um único ecossistema.',
    },
    summary:
      'Um ambiente de trabalho imutável de uso geral, com gerenciamento do sistema por imagens e ambientes isolados para aplicativos e tarefas de linha de comando.',
    strengths: [
      'Sistema anfitrião protegido com atualizações atômicas ABRoot e retorno a estados anteriores',
      'Ambientes Apx com suporte a espaços de usuário de várias distribuições Linux',
      'Aplicativos Flatpak separados do sistema anfitrião',
      'Opções integradas de imagens NVIDIA',
    ],
    cautions: [
      'Apx, VSO e ABRoot introduzem um fluxo de trabalho pouco convencional; reserve pelo menos 50 GB de espaço em disco.',
      'Um projeto pequeno com uma grande revisão recém-lançada tem suporte menos consolidado que Fedora ou Ubuntu.',
      'O Reunion altera os fluxos dos subsistemas; atualizações a partir de configurações antigas exigem atenção.',
      'As imagens NVIDIA usam módulos não assinados; é preciso verificar o Secure Boot e a geração da GPU.',
    ],
    idealFor: [
      'Quem tem curiosidade por ambientes imutáveis e disposição para aprender',
      'Desenvolvedores que usam vários ambientes Linux',
      'Quem quer separar os ambientes dos aplicativos do sistema anfitrião',
    ],
    assessmentBasis:
      'Ambiente GNOME do Vanilla OS 3 Reunion, lançado em agosto de 2026; sistema anfitrião OCI híbrido derivado do Debian, com ABRoot, Apx v3, ambiente VSO baseado no Debian testing e aplicativos Flatpak. Imagens atualizadas continuamente, com grandes revisões nomeadas, são modeladas como atualização contínua, não como Ubuntu LTS. Incluído com cautela pelo ecossistema pequeno e pelas mudanças recentes no fluxo de trabalho.',
  },
  'rhino-linux': {
    name: 'Rhino Linux',
    archetype: {
      name: 'O Desbravador',
      description:
        'O Desbravador percorre o território familiar do Ubuntu sem esperar pela próxima sinalização. O Rhino Linux combina com quem quer um fluxo contínuo de software atual, mantendo a cultura de pacotes e as bases do mundo Ubuntu.',
    },
    summary:
      'Um ambiente de atualização contínua da família Ubuntu, que combina pacotes atuais com ferramentas Pacstall e uma experiência leve com escolhas próprias.',
    strengths: [
      'Base de pacotes da versão de desenvolvimento do Ubuntu com atualizações contínuas',
      'Kernels e software de desenvolvimento muito atuais',
      'Pacotes da comunidade Pacstall e integração com Rhino PKG',
      'Ambiente Unicorn leve e personalizável, baseado no Xfce',
    ],
    cautions: [
      'Pacotes de desenvolvimento do Ubuntu e atualizações contínuas podem causar falhas que exigem correções manuais.',
      'Projeto e comunidade de suporte menores que os do Ubuntu padrão.',
      'Pacotes da comunidade Pacstall exigem avaliação independente; nem todos são mantidos pelo Ubuntu.',
      'Kernels não assinados afetam a configuração do Secure Boot; as versões dos drivers NVIDIA precisam ser verificadas.',
    ],
    idealFor: [
      'Usuários experientes de Ubuntu que querem software de atualização contínua',
      'Desenvolvedores que querem conjuntos de ferramentas atuais',
      'Quem lida bem com a manutenção do ambiente e prefere sistemas da família Debian ao Arch',
    ],
    assessmentBasis:
      'Snapshot do Rhino Linux 2026.1 com ambiente Unicorn: base mutável Ubuntu devel, Xfce, Pacstall e Rhino PKG (RPK2), com configuração guiada de NVIDIA. Ambientes UBXI, como Lomiri, são escolhas separadas. Incluído com cautela; a correção emergencial do Pacstall em fevereiro de 2026 ilustra um risco real de manutenção.',
  },
  slackware: {
    name: 'Slackware',
    archetype: {
      name: 'O Tradicionalista',
      description:
        'O Tradicionalista preserva as convenções do Unix e entende cada mudança. O Slackware combina com quem tem confiança técnica e valoriza a continuidade, o software dos projetos de origem e a administração manual como parte de conhecer o próprio sistema.',
    },
    summary:
      'Uma distribuição independente de longa trajetória, que prioriza versões conservadoras e administração direta e tradicional.',
    strengths: [
      'Filosofia conservadora de lançamentos',
      'Configuração direta por texto',
      'Poucas alterações no software dos projetos de origem',
      'Fluxos consolidados no estilo Unix',
    ],
    cautions: [
      'As ferramentas oficiais de pacotes deixam a resolução de dependências por sua conta.',
      'O software da versão estável pode ser consideravelmente mais antigo.',
      'Ambientes modernos e fluxos com software de fornecedores exigem mais trabalho manual.',
    ],
    idealFor: [
      'Usuários experientes com orientação Unix',
      'Quem prefere administração manual',
      'Quem valoriza convenções de sistema duradouras',
    ],
    assessmentBasis:
      'Slackware estável com Xfce; a versão de desenvolvimento está fora deste perfil.',
  },
} satisfies DistroDictionary;
