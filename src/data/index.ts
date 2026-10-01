import type { Distro, DistroDictionary } from '../domain/distro.ts';
import { distroProfiles } from './distros.ts';

export { distroProfiles };

// The caller supplies a published locale's dictionary. No locale-specific URLs
// or English fallback are embedded in the technical dataset.
export function getDistros(content: DistroDictionary): readonly Distro[] {
  return distroProfiles.map((profile) => ({
    ...profile,
    ...content[profile.id],
  }));
}
