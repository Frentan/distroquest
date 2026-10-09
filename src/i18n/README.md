# Internationalization

English (`en.ts` and `en/`) is the editorial source. All user-facing copy, metadata,
and accessible labels live here. Domain IDs and recommendation/platform logic
remain independent of translated presentation.

## Dictionaries and routes

`Messages` covers page copy, questions, distro profiles, capabilities, preparation
tips, explanations, and platform guidance. `catalog.ts` registers complete runtime
dictionaries. `getMessages()` requires a published locale and an available dictionary;
there is no partial merge or English fallback. Draft dictionaries are loaded only
by Node review tooling.

`locales.ts` separates known IDs, actively planned locales, deferred locales, and
published locales. Reserved IDs keep their paths and native-language name keys;
they do not enable translation work or publication.

`src/routing.ts` owns the `home` and `quiz` page identities. English uses `/` and
`/quiz/`; other locales use `/{locale}/` and `/{locale}/quiz/`. `pagePath()` constructs
known paths; `publishedPagePath()` gates public links. Helpers do not create routes.
Astro route files reuse `HomePage.astro` and `QuizPage.astro`; the quiz client receives
its locale through `data-locale`.

With `SITE_URL`, published equivalents receive self-referencing canonical and Open
Graph URLs and reciprocal `hreflang` links. The sitemap lists published indexable
pages. The complete quiz remains on one route with `noindex, follow`, outside the
sitemap. Without an origin, absolute metadata is omitted and the sitemap is empty.

## Parameterized messages

`message.ts` creates callable messages from a template, an ordered list of named
text/number/choice parameters, and a locale. Translations may reorder or repeat
placeholders, but must retain the call contract. TypeScript checks positional
argument types; validation checks parameter names, types, choices, and precision.
Message templates and every choice label must contain nonempty text.

`Intl.NumberFormat` localizes human-readable numbers without changing calculation
inputs, ranking, or machine-readable ARIA values. `createExplanations()` resolves
domain codes against the selected dictionary's explanation records.

## Freshness and publication

Node tooling hashes individual strings and explicit message units with SHA-256.
Message units include their template, ordered parameter definitions, choice labels,
and formatting locale. Canonical JSON sorts object keys; string whitespace and
array order remain significant. JSON Pointer paths identify units unambiguously.
Hashing runs in development/build tooling, not in the browser.

`{locale}/reviews.json` stores accepted English and translation hashes per unit,
review status, and reviewer identity. Publication approval is recorded separately.
English edits mark affected reviews `staleSource`; translated edits mark
`changedTranslation`. The report also identifies missing, extra, unreviewed,
invalid, and orphaned units. Accept hashes from the exact content reviewed;
changed content requires another review.

Every published locale requires complete content, matching parameter contracts,
and correct message formatting locales. A translated locale also requires current
reviewed hashes for every unit and explicit publication approval; English is the
editorial source and does not require translation reviews. Deferred locales must
be reactivated before they can be published. `dictionaryIssues()` checks structural
coverage, including option IDs, nonempty strings, and array lengths.

The Astro integration validates published content at configuration startup and on
builds, including direct `astro build` commands. Output checks require both home
and quiz pages for every published locale and reject unexpected HTML routes.
Run the checks while editing; freshness is not monitored through HMR.

```sh
npm run i18n:check
npm run i18n:review
npm run i18n:review -- --locale es
npm run i18n:review -- --locale it
npm run i18n:review -- --locale pt
npm run --silent i18n:review -- --json
npm run --silent i18n:review -- --markdown
npm run --silent i18n:review -- --hashes
```

`i18n:check` validates published locales. `i18n:review` reports draft coverage and
freshness for `--locale <code>`, defaulting to Spanish (`es`). It loads
`src/i18n/{locale}/draft.ts` (named export `draftEs`, `draftIt`, `draftPt`, etc.)
and the corresponding `reviews.json`. A locale without a draft produces an error;
selecting a locale does not create content or enable publication. Italian and
Portuguese have no drafts yet.

Combine `--locale` with any one output mode: `--json` includes content units and proposed hashes,
`--markdown` produces bilingual copy in authored order, and `--hashes` emits a
proposal snapshot. Generated proposals do not grant editorial or publication approval.
