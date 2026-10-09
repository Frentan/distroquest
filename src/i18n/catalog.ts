import { en } from './en.ts';
import { es } from './es.ts';
import type { Locale } from './locales.ts';
export type Messages = typeof en;

// Complete runtime dictionaries only. Drafts are imported by development tooling.
export const dictionaries: Partial<Record<Locale, Messages>> = { en, es };
