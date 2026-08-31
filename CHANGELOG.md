# GoGBA Changelog

What changed in each release, from a player's point of view. Internal refactors,
build tooling, and reverted experiments are left out. Grouped by minor version.

---

## 3.18 — August 2026

- Landscape now starts at the largest picture, with button opacity at 50%
- Landscape buttons sit closer to the edge and steer clear of the camera cutout
- Clearer titles and switch labels on the instant save page

## 3.17 — August 2026

- Fast-forward no longer sounds harsh: a speed-tracking high shelf tames the treble
- The screen stays awake during a play session
- The menu drawer closes on Back instead of staying open
- Screen settings renamed to Video Filter; the bezel option moved into Layout
- Fixed an Android file picker that filtered out ROMs you were trying to import

## 3.16 — August 2026

- New tap-to-reveal gesture lock, so a stray touch can't trigger a gesture
- New three-mode visibility setting for the on-screen buttons
- The D-pad is drawn as one connected cross; arcade LRAB lost its background circle
- Audio focus is released when the game is silent or paused, so other apps aren't interrupted
- Fixed ZIP files renamed to a ROM extension not extracting on import
- Fixed GBK-encoded game names showing as garbled text
- New screen bezel toggle

## 3.15 — August 2026

- The six themes became handheld-shell colorways, with names that say what they are
- Fast-forward pitches up instead of time-stretching, which removes the warble
- The quick-save gesture now honors your vibration settings

## 3.14 — July 2026

- Landscape screen scale can be set separately for GBA and GB/GBC
- Long-press to reset now defaults to off, so it can't fire by accident
- Added a Gen 1–3 physical/special split reference

## 3.13 — July 2026

- The layout editor can hide the menu and toolkit buttons
- AI translation switched to your own Gemini API key — no subscription needed

## 3.12 — June 2026

- New move and ability browser
- The Pokédex detail page shows base stat total
- The type filter row is pinned above the list; search collapses into the app bar
- Smoother scrolling in the achievements list
- Fixed a crash when an external link had nothing to open it

## 3.11 — June 2026

- Opening the toolkit mid-game pauses emulation
- Pokédex content refreshes when you switch language
- Audio focus is only taken during an active game session

## 3.10 — June 2026

- New GoGBA Toolkit: Pokédex, type chart, and nature table
- The Pokédex ships an offline database, localized across 24 languages
- New long-press to reset toggle

## 3.9 — June 2026

- Rebuilt the emulation cores, fixing the real-time clock across all games
- Fixed color-block flicker on Android
- Pressing a button brightens its glyph instead of scaling it
- D-pad vibration can be turned off on its own
- New adaptive orientation mode

## 3.8 — June 2026

- The quick-save gesture is free for everyone
- New screenshot gesture toggle
- Button opacity can be set separately for portrait and landscape
- Landscape defaults the game screen to 75% of the usable height
- Fixed the freeze when switching between games

## 3.7 — June 2026

- New Tip of the Day, surfacing features that are easy to miss
- The achievement sound mixes with game audio instead of interrupting it

## 3.6 — June 2026

- The app icon was redrawn as a mascot gamepad face
- Long-press to reset gained haptic feedback

## 3.5 — June 2026

- New slide-to-unlock gesture and quick-save slot; swipe right to view the slot
- Fixed audio latency building up on Bluetooth headphones
- Fixed the landscape picture not matching the real display area
- Fixed a render-thread freeze on Android

## 3.4 — May 2026

- New screenshot capture, saved to your gallery
- The library filter is remembered between sessions
- Reset can be mapped to a gamepad button
- GB/GBC use the standard layout, with the control-mode menu hidden
- Fixed audio desync and crashes during fast-forward
- Fixed inconsistent upscaling between video filters
- The RetroAchievements password moved into secure storage

## 3.3 — May 2026

- Redesigned render filters with a new CRT mode
- The linear filter split into its own setting
- New premium pixel font style

## 3.2 — May 2026

- Folder import shows native scan progress and can be cancelled
- New GB BIOS file card
- Fixed how duplicate filenames are handled on import

## 3.1 — May 2026

- Reworked library browsing with grid layout and pinch-to-zoom
- Long titles scroll as a marquee
- Upside-down portrait and every iPad orientation are supported

## 3.0 — April 2026

- New toggle for using the official BIOS in emulation
- Redesigned library home
- Fixed render-thread and audio-startup races on Android

## 2.5 — April 2026

- GB/GBC cheats (CodeBreaker format) and achievements
- Cards show a GBA platform label

## 2.4 — April 2026

- New automatic orientation mode, now the default
- New draggable button layout editor
- Import Libretro `.cht` cheat files
- Automatic instant-save slot
- Fixed saves being lost when renaming a game

## 2.3 — April 2026

- Instant save slots can be deleted
- ROM hashing moved off the UI thread, so imports no longer stutter

## 2.2 — April 2026

- New instant save with cloud sync
- Folder import on iOS
- Fixed BIOS files being mistaken for ROMs

## 2.1 — April 2026

- Bundled Libretro cheat library
- Android fast-forward uses libsonic for steadier audio
- URL import and Android folder import
- Fixed audio dropping out after a Bluetooth route change

## 2.0 — March 2026

- New AI screen translation
- New cheat support
- Tighter audio buffers for lower playback latency
- Covers fade in as they load
- Fixed game paths being lost after an iOS sandbox move

## 1.15 — March 2026

- New AI translation for the game screen

## 1.14 — March 2026

- New reset button with a long-press progress indicator

## 1.13 — March 2026

- ZIP import, with the cover extracted automatically

## 1.12 — March 2026

- Audio playback speed follows game speed
- Fixed crackling during fast-forward

## 1.11 — March 2026

- New cloud save: iCloud and Google Drive
- Fast-forward extended to 5x, with custom speeds
- Introduced Premium and in-app purchases
- D-pad diagonals can be disabled

## 1.10 — February 2026

- Fixed precision issues in the color filter

## 1.9 — January 2026

- New gyroscope and rumble support
- Achievements support multiple subsets
- Sensor support on iOS
- Faster game loading

## 1.8 — January 2026

- Rendering upgraded to OpenGL ES 3.0 for a smoother picture
- New FPS overlay
- New button size and layout configuration
- Save writes moved to a background thread
- Gamepad support on iOS

## 1.7 — January 2026

- New video filter settings page
- The onboarding guide supports landscape
- Fixed audio desync during fast-forward
- Fixed audio routing when Bluetooth devices change

## 1.6 — December 2025

- New BIOS management
- Database version management
- Achievement cards show a missable indicator

## 1.5 — December 2025

- Swapped the emulation core from vba-next to mGBA, a large compatibility gain
- New game search
- New achievement sound
- More game file extensions supported

## 1.4 — December 2025

- New leaderboards
- New hardcore mode
- Open games from other apps
- Rich Presence shown in the drawer

## 1.3 — December 2025

- New Rich Presence
- Gamepad support on iOS
- Menu and power buttons stay visible when controls are hidden

## 1.2 — November 2025

- New RetroAchievements support, iOS included
- New Encore mode
- New gamepad button mapping
- New game file validation

## 1.1 — November 2025

- RetroAchievements foundation
- New favorites and play-time tracking
- ZIP import and automatic cover matching
- Redrawn app icon and splash screen
- Android 15 edge-to-edge support

## 1.0 — November 2025

First release.

- GBA emulation
- Auto-save every 10 seconds
- On-screen controls in D-pad and joystick modes
- Six dark themes
- 24 interface languages
- Game cover search and automatic matching
- Adjustable button opacity and vibration strength
- Portrait and landscape locking
