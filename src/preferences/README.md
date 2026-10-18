# User preferences, v1

The 16-question schema converts complete answers into a deterministic
`UserPreferenceProfile`. This module owns validation and evidence construction;
[the engine](../recommendations/README.md) owns ranking and constraint evaluation.

## Review and use

```sh
npm run preferences:review                  # Questions and example target table
npm run preferences:review -- --json        # Copy, effects, answers, full profiles
npm run preferences:review -- --answers /tmp/answers.json
```

JSON output includes option IDs, emoji, localized copy and effects. File mode
rejects invalid JSON or answers; the application does not persist answers.

```ts
import { buildPreferenceProfile } from './profile.ts';

// One option ID in an array for single-choice questions; 1–3 for use-cases.
const profile = buildPreferenceProfile(answers);
```

`validateAnswers(unknown)` returns issues; `buildPreferenceProfile(unknown)` throws an
`InvalidAnswersError` with structured question IDs and issue codes. Missing,
empty, malformed, duplicate, unknown, or excessive selections are rejected.
Incomplete sessions belong in `src/quiz/state.ts`, not in fabricated finished profiles.
Issue codes are internal; user-facing error messages live in `src/i18n/`.

## Boundaries

- `src/domain/preferences.ts`: question, effect, answer, and profile contracts.
- `src/data/questions.ts`: stable IDs, section/order, selection limits, decorative
  emoji, numeric effects, and explicit trait/eligibility evidence.
- `src/i18n/en/questions.ts`: prompts, helpers, labels, and final-road descriptions;
  exposed as `en.questions`. No matching logic depends on translated strings.
- `src/preferences/profile.ts`: answer validation and pure profile construction.
- `scripts/preference-examples.ts`: eight review fixtures shared with tests.

`QUESTION_COUNT` derives from the schema and supplies both public format badges.
The question order follows the 8 / 4 / 3 / 1 structure:

|   # | ID               | Main evidence                                              |
| --: | :--------------- | :--------------------------------------------------------- |
|   1 | experience       | Beginner needs; reported Linux experience                  |
|   2 | setup            | Default polish, convenience, explicit self-build intent    |
|   3 | freshness        | Desired software currency and conservatism                 |
|   4 | maintenance      | Convenience, conservatism; upkeep tolerance                |
|   5 | control          | System control; explicit control appetite                  |
|   6 | customization    | Desktop flexibility and default polish                     |
|   7 | release          | Fixed/rolling preference and strength                      |
|   8 | system-model     | Traditional/atomic preference, container-first interest    |
|   9 | use-cases        | 1–3 purposes; development and old-hardware needs           |
|  10 | gaming           | Gaming intensity                                           |
|  11 | hardware         | Resource constraints, separate from machine age            |
|  12 | gpu              | Graphics vendor or explicit uncertainty                    |
|  13 | software-freedom | Free-software preference                                   |
|  14 | troubleshooting  | Learning tolerance; secondary convenience/control needs    |
|  15 | identity         | Aspirational preferences and explicit specialist interests |
|  16 | path             | Thematic reinforcement and qualified control priority      |

## Targets, evidence weights, and importance

Each answer contributes `{ target, weight }` pairs on the distro model's ten
capability axes. Targets are weighted means:

```text
target(axis) = sum(answer target × evidence weight) / sum(evidence weight)
```

With no evidence, a target and its importance are 0. Targets are continuous 0–5
values, without half-step rounding or per-person min/max normalization.

Direct questions use weight 4; setup and other secondary signals use 1, except
homelab development at 2. Identity uses 2; the final road uses 0.5. These weights
describe evidence strength within an axis, not the later match score. Freshness
and stability need not sum to 5. Rolling and atomic choices do not change numeric
capabilities.

`importance` is a separate 0–5 map. For benefit axes it equals the resulting
target: a user who needs little gaming support gives it little weight. Freshness
has importance 4 even for a low target, because choosing older software is still
a meaningful directional preference. There is no global normalization of weights.
Evidence weights and importance are design judgments, not empirical calibration.

[The engine](../recommendations/README.md) normalizes importance to 0–1 and uses
shortfall distance for benefits: zero gaming need does not reward poor gaming,
and surplus beginner support or polish is not a mismatch.

## Explicit evidence and mixed answers

- Only the build setup answer supplies `traits.selfBuild`; the engine uses it for
  [polish importance](../recommendations/README.md#capability-fit)
  and [specialist credit](../recommendations/README.md#specialist-intent).
- Experience comes only from question 1: regular use is intermediate; terminal
  confidence and init-system familiarity are advanced self-reports. Aspirations
  and troubleshooting never promote experience. Upkeep tolerance comes from
  question 4, control appetite from 5, and learning tolerance from 14.
- Question 9 retains all selected purposes in canonical order. Development supplies
  developer target and importance 5, including when homelab is also selected.
  Homelab alone retains target and importance 4; its trait and preparation advice
  remain present in the combined answer. This pair is the only exception to the
  weighted-mean aggregation. Creative/security intent is categorical. Question 10
  alone sets numeric gaming intensity, including zero.
- Question 11 supplies resource needs; old-hardware intent adds secondary evidence.
  Handheld hardware sets resource target 2, `deviceType: handheld`, and power category
  `unspecified`. Other hardware answers use `desktop-or-laptop`. Device choice
  does not infer GPU, gaming intensity, use cases, atomic preference, or eligibility, and is
  not a RAM/CPU compatibility gate.
- The direct freshness question sets `freshnessIntent`; identity/finale answers may
  blend numeric targets without changing it. The engine's [freshness distance](../recommendations/README.md#capability-fit)
  uses this explicit intent.
- Familiar panels/menus records `desktopLayoutPreference: panel-menu`; other
  customization choices leave layout unspecified.
- Fixed/traditional choices are explicit `false`; neutral choices omit the optional
  boolean and have strength 0. Positive preferences have strength 1 or 2.
  Atomic, rolling, and container-first interests are separate.
- Free-software preference is 0, 2, 4, or 5, without guaranteeing entirely free
  firmware, applications, or drivers. GPU `unknown` stays unknown; `other` retains
  unusual-hardware uncertainty. `open-driver` combines AMD/Intel. GPU evidence
  supplies the engine's [driver-setup refinement](../recommendations/README.md#trait-refinements).
- Identity names technical learning, declarative configuration, minimalism, or
  traditional Unix interests. The learning use case can add technical learning
  alongside an identity interest. The final road supplies low-weight capability
  targets and `finalRoad` for qualified control priority, without traits or
  eligibility evidence.

Mixed answers retain each signal. `useCases`, `interests`, and explicit `eligibility`
supply the engine's [constraint evidence](../recommendations/README.md#eligibility).
Security intent comes from the `security-testing` use case.

## Copy and platform intake

Mac GPU choices supply neutral graphics evidence and a required follow-up outside
the 16-question preference contract. Follow-ups guide installation without changing
targets, traits, or eligibility; exact device, driver, and game support still need checks.
Preparation tips add no scores or eligibility evidence; gaming tips require
positive intensity. Creative advice does not certify a workflow's compatibility.

## Verification

Tests cover every option and all 92 valid use-case combinations, answer validation,
bounds, determinism, nonmutation and evidence ownership. Each scalar trait or
eligibility field has one owning question whose options must supply required
evidence; use cases and interests accumulate.
