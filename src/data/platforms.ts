import type { DistroId } from '../domain/distro.ts';
import type { PlatformFollowup } from '../domain/platform.ts';

// Compatibility data is separate from the 29 preference profiles and their scores.
export const platformFollowups = {
  'apple-silicon': {
    id: 'apple-generation',
    options: [
      { id: 'm1-m2', emoji: '🍏', platform: 'apple-silicon-m1-m2' },
      { id: 'm3', emoji: '💻', platform: 'apple-silicon-m3' },
      { id: 'm4-plus', emoji: '🚀', platform: 'apple-silicon-m4-plus' },
      { id: 'unknown', emoji: '❓', platform: 'apple-silicon-unknown' },
    ],
  },
  'intel-mac': {
    id: 'intel-t2',
    options: [
      { id: 'yes', emoji: '🔐', platform: 'intel-mac-t2' },
      { id: 'no', emoji: '💻', platform: 'intel-mac' },
      { id: 'unknown', emoji: '❓', platform: 'intel-mac-unknown-t2' },
    ],
  },
} as const satisfies Record<string, PlatformFollowup>;
export const platformSources = {
  reviewedOn: '2026-10-02',
  asahi: 'https://asahilinux.org/fedora/',
  m3: 'https://asahilinux.org/docs/platform/feature-support/m3/',
  m4: 'https://asahilinux.org/docs/platform/feature-support/m4/',
  appleChip: 'https://support.apple.com/en-us/116943',
  t2Chip: 'https://support.apple.com/en-us/103265',
  t2: 'https://wiki.t2linux.org/guides/preinstall/',
};
// Maintained installer/module paths vs documented manual enablement. These are
// support-effort categories, not claims that all features work on every model.
export const t2Paths: Partial<
  Record<DistroId, { installation: 'guided' | 'manual'; url: string }>
> = {
  'fedora-kde': {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/fedora/home/',
  },
  'fedora-workstation': {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/fedora/home/',
  },
  ubuntu: {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/ubuntu/installation/',
  },
  'linux-mint': {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/ubuntu/installation/',
  },
  'arch-linux': {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/arch/installation/',
  },
  endeavouros: {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/endeavouros/installation/',
  },
  cachyos: {
    installation: 'guided',
    url: 'https://wiki.cachyos.org/installation/installation_t2macbook/',
  },
  nixos: {
    installation: 'guided',
    url: 'https://wiki.t2linux.org/distributions/nixos/home/',
  },
  debian: {
    installation: 'manual',
    url: 'https://wiki.t2linux.org/distributions/debian/installation/',
  },
  'pop-os': {
    installation: 'manual',
    url: 'https://wiki.t2linux.org/distributions/debian/installation/',
  },
  'zorin-os': {
    installation: 'manual',
    url: 'https://wiki.t2linux.org/distributions/debian/installation/',
  },
  'elementary-os': {
    installation: 'manual',
    url: 'https://wiki.t2linux.org/distributions/debian/installation/',
  },
  gentoo: {
    installation: 'manual',
    url: 'https://wiki.t2linux.org/distributions/gentoo/installation/',
  },
};
