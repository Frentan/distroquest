import type { AstroIntegration } from 'astro';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { validatePublication } from './check-i18n.ts';
import { pageOutputIssues } from './lib/publication.ts';
import { publishedLocales } from '../src/i18n/locales.ts';
import { resolvePage } from '../src/routing.ts';
import type { PublishedLocale } from '../src/i18n/locales.ts';
import { staticPageIssues } from './lib/static-pages.ts';

export default function i18nPublicationGate(): AstroIntegration {
  let site: URL | undefined;
  return {
    name: 'distroquest-i18n-publication',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ? new URL(config.site) : undefined;
      },
      'astro:config:setup': () => {
        validatePublication();
      },
      'astro:build:done': ({ dir }) => {
        // Require every equivalent and reject accidentally generated draft pages.
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
        for (const file of html) {
          const route = resolvePage(`/${file.replace(/index\.html$/, '')}`);
          if (!route) continue;
          issues.push(
            ...staticPageIssues(
              readFileSync(join(root, file), 'utf8'),
              route.page,
              route.locale as PublishedLocale,
              site,
            ).map((issue) => `${file}: ${issue}`),
          );
        }
        if (issues.length)
          throw new Error(
            `Published routes do not match output:\n${issues.join('\n')}`,
          );
      },
    },
  };
}
