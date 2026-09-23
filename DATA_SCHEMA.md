# Forever Path data model

The starter deliberately separates **route logic** from **verified game data**.

## Quest record

Recommended production shape:

```js
{
  id: 12345,
  name: "Quest name",
  faction: ["Horde"],
  races: [],
  classes: [],
  questLevel: 12,
  minLevel: 9,
  zone: "The Barrens",
  giver: { npcId: 111, name: "NPC", x: 52.1, y: 31.4 },
  turnIn: { npcId: 111, name: "NPC", x: 52.1, y: 31.4 },
  prerequisites: [12340],
  followups: [12346],
  mutuallyExclusiveWith: [],
  objectives: [
    { type: "kill", targetId: 222, targetName: "Mob", count: 8, locations: [{x:44.2,y:55.0}] }
  ],
  xp: 1150,
  elite: false,
  dungeon: null,
  repeatable: false,
  verification: {
    build: "1.60.1",
    status: "verified",
    checkedAt: "2026-09-18",
    sources: []
  }
}
```

### Verification status

- `DB_VERIFIED` — present in the Forever database; level, minimum level, and XP checked.
- `PAGE_VERIFIED` — the individual quest page and its objective/giver details were inspected.
- `IN_GAME_VERIFIED` — reserved for a quest confirmed during a live Forever playthrough.

Database verification does not mean the route order has been timed. Route packs carry their own `ROUTE_BETA` status.

## Route step

```js
{
  id: "h-12-034",
  type: "accept | complete | turnin | travel | hearth | flight | train | vendor | dungeon | grind",
  questIds: [12345],
  title: "Accept Quest Name",
  instruction: "Talk to NPC at 52.1, 31.4.",
  zone: "The Barrens",
  coordinates: {x:52.1,y:31.4},
  minLevel: 12,
  estimatedMinutes: 1,
  estimatedXp: 0,
  requiredCompletedSteps: [],
  flags: ["optional"],
  reason: "Picked up now because the next three objectives overlap."
}
```

Checkpoint-capable steps may also include:

```js
{
  checkpoint: true,
  tags: ["crossroads", "inn", "flight master"]
}
```

When **Start route from my current level & zone** is used, the resolver selects the best segment and then scores its checkpoints against the character level, current zone, and free-text location notes.

## Route segment

Segments make "pick up anywhere" possible. A segment should have multiple valid entry points and an end state that connects to the next segment.

```js
{
  id: "horde-barrens-12-16-a",
  faction: "Horde",
  minLevel: 12,
  maxLevel: 16,
  startZones: ["The Barrens", "Stonetalon Mountains"],
  startLocations: [],
  endZone: "The Barrens",
  prerequisites: [],
  steps: []
}
```

## Optimization fields to add later

- measured completion time per step
- measured XP/hour by class/spec
- travel seconds between hubs
- expected mob competition
- group-finder wait time
- death-risk penalty
- vendor/repair/training detour cost
- hearthstone cooldown/state
- flight paths known
- profession detour toggles
- route build/version

## Sync envelope

Game status uses a compact, semicolon-delimited `FP1` envelope. Completed and active quests are fixed-registry bitsets, encoded as hexadecimal. Both the addon and `data/quest-database.js` must keep the registry in exactly the same order.

```text
FP1;R=1;L=18;Z=The%20Barrens;S=Crossroads;M=10;X=52.1;Y=30.4;H=Crossroads;C=...;A=...;K=...
```

`K` is the uppercase eight-digit Adler-32 checksum of everything before `;K=`. The web app previews and validates the envelope before the user explicitly applies it.

Web-to-game settings use the `FPW1` envelope:

```text
FPW1;D=1;G=1;N=h-18-001;T=Next%20instruction;K=...
```

The sync merge is additive: verified in-game completion can complete matching route steps, but an import never removes an existing completed or skipped step.

v0.4 appends route-state fields to both backward-compatible envelopes:

- `N`: current route-step ID
- `P`: completed route-step bitset
- `Q`: skipped route-step bitset

The route bitsets use the fixed step order exported by `data/route-packs.js` and mirrored in `ForeverPathSync/RouteData.lua`. The registries must remain byte-for-byte ordered together.

## Navigation anchor

Each bundled addon step contains a WoW UI map ID and normalized percent coordinates:

```lua
{
  id = "bar-060",
  mapID = 1413,
  x = 62.7,
  y = 36.2,
  coordinateStatus = "ROUTE_BETA"
}
```

An anchor is the primary destination for an aggregated route instruction. It is not a claim that every linked NPC, mob, or object occupies that single coordinate.
