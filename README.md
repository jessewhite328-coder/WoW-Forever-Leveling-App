# Forever Path

A GitHub Pages-friendly, mobile-first WoW: Forever leveling route planner.

## v0.2 data coverage

This release replaces the demo Horde data with the first real production slice:

- Orc/Troll Durotar opening through level 12
- Crossroads, Ratchet, oasis, western and southern Barrens routes through level 20
- optional five-quest Ragefire Chasm window
- 87 structured quest records checked against the WoW Forever database for build 1.60.1 on 2026-09-18
- route checkpoints that use level, zone, and typed location notes such as `Crossroads`, `Ratchet`, or `Camp Taurajo`

Quest availability, required level, quest level, and XP are database-verified. The route order is a speed-route candidate and still needs timed in-game validation. Exact NPC/objective/turn-in coordinates are the v0.3 milestone.

## What this starter already does

- character profile: faction, race, class, level, current zone
- "Build / Resume Route" from saved progress
- "Start from my current level & zone" resolver
- step-by-step checklist
- next-step card
- persistent progress using localStorage
- skip / complete controls
- filters and search
- estimated remaining XP and time
- dungeon preference toggle
- export/import progress JSON
- installable PWA shell and offline cache
- no framework or build process required

## Verification labels

- `DB_VERIFIED`: the quest record appears in the Forever database.
- `PAGE_VERIFIED`: the individual quest page, giver/objective, level, and XP were checked.
- `ROUTE_BETA`: the ordering is ready for playtesting but is not yet a timed world-record route.

Alliance and non-Durotar Horde starters intentionally show an unavailable message instead of demo instructions.

## Publish on GitHub Pages

1. Create a repository, for example `wow-forever-leveling-guide`.
2. Upload the contents of this folder to the repository root.
3. In GitHub open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then Save.
6. GitHub will show the public Pages URL after deployment.

Because all asset paths are relative, this project works correctly from a GitHub Pages repository subdirectory.

## Recommended development roadmap

### Phase 1 — engine + levels 1–20
- replace demo route packs with verified beta data — Horde Orc/Troll slice complete
- support Horde and Alliance entry points
- add exact quest giver / objective / turn-in coordinates
- add prerequisite chain logic
- add trainer, flight path, hearth, vendor, and dungeon steps
- validate routes with timed playthroughs

## Playtest workflow

1. Enter your actual level, zone, and a recognizable location such as `Razor Hill`.
2. Select **Start route from my current level & zone**.
3. Complete or skip each instruction while playing.
4. Export progress before switching devices.
5. Record any incorrect quest availability, route detour, or level gap for the next data revision.

### Phase 2 — levels 21–30 beta
- add new beta zones/content as the cap rises
- compare alternate zone paths by measured XP/hour
- add route branching when a player arrives over/under-level

### Phase 3 — launch 1–60
- complete the quest database
- route through new Forever zones such as Riverglades and Shen'Dralas where efficient
- add level 60 transition / pre-bis preparation as an optional endpoint

### Phase 4 — smart optimizer
- weighted graph of travel + quest dependencies
- live route recalculation
- per-class speed modifiers
- route variants: pure speed, dungeon-heavy, solo-only, completionist
- crowdsourced anonymous timing data

## Local testing

Do not open `index.html` directly because browser module rules can block local files. Run a tiny local web server instead:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.
