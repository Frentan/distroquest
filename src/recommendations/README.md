# Recommendation engine, model v2

Milestone 4 transforms a complete 16-question answer set into a normalized profile
and a deterministic ranking of all 25 distro records. It implements no quiz or
result UI and adds no dependencies. The questionnaire still has 16 questions. The hardware/customization questions
now include handheld and familiar-layout answers; Fedora Workstation assessments
and the scoring rules have been tuned against the complete persona suite.

## API and boundaries

```ts
import { recommend } from './engine.ts';

const result = recommend(answers);
// { modelVersion: 2, profile, ranking }
```

`recommend(unknown)` is the public input boundary. Existing answer validation rejects
incomplete, malformed, unknown, duplicate, or excessive selections with
`InvalidAnswersError`. It never supplies missing answers. Outputs contain no localized
prose: reasons and cautions are machine codes for later mapping into `src/i18n/`.

`normalizePreferenceProfile` adapts the existing `UserPreferenceProfile` into a
`RecommendationProfile`. Every axis contains `{ target, weight }`: target is the
original continuous 0–5 value; weight is original importance divided by 5, giving
0–1. This preserves relative importance. Answer evidence weights remain part of
profile construction, separate from scoring weights. Categorical traits and explicit
eligibility evidence remain separate from capability preferences.

`scoreDistro`, `rankDistros`, `matchesCondition`, and `capabilitySimilarity` accept
typed, already constructed inputs for development and integration. They do not
validate arbitrary imported profiles; import answers through `recommend` instead.
No function performs I/O, reads a clock, mutates its inputs, or uses randomness.
Returned constraint diagnostics do not share mutable objects with the dataset.

## Capability fit

For target `t`, assessed distro capability `d`, and importance `w`:

```text
raw freshness distance = abs(t - d)
raw benefit distance   = max(0, t - d)       # all other nine axes
effective distance     = raw distance
# balanced freshness, when d > t: max(0, raw distance - 1)
# gaming: min(5, 2 × raw distance)
similarity             = 1 - effective distance / 5
axis contribution = 100 × w × similarity / sum(all weights)
capability score  = sum(axis contributions)
```

This is normalized distance with a minimum-need interpretation for benefits.
Extra beginner support, polish, or gaming readiness is useful or harmless; an
advanced user is not rewarded merely for choosing an unfriendly system. Freshness
is directional: both newer and older packages can conflict with the selected target.
The direct freshness answer supplies `freshnessIntent`. Only “Recent enough, but
dependable” allows one extra point of freshness above its blended target before a
penalty starts. Older software still incurs the full distance penalty, and “proven
and boring” remains strict. Secondary identity/finale effects never overwrite intent.
Gaming shortfalls count twice, with similarity clamped at zero; surplus readiness
is still harmless and zero gaming importance still contributes nothing.
Zero weights contribute nothing. The defensive all-zero case yields zero capability
points; complete valid quiz profiles always carry freshness importance.

Each `capabilityMatches` entry exposes target, weight, actual value, raw distance,
effective distance, similarity, and weighted contribution. `capability.axis.met`
means zero effective distance; `.near` means at least 0.9 similarity with a remaining
penalty. Shortfall/distance cautions describe effective gaps. Raw differences remain
inspectable even within the balanced-freshness allowance. No rounding occurs before
sorting. Benefit plateaus remain intentional; traits and constraints distinguish
workflows once numeric needs are met.

## Trait refinements

All adjustments below use capability-score points. They depend on existing
traits and answer evidence, with no distro-ID bonus table.

| Evidence                                          | Match or conflict adjustment                     |
| :------------------------------------------------ | :----------------------------------------------- |
| Explicit rolling/fixed choice                     | ±2 × strength (strength 1 or 2)                  |
| Explicit atomic/traditional choice                | ±2 × strength (strength 1 or 2)                  |
| Container-first interest                          | +3 for image-based; −2 for other system models   |
| Gaming intensity and gaming focus                 | +3 × normalized gaming importance                |
| Development use case and development focus        | +2                                               |
| Security-testing use case and security focus      | +8; eligibility still applies                    |
| NVIDIA GPU                                        | integrated +2; guided 0; manual −2               |
| FOSS preference `f` on 0–5                        | free-software-first +3 × f/5; pragmatic −1 × f/5 |
| Minimalism interest and minimal focus             | +3                                               |
| Declarative interest and declarative system model | +6                                               |

Familiar panels/menus preference adds +2 only when the assessed desktop has a
`panel-menu` layout. This applies across KDE, Cinnamon, Xfce, and other assessed
panel/menu desktops; it never becomes a named KDE preference. There is no mismatch
penalty for other layouts. The new answer sits after “A few personal touches” and
before workflow rearrangement, with customization target 3.5 and polish target 4.
Its emoji is 🪟, distinct within the question.

Handheld device evidence adds +3 for `handheldSupport: documented`, currently only
Bazzite. All other assessed profiles remain `unassessed`, not asserted incompatible.
Every handheld recommendation carries `handheld.check-device-compatibility`; unassessed
ones also carry `handheld.support-unassessed`. Bazzite still needs the appropriate
image and a device-specific support check. Evidence comes from its
[Handheld Wiki](https://docs.bazzite.gg/Handheld_and_HTPC_edition/Handheld_Wiki/).
The hardware answer is 🕹️ “A handheld gaming PC.” It records `deviceType: handheld`,
resource target 2, and hardware power category `unspecified`; it does not infer GPU,
gaming intensity, use cases, experience, or atomic preference. Other hardware answers
retain their existing numeric effects and use `deviceType: desktop-or-laptop`.

The net trait adjustment is capped to −12…+12. `traitModifiers` records every
uncapped contribution and, when needed, a `traits.cap` balancing entry. Its sum
therefore reproduces `traitAdjustment`. The cap refines capability fit without
allowing stacked trait matches to rescue a very poor numeric match.

Neutral rolling/atomic answers add no modifier. Unknown, AMD, Intel, and other GPU
answers add no NVIDIA modifier. A gaming use-case checkbox cannot override numeric
zero gaming intensity. FOSS policy is a preference, not a free-firmware guarantee.
Container-first is not inferred from atomic updates; NixOS receives atomic credit
where requested but is not treated as an image-based container workstation.

## Eligibility and specialist rules

Every stored constraint is evaluated, with conjunctive `allOf` semantics. Experience
and tolerance use ordered thresholds; use cases and interests require explicit
membership. Aspirational identity/final-path answers cannot promote experience.

- A failed `require` constraint marks the distro ineligible and subtracts 100 points.
  Ineligible records remain in the complete ranking, after every eligible record,
  with normalized score zero. Kali is currently the only hard specialist gate:
  security-testing use case and at least intermediate experience are both required.
- Each missing `strongly-prefer` condition costs 8 points, capped at 24 per constraint.
  Fully satisfying a soft constraint adds 2 points. These adjustments are independent
  of the trait cap; substantial specialist reluctance is intentional.
- Gentoo checks advanced experience, high upkeep tolerance, and high system-control
  interest. Arch checks intermediate experience plus high upkeep and control.
- Alpine checks advanced experience, minimalism, and technical-learning interest.
  Slackware checks advanced experience, traditional Unix interest, and high upkeep.
- NixOS checks intermediate experience, declarative interest, and high learning
  tolerance. Routine maintenance tolerance does not substitute for learning tolerance.
- Void checks intermediate experience, high upkeep tolerance, and minimalism.

`constraints` retains the original condition values, matched flags, group result,
and applied adjustment. `constraint.i.j.unmet` caution codes identify missing
conditions; `constraint.i.met` reason codes identify satisfied groups. Numeric
penalties do not exclude soft specialists outright.

## Final score and ordering

```text
breadth adjustment = 2 × distro breadth / 5
raw score          = capability + capped traits + eligibility + breadth
normalized score   = 100 × clamp(raw score / 116, 0, 1)  # eligible only
```

Breadth contributes at most two points, with no multiplier. The fixed 116-point
normalization ceiling follows the current roster's maximum: 100 capability points,
12 trait points, 2 satisfied-soft-constraint points, and 2 breadth points. It does
not depend on the other candidates, and is not a probability, percentile, or
public-facing match claim. Revisit the ceiling if future profiles contain multiple
soft constraints. `modelVersion` identifies the current formula and machine-code
contract; persist answers rather than assuming cached rankings survive rule updates.

Sorting uses eligibility first, descending **raw** score second, and ascending
distro ID for exact ties. All 25 records are returned. `family` supplies ancestry;
`presentationGroup` groups Fedora Workstation/KDE as `fedora-desktop`, while keeping
Bazzite and Bluefin distinct. Family membership never changes core scores or removes
candidates. `workflow` independently distinguishes conventional desktop, atomic
desktop, gaming appliance, and declarative system. Fedora desktop editions share
ancestry and an edition group; Bluefin and Bazzite retain distinct workflows/groups.
No one-per-family limit or family penalty is applied. Future shortlist selection can
consider close scores and similar workflows; choosing or displaying that shortlist
remains later work.

## Persona verification and debugging

`scripts/recommendation-personas.ts` contains 15 complete answer sets: beginner,
Windows gamer, customizable-desktop developer, old laptop, rolling enthusiast, high-control
expert, declarative user, gaming-first user, gaming appliance, atomic developer,
penetration tester, security-curious beginner, FOSS advocate, conservative user,
and manual Unix administrator. Tests assert sensible top-N membership and exclusions
rather than locking every ranking position.

```sh
npm run recommendations:review
npm run recommendations:review -- --persona penetrationTester
npm run recommendations:review -- --persona atomicDeveloper --json
npm run recommendations:review -- --answers /tmp/answers.json
npm run recommendations:review -- --examples
```

`formatRankingTable(result)` is reusable by tests or local tuning scripts. Tables
print every distro and all score components; JSON includes the normalized profile,
reasons, cautions, individual trait modifiers, and constraint/capability diagnostics.
For clean JSON use `npm run --silent recommendations:review -- --json`.
[Example outputs](EXAMPLES.md) contain ten representative full ranking tables with
a contents list. `--examples` regenerates them; the five specialist scenarios remain
in the CLI/tests. The former `kdeDeveloper` fixture is now `customizableDeveloper`
to name the evidence actually present in its answers.

## Observations and tuning limits

- The beginner's old laptop ranks Mint first, MX second, Debian third. This is an
  accepted convenience/resource tradeoff for a beginner, not a defect to correct.
  Void remains low because that user lacks manual/minimalist evidence.
- Fedora Workstation now ranks third for the beginner. Its beginner friendliness
  was reassessed from 4 to 4.5 and low maintenance from 3.5 to 4; stability and
  freshness remain unchanged. These are explicit editorial judgments, not measured
  reliability. Balanced-freshness tolerance removes an overly strict interpretation
  of “Recent enough, but dependable.” No Ubuntu or family penalty was introduced.
- The Windows gamer ranks Bazzite, Fedora Workstation, Pop!_OS, Bluefin. Doubling
  gaming shortfalls strengthens gaming-specific evidence while retaining Bluefin as
  a plausible convenient desktop. Atomic development still favors Bluefin.
- Kali remains eligible and high-ranking for the experienced pentester; the beginner
  security-curious case still excludes it. Specialist eligibility rules are unchanged.
- Moderate workflow rearrangement and extensive customization both keep Fedora KDE
  near the top for the developer. Familiar-layout evidence is available separately;
  none of these answers proves a named desktop-environment preference.
- Desktop layouts describe the existing localized assessment baseline. User-selected
  desktops receive no assumed panel/menu credit. Handheld support is a separate,
  documented product path rather than a claim about the generic desktop image.
- The one-point balanced-freshness allowance, doubled gaming distance, +2 layout and
  +3 handheld bonuses, ±4 release/atomic modifiers, 12-point trait cap, and specialist
  penalties remain tuning judgments. Scenario tests are not user research or
  empirical calibration. Distro assessments keep their existing evidence limits.

Model version 2 identifies these rule changes. Before UI integration, review real
answer sets and device/game compatibility. Localize machine codes in later
presentation work; the development normalized score is not a polished percentage.
