const source = "Forever database 1.60.1; route order pending timed playthrough";

function step(id, type, title, instruction, zone, minLevel, questIds = [], extra = {}) {
  return {
    id,
    type,
    title,
    instruction,
    zone,
    minLevel,
    questIds,
    source,
    estimatedMinutes: 0,
    estimatedXp: 0,
    reason: "Included because it advances the current quest cluster without a separate travel loop.",
    ...extra
  };
}

export const ROUTE_PACKS = [
  {
    id: "horde-orc-valley-1-5",
    name: "Orc opening — Valley of Trials",
    faction: "Horde",
    races: ["Orc", "Troll"],
    order: 10,
    minLevel: 1,
    maxLevel: 5,
    startZones: ["Durotar"],
    endZone: "Durotar",
    verificationStatus: "ROUTE_BETA",
    steps: [
      step("orc-001", "turnin", "Report to Gornek", "Turn in Your Place In The World, then immediately accept Cutting Teeth.", "Durotar", 1, [4641, 788], { checkpoint: true, tags: ["valley of trials", "gornek", "starter"], estimatedMinutes: 1, estimatedXp: 40, reason: "This unlocks the Orc starter chain and puts the first kill quest in your log before any combat." }),
      step("orc-002", "accept", "Stack the opening quests", "Accept Sting of the Scorpid and Galgar's Cactus Apple Surprise before leaving the Den area.", "Durotar", 1, [789, 4402], { estimatedMinutes: 1, reason: "Boars, scorpids, and cactus apples overlap in the same compact opening loop." }),
      step("orc-003", "complete", "Clear the first Valley loop", "Kill boars and scorpids while collecting cactus apples. Stay close to the central paths and finish all three objectives before returning.", "Durotar", 1, [788, 789, 4402], { estimatedMinutes: 8, estimatedXp: 800, reason: "Completing all three together avoids three separate trips through the same terrain." }),
      step("orc-004", "turnin", "Batch the first turn-ins", "Return to the Valley hub and turn in Cutting Teeth, Sting of the Scorpid, and Galgar's Cactus Apple Surprise.", "Durotar", 2, [788, 789, 4402], { estimatedMinutes: 2, estimatedXp: 800, reason: "The turn-ins are close together and should push you into the next quest tier." }),
      step("orc-005", "accept", "Accept the north-loop quests", "Accept Lazy Peons, Vile Familiars, Sarkoth, Thazz'ril's Pick, and Burning Blade Medallion as they become available.", "Durotar", 3, [5441, 792, 804, 6394, 794], { checkpoint: true, tags: ["valley of trials", "den"], estimatedMinutes: 2, reason: "These objectives all sit north or west of the Valley hub and combine into one outward loop." }),
      step("orc-006", "complete", "Kill Sarkoth on the west side", "Detour west for Sarkoth, loot the claw, turn the first Sarkoth step in nearby, and accept the follow-up before continuing north.", "Durotar", 3, [804, 790], { estimatedMinutes: 3, estimatedXp: 560, reason: "The short local handoff prevents an extra return after the cave loop." }),
      step("orc-007", "complete", "Wake peons while moving north", "Use the Foreman's Blackjack on sleeping peons and kill Vile Familiars along the same route.", "Durotar", 3, [5441, 792], { estimatedMinutes: 6, estimatedXp: 900, reason: "The peons and familiars share the route toward the Burning Blade cave." }),
      step("orc-008", "complete", "One-pass Burning Blade cave", "Enter the cave once. Loot Thazz'ril's Pick and the Burning Blade Medallion, then leave without grinding deep respawns.", "Durotar", 4, [6394, 794], { estimatedMinutes: 8, estimatedXp: 1120, reason: "Both cave quests are completed in one visit; the cave is inefficient to revisit." }),
      step("orc-009", "turnin", "Clear the Valley quest log", "Return to the Valley hub and turn in every completed quest. Accept Report to Sen'jin Village and A Peon's Burden.", "Durotar", 5, [5441, 792, 6394, 794, 790, 805, 2161], { estimatedMinutes: 3, estimatedXp: 2250, reason: "This closes the starter hub and carries the route south, then north toward Razor Hill." })
    ]
  },
  {
    id: "horde-durotar-senjin-5-8",
    name: "Durotar coast — Sen'jin to Razor Hill",
    faction: "Horde",
    races: ["Orc", "Troll"],
    order: 20,
    minLevel: 5,
    maxLevel: 8,
    startZones: ["Durotar"],
    endZone: "Durotar",
    verificationStatus: "ROUTE_BETA",
    steps: [
      step("orc-020", "turnin", "Enter Sen'jin Village", "Turn in Report to Sen'jin Village. Accept A Solvent Spirit, Practical Prey, Thwarting Kolkar Aggression, Break a Few Eggs, From The Wreckage...., Minshina's Skull, and Zalazane as they unlock.", "Durotar", 5, [805, 818, 817, 786, 815, 825, 808, 826], { checkpoint: true, tags: ["sen'jin", "senjin", "echo isles"], estimatedMinutes: 3, estimatedXp: 230, reason: "These quests form two dense loops: the coast/islands and the nearby Kolkar camp." }),
      step("orc-021", "complete", "Sweep the shoreline wreckage", "Move east along the coast first and loot the wrecked ships for From The Wreckage.... while killing on-path tigers and crawlers.", "Durotar", 5, [825, 817, 818], { estimatedMinutes: 7, estimatedXp: 700, reason: "The wreckage is the eastern edge of the loop; doing it first prevents backtracking after the islands." }),
      step("orc-022", "complete", "Clear the Echo Isles loop", "Collect eggs and complete the tiger/crab objectives. If you have help or are comfortable with the pulls, complete Minshina's Skull and Zalazane before leaving.", "Durotar", 6, [815, 817, 818, 808, 826], { estimatedMinutes: 14, estimatedXp: 3650, flags: ["group"], reason: "All objectives are on the same island circuit; Zalazane is the danger spike, so he is filtered when group quests are disabled." }),
      step("orc-023", "complete", "Finish the Kolkar camp", "Travel west of Sen'jin and destroy the Kolkar attack plans for Thwarting Kolkar Aggression.", "Durotar", 6, [786], { estimatedMinutes: 6, estimatedXp: 700, reason: "The camp is isolated, so it is best done once after the coastal loop rather than mixed into it." }),
      step("orc-024", "turnin", "Batch all Sen'jin turn-ins", "Return to Sen'jin Village, turn in the completed cluster, sell, and repair. Do not begin another southbound loop.", "Durotar", 7, [818, 817, 786, 815, 825, 808, 826], { estimatedMinutes: 3, estimatedXp: 4420, reason: "The next route moves north permanently; this is the last efficient Sen'jin stop." }),
      step("orc-025", "travel", "Move north to Razor Hill", "Follow the road north. Turn in A Peon's Burden at the inn and Report to Orgnil in Razor Hill. Set your hearthstone at Razor Hill.", "Durotar", 7, [2161, 823], { checkpoint: true, tags: ["razor hill", "inn", "orgnil"], estimatedMinutes: 5, estimatedXp: 430, reason: "Razor Hill becomes the base for both eastern and northern Durotar loops." }),
      step("orc-026", "train", "Train and repair once", "Train your available class skills, repair, vendor, and buy food before leaving Razor Hill.", "Durotar", 7, [], { estimatedMinutes: 2, reason: "Bundling maintenance here avoids returning during the two combat loops." }),
      step("orc-027", "accept", "Stack the Razor Hill routes", "Accept Vanquish the Betrayers, Encroachment, and Winds in the Desert. Take any direct follow-ups that remain on the northbound route.", "Durotar", 7, [784, 837, 834], { estimatedMinutes: 2, reason: "The three quests cover east, west, and north Durotar and can be chained into a single clockwise sweep." })
    ]
  },
  {
    id: "horde-durotar-north-8-12",
    name: "Northern Durotar — Razor Hill to Crossroads",
    faction: "Horde",
    races: ["Orc", "Troll"],
    order: 30,
    minLevel: 8,
    maxLevel: 12,
    startZones: ["Durotar", "Orgrimmar"],
    endZone: "The Barrens",
    verificationStatus: "ROUTE_BETA",
    steps: [
      step("orc-030", "complete", "Clear Tiragarde Keep", "Go east from Razor Hill and complete Vanquish the Betrayers. Kill Lieutenant Benedict if convenient and keep any quest-starting orders he drops.", "Durotar", 8, [784], { checkpoint: true, tags: ["tiragarde", "razor hill", "east"], estimatedMinutes: 10, estimatedXp: 630, reason: "Tiragarde is the only east-side detour; clear it before committing to the north loop." }),
      step("orc-031", "complete", "Finish Encroachment west of the road", "Cross back past Razor Hill and kill the Razormane targets for Encroachment while moving toward the northern canyon.", "Durotar", 8, [837], { estimatedMinutes: 9, estimatedXp: 630, reason: "The Razormane camps lead naturally toward the Winds in the Desert area." }),
      step("orc-032", "complete", "Collect Winds in the Desert sacks", "Continue north and collect the stolen supply sacks, then take the Securing the Lines follow-up.", "Durotar", 8, [834, 835], { estimatedMinutes: 8, estimatedXp: 780, reason: "The follow-up is farther north, so accepting it now avoids a full repeat trip." }),
      step("orc-033", "complete", "Secure the northern lines", "Kill the required harpies for Securing the Lines. Stay on the western side when finished so the route can turn toward Orgrimmar.", "Durotar", 9, [835], { estimatedMinutes: 10, estimatedXp: 880, reason: "This is the last open-world objective before the Orgrimmar/Skull Rock block." }),
      step("orc-034", "travel", "Enter Orgrimmar and train", "Visit the Warrior trainer, repair, and set up the Hidden Enemies chain with Thrall. If your hearth is ready, keep it for returning to Razor Hill afterward.", "Orgrimmar", 9, [5726], { checkpoint: true, tags: ["orgrimmar", "valley of honor", "thrall"], estimatedMinutes: 5, reason: "Level 10 training and Hidden Enemies are combined into one city stop." }),
      step("orc-035", "accept", "Prepare the Skull Rock bundle", "Accept Skull Rock and Dark Storms in northern Durotar. Advance Margoz → Ak'Zeloth → Burning Shadows when offered.", "Durotar", 9, [827, 806, 828, 809, 832], { estimatedMinutes: 3, reason: "These chains all converge on Skull Rock and the Burning Blade camps." }),
      step("orc-036", "complete", "One-pass Skull Rock clear", "Complete Skull Rock, Burning Shadows, and the Hidden Enemies objective in the same cave visit. Complete Dark Storms nearby only if the named mob is available and safe.", "Durotar", 10, [827, 832, 5726, 806], { estimatedMinutes: 16, estimatedXp: 3410, flags: ["group"], reason: "The shared cave visit is highly efficient; Dark Storms is the optional danger spike." }),
      step("orc-037", "turnin", "Close the Durotar chains", "Return through Orgrimmar and Razor Hill to turn in the completed north-Durotar quests and advance Hidden Enemies with Thrall and Neeru.", "Orgrimmar", 10, [827, 832, 806, 835, 5726, 5727], { estimatedMinutes: 8, estimatedXp: 4200, reason: "This consolidates city and Durotar turn-ins before leaving the zone." }),
      step("orc-038", "travel", "Take the Crossroads handoff", "Accept Conscript of the Horde, complete it, then take Crossroads Conscription and travel west into The Barrens.", "Durotar", 10, [840, 842], { estimatedMinutes: 8, estimatedXp: 1370, reason: "The handoff pays XP for travel you already need to do and anchors the next route." })
    ]
  },
  {
    id: "horde-barrens-north-10-14",
    name: "Northern Barrens — Crossroads opening",
    faction: "Horde",
    races: [],
    order: 40,
    minLevel: 10,
    maxLevel: 14,
    startZones: ["The Barrens"],
    endZone: "The Barrens",
    verificationStatus: "ROUTE_BETA",
    steps: [
      step("bar-040", "turnin", "Establish the Crossroads", "Turn in Crossroads Conscription. Set your hearthstone, learn the flight path, repair, and empty your bags.", "The Barrens", 10, [842], { checkpoint: true, tags: ["crossroads", "inn", "flight master"], estimatedMinutes: 3, estimatedXp: 910, reason: "The Crossroads is the central hub for every 10–20 loop; all maintenance belongs in this first stop." }),
      step("bar-041", "accept", "Stack the first Crossroads cluster", "Accept Sergra Darkthorn, The Barrens Oases, Disrupt the Attacks, Plainstrider Menace, Raptor Thieves, The Zhevra, Fungal Spores, and The Forgotten Pools as they unlock.", "The Barrens", 10, [860, 886, 871, 844, 869, 845, 848, 870], { estimatedMinutes: 3, reason: "These objectives overlap across the roads and first oasis loop." }),
      step("bar-042", "complete", "Kill while moving to the Forgotten Pools", "Kill plainstriders, zhevra, and raptors only along your route. Collect fungal spores and inspect the Forgotten Pools before heading north-east.", "The Barrens", 10, [844, 845, 869, 848, 870], { estimatedMinutes: 15, estimatedXp: 4560, reason: "The wildlife drops are passive progress; the pool and spores determine the travel line." }),
      step("bar-043", "complete", "Break the Razormane attacks", "Complete Disrupt the Attacks at the nearby Razormane camps, then accept and complete The Disruption Ends if your level permits.", "The Barrens", 11, [871, 872], { estimatedMinutes: 11, estimatedXp: 1960, reason: "The follow-up uses the same enemy family and should be finished before respawn competition increases." }),
      step("bar-044", "turnin", "Batch turn in at Crossroads", "Return to the Crossroads, turn in the completed cluster, accept Prowlers of the Barrens, Echeyakee, and the next oasis quests.", "The Barrens", 12, [844, 845, 869, 848, 870, 871, 872, 903, 881], { checkpoint: true, tags: ["crossroads"], estimatedMinutes: 4, estimatedXp: 6520, reason: "This unlocks the level 13–16 chains and is the best point to re-evaluate your actual level." }),
      step("bar-045", "complete", "Complete the Echeyakee loop", "Kill prowlers on the way, summon and kill Echeyakee, and finish any remaining wildlife objectives without chasing distant spawns.", "The Barrens", 12, [903, 881], { estimatedMinutes: 12, estimatedXp: 2500, reason: "Prowlers are spread across Echeyakee's approach, making this a natural paired loop." })
    ]
  },
  {
    id: "horde-rfc-13-16",
    name: "Optional dungeon window — Ragefire Chasm",
    faction: "Horde",
    races: [],
    order: 50,
    minLevel: 13,
    maxLevel: 16,
    startZones: ["The Barrens", "Orgrimmar", "Mulgore", "Tirisfal Glades"],
    endZone: "The Barrens",
    verificationStatus: "QUESTS_PAGE_VERIFIED_ROUTE_BETA",
    flags: ["dungeon"],
    steps: [
      step("rfc-050", "travel", "Collect the Thunder Bluff RFC quests", "Travel to Thunder Bluff and accept Testing an Enemy's Strength and Searching for the Lost Satchel from Rahauro.", "Mulgore", 13, [5723, 5722], { checkpoint: true, tags: ["thunder bluff", "rahauro"], flags: ["dungeon"], estimatedMinutes: 8, reason: "Two of the five pre-run RFC quests originate in Thunder Bluff; collect both in one visit." }),
      step("rfc-051", "travel", "Collect The Power to Destroy...", "Travel to Undercity and accept The Power to Destroy... from Varimathras. Skip this detour if your group is waiting and speed matters more than full dungeon-quest completion.", "Tirisfal Glades", 13, [5725], { flags: ["dungeon", "optional"], estimatedMinutes: 12, reason: "This adds 1,450 verified quest XP, but the cross-continent travel can make it inefficient for a ready group." }),
      step("rfc-052", "accept", "Finish the Orgrimmar RFC setup", "In Orgrimmar, accept Slaying the Beast from Neeru and advance Hidden Enemies until its RFC step is active. Repair and clear bag space.", "Orgrimmar", 13, [5761, 5729, 5730], { checkpoint: true, tags: ["orgrimmar", "neeru", "ragefire"], flags: ["dungeon"], estimatedMinutes: 5, reason: "This collects the local boss quests immediately before entering the instance." }),
      step("rfc-053", "dungeon", "Run Ragefire Chasm once", "Kill 8 Ragefire Troggs and 8 Ragefire Shamans, loot both spellbooks, find Maur Grimtotem and accept Returning the Lost Satchel inside, then kill Taragaman and the Hidden Enemies targets.", "Orgrimmar", 13, [5723, 5722, 5724, 5725, 5761, 5730], { flags: ["dungeon"], estimatedMinutes: 28, estimatedXp: 7380, reason: "One complete run finishes all verified RFC objectives; a second clear is normally worse than returning to questing." }),
      step("rfc-054", "turnin", "Turn in the Orgrimmar quests", "Turn in Slaying the Beast and the final Hidden Enemies step before leaving Orgrimmar.", "Orgrimmar", 14, [5761, 5730], { flags: ["dungeon"], estimatedMinutes: 3, estimatedXp: 2600, reason: "These turn-ins are adjacent to the dungeon exit and require no extra travel." }),
      step("rfc-055", "turnin", "Bank the remote RFC turn-ins", "Turn in Testing an Enemy's Strength and Returning the Lost Satchel in Thunder Bluff, and The Power to Destroy... in Undercity, when your travel path makes those visits efficient.", "The Barrens", 14, [5723, 5724, 5725], { flags: ["dungeon", "optional"], estimatedMinutes: 12, estimatedXp: 3950, reason: "These rewards are valuable, but delaying the turn-ins can be faster than making isolated city trips." })
    ]
  },
  {
    id: "horde-barrens-ratchet-13-17",
    name: "The Barrens — Ratchet and oasis loops",
    faction: "Horde",
    races: [],
    order: 60,
    minLevel: 13,
    maxLevel: 17,
    startZones: ["The Barrens"],
    endZone: "The Barrens",
    verificationStatus: "ROUTE_BETA",
    steps: [
      step("bar-060", "travel", "Open Ratchet", "Travel to Ratchet, learn the flight path, and accept The Missing Shipment, Southsea Freebooters, WANTED: Baron Longshore, Samophlange, Nugget Slugs, and Miner's Fortune as available.", "The Barrens", 13, [890, 887, 895, 894, 3922, 896], { checkpoint: true, tags: ["ratchet", "flight master", "dock"], estimatedMinutes: 4, reason: "Ratchet supplies both the north-east Samophlange route and the south-coast pirate route." }),
      step("bar-061", "complete", "Finish the Samophlange chain", "Go north-east and complete each Samophlange console step in order. Kill Venture Co. mobs for Nugget Slugs and watch for the Miner's Fortune drop while there.", "The Barrens", 13, [894, 900, 901, 902, 3922, 896], { estimatedMinutes: 18, estimatedXp: 5170, reason: "The entire chain and two drop quests share one compact Venture Co. area." }),
      step("bar-062", "turnin", "Return to Ratchet once", "Turn in the available goblin quests, advance The Missing Shipment, and repair before heading south along the coast.", "The Barrens", 14, [894, 900, 901, 902, 3922, 896, 890, 892], { estimatedMinutes: 4, estimatedXp: 5370, reason: "This avoids carrying completed quests through the longer pirate loop." }),
      step("bar-063", "complete", "Clear the Southsea coast", "Kill Southsea Freebooters and Baron Longshore, collect Stolen Booty, and complete the shipment chain. Attempt Baron only when the pull is safe or help is available.", "The Barrens", 14, [887, 895, 888, 892], { flags: ["group"], estimatedMinutes: 14, estimatedXp: 3140, reason: "All four quests occupy the same coastal camps; Baron is the only group-sensitive target." }),
      step("bar-064", "complete", "Run the Stagnant Oasis circuit", "Return inland and complete The Stagnant Oasis and Altered Beings, killing centaurs for Centaur Bracers on the way.", "The Barrens", 15, [877, 880, 855], { estimatedMinutes: 15, estimatedXp: 3550, reason: "The oasis and centaur camps form a continuous loop back toward Crossroads." }),
      step("bar-065", "turnin", "Reset at Crossroads", "Turn in the Ratchet/oasis cluster at Crossroads, train if needed, repair, and take the harpy and higher-level hunt quests.", "The Barrens", 16, [887, 895, 888, 877, 880, 855], { checkpoint: true, tags: ["crossroads"], estimatedMinutes: 5, estimatedXp: 6070, reason: "This closes the eastern half of The Barrens and starts the 16–20 western and southern loops." })
    ]
  },
  {
    id: "horde-barrens-finish-16-20",
    name: "The Barrens — 16–20 finish",
    faction: "Horde",
    races: [],
    order: 70,
    minLevel: 16,
    maxLevel: 20,
    startZones: ["The Barrens", "Stonetalon Mountains"],
    endZone: "The Barrens",
    verificationStatus: "ROUTE_BETA",
    steps: [
      step("bar-070", "accept", "Stack the 16–20 finish quests", "At Crossroads accept Harpy Raiders, Kolkar Leaders, The Angry Scytheclaws, Enraged Thunder Lizards, Raptor Horns, Ishamuhale, and Cry of the Thunderhawk as available.", "The Barrens", 16, [867, 850, 905, 907, 865, 882, 913], { checkpoint: true, tags: ["crossroads", "level 16", "level 17"], estimatedMinutes: 3, reason: "These quests cover the western harpy loop, central raptors, and the southern transition." }),
      step("bar-071", "complete", "Clear the western harpy chain", "Complete Harpy Raiders, turn it in, then return for Harpy Lieutenants. Finish Serena Bloodfeather only with a safe pull or help.", "The Barrens", 16, [867, 875, 876], { flags: ["group"], estimatedMinutes: 20, estimatedXp: 4150, reason: "The chain reuses the same camps; Serena is the optional capstone and is filtered in solo-only mode." }),
      step("bar-072", "complete", "Finish the central hunt loop", "Complete The Angry Scytheclaws, Raptor Horns, Ishamuhale, Enraged Thunder Lizards, and Cry of the Thunderhawk while moving south.", "The Barrens", 17, [905, 865, 882, 907, 913], { estimatedMinutes: 24, estimatedXp: 8050, reason: "The objectives progress geographically south and provide strong quest XP without a return north between kills." }),
      step("bar-073", "complete", "Break the Kolkar leaders", "Complete Kolkar Leaders, Verog the Dervish, and Hezrul Bloodmark in chain order. Avoid waiting on a forced spawn if another objective is ready nearby.", "The Barrens", 17, [850, 851, 852], { flags: ["group"], estimatedMinutes: 18, estimatedXp: 2980, reason: "All three chain steps share the same centaur area, but spawn timing can make them inefficient when contested." }),
      step("bar-074", "travel", "Shift your base to Camp Taurajo", "Travel south to Camp Taurajo, learn the flight path, repair, and accept Consumed by Hatred and Lost in Battle.", "The Barrens", 18, [899, 4921], { checkpoint: true, tags: ["camp taurajo", "taurajo", "south barrens"], estimatedMinutes: 6, reason: "Taurajo shortens the remaining southern loops and prevents repeated rides from Crossroads." }),
      step("bar-075", "complete", "Complete the southern quilboar loop", "Finish Consumed by Hatred and Lost in Battle. Combine every quilboar kill and loot objective before leaving the area.", "The Barrens", 18, [899, 4921], { estimatedMinutes: 15, estimatedXp: 3100, reason: "The objectives overlap heavily and finish close to Camp Taurajo." }),
      step("bar-076", "complete", "Finish the Venture Co. escort block", "Complete Ignition and The Escape when the escort is available. Pick up Rilli Greasygob and carry the Samophlange Manual handoff forward.", "The Barrens", 18, [858, 863, 3923, 3924], { estimatedMinutes: 16, estimatedXp: 5190, reason: "The escort and goblin handoffs reuse the same northern Venture Co. route; do not wait through multiple failed escort cycles." }),
      step("bar-077", "complete", "Optional Northwatch finale", "If you have a ready group, complete Free From the Hold and The Guns of Northwatch. Otherwise skip them and finish level 20 with the remaining outdoor turn-ins and efficient on-path kills.", "The Barrens", 19, [898, 891], { flags: ["group", "optional"], estimatedMinutes: 18, estimatedXp: 3500, reason: "Northwatch is valuable with a group already formed but can be a poor solo time investment." }),
      step("bar-078", "turnin", "Close the 1–20 route", "Turn in the southern Barrens quests, train level 20 abilities, repair, and choose your next 20+ zone based on the current Forever beta route pack.", "The Barrens", 20, [899, 4921, 858, 863, 3924, 898, 891], { checkpoint: true, tags: ["camp taurajo", "crossroads", "level 20"], estimatedMinutes: 8, estimatedXp: 11790, reason: "This banks the route's final quest XP and leaves the character ready for the next verified data pack." })
    ]
  }
];

export const SYNC_ROUTE_STEP_IDS = ROUTE_PACKS.flatMap(pack => pack.steps.map(routeStep => routeStep.id));
