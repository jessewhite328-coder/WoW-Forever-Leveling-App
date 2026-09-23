# Changelog

## v0.4 — Full-route TomTom navigation

- bundled the website's ordered 53-step route inside `ForeverPathSync`
- added a TomTom Crazy Arrow, minimap pin, and world-map pin for every route step
- added `/fp next`, `/fp back`, `/fp skip`, `/fp arrow`, `/fp status`, and `/fp clear`
- added matching navigation buttons to the addon window
- added safe quest-log-based automatic advancement for accept, complete, dungeon, and turn-in steps
- ensured the addon removes only the TomTom waypoint it created
- added native waypoint and printed-coordinate fallbacks when TomTom is unavailable
- synchronized manual completed/skipped route state in both directions with fixed-registry bitsets
- added route preferences inside the addon so disabled dungeon/group steps are skipped
- added 53 route-beta navigation anchors and explicit coordinate-confidence messaging

## v0.3 — Orc Warrior profile and game sync

- locked the app to Crouton's Horde Orc Warrior profile and capped level input at 30
- preserved the verified 1–20 route boundary instead of inventing unverified 21–30 instructions
- added a versioned, checksummed game-status format with a fixed 87-quest registry
- added status preview and explicit merge confirmation in the web app
- imported level, zone, subzone, map position, hearth location, completed quests, and active quests
- automatically completed route steps whose linked quests are already complete in game
- added web-to-game export for route preferences and the next instruction
- added the installable `ForeverPathSync` addon with `/fp export`, `/fp show`, and `/fp import`
- added mobile copy/paste and iPhone Live Text guidance
- retained JSON backup and restore as a separate full-progress safety net

## v0.2 — Horde 1–20 data foundation

- replaced all demo Horde steps with an Orc/Troll Durotar → Barrens route candidate
- added structured Forever quest records and direct source links
- added the five-quest Ragefire Chasm preparation/run/turn-in flow
- added meaningful start-from-here checkpoints using level, zone, and location notes
- fixed dungeon disabling so it removes dungeon travel/setup steps as well as the instance step
- added a per-step **Why?** explanation
- added quest chips that open the corresponding Forever database page
- changed remaining XP to deduplicate linked quests across accept/complete/turn-in steps
- added explicit coverage messaging for unverified race and Alliance paths
- updated the offline cache to include the new database and documentation
