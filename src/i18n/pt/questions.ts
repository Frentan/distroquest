import type { QuestionDictionary } from '../../domain/preferences.ts';

// Unpublished batch 1 draft for human review.
export const questionContentPt = {
  experience: {
    prompt: 'Qual é a sua experiência com Linux?',
    options: {
      new: { label: 'Nunca usei. Vamos com calma.' },
      tried: { label: 'Já experimentei Linux algumas vezes.' },
      regular: { label: 'Uso Linux regularmente com tranquilidade.' },
      terminal: { label: 'Sei usar o terminal e configurar o sistema.' },
      init: { label: 'Tenho opiniões sobre sistemas de inicialização.' },
    },
  },
  setup: {
    prompt: 'O que deve acontecer depois da instalação?',
    options: {
      ready: { label: 'O ideal? Começar a usar o computador.' },
      little: { label: 'Tudo bem configurar um pouco.' },
      configure: { label: 'Gosto de configurar as coisas.' },
      build: { label: 'Montar o sistema é metade da diversão.' },
    },
  },
  freshness: {
    prompt: 'Você prefere software mais consolidado ou mais recente?',
    options: {
      proven: { label: 'Quero algo testado e sem graça.' },
      balanced: { label: 'Recente o suficiente, mas confiável.' },
      modern: {
        label: 'Gosto de kernels, drivers e ambientes de trabalho modernos.',
      },
      newest: { label: 'Quero o que há de mais novo; eu cuido do resto.' },
    },
  },
  maintenance: {
    prompt: 'Quanto de manutenção você aceita?',
    options: {
      minimal: {
        label: 'Muito pouco. As atualizações devem acontecer sem incidentes.',
      },
      occasional: {
        label:
          'Tudo bem fazer uma limpeza ou resolver problemas de vez em quando.',
      },
      sometimes: {
        label:
          'Me sinto à vontade para fazer manutenção regular e resolver problemas por conta própria.',
      },
      hobby: { label: 'Quebrar e consertar as coisas faz parte do hobby.' },
    },
  },
  control: {
    prompt: 'Quanto controle você quer sobre o próprio sistema?',
    helper:
      'Pense nos componentes e na configuração do sistema. A aparência da área de trabalho tem uma pergunta só para ela.',
    options: {
      drive: { label: 'Quero principalmente usar o sistema.' },
      understand: { label: 'Gosto de saber o que acontece por baixo.' },
      components: {
        label: 'Quero escolher os principais componentes do sistema.',
      },
      everything: { label: 'Quero controle até o último detalhe.' },
    },
  },
  customization: {
    prompt: 'E quanto você gosta de personalizar o ambiente de trabalho?',
    options: {
      defaults: {
        label:
          'Quero uma configuração inicial bem-acabada, sem precisar mexer.',
      },
      touches: { label: 'Alguns toques pessoais.' },
      familiar: {
        label: 'Painéis e menus familiares, com bastante coisa para ajustar.',
      },
      workflow: {
        label: 'Gosto de reorganizar fluxos de trabalho, painéis e atalhos.',
      },
      castle: {
        label: 'Em 48 horas, ninguém vai reconhecer minha área de trabalho.',
      },
    },
  },
  release: {
    prompt: 'O que você acha das atualizações contínuas?',
    helper:
      'Atualizações contínuas trazem novas versões ao longo do tempo, em vez de grandes lançamentos do sistema operacional. As duas abordagens recebem atualizações.',
    options: {
      fixed: {
        label: 'Não, obrigado. Quero versões bem definidas e estáveis.',
      },
      either: { label: 'Qualquer uma das duas opções serve.' },
      appealing: { label: 'Atualizações contínuas parecem interessantes.' },
      rolling: { label: 'Com certeza. Que tudo se mantenha em movimento.' },
    },
  },
  'system-model': {
    prompt:
      'Como você prefere gerenciar o sistema de base para seus aplicativos?',
    helper:
      'Sistemas atômicos atualizam a base como uma unidade, muitas vezes com a opção de voltar a um estado anterior. Aplicativos e ferramentas costumam ficar separados, usando Flatpak ou contêineres. Modificar a base funciona de forma diferente de um sistema tradicional com gerenciamento de pacotes.',
    options: {
      traditional: {
        label:
          'Quero um sistema tradicional que eu possa modificar diretamente.',
      },
      either: { label: 'Sem preferência.' },
      protected: {
        label:
          'Uma base atômica parece interessante; posso aprender como funciona.',
      },
      containers: {
        label: 'Quero a abordagem atômica, centrada em contêineres.',
      },
    },
  },
  'use-cases': {
    prompt: 'Para que você vai usar este computador principalmente?',
    helper:
      'Alguns planos orientam a afinidade; outros ajudam a preparar seu kit. Os jogos têm uma pergunta só para eles.',
    options: {
      everyday: {
        label: 'Navegar, trabalhar com documentos e uso cotidiano.',
      },
      development: { label: 'Programação e desenvolvimento.' },
      gaming: { label: 'Jogos.' },
      creative: { label: 'Trabalho criativo e mídia.' },
      learning: { label: 'Aprender Linux.' },
      security: { label: 'Cibersegurança e testes de intrusão.' },
      homelab: { label: 'Servidores, contêineres e laboratório em casa.' },
      'old-hardware': { label: 'Manter hardware antigo em uso.' },
    },
  },
  gaming: {
    prompt: 'Qual é a importância dos jogos?',
    options: {
      none: { label: 'Não são relevantes.' },
      occasional: { label: 'De vez em quando.' },
      important: { label: 'São importantes.' },
      main: { label: 'Um dos principais motivos para estar aqui.' },
    },
  },
  hardware: {
    prompt: 'Que tipo de hardware você usa?',
    helper:
      'Pense na potência e na memória disponíveis, não apenas na idade do computador.',
    options: {
      powerful: { label: 'Moderno e potente.' },
      recent: { label: 'Um notebook ou computador de mesa comum e recente.' },
      aging: { label: 'Já tem seus anos, mas ainda dá conta.' },
      limited: { label: 'Este computador é do tempo da internet discada.' },
      handheld: { label: 'Um PC portátil para jogos.' },
    },
  },
  gpu: {
    prompt: 'Qual hardware gráfico ou tipo de Mac você usa?',
    helper:
      'No Mac, escolha o tipo de Mac. Em outro computador, escolha o hardware gráfico que você usa nas tarefas mais exigentes.',
    options: {
      nvidia: { label: 'NVIDIA' },
      'open-driver': { label: 'Gráficos AMD ou Intel' },
      'apple-silicon': { label: 'Mac com Apple Silicon' },
      'intel-mac': { label: 'Mac com Intel' },
      unknown: { label: 'Não faço a menor ideia.' },
    },
  },
  'software-freedom': {
    prompt: 'Quanto você se importa com software livre e de código aberto?',
    options: {
      pragmatic: { label: 'Tanto faz.' },
      prefer: { label: 'Prefiro código aberto quando é viável.' },
      important: { label: 'É muito importante para mim.' },
      strong: {
        label: 'Quero priorizar o software livre ao máximo, por favor.',
      },
    },
  },
  troubleshooting: {
    prompt: 'Quando algo para de funcionar, qual é sua primeira reação?',
    options: {
      distress: { label: 'Por que o computador faz isso comigo?' },
      search: { label: 'Pesquisar o erro e seguir as instruções.' },
      investigate: { label: 'Abrir o terminal e investigar.' },
      learn: { label: 'Excelente. Uma oportunidade de aprendizado.' },
    },
  },
  identity: {
    prompt: 'Qual frase mais combina com você?',
    options: {
      background: { label: 'Quero que o Linux funcione sem chamar atenção.' },
      dependable: { label: 'Quero algo moderno e confiável.' },
      shape: { label: 'Quero um sistema que eu possa adaptar ao meu jeito.' },
      understand: { label: 'Quero entender como tudo funciona.' },
      declarative: {
        label:
          'Quero uma receita de configuração que possa reconstruir todo o meu sistema.',
      },
      minimal: { label: 'Quero um sistema pequeno, só com o necessário.' },
      unix: {
        label: 'Gosto do jeito tradicional do Unix e de fazer as coisas à mão.',
      },
    },
  },
  path: {
    prompt: 'Escolha seu caminho',
    helper: 'O caminho se divide mais adiante. Por onde você segue?',
    options: {
      comfortable: {
        label: 'O Caminho Confortável',
        description: 'Confiável, acolhedor e fácil de usar no dia a dia.',
      },
      modern: {
        label: 'O Caminho Moderno',
        description: 'Tecnologia recente sem complicações desnecessárias.',
      },
      artisan: {
        label: 'O Caminho do Artesão',
        description: 'Faça o sistema ser seu de verdade.',
      },
      explorer: {
        label: 'O Caminho do Explorador',
        description: 'Aprenda, experimente e aceite algumas surpresas.',
      },
      forbidden: {
        label: 'O Caminho Proibido',
        description: 'Controle máximo. Aceito as consequências.',
      },
    },
  },
} satisfies QuestionDictionary;
