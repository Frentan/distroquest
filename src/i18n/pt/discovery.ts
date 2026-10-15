import { message } from '../message.ts';

export const discoveryPt = {
  directoryLink: 'Explore as distribuições',
  directoryTitle: 'Distribuições Linux | DistroQuest',
  directoryHeading: 'Conheça as distribuições',
  directoryDescription:
    'Explore 29 distribuições Linux: pontos fortes, limitações, perfis de uso e edições avaliadas. Encontre seu ponto de partida com o DistroQuest.',
  directoryIntroduction:
    'Explore as distribuições do questionário. Estes resumos descrevem as edições avaliadas; não são recomendações personalizadas.',
  suitable: 'Para quem pode ser uma boa escolha',
  strengths: 'Pontos fortes',
  cautions: 'Limitações',
  considerations: 'Edição e considerações técnicas',
  official: 'Site oficial',
  back: 'Todas as distribuições',
  quizHeading: 'Encontre seu ponto de partida',
  quizIntroduction:
    'Responda a algumas perguntas sobre seus hábitos, seu hardware e sua disposição para experimentar.',
  quizLink: 'Comece sua aventura',
  profileTitle: message(
    '{name}: pontos fortes e limitações | DistroQuest',
    [{ name: 'name', kind: 'text' }],
    'pt',
  ),
  profileLink: message('Sobre {name}', [{ name: 'name', kind: 'text' }], 'pt'),
  support: 'Apoie o projeto',
  shareAlt: 'O escudo e terminal do DistroQuest sobre um fundo verde-escuro.',
  compatibilityNote:
    'A compatibilidade com o hardware depende do dispositivo e da edição. O questionário avalia as opções de instalação separadamente da afinidade com suas preferências.',
};
