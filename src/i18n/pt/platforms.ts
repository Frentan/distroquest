import { message } from '../message.ts';
import type { Messages } from '../catalog.ts';

// Unpublished batch 3 draft. Platform claims follow the dated English source.
export const platformCopyPt = {
  title: 'OPÇÕES PARA SEU HARDWARE',
  preferencePath: 'AFINIDADE COM SUAS PREFERÊNCIAS',
  preferenceTop:
    'Afinidade com suas preferências; é necessário verificar a compatibilidade antes da instalação',
  asahiName: message(
    'Fedora Asahi Remix {edition}',
    [
      {
        name: 'edition',
        kind: 'choice',
        values: { kde: 'KDE', gnome: 'GNOME' },
      },
    ],
    'pt',
  ),
  asahiSummary:
    'O caminho do Fedora para Apple Silicon, com o suporte de hardware do projeto Asahi.',
  baseMatch: message(
    'A afinidade é baseada em {name}. O suporte ao hardware e os aplicativos disponíveis podem ser diferentes neste Mac.',
    [{ name: 'name', kind: 'text' }],
    'pt',
  ),
  originalWinner: message(
    'Suas respostas levam a {name}. Seu hardware restringe as opções de instalação abaixo.',
    [{ name: 'name', kind: 'text' }],
    'pt',
  ),
  originalFit: message(
    'Suas respostas levam a {name}. As opções de instalação para T2 com manutenção ativa aparecem primeiro abaixo.',
    [{ name: 'name', kind: 'text' }],
    'pt',
  ),
  sameFit:
    'A distribuição recomendada tem um método de instalação documentado para esta plataforma.',
  asahiInstall:
    'Use o instalador do Fedora Asahi Remix para o modelo exato do seu Mac.',
  asahiIntro:
    'Instale pelo Fedora Asahi Remix, não por um instalador comum para PC. O KDE é o ambiente principal; o GNOME também está disponível.',
  alternatives: 'Outras opções práticas',
  preferenceAlternatives: 'Outras opções que combinam com suas preferências',
  preferenceOnly:
    'Estas opções combinam com suas preferências; o suporte à instalação nativa neste Mac ainda não foi verificado.',
  edition: 'Outro ambiente Fedora Asahi',
  install: 'Explore a opção de instalação',
  supportGuide: 'Verifique o suporte ao seu modelo',
  identifyChip: 'Identifique seu chip da Apple',
  identifyT2: 'Verifique se seu Mac tem T2',
  effort: {
    guided:
      'Use o instalador T2 ou o módulo de plataforma com manutenção ativa desta distribuição.',
    manual: 'Há uma opção documentada para T2, com mais configuração manual.',
    standard:
      'Use a imagem x86_64 adequada; verifique primeiro o hardware exato.',
    unverified:
      'O suporte à instalação nativa nesta plataforma ainda não foi verificado.',
  },
  standardInstallation: 'Opção padrão de instalação',
  notes: {
    'x86-standard':
      'Siga a opção padrão de instalação para PC. Verifique seu hardware exato e os requisitos de drivers antes de instalar.',
    'intel-mac':
      'Mac com Intel sem T2: as recomendações seguem a classificação normal para x86_64. O funcionamento do Wi-Fi, dos gráficos, do trackpad e da inicialização varia conforme o modelo.',
    'intel-mac-t2':
      'Macs com T2 precisam de suporte especial para dispositivos internos. As opções de instalação com manutenção ativa aparecem primeiro; as opções manuais documentadas continuam disponíveis. Verifique as limitações específicas do modelo antes de instalar.',
    'intel-mac-unknown-t2':
      'Verifique se seu Mac com Intel tem T2 antes de escolher um instalador. Estas opções combinam com suas preferências; o suporte à instalação ainda não foi confirmado.',
    'apple-silicon-m1-m2':
      'Macs M1/M2 têm uma opção documentada de instalação do Fedora Asahi Remix. Verifique o modelo exato e os recursos de que você precisa antes de instalar.',
    'apple-silicon-m3':
      'O suporte ao M3 ainda é experimental, com recursos importantes em desenvolvimento. Este questionário não pode confirmar uma opção de instalação nativa para uso diário. Consulte primeiro a tabela atual de suporte do Asahi.',
    'apple-silicon-m4-plus':
      'Este questionário não tem uma opção verificada de instalação nativa para Macs M4 ou mais recentes. A tabela atual de suporte ao M4 não lista um instalador; chips mais novos precisam de sua própria verificação de suporte. A afinidade com suas preferências continua útil para explorar alternativas.',
    'apple-silicon-unknown':
      'Identifique primeiro seu chip da Apple; o suporte varia bastante entre gerações. Afinidade com suas preferências não comprova compatibilidade.',
    unknown:
      'Sua plataforma não foi confirmada. Estes resultados mostram afinidade com suas preferências; verifique a arquitetura da CPU, os gráficos e o suporte à instalação antes de escolher uma imagem.',
  },
} satisfies Messages['platform'];
