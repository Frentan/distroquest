# Atomic and rolling coverage review

Reviewed 2026-10-04 from the clean current checkout. These are source-informed
editorial assessments, not reliability measurements or hardware certification.
Only the four candidates below were considered. The roster is now 29;
Kinoite and Leap remain unranked. The existing 20 personas are unchanged.
The recommendation revision is model v9: the expanded assessments, transactional
container matching, and official-family/workflow presentation changed, while the
capability-distance formula and published scores for existing profiles were preserved.

## Inclusion decisions

| Candidate         | Decision             | Recommendation case and limits                                                                                                                                                                                                                                                                                         |
| :---------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fedora Silverblue | Include              | Established official Fedora Atomic GNOME path, distinct from Universal Blue derivatives and conventional Fedora.                                                                                                                                                                                                       |
| openSUSE Aeon     | Include with caution | A distinct automated transactional rolling GNOME path. Its current homepage still declares release-candidate status; routine automation is not proof of production maturity.                                                                                                                                           |
| Vanilla OS        | Include with caution | Active: Reunion 3.0 shipped on 2026-08-24. Apx stacks and the separate VSO environment add a specific multi-userspace niche on a Debian-derived OCI host. Recent rewrites, migration caveats and a small support ecosystem justify conservative breadth and a soft learning preference.                                |
| Rhino Linux       | Include with caution | Active: 2026.1 images and maintained Pacstall/RPK tooling. Mutable Ubuntu devel plus Pacstall offers a distinct rolling Debian-family path. It is defensible for experienced users accepting upkeep, rather than a general Ubuntu upgrade. The February 2026 emergency Pacstall fix illustrates practical update risk. |

Vanilla's inclusion rests on its released architecture and multi-environment
workflow, not its marketing promises. It is not an abandoned Orchid-only project.
Rhino's inclusion rests on current releases and published maintenance tools, not
an assumption that Ubuntu development repositories have Ubuntu LTS reliability.

## Current architecture and audience

| Dimension         | Silverblue                                                                                                | Aeon                                                                                                                                                                                          | Vanilla OS                                                                                              | Rhino Linux                                                                                                                                                        |
| :---------------- | :-------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current baseline  | Fedora 44 Atomic GNOME; official download remains OSTree                                                  | Current Aeon GNOME release candidate; current installation wiki updated August 2026                                                                                                           | Vanilla OS 3 Reunion GNOME                                                                              | 2026.1 Unicorn snapshot; Lomiri is a separate evolving UBXI option                                                                                                 |
| Maturity          | Established Fedora-supported path; package-layering and driver edge cases remain                          | Long-lived RC with current packaging/documentation; hardware and recovery limitations remain                                                                                                  | Released stable revision with recently rewritten subsystem tools and migration caveats                  | Released rolling desktop maintained by a small team; upstream development churn can require hotfixes                                                               |
| Family/lineage    | Fedora, official upstream path                                                                            | openSUSE/MicroOS/Tumbleweed ecosystem, upstream path                                                                                                                                          | Hybrid Debian-derived base; historical Ubuntu ancestry is not the current host baseline                 | Ubuntu development branch, Debian-family derivative                                                                                                                |
| Release model     | Fedora's regular fixed releases, with continuous updates within each supported release                    | Rolling Tumbleweed software                                                                                                                                                                   | Continuously updated images with named major revisions; rolling in the current two-value cadence model  | Rolling; dated ISOs are installation snapshots                                                                                                                     |
| System model      | OSTree image plus rpm-ostree RPM layering; no verified replacement by bootc in the assessed official path | Package transactions into Btrfs snapshots; not an OSTree/OCI image update mechanism                                                                                                           | OCI images applied by ABRoot across A/B roots                                                           | Traditional mutable package-managed host                                                                                                                           |
| Protection        | Read-only root and /usr; /etc and /var writable                                                           | Deliberately minimal protected host; modifications are unsupported                                                                                                                            | Protected roots with transactional local image changes when necessary; writable user/state areas        | Ordinary mutable host and direct administrative control                                                                                                            |
| Updates           | GNOME Software or rpm-ostree; new deployment activates after reboot                                       | Automatic daily transactional-update; new snapshot activates after reboot                                                                                                                     | ABRoot system images, VSO operator and separate application/subsystem updates                           | Rhino PKG/RPK2 coordinates APT, Pacstall and installed Flatpak/Snap managers                                                                                       |
| Recovery          | Previous OSTree deployment, boot selection or rpm-ostree rollback                                         | systemd-boot snapshot selection or transactional-update rollback; current docs explicitly warn against Snapper rollback                                                                       | ABRoot previous root; Continuity separately backs up user data and app metadata                         | No verified default atomic rollback contract; backups and manual package repair remain relevant                                                                    |
| Desktop           | GNOME; Kinoite is the unranked official KDE Atomic counterpart                                            | Focused GNOME                                                                                                                                                                                 | GNOME 50, Wayland-only                                                                                  | Xfce-based Unicorn with app grid, overview and keyboard workflows                                                                                                  |
| Applications      | Flatpak first, Toolbx for RPM userspace, limited host layering                                            | Flatpak/Flathub first, then Distrobox; host transactions are the last resort                                                                                                                  | Flatpak plus Apx stacks and the Debian-testing VSO native environment                                   | Debian/Ubuntu package ecosystem plus Pacstall; use Rhino PKG for coordinated management                                                                            |
| Development       | Integrated Toolbx/OCI containers; conventional Fedora host instructions do not always transfer            | Podman-backed Distrobox; automatic maintenance rather than a dedicated developer bundle                                                                                                       | Multiple Apx userspaces and integrated Ptyxis access; not a Bluefin-style curated developer workstation | Current packages, Pacstall toolchains and preinstalled Codium; ordinary containers can be used without an atomic-host contract                                     |
| NVIDIA            | Third-party RPM Fusion instructions and local module signing; drivers can lag the included kernel         | No integrated proprietary-driver workflow established by the current project documentation inspected; host changes are unsupported. Model conservatively as manual and require a device check | Integrated standard/modern NVIDIA image choices; unsigned modules and GPU generation impose limits      | Guided DKMS/Pacstall driver choices; rapidly changing kernels still require attention                                                                              |
| Gaming            | Flatpak game clients and current Fedora stack; no Bazzite-style gaming defaults                           | Current stack and Steam Flatpak; no gaming specialization, with hardware/permissions caveats                                                                                                  | Feasible through Flatpak and suitable GPU image; moderate readiness rather than a gaming appliance      | Current stack and broad package access; driver/upstream churn prevents a high readiness score                                                                      |
| Hardware          | Modern GNOME desktop; no lightweight-edition credit                                                       | UEFI x86_64, fast installation USB, full selected-disk install; TPM default/fallback encryption requirements. Current installer docs do not support VMs                                       | 64-bit x86/ARM; ARM requires UEFI. Handbook lists 50 GB disk and 4 GB RAM (8 recommended)               | Lightweight desktop does not remove current-kernel compatibility checks; unsigned kernels affect Secure Boot. ARM/device images are not blanket support guarantees |
| Maintenance       | Reduced host recovery effort, but Fedora major upgrades and local layers still need care                  | Very little routine administration on supported defaults; frequent rolling changes and recovery-key care remain                                                                               | Low routine host intervention, with learning and migration work for subsystems                          | More update attention, package-source judgment and occasional manual intervention than standard Ubuntu                                                             |
| Intended audience | Fedora users and container developers seeking an official general atomic desktop                          | People accepting a focused RC workflow to get current apps with minimal routine intervention                                                                                                  | General desktop/development users specifically interested in isolated package environments              | Experienced Ubuntu/Debian-family users wanting mutable rolling software                                                                                            |
| General breadth   | 4: broad atomic desktop, below conventional Fedora                                                        | 3: focused host and RC/hardware caveats                                                                                                                                                       | 3: general purpose but unconventional and less established                                              | 2.5: distinct enthusiast niche, not a mainstream beginner default                                                                                                  |

Containers separate package environments; Toolbx, Apx and Distrobox should not be
presented as security sandboxes for untrusted programs. Rollback recovers host
state, not every user's data or third-party application's state.

## Scores and calibration

All values use the existing 0–5 half-step scale. Stability captures change
conservatism as well as operational predictability; rollback is not a substitute
for maturity. Aeon's 4.5 low-maintenance score reflects its automated defaults,
while 3.5 stability and breadth 3 retain the rolling/RC qualification.
Vanilla's freshness is 4.5 because the current Reunion stack is substantially newer
than the proposed Orchid-era hypothesis; its stability stays 3.5.

| Capability          | Silverblue | Aeon | Vanilla OS | Rhino Linux |
| :------------------ | ---------: | ---: | ---------: | ----------: |
| beginnerFriendly    |        3.5 |    3 |          3 |         2.5 |
| lowMaintenance      |          4 |  4.5 |          4 |         2.5 |
| stability           |          4 |  3.5 |        3.5 |         2.5 |
| freshness           |        4.5 |    5 |        4.5 |           5 |
| customization       |        2.5 |    2 |        2.5 |           4 |
| systemControl       |        2.5 |    2 |        2.5 |           4 |
| gaming              |        3.5 |    3 |          3 |         3.5 |
| developerExperience |        4.5 |    4 |          4 |           4 |
| oldHardware         |        2.5 |    2 |          2 |           3 |
| desktopPolish       |        4.5 |  4.5 |          4 |         3.5 |
| breadth             |          4 |    3 |          3 |         2.5 |

Silverblue and Rhino have development focus; Aeon and Vanilla retain a general
purpose focus. None has gaming/security/minimal specialization, documented handheld
support or an assessed creative integration. Silverblue uses free-software-first
policy with guided NVIDIA setup; Aeon uses free-software-first with manual assessment;
Vanilla and Rhino are pragmatic, with integrated/guided NVIDIA respectively.
All four use the dock/overview layout category for their assessed defaults.

A light creative follow-up on 2026-10-04 reviewed Vanilla's
[Reunion release/default-app and subsystem overview](https://github.com/Vanilla-OS/website/blob/v2/articles/2026-08-24-vanilla-os-3-reunion.md)
and Rhino's [setup wizard](https://github.com/rhino-linux/rhino-setup) and
[Rhino PKG](https://wiki.rhinolinux.org/user/rpk) documentation. These establish
general application/environment management, not a qualifying distro-maintained
creative integration or targeted helper. Vanilla and Rhino therefore remain
`unassessed`, without penalty. This bounded review does not establish that no
such integration exists. Silverblue and Aeon's traits were left unchanged.

Vanilla softly prefers moderate learning tolerance. Rhino softly prefers
intermediate experience and moderate upkeep tolerance. These use existing
constraint semantics; they do not exclude beginners or infer expertise from intent.
Silverblue and Aeon add no new eligibility constraints.

## Family and model integration

Official upstream paths in non-independent families share a presentation group,
derived from `family` and `lineage`. Fedora Workstation/KDE/Silverblue share
`fedora-desktop`; Aeon/Tumbleweed share `suse-desktop`. Bluefin, Bazzite, Nobara
and Rhino keep distinct derivative identities. This changes presentation only.
The public sibling label now says “Another official path in this family,” and
explains that the desktop or system workflow may differ. It selects the highest
ranked eligible sibling without changing scores. Leap is absent from the existing
roster and remains unranked; no third openSUSE profile was added.

`transactional` is a separate system model for snapshot-based protected hosts.
It receives the existing container-first match strength with its own explanation;
atomic workflow display follows protection/atomic traits. This avoids calling
Aeon image-based or penalizing its documented Distrobox workflow. Declarative NixOS
remains distinct. Existing capability distances and specialist-credit conditions
are unchanged. All 500 pre-existing persona/profile raw scores were compared
against the prior example tables and remained unchanged to their published precision.

`editionNote` is optional localized content for unranked guidance. Silverblue uses
it to surface Kinoite directly in the result card; no Kinoite score or platform
support inference is added. Fedora Asahi and T2 compatibility still require their
existing explicitly assessed conventional profiles.

## Representative simulations

These are temporary answer variations, not new registered personas. The quiz has
no family-preference question: Fedora/openSUSE checks use fixed/free-software or
rolling/customizable preferences and inspect sibling relationships, without adding
an ecosystem scoring bonus.

| Scenario                         | Observed outcome                                                                                                                                                                    |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing atomicDeveloper         | Bluefin 110.61; Silverblue 108.91; Vanilla 102.39; Aeon 102.28; Bazzite 96.86 raw points. Close Vanilla/Aeon ordering is not tuned to an exact target.                              |
| Beginner + protected host        | Silverblue rises from seventh to fourth. Bluefin leads; Mint and Ubuntu remain close. Aeon is ninth with RC/beginner limitations rather than becoming an automatic beginner winner. |
| Conventional beginner            | Mint, Ubuntu, Workstation and Zorin remain the first four; Silverblue seventh, Vanilla twelfth, Aeon thirteenth.                                                                    |
| Existing rollingEnthusiast       | Tumbleweed, EndeavourOS, Rhino, Arch, CachyOS. Rhino supplies the mutable Ubuntu niche; Aeon is a sibling with a different protected workflow.                                      |
| Atomic developer + rolling       | Bluefin, Vanilla, Aeon, Silverblue are close (106.61, 106.39, 106.28, 104.91). Aeon's rolling/container match is visible.                                                           |
| Atomic developer + fixed/FOSS    | Silverblue second, ahead of conventional Fedora; official siblings share a group while Bluefin remains separate.                                                                    |
| Customizable developer + rolling | Tumbleweed leads; Aeon appears as its official sibling, with Fedora KDE and Rhino distinct alternatives.                                                                            |
| Existing gamingAppliance         | Bazzite stays first at 109.98, followed by Nobara and Bluefin. Silverblue fifth, Vanilla tenth and Aeon fourteenth.                                                                 |

## Authoritative sources and retrieval limits

- Fedora: [Silverblue overview](https://fedoraproject.org/atomic-desktops/silverblue/),
  [44 download](https://fedoraproject.org/atomic-desktops/silverblue/download/),
  [current architecture](https://docs.fedoraproject.org/en-US/atomic-desktops/technical-information/),
  [updates/rollback](https://docs.fedoraproject.org/en-US/atomic-desktops/updates-upgrades-rollbacks/),
  [NVIDIA troubleshooting](https://docs.fedoraproject.org/en-US/atomic-desktops/troubleshooting/),
  [Kinoite](https://fedoraproject.org/atomic-desktops/kinoite/).
  The old Silverblue docs repository is archived because documentation moved to
  unified Atomic Desktop docs; it does not imply Silverblue is abandoned.
- Aeon: [current homepage/status](https://aeondesktop.org/),
  [openSUSE family overview](https://www.opensuse.org/),
  [software/updates](https://github.com/AeonDesktop/Project/wiki/Software-Installation),
  [recovery](https://github.com/AeonDesktop/Project/wiki/Troubleshooting),
  [current installer](https://github.com/AeonDesktop/Project/wiki/Install-Guide),
  [encryption](https://github.com/AeonDesktop/Project/wiki/Encryption),
  [architecture announcement](https://news.opensuse.org/2024/05/28/aeon-desktop-brings-new-features-in-rctwo-release/).
  The older announcement supports architectural history, not current release status.
- Vanilla: [3.0 release](https://github.com/Vanilla-OS/live-iso/releases/tag/3.0),
  [official Reunion article source](https://github.com/Vanilla-OS/website/blob/v2/articles/2026-08-24-vanilla-os-3-reunion.md),
  [July 2026 maintenance clarification](https://github.com/Vanilla-OS/website/blob/v2/articles/2026-07-15-vanilla-os-3-development-update.md),
  [cadence policy](https://github.com/Vanilla-OS/website/blob/v2/articles/2024-09-25-vanillaos-2-future-plans-updates-next-release.md),
  [ABRoot](https://github.com/Vanilla-OS/ABRoot),
  [current installation source](https://github.com/Vanilla-OS/handbook/blob/main/articles/en/installation.md),
  [NVIDIA source](https://github.com/Vanilla-OS/handbook/blob/main/articles/en/nvidia-issues.md).
  The site's JavaScript shell hides its articles from text retrieval, so the
  maintained official website/handbook source was inspected directly. The 2026
  article confirms the continuous in-place upgrade behavior described by the older
  cadence policy. VSO's Debian-testing userspace is not a claim that every host
  package is Debian testing. Removed Android support and FsGuard are not credited.
- Rhino: [current architecture/default desktop](https://rhinolinux.org/),
  [2026.1 release](https://blog.rhinolinux.org/news-26),
  [2026 Pacstall emergency patch](https://blog.rhinolinux.org/news-25),
  [Rhino PKG](https://wiki.rhinolinux.org/user/rpk),
  [NVIDIA guide](https://wiki.rhinolinux.org/user/nvidia),
  [installer/Secure Boot](https://wiki.rhinolinux.org/user/install/live).

No actual OS installation or physical GPU test was performed. Project claims are
qualified in the content, scores and workflow cautions rather than treated as
measured dependability.
No standardized OS-installation or physical-GPU test baseline was found in the
project's existing assessment or verification documentation for the other profiles.
An installation smoke test would require booting a candidate in a VM or on a spare
drive, then checking installation, updates, applications/containers and recovery.
Physical-GPU validation additionally requires the relevant GPU running that candidate
to check driver loading, graphics acceleration, displays, suspend/resume and selected
games or creative workloads. A VM with virtual graphics cannot establish those claims.
These are separate test sessions, not quick application checks.
