# Internationalization

English (`en.ts` and `en/`) is the editorial source. All user-facing copy, metadata,
and accessible labels live here. Domain IDs and recommendation/platform logic
remain independent of translated presentation.

## Dictionaries and routes

`Messages` covers page copy, questions, distro profiles, capabilities, preparation
tips, explanations, and platform guidance. `catalog.ts` registers complete runtime
dictionaries. `getMessages()` requires a published locale and an available dictionary;
there is no partial merge or English fallback. EN/ES/PT/IT are registered explicitly;
Node review tooling alone loads unpublished drafts.

`locales.ts` separates known IDs, actively planned locales, deferred locales, and
published locales. Reserved IDs keep their paths and native-language name keys;
they do not enable translation work or publication.

`src/routing.ts` owns the `home`, `quiz`, `distros` and typed `distro:<id>` page identities. English uses `/` and
`/quiz/`; other locales use `/{locale}/` and `/{locale}/quiz/`. `pagePath()` constructs
known paths; `publishedPagePath()` gates public links. Helpers do not create routes.
Directories use `/{locale}/distros/`; profiles use
`/{locale}/distros/{slug}/`, with the English prefix omitted. Profile slugs match
stable distro IDs. The quiz client receives its locale through `data-locale`.

With `SITE_URL`, published equivalents receive self-referencing canonical and Open
Graph URLs and reciprocal `hreflang` links, including `x-default` to the corresponding English page. The sitemap lists published indexable
pages. The complete quiz remains on one route with `noindex, follow`, outside the
sitemap. Without an origin, absolute metadata is omitted and the sitemap is empty.

## Language switching

Header language links retain native-language names and accessible labels, and
lead to the equivalent page or distro profile. On the quiz, any selected or retained
answer triggers the restart confirmation
before same-tab language navigation. The dialog identifies the destination language;
cancel or Escape preserves progress. Confirming clears the old page's answers and
starts the destination quiz empty.
Answers and language choices are not persisted; theme persistence is independent.

## Parameterized messages

`message.ts` creates callable messages from a template, an ordered list of named
text/number/choice parameters, and a locale. Translations may reorder or repeat
placeholders, but must retain the call contract. TypeScript checks positional
argument types; validation checks parameter names, types, choices, and precision.
Message templates and every choice label must contain nonempty text.

`Intl.NumberFormat` localizes human-readable numbers without changing calculation
inputs, ranking, or machine-readable ARIA values. `formattingLocale()` maps `pt`
to Brazilian number formatting (`pt-BR`); dictionary, message, route, and HTML
language identity remain `pt`. Other locale IDs use their own formatting.
`createExplanations()` resolves domain codes against the selected dictionary's
explanation records.

## Freshness and publication

Node tooling hashes individual strings and explicit message units with SHA-256.
Message units include their template, ordered parameter definitions, choice labels,
and locale identity (which selects the formatting conventions above). Canonical JSON sorts object keys; string whitespace and
array order remain significant. JSON Pointer paths identify units unambiguously.
Hashing runs in development/build tooling, not in the browser.

`{locale}/reviews.json` stores accepted English and translation hashes per unit,
review status, and reviewer identity.
English edits mark affected reviews `staleSource`; translated edits mark
`changedTranslation`. The report also identifies missing, extra, unreviewed,
invalid, and orphaned units. Accept hashes from the exact content reviewed;
changed content requires another review.

Every published locale requires complete content, matching parameter contracts,
and correct message formatting locales. A translated locale also requires current
reviewed hashes for every unit and separate explicit publication approval; English is the
editorial source and does not require translation reviews. Deferred locales must
be reactivated before they can be published. `dictionaryIssues()` checks structural
coverage, including option IDs, nonempty strings, and array lengths.

The Astro integration validates published content at configuration startup and
on builds, including direct `astro build` commands. Output checks enforce exact
route coverage, localized content, internal links and JSON-LD. Freshness is not
monitored through HMR; run the checks while editing.

```sh
npm run i18n:check
npm run i18n:review -- --locale it
npm run --silent i18n:review -- --locale it --markdown
```

`i18n:check` validates published locales. `i18n:review` reports draft coverage and
freshness for `--locale <code>` (`es`, `pt`, or `it`), defaulting to `es`. It loads
`src/i18n/{locale}/draft.ts` (named export `draftEs`, `draftIt`, `draftPt`, etc.)
and the corresponding `reviews.json`. A missing draft is an error; selecting a
locale does not create or publish it.
ES/PT/IT review entry points re-export their runtime dictionaries.

Combine `--locale` with any one output mode: `--json` includes content units and proposed hashes,
`--markdown` produces bilingual copy in authored order, and `--hashes` emits a
proposal snapshot. Generated proposals do not grant editorial or publication approval.

## Informational pages and search metadata

Profiles render the existing localized summaries, archetypes, suitability lists,
strengths, cautions and edition notes, plus all ten curated capability ratings.
Profiles use accessible capability meters, without personalized fit scores.
Official destinations live separately in
`src/data/official-websites.ts`; an unverified destination is omitted. The quiz's
platform guidance remains separate from these general summaries.

With an origin, the English root identifies DistroQuest with `WebSite` JSON-LD.
Indexable pages describe themselves with `WebPage` or `CollectionPage`; quizzes
emit no structured data. The social image reuses the canonical favicon mark.
`npm run assets:social` regenerates it with installed ImageMagick, outside the
ordinary build.

A complete production build emits 128 HTML pages and 124 sitemap entries:
four homepages, four directories and 116 profiles are indexable; four quizzes are
excluded.
