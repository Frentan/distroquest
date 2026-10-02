# DistroQuest

**Stop distro-hopping before it starts.**

A small, playful Linux distribution finder built with Astro, TypeScript, and plain CSS.
Milestone 5A includes a responsive homepage, light/dark themes, and a working
16-question quiz at `/quiz/`. Results come from the existing recommendation engine,
with answer-based explanations, tradeoffs, and edition-aware alternatives.

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

## User preferences

The questionnaire defines eight core, four practical, three philosophy, and one
final-path question. Question copy lives in `src/i18n/en/questions.ts`; typed effects
and profile construction are independent of presentation and distro matching.

```sh
npm run preferences:review              # Questions and example preference table
npm run preferences:review -- --json     # Questions, effects, answers, and profiles
```

See [the preference model notes](src/preferences/README.md) for the answer contract,
target/importance semantics, eligibility evidence, and validation coverage. About
three minutes was confirmed in a user playtest of the Milestone 5A UI.

## Recommendations

The pure engine validates complete quiz answers, normalizes capability weights,
evaluates all 25 distro profiles, and returns a full ranking with machine-readable
reasons, cautions, per-axis contributions, and constraint outcomes. The quiz consumes
this engine without changing its rules or scores.

```sh
npm run recommendations:review                              # All 15 personas
npm run recommendations:review -- --persona atomicDeveloper # Full score table
npm run recommendations:review -- --persona beginner --json # Complete diagnostics
npm run recommendations:review -- --answers /tmp/answers.json
npm run recommendations:review -- --examples                # Representative tables
```

See [the scoring notes](src/recommendations/README.md) for formulas, rule strengths,
API usage, limitations, and tuning questions. [Example rankings](src/recommendations/EXAMPLES.md)
include complete 25-distro tables for ten representative personas.

## Interactive quiz

`src/quiz/state.ts` manages the current question, answer set, validation, completion,
errors, and complete engine result. `src/quiz/client.ts` renders native buttons and
checkboxes inside `Quiz.astro`; no application framework or server is needed.
Every question uses Continue; the final question uses Reveal my path. Choosing
an answer stays on the current question. Multi-select enforces the questionnaire’s
selection limit. Back retains answers, including conditional platform answers.
Changing an answer invalidates the old result; finishing again recomputes it. Restart and retake ask before clearing answers.

Answers stay in memory in this tab and are cleared on refresh or navigation away.
Only the theme preference is persisted. Result explanations translate the engine’s
machine codes; the displayed preference percentage rounds the engine’s fixed-scale
normalized score to one decimal place. It is a quiz-fit indicator, not a probability or
hardware-compatibility measure. The shortlist preserves preference order within
platform-support tiers, groups editions with the engine’s presentation groups,
and keeps distinct workflows available even within the same family.
There is no poor-fit section or static result-page system in 5A.

In a development build, inspect `window.distroquestDebug` after completion for
answers, the normalized profile, and the full ranking with score components. This
window hook and console output are removed from production builds. It also exposes
`platformAnswer` and `platformResult` separately from the engine result. The existing
CLI review tools remain available.

Milestone 5A refinement adds compact spacing, consistent result cards, and segmented
bars for the ten existing distro capability axes. Bars show assessed capabilities
out of 5, independently of preference fit and hardware support. Asahi variants use
explicitly labeled base Fedora assessments. Alternative stats and every card’s
tradeoffs expand independently. Selected use cases also produce preparation tips;
everyday/creative intent adds no ranking weights, and gaming intensity remains
authoritative. Further artwork and motion remain outside this refinement.
About three minutes was confirmed in a user playtest; individual completion times
will vary.

## Platform compatibility

The 25 preference profiles and scoring rules remain unchanged. The graphics
question merges AMD/Intel into `open-driver` and distinguishes `apple-silicon` and
`intel-mac`. Mac users get one conditional follow-up, making 17 screens; ordinary
PC users retain 16. Follow-up answers stay outside the engine’s `AnswerSet`. The
old `amd` and `intel` answer IDs are replaced by `open-driver` in fixtures and
imports; no saved browser answer migration is needed because answers are not persisted.

`src/domain/platform.ts` defines support states. `src/data/platforms.ts` holds
follow-up schemas, reviewed support paths, and source links.
`src/platforms/compatibility.ts` maps the original engine result to a separate
practical candidate list:

- Standard PCs and Intel Macs without T2 retain preference order; exact model
  compatibility still needs checking. “Native” indicates the standard x86
  installation route, not certification of every peripheral.
- T2 Macs list maintained installers/platform modules before documented manual
  paths. Original preference order breaks ties within each support tier. Unknown
  support never implies incompatibility or inherits support from a distro family.
- M1/M2 use Fedora Asahi Remix KDE/GNOME variants attached to the existing Fedora
  profiles. The better-ranked Fedora profile supplies the first variant. No 26th
  personality profile or Asahi-specific numeric bonus is added. Other matches are
  clearly marked as preference-only comparisons. The displayed percentage uses
  the base Fedora profile; it does not certify ARM application/game support.
- M3 is experimental. M4/newer and unknown chip generations have no verified
  supported path in this dataset and remain conservative support-check results.
- Unidentified graphics/platforms and unknown T2 status preserve preference
  matches without asserting a compatible installer. These paths target native
  installation; virtual-machine recommendations are outside this change.

Compatibility evidence was checked on 2026-10-02 against the
[Asahi project](https://asahilinux.org/fedora/), its
[M3](https://asahilinux.org/docs/platform/feature-support/m3/) and
[M4](https://asahilinux.org/docs/platform/feature-support/m4/) support tables,
[t2linux installer options](https://wiki.t2linux.org/guides/preinstall/), and
[CachyOS’s T2 guide](https://wiki.cachyos.org/installation/installation_t2macbook/).
Support changes over time; review these records before extending hardware claims.

Each base question has score-bearing options. Everyday, creative, and gaming
use-case checkboxes record intent and select preparation tips without a separate
score effect; the gaming-intensity question controls numeric gaming preference.
Neutral answers deliberately express no preference. Platform follow-ups affect
installation guidance, never numerical preference scores.
