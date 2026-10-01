import type { QuestionDictionary } from '../../domain/preferences.ts';

export const questionContentEn: QuestionDictionary = {
  experience: {
    prompt: 'How deep into Linux are you already?',
    options: {
      new: { label: 'Never used it. Be gentle.' },
      tried: { label: 'I’ve tried Linux a few times.' },
      regular: { label: 'I’m comfortable using Linux regularly.' },
      terminal: {
        label: 'I know my way around the terminal and system config.',
      },
      init: { label: 'I have opinions about init systems.' },
    },
  },
  setup: {
    prompt: 'What should happen after installation?',
    options: {
      ready: { label: 'Ideally? I start using my computer.' },
      little: { label: 'A little setup is fine.' },
      configure: { label: 'I enjoy configuring things.' },
      build: { label: 'Half the fun is building the system.' },
    },
  },
  freshness: {
    prompt: 'How fresh do you like your software?',
    options: {
      proven: { label: 'Give me proven and boring.' },
      balanced: { label: 'Recent enough, but dependable.' },
      modern: { label: 'I like modern kernels, drivers, and desktops.' },
      newest: { label: 'Give me the newest stuff and let me deal with it.' },
    },
  },
  maintenance: {
    prompt: 'How much maintenance are you willing to tolerate?',
    options: {
      minimal: { label: 'Very little. Updates should be uneventful.' },
      occasional: { label: 'Occasional cleanup or troubleshooting is fine.' },
      sometimes: { label: 'I don’t mind fixing things sometimes.' },
      hobby: { label: 'Breaking and repairing things is part of the hobby.' },
    },
  },
  control: {
    prompt: 'How much control do you want over the system itself?',
    helper:
      'Think system components and configuration. Desktop decorations get their own question.',
    options: {
      drive: { label: 'I mostly want to drive it.' },
      understand: { label: 'I like knowing what’s happening underneath.' },
      components: { label: 'I want to choose major system components myself.' },
      everything: { label: 'I want control all the way down.' },
    },
  },
  customization: {
    prompt: 'And how much do you like customizing the desktop?',
    options: {
      defaults: { label: 'Give me a polished default and leave it alone.' },
      touches: { label: 'A few personal touches.' },
      workflow: {
        label: 'I like rearranging workflows, panels, and shortcuts.',
      },
      castle: {
        label: 'My desktop will become unrecognizable within 48 hours.',
      },
    },
  },
  release: {
    prompt: 'How do you feel about rolling releases?',
    helper:
      'Rolling means continuous version upgrades instead of big OS releases. Both approaches get updates.',
    options: {
      fixed: { label: 'No thanks. Give me clear, stable releases.' },
      either: { label: 'Either is fine.' },
      appealing: { label: 'Rolling sounds appealing.' },
      rolling: { label: 'Absolutely. Keep everything moving.' },
    },
  },
  'system-model': {
    prompt:
      'Would you like a protected base with a different way to change it?',
    helper:
      'Atomic systems update the core OS as an image or generation, often with rollback. Apps and containers can live around it.',
    options: {
      traditional: {
        label: 'I want a traditional system I can modify directly.',
      },
      either: { label: 'No preference.' },
      protected: { label: 'A protected base sounds appealing.' },
      containers: { label: 'Give me the atomic, container-first approach.' },
    },
  },
  'use-cases': {
    prompt: 'What will this machine mostly do?',
    helper: 'Pick up to three. Your sidequests count too.',
    options: {
      everyday: { label: 'Browsing, office, and everyday life' },
      development: { label: 'Programming and development' },
      gaming: { label: 'Gaming' },
      creative: { label: 'Creative work and media' },
      learning: { label: 'Learning Linux' },
      security: { label: 'Cybersecurity and pentesting' },
      homelab: { label: 'Servers, containers, and homelab' },
      'old-hardware': { label: 'Keeping old hardware alive' },
    },
  },
  gaming: {
    prompt: 'How important is gaming?',
    options: {
      none: { label: 'Not relevant.' },
      occasional: { label: 'Occasionally.' },
      important: { label: 'Important.' },
      main: { label: 'One of the main reasons I’m here.' },
    },
  },
  hardware: {
    prompt: 'What kind of hardware are we dealing with?',
    helper:
      'Think available power and memory, not just the birthday on the box.',
    options: {
      powerful: { label: 'Modern and powerful.' },
      recent: { label: 'A normal recent laptop or desktop.' },
      aging: { label: 'Getting old, but still respectable.' },
      limited: { label: 'This machine remembers dial-up.' },
    },
  },
  gpu: {
    prompt: 'What GPU do you have?',
    helper:
      'GPU means graphics hardware. If you have two, choose the one you want to use for demanding tasks.',
    options: {
      nvidia: { label: 'NVIDIA' },
      amd: { label: 'AMD' },
      intel: { label: 'Intel graphics' },
      other: { label: 'Apple or other graphics hardware' },
      unknown: { label: 'I have absolutely no idea.' },
    },
  },
  'software-freedom': {
    prompt: 'How much does free and open-source software matter to you?',
    options: {
      pragmatic: { label: 'Whatever works.' },
      prefer: { label: 'I prefer open source when practical.' },
      important: { label: 'It matters quite a lot.' },
      strong: { label: 'As free-software-oriented as possible, please.' },
    },
  },
  troubleshooting: {
    prompt: 'When something breaks, what’s your instinct?',
    options: {
      distress: { label: 'Why is the computer doing this to me?' },
      search: { label: 'Search the error and follow instructions.' },
      investigate: { label: 'Open the terminal and investigate.' },
      learn: { label: 'Excellent. A learning opportunity.' },
    },
  },
  identity: {
    prompt: 'Which sentence sounds most like you?',
    options: {
      background: { label: 'I want Linux to disappear into the background.' },
      dependable: { label: 'I want something modern and dependable.' },
      shape: { label: 'I want a system I can shape around myself.' },
      understand: { label: 'I want to understand how the whole thing works.' },
      declarative: {
        label: 'I want a config recipe that can rebuild my whole system.',
      },
      minimal: { label: 'I want a small system with only what I need.' },
      unix: { label: 'I like traditional Unix ways and doing things by hand.' },
    },
  },
  path: {
    prompt: 'Choose your path.',
    helper: 'The road splits ahead. Which way do you go?',
    options: {
      comfortable: {
        label: 'The comfortable road',
        description: 'Reliable, friendly, easy to live with.',
      },
      modern: {
        label: 'The modern road',
        description: 'Fresh technology without unnecessary drama.',
      },
      artisan: {
        label: 'The artisan’s road',
        description: 'Make the system truly yours.',
      },
      explorer: {
        label: 'The explorer’s road',
        description: 'Learn, experiment, and accept a few surprises.',
      },
      forbidden: {
        label: 'The forbidden road',
        description: 'Maximum control. I accept the consequences.',
      },
    },
  },
};
