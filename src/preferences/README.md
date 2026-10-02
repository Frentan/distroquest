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
These are initial design judgments to review with scenarios, not empirically
calibrated measurements.

The recommendation engine distinguishes wanted benefits from aversions. Zero gaming
need must not reward poor gaming; advanced users must not be rewarded for an unfriendly
distro. Extra polish or beginner support is not inherently a mismatch. Capability
targets and importance are inputs to [the scoring engine](../recommendations/README.md),
which normalizes importance to 0–1 and uses shortfall distance for benefits.
Direct system-model preferences remain traits.

## Explicit evidence and mixed answers

- Experience comes only from question 1. Regular use is intermediate; terminal
  confidence and the init-system answer are advanced. Humor remains self-report,
  not proof of expertise. Aspirations and troubleshooting never promote experience.
- Upkeep tolerance comes only from question 4; control appetite from question 5;
  learning tolerance from question 14. Willingness to learn a new model is distinct
  from wanting regular maintenance. The architect fixture demonstrates this.
- Question 9 records all selected use cases in canonical order. Development maps
  to developer needs; homelab supplies a smaller development signal. Creative and
  security purposes remain explicit traits because the current capability model
  has no creative-work or pentesting-quality axis. No such score is invented.
- Question 10 exclusively supplies numeric gaming intensity, including a genuine
  zero. Question 9's gaming selection remains a use case, even if answers differ.
  Everyday, creative, and gaming intent also select preparation tips. Tips add
  no scoring weights or eligibility evidence; the engine separately applies a
  small documented-integration bonus for explicit creative intent. Gaming
  tips require positive explicit intensity. Creative app/peripheral advice is not
  a claim about distro compatibility with a specific workflow.
- Question 11 supplies the main resource-constraint target. Selecting old-hardware
  use in question 9 supplies secondary evidence; opposing answers blend rather
  than discarding either. This is not a RAM, CPU architecture, or compatibility gate.
- The additional hardware answer 🕹️ “A handheld gaming PC” supplies resource target
  2 and explicit `deviceType: handheld`. Its power category is `unspecified`;
  portability is not a resource measurement. It does not infer GPU, gaming intensity,
  use cases, atomic preference, or eligibility. Existing hardware answers use
  `deviceType: desktop-or-laptop` and preserve their original numeric targets.
- The direct freshness question also supplies `freshnessIntent`. Identity/finale
  signals may blend numeric targets but cannot change that categorical evidence.
  Scoring permits limited extra freshness for the balanced answer only.
- Customization's new third answer 🪟 “Familiar panels and menus, with plenty to
  tweak” records `desktopLayoutPreference: panel-menu`. Other options leave it
  unspecified; flexibility and layout preference remain distinct signals.
- Fixed/traditional choices are explicit `false`; neutral choices omit the
  optional boolean and have strength 0. Positive preferences have strength 1 or 2.
  Atomic updates do not imply rolling releases. Container-first is separate from
  atomic interest so NixOS is not silently treated as an image-based workstation.
- Free-software preference is 0, 2, 4, or 5. It indicates policy preference, not a
  guarantee of entirely free firmware, applications, or drivers.
- `unknown` GPU is not inferred from use cases. `other` retains unusual-hardware
  uncertainty. `open-driver` combines AMD/Intel graphics. Mac answers use neutral
  graphics evidence and a separate platform layer. NVIDIA is evidence for setup
  modifiers, not an eligibility veto. The platform layer distinguishes native
  Mac installation paths. Driver generation, exact device features, and game/anti-cheat compatibility still need
  checks before actionable hardware claims.
- Identity has seven options to name technical learning, declarative configuration,
  minimalism, and traditional Unix directly. Choosing one supplies only that
  interest; the learning use case can add technical learning alongside it. Every
  interest in the existing distro constraints is reachable without stereotypes.
- The final road contributes only low-weight capability targets. It cannot change
  traits, experience, learning/upkeep tolerance, or specialist eligibility evidence.

Mixed answers are retained. A newcomer can want deep control; an experienced user
can want low maintenance. Wanting current software and fixed releases is coherent.
A learning/security use case records intent but does not satisfy Kali's required
intermediate experience. The recommendation engine now evaluates `require` and
`strongly-prefer` constraints; `UserTraits.useCases`, `interests`, and `eligibility`
provide its existing vocabulary without replacing distro constraints.

## Copy and platform intake

User-facing copy lives in `src/i18n/`. Hardware wording distinguishes resources
from age; the atomic prompt does not promise an unbreakable base. `open-driver`
combines AMD/Intel graphics. Mac choices carry neutral graphics evidence and add
one required platform follow-up outside the 16-question preference contract.
Follow-ups guide installation without changing targets, traits, or eligibility.
The base quiz took about three minutes in a user playtest; times will vary.

## Verification

Tests cover every option and all 92 valid use-case combinations, malformed answers,
bounded deterministic output, canonical ordering, nonmutation, monotonic direct
signals, neutral traits, GPU separation, gaming zero, explicit eligibility, and
limited finale influence. The builder preserves its target/importance contract;
scoring lives in the engine and interactive state/presentation in `src/quiz/`.
