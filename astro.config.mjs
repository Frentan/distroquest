// @ts-check
import { defineConfig } from 'astro/config';
import i18nPublicationGate from './scripts/i18n-integration.ts';

// Supply the public origin at deployment time; never publish a guessed canonical.
export default defineConfig({
  site: process.env.SITE_URL,
  output: 'static',
  integrations: [i18nPublicationGate()],
  trailingSlash: 'always',
});
