# DistroQuest

**Stop distro-hopping before it starts.**

A playful Linux distribution finder built with Astro, TypeScript, and plain CSS.
Answer 16 questions to compare 25 distros, with explanations, tradeoffs, and
edition-aware alternatives. Mac users get one extra hardware question.

No signup, cookies, or tracking. Answers stay in memory and disappear on refresh;
only your theme preference is saved. English is the only published language.

## Run locally

Requires Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev:start
```

Open the URL reported by Astro. Manage the background server with
`npm run dev:status`, `npm run dev:logs`, and `npm run dev:stop`.

## Validate and build

```sh
npm run check
npm test
npm run format:check
npm run build
```

`npm run format` formats the source. The static production build writes to `dist/`.
For Cloudflare Pages, use `npm run build` and output directory `dist`. Set `SITE_URL`
to the final public origin, including `https://`, before building for canonical
URLs and the sitemap. No server adapter is needed.

## How matching works

The quiz turns explicit answers into capability preferences, traits, and eligibility
evidence. A pure engine ranks all 25 profiles and explains matches and tradeoffs.
Gaming intensity comes from its dedicated question; broad purposes never infer
expertise or bypass eligibility. [The engine reference](src/recommendations/README.md)
documents the small trait/specialist refinements and minimum requirements.

Displayed fit is an uncalibrated preference score, not a compatibility guarantee.
The ten capability bars show assessed distro strengths out of 5. A separate platform
layer orders practical installation paths while preserving the engine's scores:

- PCs and Intel Macs need exact-model checks; T2 Macs distinguish maintained and
  manual installation paths.
- M1/M2 use Fedora Asahi Remix KDE/GNOME variants of the existing Fedora profiles.
  Their fit and capability bars inherit base Fedora assessments.
- M3 is experimental. M4/newer and unidentified chips have no verified supported
  path in this dataset.

Platform evidence was checked on 2026-10-02 against [Asahi](https://asahilinux.org/fedora/),
its [M3](https://asahilinux.org/docs/platform/feature-support/m3/) and
[M4](https://asahilinux.org/docs/platform/feature-support/m4/) tables,
[t2linux](https://wiki.t2linux.org/guides/preinstall/), and
[CachyOS](https://wiki.cachyos.org/installation/installation_t2macbook/).
Support changes; check current device, app, and game requirements before installing.

## Development references

User-facing copy, metadata, and accessible labels live in `src/i18n/`.
`src/quiz/` owns in-memory navigation and result presentation; `src/platforms/`
owns the hardware overlay. Development builds expose answers, profiles, rankings,
and platform diagnostics through `window.distroquestDebug`; production excludes it.

| Reference                                           | Review command                                 | Covers                                    |
| :-------------------------------------------------- | :--------------------------------------------- | :---------------------------------------- |
| [Distro model](src/data/README.md)                  | `npm run data:review`                          | Assessments, traits, constraints, sources |
| [Preference model](src/preferences/README.md)       | `npm run preferences:review`                   | Answer validation and evidence weights    |
| [Scoring engine](src/recommendations/README.md)     | `npm run recommendations:review`               | Formulas, diagnostics, and 20 personas    |
| [Example rankings](src/recommendations/EXAMPLES.md) | `npm run recommendations:review -- --examples` | All 20 complete ranking tables            |

Review commands accept `--json`. Preferences and recommendations also accept
`--answers /tmp/answers.json`; recommendations accept `--persona atomicDeveloper`.
