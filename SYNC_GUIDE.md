# Forever Path v0.4 sync and TomTom guide

Forever Path uses checksummed text codes to synchronize the website with the in-game addon. TomTom renders the active route destination as its Crazy Arrow and map pins.

## Install

1. Close WoW.
2. Install and enable a TomTom version compatible with the WoW Forever client.
3. Copy the complete `ForeverPathSync` folder into the active client's `Interface/AddOns` directory.
4. Confirm that `ForeverPathSync.toc`, `QuestIDs.lua`, `Codec.lua`, `RouteData.lua`, and `ForeverPathSync.lua` are directly inside that folder.
5. Start WoW, enable TomTom and Forever Path Sync, and log into Crouton.
6. Enter `/fp status`.

## Website → game

1. On the website, build or resume the route.
2. Tap **Sync with WoW**.
3. Under **Web → game**, tap **Refresh Code**, then **Copy for WoW**.
4. In WoW, enter `/fp import ` followed by the complete `FPW1;...` code.

The import selects the same next step in the addon's bundled 53-step route, imports completed and skipped checklist state, applies dungeon/group preferences, and creates the TomTom waypoint.

## Navigation controls

| Command | Behavior |
| --- | --- |
| `/fp status` | Opens the addon and prints the current instruction and coordinates |
| `/fp next` | Marks the current step complete and advances |
| `/fp back` | Returns to the previous enabled step and reopens it |
| `/fp skip` | Marks the current step skipped and advances |
| `/fp arrow` | Recreates the active TomTom waypoint |
| `/fp clear` | Removes only the waypoint created by Forever Path |
| `/fp export` | Builds the game → website status code |
| `/fp import <code>` | Imports the website's route state |

The addon window includes buttons for Back, Next, Skip, Arrow, and Clear.

### Automatic advancement

The addon listens for quest-log updates and advances only when every linked quest in the current aggregated step satisfies the appropriate condition:

- **Accept:** every linked quest is active or already completed.
- **Complete/dungeon:** every linked quest is ready to turn in or already completed.
- **Turn in:** every linked quest is flagged completed.
- **Travel/train/maintenance:** manual `/fp next` is required.

Mixed steps may still require `/fp next`; this prevents the addon from guessing that unfinished work is complete.

### TomTom ownership

ForeverPathSync stores the unique waypoint returned by TomTom. When the route advances, it removes that waypoint and creates the next one. It does not run TomTom's global reset command and does not remove personal markers.

If TomTom is unavailable, the addon attempts WoW's native user waypoint system. If neither interface exists, `/fp status` still prints the coordinate.

## Game → website

1. Enter `/fp export`.
2. Copy the full `FP1;...` code. On a separate iPhone, a screenshot plus Live Text also works.
3. On the website, tap **Sync with WoW**, paste the code, and tap **Preview Import**.
4. Verify the summary and tap **Update My Route**.

The game code carries:

| Field | Meaning |
| --- | --- |
| `R` | Quest-registry version |
| `L` | Character level |
| `Z`, `S` | Zone and subzone |
| `M`, `X`, `Y` | Current map and position |
| `H` | Hearth bind location |
| `C`, `A` | Completed and active quest bitsets |
| `N` | Current addon route-step ID |
| `P`, `Q` | Completed and skipped route-step bitsets |
| `K` | Checksum |

The code contains no login, Battle.net token, chat, inventory, gold, or account credentials.

## Merge rules

- Game and addon completion are additive; importing does not erase existing web completion.
- An imported completed step overrides an imported skipped marker for that same step.
- Completed quests can still complete matching website steps even if the addon route bitset is absent, preserving compatibility with v0.3 exports.
- The profile remains Horde / Orc / Warrior.
- Levels through 30 are retained, but verified instructions currently end at 20.

## Coordinate limitations

v0.4 includes a representative waypoint for every route step. These are **route-beta navigation anchors**, not fully playtested objective pins. Aggregated steps can include several NPCs, mobs, objects, or cities; the arrow points to the primary anchor named by the step. Use the written instruction and `/fp next` for remaining sub-objectives.

## Troubleshooting

- **No Crazy Arrow:** Enter `/fp arrow`. If it reports native or coordinates instead of TomTom, confirm TomTom is enabled and `/tomtom` opens.
- **Wrong step:** Reimport the latest website code or use `/fp back` and `/fp next`.
- **Arrow points to the correct area but not the exact NPC:** The coordinate is a beta route anchor; follow the step text and report the correction for the next data revision.
- **Checksum error:** Copy the entire code again, including the final `K=` field.
- **Route-state length error:** Update both the website and addon to v0.4.
- **No route above level 20:** Intentional. Levels 21–30 are stored, but the verified 21–30 route is not yet included.
