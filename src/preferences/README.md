# User preferences, v1

The 16-question schema converts complete answers into a deterministic
`UserPreferenceProfile`. This module owns validation and evidence construction;
[the engine](../recommendations/README.md) owns ranking and constraint evaluation.

## Review and use

```sh
npm run preferences:review                  # Questions and example target table
npm run preferences:review -- --json        # Copy, effects, answers, full profiles
npm run preferences:review -- --answers /tmp/answers.json
npm test
```

The JSON review output retains option IDs, emoji, localized copy, and effects.
The file mode accepts the same answer shape as the builder and exits unsuccessfully
for invalid JSON or answers. These are local inspection tools; no answers are
persisted by the application.

```ts
import { buildPreferenceProfile, validateAnswers } from './profile.ts';
import type { AnswerSet } from '../domain/preferences.ts';

// One option ID in an array for single-choice questions; 1–3 for use-cases.
// See scripts/preference-examples.ts for eight complete answer sets.
const issues = validateAnswers(answers);
if (issues.length === 0) {
  const profile = buildPreferenceProfile(answers);
}
```

`buildPreferenceProfile(unknown)` validates independently and throws an
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
The question order follows the requested 8 / 4 / 3 / 1 structure:

|   # | ID               | Main evidence                                              |
| --: | :--------------- | :--------------------------------------------------------- |
|   1 | experience       | Beginner needs; reported Linux experience                  |
|   2 | setup            | Default polish, convenience, system setup appetite         |
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
|  16 | path             | Small thematic reinforcement                               |

## Targets, evidence weights, and importance

Capabilities use the same ten keys as the distro model. Each answer contributes
`{ target, weight }` pairs on 0–5, rather than adding positive/negative modifiers
to an arbitrary starting value. Targets are weighted means:

```text
target(axis) = sum(answer target × evidence weight) / sum(evidence weight)
```

With no evidence, a target is 0 and has zero importance. Outputs are continuous
0–5 values; they are not rounded to distro half steps. No per-person min/max
normalization occurs, so answering one question does not rescale unrelated axes.

Direct questions use weight 4; secondary signals use 1 (homelab development uses 2);
identity uses 2; the final road uses 0.5. Setup describes secondary consequences,
so it uses 1. Weights represent evidence strength within an axis, not the later
distribution match score. Freshness and stability are related but not forced to
sum to 5. Rolling and atomic choices never change numeric capabilities. The familiar-layout
option sits between personal touches and workflow rearrangement, using target 3.5
for customization and 4 for polish; it supplies an explicit panel/menu preference
without changing technical control or experience.

`importance` is a separate 0–5 map. For benefit axes it equals the resulting
target: a user who needs little gaming support gives it little weight. Freshness
has importance 4 even for a low target, because choosing older software is still
a meaningful directional preference. There is no global normalization of weights.
Evidence weights and importance are design judgments, not empirical calibration.

[The engine](../recommendations/README.md) normalizes importance to 0–1 and uses
shortfall distance for benefits: zero gaming need does not reward poor gaming,
and surplus beginner support or polish is not a mismatch.

## Explicit evidence and mixed answers

- Experience comes only from question 1: regular use is intermediate; terminal
  confidence and init-system familiarity are advanced self-reports. Aspirations
  and troubleshooting never promote experience. Upkeep tolerance comes from
  question 4, control appetite from 5, and learning tolerance from 14.
- Question 9 retains all selected purposes in canonical order. Development supplies
  developer needs; homelab supplies weaker evidence. Creative/security intent stays
  categorical, without a new capability axis. Question 10 alone sets numeric gaming
  intensity, including zero; a gaming checkbox cannot override it.
- Question 11 supplies resource needs; old-hardware intent adds secondary evidence.
  Handheld hardware sets resource target 2, `deviceType: handheld`, and power category
  `unspecified`. Other hardware answers use `desktop-or-laptop`. Device choice
  does not infer GPU, gaming intensity, use cases, atomic preference, or eligibility, and is
  not a RAM/CPU compatibility gate.
- The direct freshness question sets `freshnessIntent`; identity/finale answers may
  blend numeric targets without changing it. The engine permits limited extra
  freshness for the balanced choice.
- Familiar panels/menus records `desktopLayoutPreference: panel-menu`; other
  customization choices leave layout unspecified. Flexibility, layout, and system
  control remain separate signals.
- Fixed/traditional choices are explicit `false`; neutral choices omit the optional
  boolean and have strength 0. Positive preferences have strength 1 or 2. Atomic,
  rolling, and container-first interests are separate; NixOS is not image-based.
- Free-software preference is 0, 2, 4, or 5, without guaranteeing entirely free
  firmware, applications, or drivers. GPU `unknown` stays unknown; `other` retains
  unusual-hardware uncertainty. `open-driver` combines AMD/Intel. NVIDIA evidence
  refines setup rather than vetoing eligibility.
- Identity names technical learning, declarative configuration, minimalism, or
  traditional Unix interests. The learning use case can add technical learning
  alongside an identity interest. The final road contributes only low-weight
  capability targets, never traits or eligibility evidence.

Mixed answers blend rather than discard evidence: newcomers can want deep control,
experienced users can want low upkeep, and current software can accompany fixed
releases. `useCases`, `interests`, and explicit `eligibility` supply evidence for
the engine's constraints; broad intent cannot bypass their minimum requirements.
Security intent comes from `useCases` membership (`security-testing`), without a
separate boolean that can disagree with it.

## Copy and platform intake

Copy lives in `src/i18n/`. Hardware wording distinguishes resources from age;
atomic wording does not promise an unbreakable base. Mac GPU choices supply neutral
graphics evidence and a required platform follow-up outside the 16-question
preference contract. Follow-ups guide installation without changing targets,
traits, or eligibility; exact device, driver, and game support still need checks.
Preparation tips add no scores or eligibility evidence; gaming tips require
positive intensity. Creative advice does not certify a workflow's compatibility.

## Verification

Tests cover every option and all 92 valid use-case combinations, malformed answers,
bounded deterministic output, canonical ordering, nonmutation, monotonic direct
signals, neutral traits, GPU separation, gaming zero, explicit eligibility, and
limited finale influence. The builder preserves its target/importance contract;
scoring lives in the engine and interactive state/presentation in `src/quiz/`.
Schema tests enforce one owning question for each scalar trait/eligibility field
and require every option in its owning question to provide mandatory evidence.
Use cases and interests accumulate instead; capability signals blend by weight.
