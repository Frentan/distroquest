# DistroQuest

**Stop distro-hopping before it starts.**

A small, playful Linux distribution finder built with Astro, TypeScript, and plain CSS.
The current site includes a responsive homepage, light/dark themes, and a quiz placeholder.
The recommendation quiz is still in development.

No signup, cookies, or tracking. Only your theme preference is saved in your browser.

## Run locally

Requires Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev:start
```

Open the URL reported by Astro. Manage the background server with:

```sh
npm run dev:status
npm run dev:logs
npm run dev:stop
```

## Checks and build

```sh
npm run check
npm test
npm run format:check
npm run build
```

Use `npm run format` to format the source. The production build writes static files
to `dist/`.

## Deploy

For Cloudflare Pages, use `npm run build` as the build command and `dist` as the output
directory. Set `SITE_URL` to the final public origin, including `https://`, before
building to populate canonical URLs and the sitemap. No server adapter is required.

## Content

English copy, metadata, and accessible labels live in `src/i18n/`. English is the
only published language; the locale structure is prepared for future translations.

## Distro data

The dataset contains 25 typed distro profiles. Technical data lives in `src/data/`;
English descriptions and archetypes live in `src/i18n/en/distros.ts`.

```sh
npm run data:review              # Capability table
npm run data:review -- --json     # Complete profiles
```

Both commands validate the dataset before printing it. See [the model notes](src/data/README.md)
for capability definitions, traits, recommendation constraints, and assessment assumptions.
