# Distro model, v1

The 25 desktop assessments are editorial estimates informed by linked project
sources, not benchmarks, measured reliability, or published project ratings.
[Preferences](../preferences/README.md) and [scoring](../recommendations/README.md)
are separate models.

## Inspect and validate

```sh
npm test
npm run data:review
npm run data:review -- --json
```

The default review output is a Markdown table of all ten capabilities and breadth.
JSON includes every profile, trait, constraint, source, and English content field.
For a clean JSON file, use `npm run --silent data:review -- --json > /tmp/distroquest-profiles.json`.
Both modes validate first and exit unsuccessfully if any record is invalid. Review tools run locally and ship no inspection page.

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

### Creative integration review

A `documented` assessment requires a distro-maintained creative app integration
or targeted setup helper available to the assessed desktop. Generic app availability,
codec playback, ordinary software catalogs, and manual how-tos alone do not qualify.
Optional helpers/packages count; they need not be preinstalled. This is a small
convenience signal, not a workflow-quality rating or device/app certification.

The 2026-10-02 pass reviewed the roster's project overviews and followed up on
plausible integrations. Six profiles qualify:

| Distro  | Documented convenience and source                                                                                                                                                                                         |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nobara  | [OBS packaging/plugins](https://wiki.nobaraproject.org/en/general-usage/additional-software/obs-studio) and [DaVinci Resolve Wizard](https://wiki.nobaraproject.org/en/general-usage/additional-software/davinci-resolve) |
| Bazzite | [Preinstalled OBS VkCapture and an OpenTabletDriver helper with bundled udev rules](https://github.com/ublue-os/bazzite/blob/main/README.md)                                                                              |
| PikaOS  | [Blender GPU-backend integration and customized OBS capture/stream-key support](https://pika-os.com/)                                                                                                                     |
| CachyOS | [Custom OBS package with CUDA/virtual-camera fixes](https://wiki.cachyos.org/configuration/general_system_tweaks/#obs-studio)                                                                                             |
| Bluefin | [OpenTabletDriver install/uninstall helper](https://docs.projectbluefin.io/administration/#application-installation-commands)                                                                                             |
| Solus   | [Maintained ROCm integration for GPU-accelerated Blender](https://getsol.us/#for-content-creators)                                                                                                                        |

The other 19 stay `unassessed`, without penalty. This is a bounded source pass,
not proof that they lack creative integrations. Zorin Pro's [creative bundle](https://help.zorin.com/docs/apps-games/alternatives-to-windows-apps/)
is outside the Core baseline; separate Fedora/Ubuntu creative editions do not
transfer to the assessed desktops. Pop!_OS's [Resolve guide](https://support.system76.com/support/install-davinci-resolve)
documents manual dependencies and a community script. MX's general package installer
and Garuda's general setup assistant alone do not establish specialized integration;
Garuda's current tool contents and Slackware's documentation could not be fully
retrieved in this pass. Bluefin qualifies through its current tablet helper, not the
[removed Resolve recipe](https://github.com/ublue-os/bluefin/discussions/3842).

Explicit creative intent activates the existing +2 trait modifier, inside the
±12 cap. No capability axis, extra questionnaire, inferred expertise, or guarantee
for specific apps, formats, plugins, or peripherals is added. Review helpers and
package claims again when their sources or assessed editions change.

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

Conditions describe minimum experience, upkeep/learning tolerance, system-control
interest, purposes, or specific interests. Ordered minimums are intermediate/advanced
for experience and moderate/high for tolerance/control; the preference builder
supplies explicit evidence, including lower levels.

- Kali requires security testing **and** at least intermediate Linux experience.
- Arch, Gentoo, Slackware, Void, and Alpine require intermediate experience,
  moderate upkeep tolerance, and moderate system-control interest.
- NixOS requires intermediate experience and moderate learning tolerance; routine
  upkeep and control preferences do not impose hard requirements.

These minimums are DistroQuest recommendation policy for the assessed desktop
workflows, not upstream restrictions. The existing ideal-fit conditions stay soft:

- Gentoo strongly prefers advanced experience, high upkeep tolerance, and high control.
- Alpine desktop strongly prefers advanced experience, minimalism, and technical exploration.
- Slackware strongly prefers advanced experience, traditional Unix interest, and high upkeep tolerance.
- NixOS strongly prefers technical experience, declarative interest, and willingness
  to learn a distinct system model. Learning tolerance is separate from routine upkeep.
- Arch and Void retain their stronger soft upkeep, control, and minimalism conditions.

The 2026-10-03 eligibility review used [Arch's user-built base](https://archlinux.org/about/),
[Gentoo's configurable Portage workflow](https://www.gentoo.org/get-started/about/),
[Void's handbook expectations](https://docs.voidlinux.org/about/about-this-handbook.html),
[Alpine's manual setup responsibilities](https://docs.alpinelinux.org/user-handbook/0.1a/Installing/setup_alpine.html),
[Slackware's manual administration and dependency handling](https://docs.slackware.com/slackbook:intro_to_slackware),
and [NixOS's configuration/rebuild workflow](https://nixos.org/manual/nixos/stable/#sec-changing-config).
These sources support the workflow distinction; the thresholds are editorial choices.

## Assessment rationale and limits

Review dates and sources live in each profile's `assessment`. Sources support
mechanisms and focus; comparative scores remain editorial judgments for the edition
named in `assessmentBasis`. Verify source changes before tuning. MX's manual and
Garuda's project-hosted discussion provide narrower evidence than overview pages;
their main sites were unavailable in the initial review. Gentoo's overview was
served from an older cached page, not fresh release evidence.

- Fedora Workstation emphasizes approachable GNOME defaults; KDE trades some
  initial simplicity for flexibility. Their breadth distinction describes audience,
  not quality. Fedora gaming assumes a modest driver/codec setup step. Mint favors
  newcomer convenience and conservative upkeep over current graphics/toolchains;
  its Cinnamon baseline excludes lighter editions from the default hardware score.
- Pop!_OS's COSMIC polish and freshness need hands-on release review. PikaOS is
  assessed as Debian Sid-based and rolling; stability, upkeep, and gaming readiness
  need review against its younger ecosystem. CachyOS/PikaOS optimized-build CPU
  requirements affect hardware suitability; exact CPU/GPU gates remain future work.
- Bazzite/Bluefin favor low upkeep over host control. Bazzite's gaming-oriented host
  is more constrained; custom images do not determine default control scores.
- Gentoo's hardware optimization potential does not establish practical old-machine
  suitability given build resource costs. Arch's current stack and user-led setup
  do not make it an older-hardware specialist. Alpine's small footprint helps that
  score; development evaluates a workstation rather than container strengths alone.
- Alpine/Arch/Gentoo polish measures supplied defaults, not an expert's finished
  setup. Slackware stability does not override its eligibility or soft preferences.

## Relative relationships and result diversity

### CachyOS and Garuda gaming readiness

The assessed baselines are CachyOS KDE on supported modern x86-64 hardware and
Garuda Dr460nized Gaming KDE. Garuda's [current Gaming ISO package list](https://gitlab.com/garuda-linux/tools/iso-profiles/-/raw/master/garuda/dr460nized-gaming/Packages-Desktop)
includes Steam, Lutris, Heroic, Wine, Proton, overlays, and controller tools.
CachyOS's [gaming guide](https://wiki.cachyos.org/configuration/gaming/)
documents installation of its gaming libraries and launcher bundle through CachyOS
Hello. This supports a distinction in initial setup convenience, not game compatibility
or measured performance.

Both document snapshot recovery: [Garuda](https://wiki.garudalinux.org/en/restoring-snapshots)
and [CachyOS](https://wiki.cachyos.org/configuration/btrfs_snapshots/).
Recovery support alone does not establish lower routine upkeep or greater stability.
Garuda's wiki also contains older guidance; current ISO package sources carry more
weight for bundled software. Its generic OBS package does not establish specialized
creative integration under the existing criterion.

Garuda's assessed Gaming edition receives gaming readiness 5 for its preinstalled
setup; CachyOS receives 4.5 for its documented post-install bundle. The distinction
is initial convenience, not measured performance or compatibility. Current persona
rankings live in [the examples](../recommendations/EXAMPLES.md).

Dataset tests check beginner friendliness (Mint > Fedora > Tumbleweed > Arch >
Gentoo), gaming readiness (Bazzite > Fedora), and old-hardware fit (MX > Mint).
Breadth separately favors general-purpose reach; it is not quality.

The engine groups Fedora Workstation/KDE as `fedora-desktop`; other distro IDs
remain distinct. `family` describes ancestry, and `workflow` distinguishes
conventional, atomic, gaming-appliance, and declarative systems. The quiz groups
sibling editions without penalizing scores or enforcing one result per family.
Platform support can independently reorder practical installation paths.
