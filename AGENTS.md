## Development

When starting the dev server, use background mode:

```
npm run dev:start
```

Manage the background server with `npm run dev:stop`, `npm run dev:status`, and
`npm run dev:logs`.

## Documentation

- Keep ignored `docs/V1-PLAN.md` and `docs/DEVELOPMENT.md` current as work progresses
  and before each commit; record the verified scope and delivery after each commit.
- Public READMEs describe usage and durable technical contracts. Keep editorial
  proposals, review dialogue, and session checkpoints under ignored `docs/`.
  Machine-readable translation approval records remain tracked.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## DistroQuest scope and content

- Respect the requested milestone boundary; do not advance to the next milestone
  without an explicit request. Local planning notes may exist in the ignored `docs/`
  folder, but tracked instructions must remain useful without those notes.
- Keep user-facing text, metadata, and accessible labels in `src/i18n/`.
  English and Spanish are published; Italian and Portuguese are planned. French and
  German are deferred indefinitely; preserve their reserved IDs without starting
  translation or publication work.
  Do not expose untranslated routes or a language selector before content is ready.
- Use at least `0.875rem` for small readable text; do not shrink it further on mobile.

## Matching and assessments

- Keep the roster at 29 profiles unless an expansion is explicitly requested.
  Assessment changes need source evidence for the specific edition being assessed.
- Derive expertise and specialist eligibility from explicit answers. Broad purposes
  and aspirational answers must not grant experience or bypass requirements.
- Keep platform installation guidance separate from matching scores. Platform
  support may reorder practical paths without changing the engine's scores.
- For scoring changes, review the existing personas and relevant focused scenarios,
  then regenerate `src/recommendations/EXAMPLES.md` with
  `npm run --silent recommendations:review -- --examples` and format the output.
- Consult the [distro model](src/data/README.md),
  [preference model](src/preferences/README.md), and
  [scoring engine](src/recommendations/README.md) before changing their rules.

## Local verification

Run the checks relevant to the change; use the full set for application or scoring
changes:

```sh
npm run check
npm test
npm run format:check
npm run build
```

- Leave a dev server started by the user running. Reuse its reported URL for inspection.
- In the managed sandbox, process visibility can be restricted. Astro’s status check
  may falsely treat an outside-sandbox PID as stale and remove its lock file. Inspect
  status in the same execution context as the server; do not restart a server merely
  because a sandboxed status check reports it missing.
- If browser automation is unavailable, installed `chromium-browser --headless` can
  verify the static build with an isolated profile under `/tmp`. Keep test tooling
  outside the shipped application and close only processes started for that test.

## Brand assets

- `public/favicon.svg` is the canonical shield/terminal mark. Reuse
  `src/components/BrandMark.astro` for page placements; avoid copied SVG paths.
- Generate `public/favicon.ico` from that SVG when the mark changes. Keep the
  16, 32, 48, 64, 128, and 256px fallback sizes aligned with the SVG.

  Regenerate with `magick -background none public/favicon.svg -filter point -define
  icon:auto-resize=256,128,64,48,32,16 public/favicon.ico` (build-time tooling only).
