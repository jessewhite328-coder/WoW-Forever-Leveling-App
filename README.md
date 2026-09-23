# Forever Path

A mobile-first WoW: Forever route companion for **Crouton, an Orc Warrior, levels 1–30**. The GitHub Pages web app and `ForeverPathSync` addon exchange character and route status without an account or server. v0.4 adds full 1–20 route navigation through TomTom.

## v0.4 scope

- locked Horde / Orc / Warrior profile with level input and status import through 30
- current route pack covers Durotar, Orgrimmar/Ragefire Chasm, and the Barrens through level 20
- the addon contains the same ordered 53-step route as the website
- TomTom Crazy Arrow, minimap pin, and world-map pin for the active step
- automatic advancement when the addon can safely verify acceptance, objective completion, or turn-in state
- manual **Back**, **Next**, **Skip**, **Arrow**, and **Clear** buttons plus matching slash commands
- bidirectional completed/skipped route-state sync in the compact `FP1` and `FPW1` codes
- dungeon and group preferences are applied inside the addon route
- route coordinates are beta navigation anchors and should be corrected during live playtesting

Levels 21–30 can be imported and retained, but the app deliberately stops route instructions above 20 until that route pack is verified.

## Install and navigate

1. Install a WoW Forever-compatible TomTom build.
2. Copy `ForeverPathSync` into the active client's `Interface/AddOns` directory.
3. Restart WoW and enable both addons.
4. On the website, open **Sync with WoW** and copy the Web → game code.
5. In game, paste `/fp import ` followed by the `FPW1;...` code.
6. TomTom points to the imported current step.

Use `/fp next` for travel, training, maintenance, or any step that the quest log cannot prove. Quest-log events automatically advance qualifying quest steps.

```text
/fp status     Show the current instruction
/fp next       Complete this step and advance
/fp back       Return to the previous enabled step
/fp skip       Skip this step and advance
/fp arrow      Restore the current waypoint
/fp clear      Remove only the Forever Path waypoint
/fp export     Export game and addon status to the website
/fp import …   Import web route state and preferences
```

ForeverPathSync removes only the TomTom waypoint it created. It does not clear personal TomTom markers.

See [SYNC_GUIDE.md](SYNC_GUIDE.md) for merge rules, automatic-advancement details, and troubleshooting.

## Web app features

- build or resume the route from imported/current status
- step checklist with complete and skip controls
- search and step-type filters
- estimated remaining XP and time
- optional Ragefire Chasm and group routing
- local progress storage plus JSON backup/restore
- installable PWA shell and offline cache
- no framework or build process required

## Data confidence

- `DB_VERIFIED`: quest record verified in the Forever database.
- `PAGE_VERIFIED`: individual quest page details checked.
- `ROUTE_BETA`: route order and navigation anchor require timed in-game validation.

A waypoint is the representative destination for an aggregated route step. Some steps contain several nearby NPCs or objectives, so `/fp next` remains the final control when one arrow cannot represent every sub-objective.

## Publish on GitHub Pages

1. Upload the contents of this directory to the repository root, preserving `data`, `src`, and `ForeverPathSync` as folders.
2. In GitHub open **Settings → Pages**.
3. Choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. After deployment, reload the site once online so the v0.4 offline cache replaces v0.3.

The addon folder can remain in the GitHub repository; the website does not load it.

## Local testing

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Roadmap

- playtest and correct all 53 navigation anchors
- split multi-location route steps into finer waypoint stages
- validate and add the Orc Warrior level 21–30 route pack
- add trainer, flight path, hearth, and vendor state detection
- add an optional QR presentation layer over the compact status codes
