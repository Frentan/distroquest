# DistroQuest

**Stop distro-hopping before it starts.**

[Try DistroQuest](https://distroquest.com)

A playful Linux distribution finder built with Astro, TypeScript, and plain CSS.
Answer 16 questions to compare 29 distros, with explanations, tradeoffs, and
edition-aware alternatives. Mac users get one extra hardware question.

No signup or cookies. Answers stay in memory and disappear on refresh;
only your theme preference is saved. Cloudflare provides privacy-conscious traffic analytics.
Available in English, Spanish, Portuguese, and Italian.

Browse the [distro directory](https://distroquest.com/distros/) for strengths,
trade-offs and assessed-edition notes.

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

After building, `npm run test:browser` runs optional local Chromium checks using an
isolated temporary profile. Set `CHROME_PATH` if Chromium is installed elsewhere.

Local builds can omit `SITE_URL`. Cloudflare builds write the site to
`dist/client/` and generate Wrangler's deployment configuration.

For Cloudflare Workers Builds, use:

| Setting        | Value                                         |
| -------------- | --------------------------------------------- |
| Build command  | `npm run build:deploy`                        |
| Deploy command | `npm run deploy:check && npx wrangler deploy` |
| Build variable | `SITE_URL=https://distroquest.com`            |

Deployment commands require a public HTTPS `SITE_URL` and reject missing or
inconsistent generated SEO metadata before upload.

## Matching and development

The engine ranks distributions using explicit capability preferences, traits and
eligibility evidence.
Broad purposes never infer expertise or bypass eligibility; the dedicated gaming
question controls gaming intensity.

Displayed fit is an uncalibrated preference score, not a compatibility guarantee.
The ten capability bars show assessed distro strengths out of 5. A separate platform
layer orders practical installation paths while preserving the engine's scores:

- PCs and Intel Macs need exact-model checks; T2 Macs distinguish maintained and
  manual installation paths.
- M1/M2 use Fedora Asahi Remix KDE/GNOME variants of the existing Fedora profiles.
  Their fit and capability bars inherit base Fedora assessments.
- M3 is experimental. M4/newer and unidentified chips have no verified supported
  path in this dataset.

Technical references:

- [Distro assessments and sources](src/data/README.md)
- [Support lifecycle and continuity](src/data/SUPPORT-REVIEW.md)
- [Preference model](src/preferences/README.md)
- [Scoring engine](src/recommendations/README.md) and [example rankings](src/recommendations/EXAMPLES.md)
- [Routing, translations, and publication checks](src/i18n/README.md)
- [Documentation and code relationship maps](reports/relationship-graph/README.md)

## License

Except where otherwise noted, the source code of DistroQuest is licensed under the
[MIT License](LICENSE).

The DistroQuest name, logo, visual identity, character designs, illustrations, and
other original artwork are © 2026 Frentan and are not licensed under the MIT
License.

Linux distribution names, logos, and trademarks depicted in DistroQuest are the
property of their respective owners. Their inclusion does not imply affiliation
with or endorsement of DistroQuest.

See [licensing scope and asset rights](LICENSE-ASSETS.md) for the standalone notice.
