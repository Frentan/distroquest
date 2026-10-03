# Recommendation engine, model v7

The pure engine converts complete quiz answers into a deterministic ranking of
all 25 distro profiles. Model v7 adds minimum eligibility requirements for manual
desktops and NixOS, retaining the separate specialist intent matches. The shared
trait cap, normalization scale, questionnaire, and ten capability axes are unchanged.

## API and boundaries

```ts
import { recommend } from './engine.ts';
const result = recommend(answers); // { modelVersion: 7, profile, ranking }
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

| Evidence                                                    | Adjustment                                       |
| :---------------------------------------------------------- | :----------------------------------------------- |
| Explicit rolling/fixed choice                               | ±2 × strength (1 or 2)                           |
| Explicit atomic/traditional choice                          | ±2 × strength (1 or 2)                           |
| Container-first interest                                    | +3 image-based; −2 other models                  |
| Positive gaming intensity and gaming focus                  | +3 × normalized gaming importance                |
| Development intent and development focus                    | +2                                               |
| Creative intent and documented creative integration         | +2                                               |
| Security-testing intent and security focus                  | +8; eligibility still applies                    |
| NVIDIA GPU                                                  | integrated +2; guided 0; manual −2               |
| FOSS preference `f` on 0–5                                  | free-software-first +3 × f/5; pragmatic −1 × f/5 |
| Minimalism interest and minimal focus                       | +3                                               |
| Declarative interest and declarative model                  | +6                                               |
| Explicit panel/menu preference and assessed matching layout | +2                                               |
| Handheld device and documented handheld path                | +3                                               |

The net adjustment is capped to −12…+12. `traitModifiers` retains uncapped entries
and a `traits.cap` correction when needed; its sum reproduces `traitAdjustment`.

Creative integration is documented for Nobara, Bazzite, PikaOS, CachyOS, Bluefin,
and Solus. [The dataset review](../data/README.md#creative-integration-review)
records each setup convenience and its official source (checked 2026-10-02).
Other profiles are `unassessed`, with no penalty. Only explicit creative intent
activates the modifier; the Creative kit tip remains. Neither the bonus nor a
setup helper guarantees app, codec, plugin, or peripheral compatibility.

Panel/menu credit applies across assessed desktops, without implying KDE or penalizing
other layouts. Handheld credit currently applies only to Bazzite's documented path;
all handheld results advise checking the device, and unassessed paths say so.
See [the dataset notes](../data/README.md) for trait definitions and sources.

Neutral release/atomic choices add nothing. Only NVIDIA evidence activates driver
modifiers. A gaming checkbox cannot override zero intensity. FOSS policy does not
guarantee free firmware. Atomic updates alone do not imply container-first interest;
NixOS is declarative, not an image-based container workstation.

## Specialist intent

Specific user intent receives separate credit when it matches an assessed purpose:

| Explicit evidence                                | Assessed traits                           | Credit | Current match |
| :----------------------------------------------- | :---------------------------------------- | -----: | :------------ |
| Security-testing intent                          | Security focus                            |     +4 | Kali          |
| Handheld device and positive gaming intensity    | Gaming focus and documented handheld path |     +2 | Bazzite       |
| Development purpose and container-first workflow | Development focus and image-based system  |     +2 | Bluefin       |

`specialistModifiers` explains each match and sums to `specialistAdjustment`,
outside the ±12 trait cap. Existing general trait credits remain inside that cap.
Rules use assessed traits, without distro-ID bonuses or a new capability axis;
eligibility is evaluated first and is never bypassed.

Bazzite's [Handheld Wiki](https://docs.bazzite.gg/Handheld_and_HTPC_edition/Handheld_Wiki/)
documents its separate handheld gaming path. Bluefin's
[Developer Mode](https://docs.projectbluefin.io/bluefin-dx/) provides the
container-oriented development environment; the standard desktop assessment does
not imply that developer mode is already enabled. Both sources were checked on
2026-10-03. Result explanations retain the device-check or developer-mode context.

Desktop gaming alone, a gaming checkbox with zero intensity, development without
container-first intent, and containers without development receive no new credit.
Creative setup conveniences retain their general trait modifier; platform
installation paths remain separate from scores. Future extensions need specific
user evidence, source-backed traits, scenario review, and a normalization review.

## Eligibility

Constraints use conjunctive `allOf` conditions. Ordered thresholds compare explicit
experience and tolerance; use cases and interests require membership. Aspirational
identity/finale answers cannot promote experience.

- Failed `require`: ineligible, −100 points, normalized score zero; listed after
  every eligible record. Kali requires security intent and intermediate experience.
- `strongly-prefer`: −8 per unmet condition, capped at −24 per constraint; +2 if
  fully satisfied. These adjustments sit outside the trait cap.
- Arch, Gentoo, Slackware, Void, and Alpine require intermediate experience,
  moderate upkeep tolerance, and moderate system-control interest.
- NixOS requires intermediate experience and moderate learning tolerance, without
  a hard upkeep or control requirement. Its distinct model needs learning evidence.

These are recommendation floors for the assessed desktops, not upstream installation
restrictions. Existing stronger conditions remain soft: advanced expertise, high
upkeep/control, and specific interests can improve fit without becoming hard gates.
See [the dataset notes](../data/README.md#breadth-and-constraints) for source evidence.
Matched hard requirements add no points; eligible scores stay unchanged.

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
zero breadth and no soft-constraint reward. Bazzite and Bluefin each allow 100
capability, 12 trait, 2 specialist, and 1.6 breadth points, totaling 115.6.
Dataset tests check these upper bounds
before normalization, so future changes cannot silently rely on clamping overflow.
The scale is independent of other candidates and is not a probability or calibrated
percentage. Revisit it when adding specialist matches or positive constraint rewards.
Persist answers and recompute rankings after model changes.

Sort by eligibility, descending unrounded raw score, then ascending distro ID for
exact ties. The UI rounds fit to one decimal place; displayed ties can be close
scores or exact ties. Capability bars show assessed strengths out of 5, not fit.

`family` describes ancestry; `presentationGroup` groups the two Fedora desktop
editions while retaining distinct derivatives. `workflow` distinguishes conventional,
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

The 20 complete fixtures in `scripts/recommendation-personas.ts` cover beginners,
gaming, development, old hardware, rolling/control/declarative workflows, security,
FOSS, conservative updates, manual Unix use, simple polished desktops, convenient
rolling desktops, rolling gaming, and expert minimal systems. Tests assert sensible top-N results,
constraints, deterministic scores, and reconstructable diagnostics. Five paired
creative scenarios check that the refinement leaves capability scores, expertise,
and eligibility unchanged; baseline persona rankings remain unchanged.

`formatRankingTable` prints all score components. JSON includes the full profile,
reasons, cautions, trait modifiers, and capability/constraint diagnostics. Use
`npm run --silent` for clean JSON. [Example rankings](EXAMPLES.md) contain all 20 full
tables, including specialist fixtures; `--examples` derives its list from the persona
registry so new fixtures are included automatically.

Across these fixtures, all 25 profiles appear on standard-PC shortlists through
the actual platform presentation path. This includes primary results, sibling
editions, and alternatives; it does not require every profile to win or establish
support on every platform. Coverage tests also check that Void and Alpine satisfy
their specialist conditions in the expert minimal-system scenarios.

The beginner old-laptop fixture favors Mint, MX, and Debian; the Windows gamer favors
Bazzite, Fedora Workstation, Pop!_OS, and Bluefin. Atomic development favors Bluefin;
experienced security testing can favor Kali while beginners remain excluded.
The penetration-tester fixture now puts Kali first at 110.44 raw points (95.2 fit);
shared release/system preferences cannot absorb its separate specialist credit.
These are reviewed scenarios, not user research or empirical calibration. Numeric
assessments, freshness/gaming distance rules, small trait bonuses, and specialist
penalties remain editorial tuning judgments. Verify real workflows and hardware.
