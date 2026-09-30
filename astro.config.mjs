// @ts-check
import { defineConfig } from 'astro/config';

// Supply the public origin at deployment time; never publish a guessed canonical.
export default defineConfig({
  site: process.env.SITE_URL,
  output: 'static',
  trailingSlash: 'always',
});
