# Distro model, v1

Milestone 2 contains 25 desktop-oriented assessments. Scores are editorial estimates
for comparison and tuning, informed by the linked project sources; they are not
benchmarks, measured reliability, or published project ratings. Review the table
during model tuning. Milestone 3 now defines questions and user
preferences separately in [the preference model](../preferences/README.md).
Milestone 4 implements scoring, ranking, and eligibility evaluation in
[the recommendation engine](../recommendations/README.md).

## Inspect and validate

```sh
npm test
npm run data:review
npm run data:review -- --json
```

The default review output is a Markdown table of all ten capabilities and breadth.
JSON includes every profile, trait, constraint, source, and English content field.
For a clean JSON file, use `npm run --silent data:review -- --json > /tmp/distroquest-profiles.json`.
Both modes validate first and exit unsuccessfully if any record is invalid. These
tools run locally with Node's built-in TypeScript stripping and test runner; they
add no dependencies and ship no inspection page.

Tests use in-process execution because this managed environment's isolated runner
reported only the file wrapper. In-process execution exposes the individual test cases
and their assertions; the suite has no global mocks or shared-state changes.

## Boundaries

- `src/domain/distro.ts`: score values, capability keys, frozen IDs, traits,
  constraint vocabulary, and content/profile types.
- `src/data/distros.ts`: language-independent profiles and source provenance.
- `src/i18n/en/distros.ts`: display names, archetypes, summaries, strengths,
  cautions, ideal users, and assessment baselines. Exposed as `en.distros`.
- `getDistros(dictionary)`: compose profiles with a supplied published dictionary.
  IDs and slugs do not encode a locale. English routing remains unprefixed.
- `src/data/validate.ts`: runtime structural validation, including exact fields
  and frozen-roster completeness. TypeScript checks authored data independently.

## Numeric capabilities

Only 0–5 in half steps is valid. Anchors: 0 actively poor fit, 1 weak,
2 below average, 3 solid, 4 strong, 5 defining strength. Half steps express an
intermediate judgment, not measurement precision. A capability describes the distro;
it never represents how much a user cares about it.

| Capability          | Interpretation                                                                            |
| :------------------ | :---------------------------------------------------------------------------------------- |
| beginnerFriendly    | Suitability for someone new to Linux, including initial learning and setup.               |
| lowMaintenance      | How little ongoing intervention, troubleshooting, and manual upkeep is expected.          |
| stability           | Conservative change, predictability, and operational steadiness of the base.              |
| freshness           | Currency of kernels, desktops, packages, drivers, and the general stack.                  |
| customization       | Room to reshape the desktop and user experience.                                          |
| systemControl       | Direct control over underlying system configuration and composition.                      |
| gaming              | Gaming readiness out of the box or with minimal setup, rather than theoretical potential. |
| developerExperience | Ecosystem, documentation, tools, packages, containers, and development workflows.         |
| oldHardware         | Suitability for resource-constrained machines under the stated desktop baseline.          |
| desktopPolish       | Cohesion of the supplied desktop defaults, before extensive personal configuration.       |

Lightweight user-built desktops can have high oldHardware scores and low default
polish. Container strengths do not automatically imply desktop development
convenience. A rolling distro can be operationally reliable; frequent base changes
still reduce conservatism. Rollback reduces recovery effort without making new
software intrinsically bug-free. Gaming scores never promise support for every game,
anti-cheat system, or GPU. Scores describe Linux desktop fit, not competition with
Windows in absolute game compatibility.

## Structured traits

`family` describes ecosystem ancestry; `lineage` distinguishes upstream projects
from derivatives. Arch itself is Arch-family/upstream; its derivatives use the same
family. Debian-family includes Ubuntu descendants. Fedora editions are upstream,
not separate derivatives. An independent family has no major-family parent.

`release` describes base release cadence. Bazzite and Bluefin use a fixed Fedora
base release lineage even though images update continuously; atomic delivery and
rolling release are separate concepts. NixOS is assessed on its stable channel.

`systemModel` is package-managed, image-based, or declarative. `baseMutability`
is mutable or protected: a protected base is normally changed through image updates
or declarative rebuilds, not ordinary manual package/file editing. This includes
NixOS's managed system/store and does not claim that every filesystem is read-only
or that the machine is tamper-proof. `atomicUpdates` identifies system image or
generation switching, not ordinary Btrfs snapshots or application updates.

`softwarePolicy` distinguishes free-software-first defaults/policy from pragmatic
proprietary integration; neither means entirely free software or restricted user
choice. `nvidiaSupport` means integrated driver/image conveniences, guided setup,
or manual integration. It is not a compatibility gate: supported GPU generations,
Secure Boot, hybrid graphics, and image choice require later hardware questions.

The four `focus` booleans identify deliberate gaming, security, minimal-system, or
development emphasis. A false value means no special emphasis, not inability.
Traits stay categorical; they are never secretly converted to extra capabilities.

`desktopLayout` records the assessed edition's layout: `panel-menu`, `dock-overview`,
or `user-selected`. It describes defaults, not every desktop a distro can install.
Only explicit panel/menu user preference receives a small match bonus; no layout
conflict penalty is applied. The categories follow the existing localized
`assessmentBasis`, so KDE, Cinnamon, and Xfce assessments can share a style without
claiming identical desktop environments.

`handheldSupport` is `documented` for Bazzite's separate handheld path and `unassessed`
for the other current desktop baselines. Unassessed does not mean unsupported and
does not exclude a distro. Bazzite's [Handheld Wiki](https://docs.bazzite.gg/Handheld_and_HTPC_edition/Handheld_Wiki/)
provides device-specific support information; scoring never guarantees compatibility
for an unspecified handheld or for the generic desktop image.

## Breadth and constraints

`recommendation.breadth` is an internal 0–5 half-step prior for ordinary desktop
recommendation: 0 specialist-only, 1 very narrow, 2 enthusiast, 3 moderate,
4 broad, 5 exceptionally broad. Intermediate half steps are allowed. It measures
audience breadth, not quality, popularity, or a user's match. The recommendation engine
uses it as an additive 0–2 point prior, after eligibility and capability fit. A breadth of
0 is not a hidden gate; Kali has explicit requirements.

Each constraint has an `effect` and nonempty `allOf` conditions. All conditions
within a constraint are conjunctive. All `require` constraints must be satisfied
before a top recommendation is eligible. `strongly-prefer` expresses substantial
soft reluctance if the whole condition group does not match, rather than a total
lock. Unknown user evidence must not be assumed to satisfy hard requirements.
The engine penalizes unmet soft conditions and rejects incomplete answer sets;
see its scoring notes for the selected strengths.

Conditions describe minimum experience, maintenance/learning tolerance, desire for system
control, a use case, or a specific interest. Ordered thresholds are intermediate
then advanced for experience, moderate then high for tolerance/control. They are
eligibility vocabulary. Milestone 3 provides explicit user evidence using these
values, extended with lower experience/tolerance levels; the engine evaluates those thresholds.

- Kali requires security testing **and** at least intermediate Linux experience.
- Gentoo strongly prefers advanced experience, high upkeep tolerance, and high control.
- Alpine desktop strongly prefers advanced experience, minimalism, and technical exploration.
- Slackware strongly prefers advanced experience, traditional Unix interest, and high upkeep tolerance.
- NixOS strongly prefers technical experience, declarative interest, and willingness
  to learn a distinct system model. Learning tolerance is separate from routine upkeep.
- Arch and Void also carry soft conditions to prevent control/resource scores alone
  from making them accidental beginner recommendations.

## Assessment limits and tuning questions

Original source checks date to 2026-10-01; the Bazzite handheld documentation
was additionally checked on 2026-10-02. Project descriptions support mechanisms and focus;
scores and comparative judgments remain DistroQuest's own interpretation. Edition
baselines are explicit in `assessmentBasis`. Sources can change; verify new releases
before tuning. MX's project manual and Garuda's project-hosted support discussion
provide narrower evidence than the other project overview pages; their main sites
were unavailable to the research tool. Gentoo's overview was served from an older
cached page, so it is not evidence of a newly verified release state.

- Fedora Workstation emphasizes approachable, cohesive GNOME defaults (beginner
  friendliness 4.5, customization 3, polish 5). Fedora KDE trades some initial
  simplicity for built-in flexibility (3.5, 4.5, and 4.5 respectively). Workstation
  now has low maintenance 4 (formerly 3.5), following persona review; these
  convenience scores are editorial judgments. Workstation retains breadth 5; KDE
  uses 4.5 to distinguish its audience without implying lower quality. Fedora's 4 gaming still assumes a modest driver/codec setup step.
- Mint scores higher on newcomer convenience and conservative upkeep, but lower
  on current graphics/toolchains and development than Fedora. Its Cinnamon baseline
  prevents lightweight alternate editions from inflating the default hardware score.
- Pop!_OS maintenance and stability are both 4 after model review. COSMIC polish
  (4) and freshness (3.5) still deserve hands-on review of the current release.
- PikaOS is modeled as Debian Sid-based and rolling, not Ubuntu-based. Stability
  (2.5), maintenance (2.5), and gaming (4.5) need review against its younger ecosystem.
- CachyOS/PikaOS old-hardware scores include optimized-build CPU requirements.
  Minimum CPU/GPU compatibility will eventually need real hardware gates.
- Bazzite/Bluefin have high maintenance scores and lower system control. Bazzite
  scores 2 against Bluefin's 2.5, reflecting its more constrained gaming-oriented
  host workflows; custom image possibilities do not determine default control.
- Gentoo old-hardware fit is 2: hardware optimization potential does not establish
  practical suitability for aging machines, especially given build resource costs.
- Arch gaming is 3.5 for its current software stack; gaming focus remains false.
  Its old-hardware score is 3 because current rolling packages and user-led setup
  do not make it an older-machine specialist. Alpine scores 4.5 for its small
  footprint without treating old-hardware desktop use as its primary purpose.
- Alpine development (3) evaluates a workstation rather than merely its excellent
  container footprint. Alpine/Arch/Gentoo polish measures what is supplied, not what
  an expert could build. Slackware stability does not override its soft conditions.

The numeric table, edition assumptions, and specialist constraints were reviewed
before Milestone 3. Keep further distro tuning separate from questionnaire design.

## Relative relationships and later result diversity

The reviewed model prioritizes coherent relationships over isolated scores:

- Beginner friendliness: Mint > Fedora (both desktops) > Tumbleweed > Arch > Gentoo.
- Gaming readiness: Bazzite > Fedora; general-purpose breadth: Fedora > Bazzite.
- Older-hardware suitability: MX > Mint; general-purpose breadth: Mint > MX.

These relationships are regression-checked in the dataset tests. Breadth represents
ordinary desktop recommendation reach; it is not an overall quality score.

For the later results model, avoid placing two near-identical members of the same
family among the top three unless their match scores differ meaningfully. Present
the best-matching Fedora desktop as the winner and its sibling as a desktop
alternative, leaving the other recommendation slots for distinct paths. Either
Workstation or KDE can win according to the user's needs; the breadth difference
alone is not sufficient to guarantee diverse results.

For example, hypothetical scores of Fedora KDE 92, Workstation 90, Tumbleweed 84,
and CachyOS 81 should yield KDE as winner, Workstation as its desktop alternative,
and Tumbleweed/CachyOS as other recommendations. These are illustrative scores,
not current engine outputs or a selected presentation threshold.

`traits.family` provides ancestry context, but family membership alone is too broad
to decide equivalence. Fedora KDE and Workstation share a foundation and chiefly
differ by desktop; Bazzite changes the system/update model and gaming workflow.
Likewise, Debian ancestry does not make every Debian derivative interchangeable.
The engine exposes both ancestry and a `presentationGroup`: Fedora Workstation
and KDE share `fedora-desktop`; other distro IDs remain distinct. Independent `workflow` metadata distinguishes conventional desktop, atomic
desktop, gaming appliance, and declarative system. Core scoring never penalizes
family members or applies a one-per-family limit. Choosing a meaningful-difference threshold and
presenting grouped alternatives remain later result-UI decisions.
