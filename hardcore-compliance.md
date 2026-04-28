# GoGBA and RetroAchievements Hardcore Compliance

This document maps **GoGBA** (Android/iOS handheld emulator: GBA, GBC, and GB via libretro mGBA) against the requirements summarized in the official RetroAchievements page: [Hardcore Compliance Requirements](https://docs.retroachievements.org/general/hardcore-compliance-requirements.html).

It explains **why the current codebase aligns with those requirements** for the areas the product implements, and calls out **product or process items** that sit outside the repo (e.g. store listings, eligibility timeline).

---

## Summary

GoGBA integrates RetroAchievements through a dedicated API client (`RcClient`), native mGBA/libretro achievement evaluation, Rich Presence on ping, session lifecycle (`startSession`, `ping`, `awardAchievement`), and an offline achievement queue. **Hardcore mode** is threaded consistently as a boolean (`hardcore` / effective hardcore from Remote Config × user preference) on bootstrap, session start, pings, unlocks, and queued retries.

**Cheat use is blocked in hardcore** when RetroAchievements is enabled and the user has an authenticated session, via `shouldBlockCheatsForHardcore` and native `applyCheats` with empty lists.

**Emulator save states (load/slot UI)** are not a shipped feature; persistence uses **standard battery `.sav` / Save RAM** compatible with common Game Boy family practice (GBA/GBC/GB as supported by the core).

**Client identity** uses a purpose-built User-Agent (`GoGBA/<app version> (<OS> <version>) mgba/0.10.5`) as required for integrity reporting.

Formal **approval** on RetroAchievements (Downloads listing, verification) remains their process; this statement is a **developer-facing mapping**, not a certificate from RetroAchievements.

---

## A. RetroAchievements features

| Requirement | GoGBA implementation (high level) |
|-------------|-----------------------------------|
| Achievements: triggers, Measured / Trigger | Handled in native mGBA + RA integration path; game sets loaded via bootstrap port and passed to native init. |
| Rich Presence & leaderboards | RP script loaded when available; cached RP sent with `RcClient.ping`. Leaderboards included in bootstrap payload to native layer. |
| Offline queue | `AchievementQueueService` persists pending unlocks (including `hardcore` flag) and syncs when online. |
| Save state hit storage | **Optional** per RA. Not exposed as a first-class user feature; depends on core/RA integration internals—investigate if RA requests evidence for softcore edge cases. |
| RAIntegration (Windows) | **N/A** for mobile-only shipping; RA notes a downloads-page hint if absent on Windows. |
| Save file compatibility | **.sav** / Save RAM read/write paths on Android and iOS align with common interchange expectations (see native save modules). |

---

## B. Hardcore rules enforcement

| Requirement | GoGBA |
|-------------|--------|
| Cheats disabled in hardcore | **Yes**, when RA is on, credentials have an authenticated session, and effective hardcore is true: cheats are not applied (`_applyCheatsFromDatabaseIfAllowed`), cheat menu respects the same gate (`shouldBlockCheatsForHardcore`), localized *hardcore blocked* copy in cheats UI. |
| Rewind | **Not offered** as a product feature in the Flutter app layer. |
| Slowdown / frame advance | **Not offered** as explicit user features in the app layer. |
| Load save states in hardcore | **No user-facing save-state load path**; compliance-relevant risk is therefore low. (If a future feature adds slots, loads must be blocked whenever hardcore session is active.) |
| RP & leaderboards not disabled in hardcore | **No setting** turns off RP/leaderboard integration specifically in hardcore; pings continue with RP when available. |
| Resume / quick resume → softcore | No separate “snapshot resume” product feature identified; normal app lifecycle pause/resume does not imply a save-state–based quick resume. |
| Softcore → hardcore mid-session | Hardcore is configured under **Settings → RetroAchievements**, while **Play** is a sibling route under `/home`. Exiting play **disposes** `PlayPage` and ends the session; re-entering runs initialization and `startSession` again with the current flag—**aligned with “must reset to go hardcore”** in typical navigation. If navigation ever allows changing this toggle without tearing down play, that would need an explicit enforced game reset. |
| Save states created in hardcore but not loadable | **N/A** today (no save-state UI). |
| Memory editors, debuggers, TAS/recorded input | **Not shipped** as end-user features in-app. |

---

## C. Identity and integrity (User-Agent)

`RcClient` builds `User-Agent` via `buildUserAgent()` in `lib/core/services/rapi/client.dart`: **GoGBA/{numeric version} (Android\|iOS {version}) mgba/0.10.5**, matching RetroAchievements’ expected pattern (emulator name/version, OS, core name/version).

Fork/adoption note: if the binary ever identified as another client historically, RA requires **disclosure** when applying for compliance (official §C / §G).

---

## D. Eligibility timeline

RetroAchievements requires the emulator (or parent) to be **publicly available for at least six months** before hardcore compliance review. That is a **release-history requirement**, not something the source tree can prove by itself.

---

## E. Defaults and UX

| Requirement | GoGBA |
|-------------|--------|
| Default hardcore on login | RA **recommends** hardcore by default; GoGBA’s stored default for `retroAchievementsHardcoreModeEnabled` is **softcore (false)** unless changed—still allowed if enabling hardcore stays **clear and easy** (toggle in RetroAchievements settings when Remote Config master switch is on). |
| Visible indication during play | After RA load, UI shows **hardcore vs softcore** in the achievements snackbar (shield icon + `t.app.hardcore` / `t.app.softcore`) and similar patterns elsewhere. |

Remote Config **`retro_achievements_hardcore_enabled`** can hide hardcore UX app-wide when off; effective hardcore is always **master switch ∧ user toggle**.

---

## F. Transparency and legality

| Requirement | Notes for GoGBA |
|-------------|-----------------|
| Monetization / feature matrix | Store listings and in-app paywall describe premium vs free; **paid features must not violate hardcore rules** (cheats are premium-gated but **hardcore still blocks** cheat application when RA + authenticated + hardcore). |
| Licenses & FOSS cores | **Open source licenses** screen lists **libretro mGBA** (MPL-2.0) and upstream link (`lib/pages/settings/license_page.dart`). Commercial use must stay compatible with those licenses and any other shipped natives. |
| Privacy policy | App store metadata points to a privacy URL; policy must stay **non-placeholder** and consistent with analytics/crash reporting (RA §F / auto-fail on contradictory privacy text). |

---

## G. Auto-fail criteria (checklist)

1. **Load save states in hardcore** — **Mitigated**: no save-state load feature in current product surface.  
2. **Rewind / slo-mo / frame advance in hardcore** — **Mitigated**: not exposed as user features.  
3. **Gameplay-altering cheats in hardcore** — **Blocked** under authenticated RA + effective hardcore (`cheats_hardcore_gate.dart` + apply path).  
4. **Switch to hardcore without game reset** — **Aligned** under current routing (play disposed when leaving for settings); re-verify if navigation model changes.  
5. **Non-unique User-Agent** — **Met** with dedicated `GoGBA/...` string.  
6. **Undisclosed prior impersonation of another client** — Process / release-history item.  
7. **Commercial use + non-commercial cores without permission** — Legal/compliance review of **mGBA (MPL-2.0)** and distribution.  
8. **Privacy policy placeholders/contradictions** — Ongoing store/legal maintenance.

---

## Code anchors (for reviewers)

- Cheat gate: `lib/core/cheats/cheats_hardcore_gate.dart`
- Effective hardcore providers: `lib/providers/retro_achievements_providers.dart` (`hardcoreMasterSwitchEnabledProvider`, `retroAchievementsHardcoreModeEnabledProvider`)
- Session / ping / award: `lib/core/services/rapi/client.dart`, `lib/pages/play/play_page_game_init.dart`, `lib/pages/play/play_page_lifecycle_timers.dart`, `lib/widgets/achievement_overlay.dart`
- Offline queue + `hardcore` persistence: `lib/domain/services/achievement_queue_service.dart`
- User-Agent: `buildUserAgent()` in `lib/core/services/rapi/client.dart`

---

## Maintenance

RetroAchievements may **re-audit** listed emulators. This document should be updated when play/session navigation, save-state features, cheat paths, or the User-Agent format change.
