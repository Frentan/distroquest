import { message } from '../message.ts';
import type { Messages } from '../catalog.ts';

export const quizCopyPt = {
  title: 'Encontre seu caminho | DistroQuest',
  description:
    'Um questionário curto e privado sobre Linux. Encontre uma distribuição que combine com seus hábitos, hardware e vontade de experimentar.',
  eyebrow: 'SUA AVENTURA',
  progress: message(
    'Pergunta {current} de {total}',
    [
      { name: 'current', kind: 'number' },
      { name: 'total', kind: 'number' },
    ],
    'pt',
  ),
  progressLabel: 'Respostas enviadas',
  submitted: message(
    '{count} de {total} enviadas',
    [
      { name: 'count', kind: 'number' },
      { name: 'total', kind: 'number' },
    ],
    'pt',
  ),
  macStep: 'Inclui uma pergunta sobre o hardware do Mac.',
  selectionCount: message(
    '{count} de {max} selecionadas',
    [
      { name: 'count', kind: 'number' },
      { name: 'max', kind: 'number' },
    ],
    'pt',
  ),
  selectionLimit:
    'Limite atingido. Desmarque uma resposta para escolher outra.',
  relevantStats: 'Capacidades para suas prioridades',
  statsNote:
    'Notas de capacidade em uma escala de 5 pontos; não são notas de afinidade nem de suporte ao hardware.',
  comparedWith: message(
    'Em comparação com {name}',
    [{ name: 'name', kind: 'text' }],
    'pt',
  ),
  capabilityComparison: message(
    '{label}: {value}/5, em comparação com {primary}/5 de {name}',
    [
      { name: 'label', kind: 'text' },
      { name: 'value', kind: 'number' },
      { name: 'primary', kind: 'number' },
      { name: 'name', kind: 'text' },
    ],
    'pt',
  ),
  workflow: {
    'conventional-desktop': 'Ambiente de trabalho tradicional',
    'atomic-desktop': 'Ambiente de trabalho atômico',
    'gaming-appliance': 'Sistema dedicado a jogos',
    'declarative-system': 'Sistema declarativo',
  },
  release: { fixed: 'Versões fixas', rolling: 'Atualizações contínuas' },
  singleHint: 'Escolha uma opção.',
  finalHint: 'Escolha uma opção para descobrir seu caminho.',
  multipleHint: message(
    'Escolha de 1 a {max}.',
    [{ name: 'max', kind: 'number' }],
    'pt',
  ),
  back: 'Voltar',
  next: 'Continuar',
  retry: 'Tentar novamente',
  finish: 'Descobrir meu caminho',
  match: message(
    '{percentage}% de afinidade com suas preferências',
    [{ name: 'percentage', kind: 'number', digits: 1 }],
    'pt',
  ),
  matchNote: 'O suporte ao hardware é verificado separadamente.',
  fitContext:
    'Os percentuais de afinidade são estimativas do modelo, não probabilidades. Diferenças muito pequenas indicam opções com afinidade semelhante.',
  restart: 'Reiniciar a aventura',
  restartPrompt: 'Começar de novo? Suas respostas atuais serão apagadas.',
  confirmRestart: 'Começar de novo',
  cancel: 'Manter minhas respostas',
  retake: 'Refazer a aventura',
  revise: 'Alterar respostas',
  noScript:
    'Esta aventura precisa de JavaScript para manter suas respostas e calcular o resultado no navegador. Ative-o e recarregue a página para começar.',
  error:
    'Não foi possível descobrir seu caminho. Suas respostas continuam aqui. Tente novamente ou volte para revisá-las.',
  path: 'SEU CAMINHO',
  stats: 'Perfil completo de capacidades',
  installationGuidance: 'Orientações de instalação',
  variantStatsNote:
    'Capacidades da base Fedora em uma escala de 5 pontos; o Asahi não tem uma avaliação separada.',
  statScore: message('{value}/5', [{ name: 'value', kind: 'number' }], 'pt'),
  statValue: message('{value} de 5', [{ name: 'value', kind: 'number' }], 'pt'),
  preparation: 'Prepare seu kit para as próximas aventuras',
  why: 'Por que combina com você',
  tradeoffs: 'Antes de seguir caminho',
  edition: 'Outro caminho oficial nesta família',
  alternatives: 'Outros caminhos para explorar',
  sameFamily:
    'Da mesma família da sua recomendação principal, com um caminho diferente.',
  alternativeDetails: 'Vantagens e limitações',
  resultFallback:
    'Um caminho que vale a pena explorar com base nas suas respostas. Considere suas vantagens e limitações antes de partir.',
} satisfies Messages['quiz'];

export const capabilityLabelsPt = {
  beginnerFriendly: 'Orientação para iniciantes',
  lowMaintenance: 'Pouca manutenção',
  stability: 'Previsibilidade',
  freshness: 'Atualidade do software',
  customization: 'Personalização',
  systemControl: 'Controle do sistema',
  gaming: 'Preparação para jogos',
  developerExperience: 'Ferramentas de desenvolvimento',
  oldHardware: 'Hardware antigo',
  desktopPolish: 'Acabamento do ambiente de trabalho',
} satisfies Messages['capabilityLabels'];

// Unpublished batch 3 draft; the security-testing sample is already reviewed.
export const preparationCopyPt = {
  'general-desktop':
    'Kit para o dia a dia: teste seu navegador, documentos de escritório, chamadas e impressora em uma sessão sem instalar o sistema.',
  creative:
    'Kit criativo: verifique seus aplicativos essenciais, plugins, formatos de mídia e periféricos antes de transferir seus projetos.',
  gaming:
    'Kit de jogos: verifique o suporte aos seus jogos, os requisitos dos sistemas antitrapaça e os controles antes de instalar.',
  development:
    'Kit de desenvolvimento: prepare as ferramentas das suas linguagens de programação, o editor e as dependências dos seus projetos.',
  homelab:
    'Kit para seu laboratório em casa: faça um teste dos contêineres, serviços e do processo de backup.',
  'technical-learning':
    'Kit para aprender: prepare um pendrive com um sistema que possa usar sem instalar ou uma máquina virtual para seus experimentos.',
  'security-testing':
    'Kit de segurança: use um laboratório de prática isolado e autorizado para suas ferramentas.',
  'old-hardware':
    'Kit de resgate: teste o ambiente em modo live sem instalação no computador antigo antes da próxima aventura.',
} satisfies Messages['preparationCopy'];
