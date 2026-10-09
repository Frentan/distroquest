# Recommendation engine, model v11

The pure engine converts complete quiz answers into a deterministic ranking of
all 29 distro profiles, with eligibility, score components, and explanation codes.
Model v11 grades one soft upkeep shortfall: explicit moderate maintenance tolerance
incurs −4 when high tolerance is preferred, rather than the usual −8. Hard
requirements, all other soft penalties, capability fit, assessments, and the model
v10 gaming-consistency rule are unchanged.

## API and boundaries

```ts
import { recommend } from './engine.ts';
const result = recommend(answers); // { modelVersion: 11, profile, ranking }
```

`recommend(unknown)` validates through the preference builder and throws
`InvalidAnswersError` for incomplete or malformed answers. It never supplies defaults.
Outputs contain machine codes; the UI localizes them through `src/i18n/`.

`normalizePreferenceProfile` retains continuous 0–5 targets and divides importance
by 5 to produce 0–1 scoring weights. Answer evidence weights belong to profile
construction, separately from scoring. Traits and eligibility remain categorical.

`scoreDistro`, `rankDistros`, `matchesCondition`, and `capabilitySimilarity` take
constructed typed inputs; they do not validate imported profiles. Import answers
through `recommend`. Functions perform no I/O, read no clock, use no randomness,
and mutate neither inputs nor dataset. Constraint diagnostics own their copies.

## Capability fit

For target `t`, assessed capability `d`, and weight `w`:

```text
raw freshness distance = abs(t - d)
raw benefit distance   = max(0, t - d)       # other nine axes
balanced freshness     = max(0, raw distance - 1) when d > t
other freshness        = raw distance
gaming distance        = min(5, 2 × raw distance)
similarity             = 1 - effective distance / 5
axis contribution      = 100 × w × similarity / sum(all weights)
capability score       = sum(axis contributions)
```

Benefits use minimum-need distance: surplus support or polish never hurts. Freshness
penalizes either direction, except that the direct balanced answer permits one
extra point above its blended target. Older packages still incur the full penalty;
secondary answers cannot overwrite `freshnessIntent`. Gaming shortfalls count twice.
Zero weights contribute nothing; an all-zero profile defensively yields zero points.
Valid quiz profiles always carry freshness importance.

`capabilityMatches` exposes target, weight, actual value, raw/effective distance,
similarity, and contribution. Reason `.met` means zero effective distance; `.near`
means similarity at least 0.9 with a remaining penalty. Cautions describe effective
gaps. Raw differences remain inspectable. No rounding occurs before sorting.

## Trait refinements

Adjustments use capability-score points and assessed traits, without distro-ID bonuses.

| Evidence                                                      | Adjustment                                       |
| :------------------------------------------------------------ | :----------------------------------------------- |
| Explicit rolling/fixed choice                                 | ±2 × strength (1 or 2)                           |
| Explicit atomic/traditional choice                            | ±2 × strength (1 or 2)                           |
| Container-first interest                                      | +3 image-based/transactional; −2 other models    |
| Gaming focus, intensity none (with or without gaming purpose) | −6                                               |
| Gaming focus, occasional intensity, no gaming purpose         | −3                                               |
| Gaming focus, occasional intensity, explicit gaming purpose   | 0                                                |
| Gaming focus, important/main intensity                        | +3 × normalized gaming importance                |
| Development intent and development focus                      | +2                                               |
| Creative intent and documented creative integration           | +2                                               |
| Security-testing intent and security focus                    | +8; eligibility still applies                    |
| NVIDIA GPU                                                    | integrated +2; guided 0; manual −2               |
| FOSS preference `f` on 0–5                                    | free-software-first +3 × f/5; pragmatic −1 × f/5 |
| Minimalism interest and minimal focus                         | +3                                               |
| Declarative interest and declarative model                    | +6                                               |
| Explicit panel/menu preference and assessed matching layout   | +2                                               |
| Handheld device and documented handheld path                  | +3                                               |

The net adjustment is capped to −12…+12. `traitModifiers` retains uncapped entries
and a `traits.cap` correction when needed; its sum reproduces `traitAdjustment`.

[The dataset notes](../data/README.md) define assessed traits and document creative,
layout, and handheld evidence. Only explicit creative intent activates its modifier;
unassessed integration receives no penalty. Setup helpers do not guarantee app,
codec, plugin, or peripheral compatibility. Handheld results always advise checking
the specific device.

Neutral release/atomic choices add nothing. Only NVIDIA evidence activates driver
modifiers. Gaming focus is distinct from gaming capability: none (target 0)
incurs −6 regardless of purpose selection. Occasional gaming (target 2) incurs
−3 without an explicit gaming purpose and receives no modifier with it.
Important/main intensity keeps its existing reward. The modifier uses
`focus.gaming-mismatch` in diagnostics and cautions, inside the existing trait cap.
Surplus gaming capability remains free. FOSS policy does not
guarantee free firmware. Transactional hosts use `containers.transactional` for their match explanation;
image-based hosts retain `containers.image-based`.
Atomic updates alone do not imply container-first interest;
NixOS is declarative, not an image-based container workstation.

## Specialist intent

Specific user intent receives separate credit when it matches an assessed purpose:

| Explicit evidence                                | Assessed traits                           | Credit | Current match       |
| :----------------------------------------------- | :---------------------------------------- | -----: | :------------------ |
| Security-testing intent                          | Security focus                            |     +4 | Kali                |
| Handheld device and positive gaming intensity    | Gaming focus and documented handheld path |     +2 | Bazzite             |
| Development purpose and container-first workflow | Development focus and image-based system  |     +2 | Bluefin, Silverblue |

`specialistModifiers` explains each match and sums to `specialistAdjustment`,
outside the ±12 trait cap. Existing general trait credits remain inside that cap.
Rules use assessed traits, without distro-ID bonuses or a new capability axis;
eligibility is evaluated first and is never bypassed.

Bazzite's [documented handheld path](https://docs.bazzite.gg/Handheld_and_HTPC_edition/Handheld_Wiki/)
requires a device check. Bluefin's [Developer Mode](https://docs.projectbluefin.io/bluefin-dx/)
supplies the container-oriented tooling; the standard desktop assessment does not
imply that it is enabled. Those sources were checked on 2026-10-03. Silverblue also satisfies the existing
image-based/development-focus predicate through its official Toolbx workflow,
reviewed on 2026-10-04; it adds no new specialist rule.

Handheld credit requires positive gaming intensity; desktop gaming alone does not
qualify. Container-development credit requires both explicit intents. Creative
integration remains a general trait; platform installation paths remain separate
from scores.

## Eligibility

Constraints use conjunctive `allOf` conditions. Ordered thresholds compare explicit
experience and tolerance; use cases and interests require membership. Aspirational
identity/finale answers cannot promote experience.

- Failed `require`: ineligible, −100 points, normalized score zero; listed after
  every eligible record. Kali requires security intent and intermediate experience.
- `strongly-prefer`: −8 per unmet condition, except −4 for explicit moderate
  maintenance tolerance falling short of a high-maintenance preference. The total
  penalty is capped at −24 per constraint; +2 if fully satisfied. These adjustments
  sit outside the trait cap. The partial-fit rule does not apply to hard requirements,
  low maintenance tolerance, or experience, learning, control, and interest shortfalls.
- Arch, Gentoo, Slackware, Void, and Alpine require intermediate experience,
  moderate upkeep tolerance, and moderate system-control interest.
- NixOS requires intermediate experience and moderate learning tolerance, without
  a hard upkeep or control requirement. Its distinct model needs learning evidence.

These are recommendation floors for the assessed desktops, not upstream installation
restrictions. Existing stronger conditions remain soft: advanced expertise, high
upkeep/control, and specific interests can improve fit without becoming hard gates.
See [the dataset notes](../data/README.md#breadth-and-constraints) for source evidence.
Matched hard requirements add no points.

`constraints` exposes condition values, match flags, and adjustments.
`constraint.i.j.unmet` identifies missing evidence; `constraint.i.met` explains
satisfied groups. Soft penalties do not exclude a distro outright.

## Final score and presentation

```text
breadth adjustment = 2 × distro breadth / 5
raw score          = capability + capped traits + specialist + eligibility + breadth
normalized score   = 100 × clamp(raw score / 116, 0, 1)  # eligible only
```

The fixed ceiling remains 116. Ordinary profiles allow 100 capability, 12 trait,
2 satisfied-soft-constraint, and 2 breadth points. Kali, the only current security
specialist, instead allows 100 capability, 12 trait, and 4 specialist points; it has
zero breadth and no soft-constraint reward. Bazzite allows 100 capability, 12 trait, 2 specialist, and 1.2 breadth points,
totaling 115.2; Bluefin and Silverblue allow 1.6 breadth points, totaling 115.6.
Dataset tests check these upper bounds
before normalization, so future changes cannot silently rely on clamping overflow.
The scale is independent of other candidates and is not a probability or calibrated
percentage. Revisit it when adding specialist matches or positive constraint rewards.

Sort by eligibility, descending unrounded raw score, then ascending distro ID for
exact ties. The UI rounds fit to one decimal place; displayed ties can be close
scores or exact ties. Capability bars show assessed strengths out of 5, not fit.

`family` describes ancestry; `presentationGroup` derives official sibling paths
from shared non-independent family and upstream lineage, retaining distinct
derivatives. Fedora groups Workstation/KDE/Silverblue; openSUSE groups
Tumbleweed/Aeon. `workflow` distinguishes conventional,
atomic, gaming-appliance, and declarative desktops. Grouping never changes scores
or imposes a one-per-family limit. The public shortlist offers a primary path,
optional sibling edition, and distinct alternatives.

The platform overlay keeps follow-up answers outside the engine contract and orders
installation paths separately. Fedora Asahi variants inherit base Fedora fit and
capabilities. See [the root README](../../README.md#how-matching-works) for support
sources and limits. Preparation tips follow selected purposes; gaming advice requires
positive intensity. Tips add no scores or eligibility evidence.

## Review and tuning limits

```sh
npm run recommendations:review
npm run recommendations:review -- --persona atomicDeveloper --json
npm run recommendations:review -- --answers /tmp/answers.json
npm run recommendations:review -- --examples
```

The 20 complete fixtures in `scripts/recommendation-personas.ts` cover ordinary
and specialist desktop workflows. Tests check top-N results, eligibility boundaries,
paired creative scenarios, deterministic scores, and reconstructable diagnostics.
Explanation tests check every emitted public reason and caution across the personas
and individual answer options, including reasons omitted from the visible shortlist.
Internal breadth and satisfied-constraint diagnostics remain untranslated.
Across these fixtures, all 29 profiles appear on standard-PC shortlists as primary
results, sibling editions, or alternatives. This does not require every profile
to win or establish support on every platform.

`formatRankingTable` prints all score components. JSON includes the full profile,
reasons, cautions, modifiers, and capability/constraint diagnostics; use
`npm run --silent` for clean JSON. [Example rankings](EXAMPLES.md) contain all 20
full tables. `--examples` uses the persona registry, so new fixtures are included
automatically.

Scores are editorial judgments, not user research or empirical calibration. Changes
need source-backed assessments, persona/focused-scenario review, a normalization
check, and regenerated examples. Verify real workflows and hardware separately.
