import type { DistroId } from '../domain/distro.ts';

// Editorial destinations, independent of scores and assessment-source ordering.
// Checked against the projects' sites on 2026-10-15; see docs/M8-LAUNCH.md.
// Omit a link when its official destination cannot be established.
export const officialWebsites: Partial<Record<DistroId, string>> = {
  'linux-mint': 'https://www.linuxmint.com/',
  ubuntu: 'https://ubuntu.com/desktop',
  'fedora-workstation': 'https://fedoraproject.org/workstation/',
  'fedora-kde': 'https://fedoraproject.org/kde/',
  'fedora-silverblue': 'https://fedoraproject.org/atomic-desktops/silverblue/',
  debian: 'https://www.debian.org/',
  'pop-os': 'https://system76.com/pop',
  'zorin-os': 'https://zorin.com/os/',
  'elementary-os': 'https://elementary.io/',
  'opensuse-tumbleweed': 'https://get.opensuse.org/tumbleweed/',
  'opensuse-aeon': 'https://aeondesktop.org/',
  endeavouros: 'https://endeavouros.com/',
  'arch-linux': 'https://archlinux.org/',
  cachyos: 'https://cachyos.org/',
  nobara: 'https://nobaraproject.org/',
  bazzite: 'https://bazzite.gg/',
  bluefin: 'https://projectbluefin.io/',
  nixos: 'https://nixos.org/',
  gentoo: 'https://www.gentoo.org/',
  'void-linux': 'https://voidlinux.org/',
  'kali-linux': 'https://www.kali.org/',
  // Site blocks automated retrieval; domain ownership verified by github.com/MX-Linux.
  'mx-linux': 'https://mxlinux.org/',
  'garuda-linux': 'https://garudalinux.org/',
  solus: 'https://getsol.us/',
  pikaos: 'https://pika-os.com/',
  'alpine-linux': 'https://alpinelinux.org/',
  'vanilla-os': 'https://vanillaos.org/',
  'rhino-linux': 'https://rhinolinux.org/',
  // Official site serves HTTP; HTTPS was not working at verification time.
  slackware: 'http://www.slackware.com/',
};
