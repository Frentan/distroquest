import type { DistroDictionary } from '../../domain/distro.ts';

export const distroContentEn = {
  'linux-mint': {
    name: 'Linux Mint',
    archetype: {
      name: 'The Pragmatist',
      description:
        'The Pragmatist chooses a familiar desktop and sensible defaults, keeping the path from installation to useful work short. Linux Mint rewards people who would rather use their computer than make its upkeep a hobby.',
    },
    summary:
      'A welcoming Ubuntu-based desktop with conservative updates and practical graphical tools.',
    strengths: [
      'Familiar desktop layout',
      'Accessible update and driver tools',
      'Conservative Ubuntu LTS foundation',
      'Broad everyday application availability',
    ],
    cautions: [
      'Base packages can lag current upstream releases.',
      'Cinnamon is heavier than lightweight desktop alternatives.',
      'Newest gaming hardware may need a newer graphics stack.',
    ],
    idealFor: [
      'First-time Linux users',
      'Everyday home computing',
      'People who prefer familiar workflows',
    ],
    assessmentBasis:
      'Ubuntu-based Cinnamon edition; MATE and Xfce can reduce desktop overhead.',
  },
  ubuntu: {
    name: 'Ubuntu',
    archetype: {
      name: 'The Envoy',
      description:
        'The Envoy moves comfortably between Linux and the wider software world. Ubuntu suits people who value widely documented workflows, vendor compatibility, and a well-marked route into Linux.',
    },
    summary:
      'A widely supported Linux desktop with an extensive software ecosystem and an LTS option.',
    strengths: [
      'Extensive documentation and community help',
      'Broad commercial software support',
      'Long-term support release option',
      'Strong development ecosystem',
    ],
    cautions: [
      'GNOME can feel unfamiliar to Windows users.',
      'Snap packaging may not suit every workflow.',
      'LTS base packages trade freshness for continuity.',
    ],
    idealFor: [
      'New Linux users',
      'Developers using vendor-supported tools',
      'People seeking an established desktop',
    ],
    assessmentBasis:
      'Ubuntu Desktop LTS with GNOME; interim releases have a different freshness and support balance.',
  },
  'fedora-workstation': {
    name: 'Fedora Workstation',
    archetype: {
      name: 'The Vanguard',
      description:
        'The Vanguard adopts new Linux ideas early while keeping a disciplined system underneath. Fedora Workstation suits developers and desktop users who enjoy current technology and a focused GNOME workspace.',
    },
    summary:
      'A modern GNOME workstation combining current Linux technology with a regular release cycle.',
    strengths: [
      'Current kernels and development tooling',
      'Strong container workflows',
      'Cohesive GNOME defaults',
      'Established upstream collaboration',
    ],
    cautions: [
      'Frequent release upgrades need planning.',
      'Some codecs and proprietary drivers need extra setup.',
      'GNOME extensions can add upgrade friction.',
    ],
    idealFor: [
      'Software developers',
      'Users wanting a modern general desktop',
      'People comfortable with regular upgrades',
    ],
    assessmentBasis: 'Standard Fedora Workstation GNOME installation.',
  },
  'fedora-kde': {
    name: 'Fedora KDE',
    archetype: {
      name: 'The Tinkerer',
      description:
        'The Tinkerer likes a modern foundation with panels, shortcuts, and workflows to shape. Fedora KDE makes that curiosity part of everyday desktop use without turning customization into a full-time maintenance hobby.',
    },
    summary:
      'A current KDE Plasma desktop on Fedora’s broad workstation foundation.',
    strengths: [
      'Flexible Plasma desktop settings',
      'Current kernels and graphics stack',
      'Excellent development and container ecosystem',
      'Broad general-purpose workstation fit',
    ],
    cautions: [
      'Frequent release upgrades need planning.',
      'Proprietary drivers and some codecs need extra setup.',
      'Abundant desktop settings can overwhelm newcomers.',
    ],
    idealFor: [
      'Users wanting an adjustable everyday desktop',
      'Software developers',
      'People seeking modern software with conventional administration',
    ],
    assessmentBasis:
      'Fedora KDE Plasma Desktop; desktop customization scores its built-in settings above GNOME.',
  },
  debian: {
    name: 'Debian',
    archetype: {
      name: 'The Steward',
      description:
        'The Steward gives mature software a long, useful life. Debian suits people who value predictable change, community stewardship, and a system they can keep steady over time.',
    },
    summary:
      'A community-maintained distribution whose stable branch favors continuity and a large package archive.',
    strengths: [
      'Conservative stable release base',
      'Large package archive',
      'Broad architecture support',
      'Community-governed development',
    ],
    cautions: [
      'Older base packages and graphics stack.',
      'Desktop setup can require more choices than beginner-focused derivatives.',
      'New hardware may need backports or firmware attention.',
    ],
    idealFor: [
      'Users prioritizing predictable change',
      'Long-lived workstations',
      'Modest hardware with a lightweight desktop',
    ],
    assessmentBasis:
      'Debian stable with a lightweight Xfce desktop; testing and unstable are outside this profile.',
  },
  'pop-os': {
    name: 'Pop!_OS',
    archetype: {
      name: 'The Pilot',
      description:
        'The Pilot wants a workstation that helps demanding work stay on course. Pop!_OS pairs System76’s desktop direction with productive window management for developers, creators, and people who like purposeful controls.',
    },
    summary:
      'An Ubuntu-based workstation shaped around System76’s COSMIC desktop and productivity workflows.',
    strengths: [
      'Productive tiling and workspace features',
      'Ubuntu software ecosystem',
      'Hardware integration on System76 machines',
      'Gaming and graphics setup conveniences',
    ],
    cautions: [
      'COSMIC maturity and app integration deserve hands-on review.',
      'Ubuntu instructions may differ in desktop and system details.',
      'Not aimed at very weak machines.',
    ],
    idealFor: [
      'Developers and creators',
      'Users who enjoy tiling workflows',
      'System76 hardware owners',
    ],
    assessmentBasis:
      'Current COSMIC desktop direction; polish and maintenance estimates need review as the desktop matures.',
  },
  'zorin-os': {
    name: 'Zorin OS',
    archetype: {
      name: 'The Initiate',
      description:
        'The Initiate takes a welcoming first step into Linux. Zorin’s familiar layouts and careful presentation give newcomers room to learn while keeping everyday desktop tasks approachable.',
    },
    summary:
      'A polished Ubuntu-based desktop designed to ease the transition from Windows or macOS.',
    strengths: [
      'Familiar desktop layouts',
      'Welcoming graphical setup',
      'Ubuntu application ecosystem',
      'Carefully styled defaults',
    ],
    cautions: [
      'Base software can lag upstream.',
      'Some layouts and extras belong to the paid edition.',
      'Default desktop is heavier than minimal alternatives.',
    ],
    idealFor: [
      'Windows and macOS newcomers',
      'Users who value presentation',
      'Everyday home and office computing',
    ],
    assessmentBasis:
      'Zorin OS Core; paid Pro layouts do not increase capability scores.',
  },
  'elementary-os': {
    name: 'elementary OS',
    archetype: {
      name: 'The Aesthete',
      description:
        'The Aesthete values visual coherence and deliberate restraint. elementary OS offers a curated Pantheon desktop for people who prefer consistent design decisions to a sprawling set of interface controls.',
    },
    summary:
      'An Ubuntu-based desktop centered on Pantheon, cohesive design, and curated applications.',
    strengths: [
      'Coherent interface design',
      'Curated desktop applications',
      'Simple everyday workflows',
      'Ubuntu foundation',
    ],
    cautions: [
      'Limited built-in desktop customization.',
      'Smaller selection of tightly integrated applications.',
      'Gaming and specialist tools require more setup.',
    ],
    idealFor: [
      'Design-conscious desktop users',
      'People preferring a restrained interface',
      'Users happy with curated defaults',
    ],
    assessmentBasis: 'Default Pantheon desktop.',
  },
  'opensuse-tumbleweed': {
    name: 'openSUSE Tumbleweed',
    archetype: {
      name: 'The Sentinel',
      description:
        'The Sentinel explores with safeguards close at hand. Tumbleweed suits users who want rolling software, tested snapshots, and recovery tools that make an adventurous desktop easier to manage.',
    },
    summary:
      'A rolling distribution combining current software with automated testing and snapshot recovery tooling.',
    strengths: [
      'Current rolling software',
      'Automated distribution testing',
      'Btrfs snapshot recovery',
      'Broad desktop and system configuration options',
    ],
    cautions: [
      'Frequent and sometimes large updates.',
      'Proprietary codecs and drivers need attention.',
      'Snapshot recovery still requires understanding and disk space.',
    ],
    idealFor: [
      'Users wanting a managed rolling desktop',
      'Developers needing current tools',
      'Tinkerers who value recovery options',
    ],
    assessmentBasis:
      'KDE desktop with the standard Btrfs/Snapper installation; recovery is not atomic image updating.',
  },
  endeavouros: {
    name: 'EndeavourOS',
    archetype: {
      name: 'The Explorer',
      description:
        'The Explorer enters the Arch world through a clearer trailhead. EndeavourOS offers a friendly starting community and graphical installation while leaving the journey of system ownership to the user.',
    },
    summary:
      'A terminal-oriented Arch derivative with a guided installer and a relatively lean desktop setup.',
    strengths: [
      'Guided entry to the Arch ecosystem',
      'Current packages',
      'Friendly learning community',
      'Lean and adaptable installation',
    ],
    cautions: [
      'Rolling updates can need manual intervention.',
      'Terminal-based administration is expected.',
      'AUR packages need independent review and maintenance.',
    ],
    idealFor: [
      'Linux users moving toward Arch',
      'Hands-on learners',
      'People comfortable owning system maintenance',
    ],
    assessmentBasis:
      'Default KDE installation; alternative desktop choices change resource use.',
  },
  'arch-linux': {
    name: 'Arch Linux',
    archetype: {
      name: 'The Artisan',
      description:
        'The Artisan assembles a system piece by piece, understanding each choice along the way. Arch rewards experienced users who enjoy building their own environment and taking responsibility for its upkeep.',
    },
    summary:
      'A minimal rolling distribution that leaves desktop assembly and system configuration to the user.',
    strengths: [
      'Exceptional control over system composition',
      'Current packages and toolchains',
      'Extensive Arch Wiki',
      'Large community build ecosystem',
    ],
    cautions: [
      'Installation and desktop assembly require deliberate choices.',
      'Updates may need manual intervention.',
      'Community packages are not equivalent to vetted official packages.',
    ],
    idealFor: [
      'Experienced Linux users',
      'People building a personal environment',
      'Hands-on system learners',
    ],
    assessmentBasis:
      'Minimal base with a user-built lightweight desktop; polish scores supplied defaults, not a finished custom setup.',
  },
  cachyos: {
    name: 'CachyOS',
    archetype: {
      name: 'The Strider',
      description:
        'The Strider favors a responsive pace and current equipment. CachyOS puts performance-oriented Arch tooling within easier reach for users who want to tune their stride without assembling every starting component.',
    },
    summary:
      'An Arch-based desktop with optimized packages, kernel choices, and performance-oriented tooling.',
    strengths: [
      'Current graphics and kernels',
      'Performance-oriented package builds',
      'Graphical installation',
      'Kernel and scheduler choices',
    ],
    cautions: [
      'CPU requirements vary across optimized builds.',
      'Rolling and custom kernel updates need attention.',
      'Performance gains depend on hardware and workload.',
    ],
    idealFor: [
      'Gaming enthusiasts with modern hardware',
      'Users wanting performance tuning',
      'People comfortable with Arch maintenance',
    ],
    assessmentBasis:
      'KDE desktop on compatible modern x86-64 hardware; optimizations are not universal performance guarantees.',
  },
  nobara: {
    name: 'Nobara',
    archetype: {
      name: 'The Champion',
      description:
        'The Champion arrives equipped for demanding play and creative work. Nobara brings gaming and multimedia conveniences to a Fedora-derived workstation for people who want fewer setup chores before the main event.',
    },
    summary:
      'A Fedora derivative with gaming, graphics, and content-creation setup conveniences.',
    strengths: [
      'Gaming dependencies and driver conveniences',
      'Multimedia and capture tooling',
      'Current Fedora-derived foundation',
      'Graphical setup and update tools',
    ],
    cautions: [
      'Custom changes can diverge from Fedora guidance.',
      'Smaller hobby project support surface.',
      'Major upgrades deserve attention to project instructions.',
    ],
    idealFor: [
      'Desktop gamers',
      'Streamers and content creators',
      'Users wanting gaming setup conveniences',
    ],
    assessmentBasis:
      'Nobara Official KDE desktop; follow Nobara’s update tools and guidance.',
  },
  bazzite: {
    name: 'Bazzite',
    archetype: {
      name: 'The Player',
      description:
        'The Player treats the machine as a gaming platform as well as a desktop. Bazzite pairs prepared gaming tools with an image-based foundation for users who like dependable sessions and a quick route back to play.',
    },
    summary:
      'A Fedora Atomic-based gaming desktop with image updates and hardware-specific variants.',
    strengths: [
      'Prepared gaming environment',
      'Atomic image updates and rollback',
      'Desktop and supported handheld options',
      'Application separation from the base system',
    ],
    cautions: [
      'Host modifications differ from conventional Linux.',
      'Game-mode support depends on hardware and image.',
      'Flatpak and container workflows take adjustment.',
    ],
    idealFor: [
      'Desktop gamers',
      'Owners of supported handhelds',
      'Users preferring a managed gaming base',
    ],
    assessmentBasis:
      'KDE desktop image on supported hardware; handheld and game-mode compatibility must be checked separately.',
  },
  bluefin: {
    name: 'Bluefin',
    archetype: {
      name: 'The Navigator',
      description:
        'The Navigator stays on course with a managed foundation and clearly separated tools. Bluefin suits people who welcome automatic image updates and application-focused workflows, especially developers already comfortable with containers.',
    },
    summary:
      'A Fedora-based image workstation with curated GNOME defaults and container-oriented development workflows.',
    strengths: [
      'Automatic image-based updates',
      'Strong container-focused developer mode',
      'Curated GNOME experience',
      'Separated desktop and command-line applications',
    ],
    cautions: [
      'Host package installation follows a different model.',
      'Homebrew, Flatpak, and containers add concepts to learn.',
      'GNOME customization remains more limited than Plasma.',
    ],
    idealFor: [
      'Container-oriented developers',
      'Users seeking low routine upkeep',
      'People happy with a managed workstation',
    ],
    assessmentBasis:
      'Standard GNOME image with developer mode available; release channel affects freshness.',
  },
  nixos: {
    name: 'NixOS',
    archetype: {
      name: 'The Architect',
      description:
        'The Architect describes a machine so it can be rebuilt and reasoned about. NixOS rewards technical users willing to learn a distinct configuration model in exchange for reproducible environments and deliberate system changes.',
    },
    summary:
      'A declaratively configured distribution built around Nix packages, system generations, and reproducibility.',
    strengths: [
      'Declarative system configuration',
      'Reproducible development environments',
      'System generations and rollback',
      'Extensive package ecosystem',
    ],
    cautions: [
      'Distinct configuration language and learning curve.',
      'Conventional filesystem assumptions can break software workflows.',
      'Reproducibility requires disciplined version pinning.',
    ],
    idealFor: [
      'Technical users interested in declarative systems',
      'Developers managing repeatable environments',
      'People maintaining configuration as code',
    ],
    assessmentBasis:
      'Stable NixOS channel with a configured KDE desktop; unstable is a separate freshness tradeoff.',
  },
  gentoo: {
    name: 'Gentoo',
    archetype: {
      name: 'The Alchemist',
      description:
        'The Alchemist turns selected ingredients into a carefully tuned system. Gentoo suits patient enthusiasts who enjoy choosing build features and understanding how software fits together, accepting the work that this freedom brings.',
    },
    summary:
      'A highly configurable distribution centered on Portage, build choices, and user-directed system composition.',
    strengths: [
      'Fine-grained package feature selection',
      'Deep system composition control',
      'Flexible source and binary package workflows',
      'Detailed system documentation',
    ],
    cautions: [
      'Configuration and upgrades demand substantial attention.',
      'Source builds can consume considerable time and resources.',
      'Desktop integration is the user’s responsibility.',
    ],
    idealFor: [
      'Experienced system enthusiasts',
      'Users needing specific build features',
      'Patient learners seeking deep control',
    ],
    assessmentBasis:
      'User-built desktop using stable package keywords; binary packages can reduce compilation work.',
  },
  'void-linux': {
    name: 'Void Linux',
    archetype: {
      name: 'The Wanderer',
      description:
        'The Wanderer follows an independent route with few layers between user and system. Void’s runit and XBPS appeal to hands-on users who value lean design and are comfortable finding their way outside mainstream distro conventions.',
    },
    summary:
      'An independent rolling distribution using runit and XBPS, with glibc and musl variants.',
    strengths: [
      'Lean system design',
      'Simple runit service supervision',
      'Fast native package tools',
      'Alternative libc options',
    ],
    cautions: [
      'Smaller ecosystem than major distro families.',
      'More manual desktop and driver integration.',
      'Many mainstream instructions assume systemd.',
    ],
    idealFor: [
      'Experienced users seeking a lean desktop',
      'People interested in runit',
      'Users comfortable with an independent ecosystem',
    ],
    assessmentBasis:
      'glibc Xfce desktop; musl brings additional compatibility tradeoffs.',
  },
  'kali-linux': {
    name: 'Kali Linux',
    archetype: {
      name: 'The Specialist',
      description:
        'The Specialist arrives with a defined security task and the skills to use the tools. Kali is a focused companion for penetration testing and security study, with a purpose narrower than everyday desktop discovery.',
    },
    summary:
      'A Debian-based security-testing distribution intended for penetration testers and security specialists.',
    strengths: [
      'Broad penetration-testing toolkit',
      'Security-focused documentation',
      'Purpose-built assessment workflows',
      'Virtual-machine and live-use options',
    ],
    cautions: [
      'Unsuitable as an ordinary beginner desktop recommendation.',
      'Unrelated repositories can damage the supported system.',
      'General development and gaming are outside its focus.',
    ],
    idealFor: [
      'Penetration testers',
      'Security students with Linux experience',
      'Authorized security assessment labs',
    ],
    assessmentBasis:
      'Standard Xfce security-tool installation; evaluated as a specialist environment, not a general desktop.',
  },
  'mx-linux': {
    name: 'MX Linux',
    archetype: {
      name: 'The Survivor',
      description:
        'The Survivor keeps useful machines working within modest means. MX combines a steady Debian base with practical desktop tools for people who value resource efficiency and a computer that still earns its place.',
    },
    summary:
      'A Debian stable-based desktop with practical administration tools and relatively modest resource needs.',
    strengths: [
      'Relatively lightweight Xfce desktop',
      'Conservative Debian foundation',
      'Practical MX administration tools',
      'Useful live and recovery workflows',
    ],
    cautions: [
      'Base packages favor stability over freshness.',
      'Newest graphics hardware may need a different kernel stack.',
      'Desktop presentation is less cohesive than design-focused alternatives.',
    ],
    idealFor: [
      'Users keeping modest hardware productive',
      'People wanting graphical administration tools',
      'Users seeking a steady everyday desktop',
    ],
    assessmentBasis:
      'Standard Xfce edition; not a promise of support for every obsolete CPU or GPU.',
  },
  'garuda-linux': {
    name: 'Garuda Linux',
    archetype: {
      name: 'The Berserker',
      description:
        'The Berserker embraces bold presentation and an enthusiast’s appetite for power. Garuda outfits the Arch journey with gaming tools and recovery aids for users happy to manage a busy, opinionated desktop.',
    },
    summary:
      'An enthusiast-oriented Arch derivative with bold desktop defaults and snapshot recovery tools.',
    strengths: [
      'Current Arch software',
      'Gaming-oriented setup tools',
      'Snapshot recovery integration',
      'Highly adjustable desktop',
    ],
    cautions: [
      'Rolling updates still need attention.',
      'Rich defaults consume more resources.',
      'Opinionated theming and extra tools may not suit everyone.',
    ],
    idealFor: [
      'Gaming enthusiasts',
      'Users who enjoy bold desktop styling',
      'Tinkerers comfortable with recovery tools',
    ],
    assessmentBasis:
      'Gaming-oriented KDE installation with Btrfs snapshots; lighter editions differ.',
  },
  solus: {
    name: 'Solus',
    archetype: {
      name: 'The Curator',
      description:
        'The Curator assembles a desktop with a consistent point of view. Solus takes an independent, desktop-focused path for people who value integration and deliberate package selection over the largest possible catalogue.',
    },
    summary:
      'An independent rolling desktop distribution with a curated package ecosystem.',
    strengths: [
      'Desktop-focused integration',
      'Curated software selection',
      'Rolling application updates',
      'Independent distribution design',
    ],
    cautions: [
      'Smaller package catalogue than major distro families.',
      'Vendor packages may target other distributions.',
      'Rolling changes and project direction need periodic review.',
    ],
    idealFor: [
      'Users wanting a curated daily desktop',
      'People comfortable with a smaller ecosystem',
      'Fans of the Budgie workflow',
    ],
    assessmentBasis:
      'Budgie edition; other desktop editions change polish and customization.',
  },
  pikaos: {
    name: 'PikaOS',
    archetype: {
      name: 'The Challenger',
      description:
        'The Challenger brings fresh ambition to the gaming desktop field. PikaOS suits enthusiasts who want current drivers and accessible tuning tools, and who are willing to follow a younger project as it develops.',
    },
    summary:
      'A Debian Sid-based rolling desktop with curated performance builds and gaming and graphics tooling.',
    strengths: [
      'Current gaming and graphics stack',
      'Graphical driver and kernel tools',
      'Performance-oriented package builds',
      'Creator and compute tooling',
    ],
    cautions: [
      'Younger project with less accumulated support history.',
      'Optimized base requires compatible modern CPUs.',
      'Rolling custom repositories can need closer maintenance.',
    ],
    idealFor: [
      'Gamers with compatible modern hardware',
      'Creators wanting current GPU tooling',
      'Enthusiasts willing to follow a newer project',
    ],
    assessmentBasis:
      'KDE desktop on x86-64-v3-capable hardware; newer project estimates require closer review.',
  },
  'alpine-linux': {
    name: 'Alpine Linux',
    archetype: {
      name: 'The Ascetic',
      description:
        'The Ascetic chooses a small system and accepts the consequences of travelling light. Alpine’s musl and BusyBox foundation suits advanced users with a specific technical reason to shed conventional desktop assumptions.',
    },
    summary:
      'A minimal, security-conscious distribution using musl and BusyBox, with substantial desktop compatibility tradeoffs.',
    strengths: [
      'Very small base footprint',
      'Simple package and service tools',
      'Useful container and appliance ecosystem',
      'Explicit minimal system composition',
    ],
    cautions: [
      'musl can complicate proprietary and glibc-targeted software.',
      'Desktop integration requires manual work.',
      'Poor fit for mainstream desktop gaming.',
    ],
    idealFor: [
      'Advanced minimal-system users',
      'Technical experimentation with musl',
      'Special-purpose lightweight machines',
    ],
    assessmentBasis:
      'Stable Alpine base with a manually assembled lightweight desktop; container strengths do not imply desktop convenience.',
  },
  slackware: {
    name: 'Slackware',
    archetype: {
      name: 'The Traditionalist',
      description:
        'The Traditionalist keeps Unix-style conventions close and understands each change. Slackware suits technically confident users who value continuity, upstream software, and manual administration as part of knowing their system.',
    },
    summary:
      'A long-established independent distribution emphasizing conservative releases and direct, traditional administration.',
    strengths: [
      'Conservative release philosophy',
      'Direct text-based configuration',
      'Limited alteration of upstream software',
      'Established Unix-style workflows',
    ],
    cautions: [
      'Official package tools do not resolve dependencies automatically.',
      'Stable software can be substantially older.',
      'Modern desktop and vendor workflows need extra manual work.',
    ],
    idealFor: [
      'Experienced Unix-oriented users',
      'People who prefer manual administration',
      'Users valuing long-lived system conventions',
    ],
    assessmentBasis:
      'Stable Slackware with Xfce; the development branch is outside this profile.',
  },
} satisfies DistroDictionary;
