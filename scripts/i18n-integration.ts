import type { AstroIntegration } from 'astro';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { validatePublication } from './check-i18n.ts';
import { pageOutputIssues } from './lib/publication.ts';
import { publishedLocales } from '../src/i18n/locales.ts';

export default function i18nPublicationGate(): AstroIntegration {
  return {
    name: 'distroquest-i18n-publication',
    hooks: {
      'astro:config:setup': () => {
        validatePublication();
      },
      'astro:build:done': ({ dir }) => {
        // Require both equivalents and reject accidentally generated draft pages.
        const root = fileURLToPath(dir);
        const html: string[] = [];
        function walk(directory: string) {
          for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) walk(path);
            else if (entry.name.endsWith('.html'))
              html.push(relative(root, path).replaceAll('\\', '/'));
          }
        }
        walk(root);
        const issues = pageOutputIssues(html, publishedLocales);
        if (issues.length)
          throw new Error(
            `Published home/quiz routes do not match output:\n${issues.join('\n')}`,
          );
      },
    },
  };
}
