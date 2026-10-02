import type { DistroId } from './distro.ts';
import type { Recommendation } from './recommendations.ts';

export type Platform =
  | 'x86-standard'
  | 'intel-mac'
  | 'intel-mac-t2'
  | 'intel-mac-unknown-t2'
  | 'apple-silicon-m1-m2'
  | 'apple-silicon-m3'
  | 'apple-silicon-m4-plus'
  | 'apple-silicon-unknown'
  | 'unknown';
export type PlatformSupport =
  | 'native'
  | 'supported-with-special-path'
  | 'experimental'
  | 'unsupported'
  | 'unknown';
export type PlatformFollowupId = 'apple-generation' | 'intel-t2';
export type PlatformFollowup = Readonly<{
  id: PlatformFollowupId;
  options: readonly Readonly<{
    id: string;
    emoji: string;
    platform: Platform;
  }>[];
}>;
export type PlatformVariant = Readonly<{
  id: 'fedora-asahi-remix';
  baseDistroId: Extract<DistroId, 'fedora-kde' | 'fedora-workstation'>;
  edition: 'kde' | 'gnome';
}>;
export type PlatformCandidate = Readonly<{
  recommendation: Recommendation;
  support: PlatformSupport;
  installation: 'standard' | 'guided' | 'manual' | 'unverified';
  url?: string;
  variant?: PlatformVariant;
}>;
export type PlatformResult = Readonly<{
  platform: Platform;
  preferenceWinner: Recommendation;
  // Separate ordering; engine ranking and every numeric score stay unchanged.
  candidates: readonly PlatformCandidate[];
  practical: readonly PlatformCandidate[];
}>;
