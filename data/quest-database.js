const CHECKED_AT = "2026-09-18";
const BUILD = "1.60.1";

function quest(id, name, zone, questLevel, minLevel, xp, extra = {}) {
  return {
    id,
    name,
    faction: ["Horde"],
    races: [],
    classes: [],
    questLevel,
    minLevel,
    zone,
    xp,
    elite: false,
    dungeon: null,
    repeatable: false,
    prerequisites: [],
    followups: [],
    objectives: [],
    sourceUrl: `https://www.wowhead.com/forever/quest=${id}`,
    verification: {
      build: BUILD,
      status: "DB_VERIFIED",
      checkedAt: CHECKED_AT,
      source: "Wowhead Forever database"
    },
    ...extra
  };
}

export const QUESTS = [
  // Durotar / Valley of Trials
  quest(4641, "Your Place In The World", "Durotar", 1, 1, 40, { followups: [788] }),
  quest(788, "Cutting Teeth", "Durotar", 2, 1, 170, { prerequisites: [4641] }),
  quest(789, "Sting of the Scorpid", "Durotar", 3, 1, 250),
  quest(4402, "Galgar's Cactus Apple Surprise", "Durotar", 3, 1, 380),
  quest(792, "Vile Familiars", "Durotar", 4, 2, 450),
  quest(5441, "Lazy Peons", "Durotar", 4, 3, 450),
  quest(6394, "Thazz'ril's Pick", "Durotar", 4, 3, 450),
  quest(794, "Burning Blade Medallion", "Durotar", 5, 1, 670),
  quest(804, "Sarkoth", "Durotar", 5, 1, 110, { followups: [790] }),
  quest(790, "Sarkoth", "Durotar", 5, 1, 450, { prerequisites: [804] }),
  quest(805, "Report to Sen'jin Village", "Durotar", 5, 1, 230),
  quest(2161, "A Peon's Burden", "Durotar", 5, 1, 110),

  // Sen'jin Village / Razor Hill / northern Durotar
  quest(818, "A Solvent Spirit", "Durotar", 7, 5, 630),
  quest(784, "Vanquish the Betrayers", "Durotar", 7, 3, 630),
  quest(823, "Report to Orgnil", "Durotar", 7, 4, 320),
  quest(786, "Thwarting Kolkar Aggression", "Durotar", 8, 5, 700),
  quest(815, "Break a Few Eggs", "Durotar", 8, 6, 700),
  quest(817, "Practical Prey", "Durotar", 8, 5, 700),
  quest(825, "From The Wreckage....", "Durotar", 8, 3, 700),
  quest(808, "Minshina's Skull", "Durotar", 9, 4, 780),
  quest(834, "Winds in the Desert", "Durotar", 9, 7, 780),
  quest(826, "Zalazane", "Durotar", 10, 4, 840, { elite: true }),
  quest(837, "Encroachment", "Durotar", 10, 6, 630),
  quest(835, "Securing the Lines", "Durotar", 11, 7, 880),
  quest(806, "Dark Storms", "Durotar", 12, 4, 910, { elite: true }),
  quest(827, "Skull Rock", "Durotar", 12, 4, 910),
  quest(828, "Margoz", "Durotar", 12, 4, 90, { followups: [809] }),
  quest(809, "Ak'Zeloth", "Durotar", 13, 4, 460, { prerequisites: [828] }),
  quest(832, "Burning Shadows", "Durotar", 12, 4, 680),
  quest(829, "Neeru Fireblade", "Durotar", 12, 4, 460),
  quest(840, "Conscript of the Horde", "Durotar", 12, 10, 460, { followups: [842] }),
  quest(842, "Crossroads Conscription", "Durotar", 12, 10, 910, { prerequisites: [840] }),

  // Orgrimmar / Ragefire Chasm
  quest(5726, "Hidden Enemies", "Orgrimmar", 12, 9, 910, { followups: [5727] }),
  quest(5727, "Hidden Enemies", "Orgrimmar", 12, 9, 460, { prerequisites: [5726], followups: [5729] }),
  quest(5729, "Hidden Enemies", "Orgrimmar", 15, 9, 110, { prerequisites: [5727], followups: [5730] }),
  quest(5730, "Hidden Enemies", "Ragefire Chasm", 16, 9, 1450, { prerequisites: [5729], dungeon: "Ragefire Chasm" }),
  quest(5761, "Slaying the Beast", "Ragefire Chasm", 16, 9, 1150, { dungeon: "Ragefire Chasm", giver: "Neeru Fireblade", turnIn: "Neeru Fireblade", verification: { build: BUILD, status: "PAGE_VERIFIED", checkedAt: CHECKED_AT, source: "Wowhead Forever quest page" } }),
  quest(5723, "Testing an Enemy's Strength", "Ragefire Chasm", 15, 9, 1050, { dungeon: "Ragefire Chasm", giver: "Rahauro", turnIn: "Rahauro", verification: { build: BUILD, status: "PAGE_VERIFIED", checkedAt: CHECKED_AT, source: "Wowhead Forever quest page" } }),
  quest(5722, "Searching for the Lost Satchel", "Ragefire Chasm", 16, 9, 880, { dungeon: "Ragefire Chasm", giver: "Rahauro", turnIn: "Maur Grimtotem", followups: [5724], verification: { build: BUILD, status: "PAGE_VERIFIED", checkedAt: CHECKED_AT, source: "Wowhead Forever quest page" } }),
  quest(5724, "Returning the Lost Satchel", "Ragefire Chasm", 16, 9, 1450, { dungeon: "Ragefire Chasm", giver: "Maur Grimtotem", turnIn: "Rahauro", prerequisites: [5722], verification: { build: BUILD, status: "PAGE_VERIFIED", checkedAt: CHECKED_AT, source: "Wowhead Forever quest page" } }),
  quest(5725, "The Power to Destroy...", "Ragefire Chasm", 16, 9, 1450, { dungeon: "Ragefire Chasm", giver: "Varimathras", turnIn: "Varimathras", verification: { build: BUILD, status: "PAGE_VERIFIED", checkedAt: CHECKED_AT, source: "Wowhead Forever quest page" } }),

  // The Barrens, levels 10–20
  quest(886, "The Barrens Oases", "The Barrens", 10, 10, 90, { followups: [870] }),
  quest(860, "Sergra Darkthorn", "The Barrens", 10, 10, 90, { followups: [844] }),
  quest(844, "Plainstrider Menace", "The Barrens", 12, 10, 910, { prerequisites: [860] }),
  quest(871, "Disrupt the Attacks", "The Barrens", 12, 9, 910, { followups: [872] }),
  quest(845, "The Zhevra", "The Barrens", 13, 10, 910),
  quest(869, "Raptor Thieves", "The Barrens", 13, 9, 910),
  quest(870, "The Forgotten Pools", "The Barrens", 13, 10, 680, { prerequisites: [886] }),
  quest(894, "Samophlange", "The Barrens", 14, 10, 740, { followups: [900] }),
  quest(900, "Samophlange", "The Barrens", 14, 10, 490, { prerequisites: [894], followups: [901] }),
  quest(901, "Samophlange", "The Barrens", 14, 10, 740, { prerequisites: [900], followups: [902] }),
  quest(890, "The Missing Shipment", "The Barrens", 14, 9, 100, { followups: [892] }),
  quest(892, "The Missing Shipment", "The Barrens", 14, 9, 100, { prerequisites: [890] }),
  quest(887, "Southsea Freebooters", "The Barrens", 14, 9, 740),
  quest(855, "Centaur Bracers", "The Barrens", 14, 9, 1250),
  quest(848, "Fungal Spores", "The Barrens", 15, 10, 1050),
  quest(872, "The Disruption Ends", "The Barrens", 15, 9, 1050, { prerequisites: [871] }),
  quest(903, "Prowlers of the Barrens", "The Barrens", 15, 10, 1050),
  quest(867, "Harpy Raiders", "The Barrens", 15, 12, 1050, { followups: [875] }),
  quest(3922, "Nugget Slugs", "The Barrens", 15, 10, 1050),
  quest(819, "Chen's Empty Keg", "The Barrens", 15, 11, 1050, { followups: [821] }),
  quest(880, "Altered Beings", "The Barrens", 16, 10, 1150),
  quest(877, "The Stagnant Oasis", "The Barrens", 16, 10, 1150),
  quest(881, "Echeyakee", "The Barrens", 16, 10, 1450),
  quest(888, "Stolen Booty", "The Barrens", 16, 9, 1150),
  quest(895, "WANTED: Baron Longshore", "The Barrens", 16, 11, 1150, { elite: true }),
  quest(850, "Kolkar Leaders", "The Barrens", 16, 11, 880),
  quest(875, "Harpy Lieutenants", "The Barrens", 16, 12, 1150, { prerequisites: [867], followups: [876] }),
  quest(902, "Samophlange", "The Barrens", 16, 10, 1150, { prerequisites: [901] }),
  quest(905, "The Angry Scytheclaws", "The Barrens", 17, 10, 1250),
  quest(3281, "Stolen Silver", "The Barrens", 18, 9, 1350),
  quest(865, "Raptor Horns", "The Barrens", 18, 13, 1350),
  quest(858, "Ignition", "The Barrens", 18, 13, 1350, { followups: [863] }),
  quest(863, "The Escape", "The Barrens", 18, 13, 1700, { prerequisites: [858] }),
  quest(896, "Miner's Fortune", "The Barrens", 18, 13, 1700),
  quest(907, "Enraged Thunder Lizards", "The Barrens", 18, 10, 1700),
  quest(851, "Verog the Dervish", "The Barrens", 18, 11, 1000),
  quest(3923, "Rilli Greasygob", "The Barrens", 18, 10, 340, { followups: [3924] }),
  quest(852, "Hezrul Bloodmark", "The Barrens", 19, 11, 1100),
  quest(882, "Ishamuhale", "The Barrens", 19, 10, 1800),
  quest(3924, "Samophlange Manual", "The Barrens", 19, 10, 1800, { prerequisites: [3923] }),
  quest(876, "Serena Bloodfeather", "The Barrens", 20, 12, 1950, { prerequisites: [875], elite: true }),
  quest(898, "Free From the Hold", "The Barrens", 20, 13, 1950, { elite: true }),
  quest(891, "The Guns of Northwatch", "The Barrens", 20, 13, 1550, { elite: true }),
  quest(899, "Consumed by Hatred", "The Barrens", 20, 14, 1950),
  quest(4921, "Lost in Battle", "The Barrens", 20, 14, 1150),
  quest(913, "Cry of the Thunderhawk", "The Barrens", 20, 10, 1950)
];

export const QUEST_BY_ID = new Map(QUESTS.map(record => [record.id, record]));
export const SYNC_QUEST_IDS = QUESTS.map(record => record.id);

export const DATASET = {
  id: "horde-orc-1-20-2026-09-18",
  build: BUILD,
  checkedAt: CHECKED_AT,
  questCount: QUESTS.length,
  coverage: "Orc Warrior 1–30 application; verified route data currently covers levels 1–20",
  verificationStatus: "FOREVER_DB_VERIFIED_ROUTE_BETA",
  limitations: [
    "Quest availability, level requirements, and XP were checked against the Forever database.",
    "Route order is a speed-route candidate and still needs timed in-game validation.",
    "v0.4 waypoint coordinates are route-beta navigation anchors and require live playtest correction."
  ]
};
