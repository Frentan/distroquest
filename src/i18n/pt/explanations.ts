import type { Messages } from '../catalog.ts';

// Unpublished batch 3 draft for human review.
export const explanationsPt = {
  capability: {
    beginnerFriendly: {
      reason: 'A orientação para iniciantes oferece a ajuda que você procura.',
      caution: 'Você pode precisar aprender mais na prática do que gostaria.',
    },
    lowMaintenance: {
      reason: 'A manutenção cabe no tempo que você quer dedicar a ajustes.',
      caution:
        'A manutenção de rotina pode levar mais tempo do que você planejou.',
    },
    stability: {
      reason:
        'A previsibilidade do software oferece a estabilidade que você procura.',
      caution: 'Espere menos previsibilidade do software do que você gostaria.',
    },
    freshness: {
      reason: 'O nível de atualização do software combina com sua preferência.',
      caution: 'O nível de atualização do software difere da sua preferência.',
    },
    customization: {
      reason:
        'As opções de personalização permitem fazer as mudanças que você planeja para o ambiente de trabalho.',
      caution:
        'A personalização que você procura pode exigir mais trabalho aqui.',
    },
    systemControl: {
      reason:
        'O controle do sistema oferece a liberdade para fazer os ajustes que você quer.',
      caution:
        'Oferece menos controle direto sobre o sistema do que você prefere.',
    },
    gaming: {
      reason:
        'A preparação para jogos combina com a importância que eles têm para você.',
      caution:
        'Preparar o sistema para jogar pode exigir mais trabalho aqui. Verifique o suporte aos seus jogos e hardware.',
    },
    developerExperience: {
      reason:
        'As ferramentas e o ecossistema de software oferecem um bom ponto de partida para seus projetos técnicos.',
      caution:
        'Seu fluxo de desenvolvimento pode precisar de configuração adicional.',
    },
    oldHardware: {
      reason:
        'O consumo de recursos deixa uma boa margem para o seu computador funcionar com folga.',
      caution:
        'O consumo de recursos pode deixar seu computador com menos folga do que você gostaria.',
    },
    desktopPolish: {
      reason:
        'O acabamento do ambiente atende às suas expectativas de uma configuração pronta para usar.',
      caution:
        'Talvez seja preciso fazer mais ajustes no ambiente de trabalho do que você gostaria.',
    },
  },
  near: {
    beginnerFriendly:
      'A orientação para iniciantes oferece quase toda a ajuda que você procura.',
    lowMaintenance:
      'A manutenção de rotina exige um pouco mais de tempo do que você quer dedicar a ajustes.',
    stability: 'A previsibilidade do software se aproxima do que você procura.',
    freshness:
      'O nível de atualização do software se aproxima do que você prefere.',
    customization:
      'As opções de personalização oferecem quase toda a liberdade que você procura.',
    systemControl:
      'O controle do sistema oferece um pouco menos de liberdade para ajustes do que você gostaria.',
    gaming: 'A preparação para jogos se aproxima do nível que você procura.',
    developerExperience:
      'As ferramentas de desenvolvimento cobrem quase tudo o que você procura para começar.',
    oldHardware:
      'O consumo de recursos deixa um pouco menos de margem do que você gostaria para o computador.',
    desktopPolish:
      'O acabamento do ambiente atende a quase todas as suas expectativas.',
  },
  reasons: {
    'release.match':
      'O modelo de versões fixas ou atualizações contínuas combina com sua preferência.',
    'atomic.match':
      'O modelo de atualização do sistema de base combina com sua preferência.',
    'containers.transactional':
      'Um sistema anfitrião protegido com atualizações transacionais combina com seu interesse em contêineres.',
    'containers.image-based':
      'Um fluxo de trabalho baseado em imagens combina com seu interesse em contêineres.',
    'focus.gaming':
      'O foco em jogos coloca suas partidas no centro da aventura.',
    'creative.documented-integration':
      'Os recursos documentados de configuração para trabalho criativo ajudam nos seus projetos.',
    'focus.development':
      'O foco em desenvolvimento coloca a programação no centro do ambiente.',
    'focus.security':
      'O foco em ferramentas de segurança combina com os testes que você escolheu.',
    'specialist.security-testing':
      'A especialização combina com os testes de segurança que você escolheu.',
    'specialist.handheld-gaming':
      'Uma opção documentada para jogar em PCs portáteis combina com seus planos de jogos.',
    'specialist.minimalist-self-build':
      'A abordagem minimalista combina com seus planos de montar e configurar seu próprio sistema.',
    'specialist.traditional-unix':
      'O estilo de administração tradicional combina com o caminho Unix que você escolheu.',
    'specialist.container-development':
      'As ferramentas de desenvolvimento com contêineres combinam com o fluxo de trabalho que você escolheu.',
    'nvidia.integrated':
      'As facilidades de configuração para NVIDIA combinam com sua escolha de hardware gráfico.',
    'software-policy.free-software-first':
      'A política de priorizar software livre combina com sua preferência.',
    'focus.minimalism':
      'A abordagem minimalista mantém o sistema enxuto, como você procura.',
    'workflow.declarative':
      'O modelo declarativo combina com seus planos de construir o sistema a partir da configuração.',
    'desktop-layout.match':
      'Os painéis e menus combinam com sua preferência por uma organização familiar.',
    'handheld.documented-support':
      'Uma opção documentada para jogar em PCs portáteis combina com o dispositivo que você escolheu.',
  },
  cautions: {
    'focus.gaming-mismatch':
      'O foco em jogos combina menos com seus planos de jogar pouco.',
    'release.conflict':
      'O modelo de versões fixas ou atualizações contínuas difere da sua preferência.',
    'atomic.conflict':
      'O modelo de atualização do sistema de base difere da sua preferência.',
    'containers.other-model':
      'O fluxo de trabalho é menos centrado em ferramentas baseadas em imagens e contêineres.',
    'nvidia.manual': 'Os drivers NVIDIA podem exigir configuração manual.',
    'software-policy.pragmatic':
      'A política pragmática de software pode incluir componentes proprietários.',
    'handheld.check-device-compatibility':
      'Verifique o modelo exato do PC portátil para jogos, a imagem de instalação e os recursos suportados antes de instalar.',
    'handheld.support-unassessed':
      'O suporte a PCs portáteis para jogos não foi avaliado para esta distribuição.',
    constraint:
      'Este caminho exige mais experiência ou interesse especializado do que suas respostas indicam. Considere o aprendizado e a manutenção necessários.',
  },
} satisfies Messages['explanations'];
