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
