function raceCompatible(segment, profile) {
  return !segment.races?.length || segment.races.includes(profile.race);
}

function zonePenalty(currentZone, segment) {
  if (segment.startZones.includes(currentZone)) return 0;
  if (segment.endZone === currentZone) return 2;
  return 8;
}

function levelPenalty(level, segment) {
  if (level < segment.minLevel) return (segment.minLevel - level) * 5;
  if (level > segment.maxLevel) return (level - segment.maxLevel) * 3;
  return 0;
}

function locationNotePenalty(segment, profile) {
  const notes = profile.locationNotes.toLowerCase();
  if (!notes) return 0;
  return segment.steps.some(step => step.tags?.some(tag => notes.includes(tag))) ? -4 : 0;
}

function segmentScore(segment, profile) {
  return levelPenalty(profile.level, segment) + zonePenalty(profile.zone, segment) + locationNotePenalty(segment, profile);
}

export function selectSegments(routePacks, profile) {
  return routePacks
    .filter(segment => segment.faction === profile.faction && raceCompatible(segment, profile))
    .sort((a, b) => a.order - b.order);
}

function selectStartSegment(segments, profile) {
  return [...segments].sort((a, b) => {
    const scoreDelta = segmentScore(a, profile) - segmentScore(b, profile);
    if (scoreDelta) return scoreDelta;
    // When two segments fit equally, prefer the latest one the character is high enough to enter.
    return b.minLevel - a.minLevel;
  })[0];
}

function chooseCheckpoint(segment, profile) {
  const notes = profile.locationNotes.toLowerCase();
  const candidates = segment.steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => step.checkpoint && step.minLevel <= profile.level);

  if (!candidates.length) return { index: 0, step: segment.steps[0] };

  return candidates.sort((a, b) => {
    const aTag = a.step.tags?.some(tag => notes.includes(tag)) ? 1 : 0;
    const bTag = b.step.tags?.some(tag => notes.includes(tag)) ? 1 : 0;
    if (aTag !== bTag) return bTag - aTag;
    if (a.step.zone === profile.zone && b.step.zone !== profile.zone) return -1;
    if (b.step.zone === profile.zone && a.step.zone !== profile.zone) return 1;
    return b.step.minLevel - a.step.minLevel || b.index - a.index;
  })[0];
}

function stepAllowed(step, profile) {
  if (!profile.includeDungeons && (step.type === "dungeon" || step.flags?.includes("dungeon"))) return false;
  if (!profile.includeGroupQuests && step.flags?.includes("group")) return false;
  return true;
}

export function buildRoute(routePacks, profile, state, { startHere = false } = {}) {
  if (profile.level > 20) {
    return {
      steps: [],
      selectedSegments: [],
      entryStep: null,
      reason: `Crouton's profile is synced at level ${profile.level}. The application is limited to levels 1–30, but verified Forever route instructions currently end at level 20. Your status is saved and the 21–30 pack can attach here without restarting progress.`
    };
  }
  const compatible = selectSegments(routePacks, profile);
  const ordered = compatible.filter(segment => profile.includeDungeons || !segment.flags?.includes("dungeon"));
  if (!ordered.length) {
    const coverage = profile.faction === "Alliance"
      ? "The verified Alliance 1–20 route pack has not been added yet. This release contains the personalized Orc/Horde path first."
      : `No verified route pack currently supports ${profile.race}.`;
    return { steps: [], selectedSegments: [], reason: coverage, entryStep: null };
  }

  let startSegment = selectStartSegment(ordered, profile);

  if (!startHere && state.activeRouteIds?.length) {
    const active = ordered.find(segment => state.activeRouteIds.includes(segment.id) && segment.steps.some(step => !state.completed[step.id] && !state.skipped[step.id]));
    if (active) startSegment = active;
  }

  const startIndex = ordered.findIndex(segment => segment.id === startSegment.id);
  const selectedSegments = ordered.slice(startIndex);
  const checkpoint = startHere ? chooseCheckpoint(startSegment, profile) : { index: 0, step: startSegment.steps[0] };

  const steps = selectedSegments.flatMap((segment, segmentIndex) => {
    const segmentSteps = segmentIndex === 0 && startHere ? segment.steps.slice(checkpoint.index) : segment.steps;
    return segmentSteps.map(step => ({
      ...step,
      segmentId: segment.id,
      segmentName: segment.name,
      verificationStatus: segment.verificationStatus
    }));
  }).filter(step => stepAllowed(step, profile));

  const checkpointText = startHere && checkpoint.step
    ? ` Entry checkpoint: “${checkpoint.step.title}”${profile.locationNotes ? ` using “${profile.locationNotes}”` : ""}.`
    : "";
  const reason = `Starting with “${startSegment.name}” because it best matches level ${profile.level}, ${profile.zone}, and ${profile.race}.${checkpointText} ` +
    `Dungeons are ${profile.includeDungeons ? "enabled" : "disabled"}; group-sensitive steps are ${profile.includeGroupQuests ? "enabled" : "disabled"}.`;

  return { steps, selectedSegments, reason, entryStep: checkpoint.step ?? null };
}

export function firstIncomplete(steps, state) {
  return steps.find(step => !state.completed[step.id] && !state.skipped[step.id]) ?? null;
}

export function routeStats(steps, state, questById = new Map()) {
  const completed = steps.filter(step => state.completed[step.id]).length;
  const remainingSteps = steps.filter(step => !state.completed[step.id] && !state.skipped[step.id]);
  const questIds = new Set(remainingSteps.flatMap(step => step.questIds ?? []));
  const xp = [...questIds].reduce((sum, id) => sum + (questById.get(id)?.xp || 0), 0);

  return {
    completed,
    remaining: remainingSteps.length,
    xp,
    questCount: questIds.size,
    minutes: remainingSteps.reduce((sum, step) => sum + (step.estimatedMinutes || 0), 0)
  };
}
