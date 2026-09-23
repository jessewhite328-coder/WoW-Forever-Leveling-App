import { SYNC_QUEST_IDS } from "../data/quest-database.js";
import { SYNC_ROUTE_STEP_IDS } from "../data/route-packs.js";

export const SYNC_VERSION = 1;
const GAME_PREFIX = "FP1";
const WEB_PREFIX = "FPW1";

export function adler32(text) {
  let a = 1;
  let b = 0;
  const bytes = new TextEncoder().encode(text);
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b * 65536 + a) >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

function safeDecode(value = "") {
  try { return decodeURIComponent(value); }
  catch { throw new Error("The status code contains invalid text encoding."); }
}

function parseEnvelope(raw, expectedPrefix) {
  const code = raw.trim().replace(/^\/fp\s+import\s+/i, "");
  const checksumMarker = code.lastIndexOf(";K=");
  if (checksumMarker < 0) throw new Error("The status code is missing its checksum.");

  const body = code.slice(0, checksumMarker);
  const suppliedChecksum = code.slice(checksumMarker + 3).toUpperCase();
  if (adler32(body) !== suppliedChecksum) throw new Error("The status code was damaged or copied incompletely.");

  const parts = body.split(";");
  if (parts.shift() !== expectedPrefix) throw new Error(`Expected a ${expectedPrefix} status code.`);
  const fields = {};
  for (const part of parts) {
    const separator = part.indexOf("=");
    if (separator > 0) fields[part.slice(0, separator)] = part.slice(separator + 1);
  }
  return { code, body, fields };
}

function decodeRegistryBitset(hex, registry, label) {
  const hexLength = Math.ceil(registry.length / 4);
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length !== hexLength) {
    throw new Error(`${label} snapshot must contain exactly ${hexLength} hexadecimal characters.`);
  }
  const ids = new Set();
  for (let nibbleIndex = 0; nibbleIndex < hex.length; nibbleIndex += 1) {
    const value = Number.parseInt(hex[nibbleIndex], 16);
    for (let bit = 0; bit < 4; bit += 1) {
      const questIndex = nibbleIndex * 4 + bit;
      if (questIndex < registry.length && (value & (1 << bit))) ids.add(registry[questIndex]);
    }
  }
  return ids;
}

export function encodeBitset(ids) {
  return encodeRegistryBitset(ids, SYNC_QUEST_IDS);
}

export function encodeRouteBitset(ids) {
  return encodeRegistryBitset(ids, SYNC_ROUTE_STEP_IDS);
}

function encodeRegistryBitset(ids, registry) {
  const selected = ids instanceof Set ? ids : new Set(ids);
  const hexLength = Math.ceil(registry.length / 4);
  let output = "";
  for (let nibbleIndex = 0; nibbleIndex < hexLength; nibbleIndex += 1) {
    let value = 0;
    for (let bit = 0; bit < 4; bit += 1) {
      const recordId = registry[nibbleIndex * 4 + bit];
      if (recordId && selected.has(recordId)) value += 1 << bit;
    }
    output += value.toString(16).toUpperCase();
  }
  return output;
}

export function decodeGameStatus(raw) {
  const { code, fields } = parseEnvelope(raw, GAME_PREFIX);
  if (Number(fields.R) !== SYNC_VERSION) throw new Error("This quest-registry version is not supported by the website.");

  const level = Number(fields.L);
  if (!Number.isInteger(level) || level < 1 || level > 30) throw new Error("The export does not contain a valid level from 1–30.");

  const x = fields.X ? Number(fields.X) : null;
  const y = fields.Y ? Number(fields.Y) : null;
  return {
    raw: code,
    registryVersion: Number(fields.R),
    level,
    zone: safeDecode(fields.Z),
    subzone: safeDecode(fields.S),
    mapId: fields.M ? Number(fields.M) : null,
    x: Number.isFinite(x) ? x : null,
    y: Number.isFinite(y) ? y : null,
    hearth: safeDecode(fields.H),
    completedQuestIds: decodeRegistryBitset(fields.C || "", SYNC_QUEST_IDS, "Quest"),
    activeQuestIds: decodeRegistryBitset(fields.A || "", SYNC_QUEST_IDS, "Quest"),
    routeStepId: safeDecode(fields.N),
    completedRouteStepIds: fields.P ? decodeRegistryBitset(fields.P, SYNC_ROUTE_STEP_IDS, "Route") : new Set(),
    skippedRouteStepIds: fields.Q ? decodeRegistryBitset(fields.Q, SYNC_ROUTE_STEP_IDS, "Route") : new Set(),
    importedAt: new Date().toISOString()
  };
}

export function mergeGameStatus(state, status, allSteps, availableZones) {
  const merged = structuredClone(state);
  const zone = availableZones.includes(status.zone) ? status.zone : merged.profile.zone;
  const locationBits = [status.subzone, status.x !== null && status.y !== null ? `${status.x.toFixed(1)}, ${status.y.toFixed(1)}` : null].filter(Boolean);

  merged.profile = {
    ...merged.profile,
    faction: "Horde",
    race: "Orc",
    className: "Warrior",
    level: status.level,
    zone,
    locationNotes: locationBits.join(" — ") || merged.profile.locationNotes
  };
  merged.gameSync = {
    importedAt: status.importedAt,
    registryVersion: status.registryVersion,
    mapId: status.mapId,
    zone: status.zone,
    subzone: status.subzone,
    x: status.x,
    y: status.y,
    hearth: status.hearth,
    completedQuestIds: [...status.completedQuestIds],
    activeQuestIds: [...status.activeQuestIds],
    routeStepId: status.routeStepId,
    completedRouteStepIds: [...status.completedRouteStepIds],
    skippedRouteStepIds: [...status.skippedRouteStepIds]
  };

  for (const id of status.completedRouteStepIds) {
    merged.completed[id] = true;
    delete merged.skipped[id];
  }
  for (const id of status.skippedRouteStepIds) {
    if (!merged.completed[id]) merged.skipped[id] = true;
  }

  let newlyCompletedSteps = 0;
  for (const step of allSteps) {
    if (!step.questIds?.length) continue;
    if (step.questIds.every(id => status.completedQuestIds.has(id)) && !merged.completed[step.id]) {
      merged.completed[step.id] = true;
      delete merged.skipped[step.id];
      newlyCompletedSteps += 1;
    }
  }
  return { state: merged, newlyCompletedSteps };
}

export function encodeWebStatus(state, nextStep) {
  const fields = [
    WEB_PREFIX,
    `D=${state.profile.includeDungeons ? 1 : 0}`,
    `G=${state.profile.includeGroupQuests ? 1 : 0}`,
    `N=${encodeURIComponent(nextStep?.id || "")}`,
    `T=${encodeURIComponent(nextStep?.title || "Route complete")}`,
    `P=${encodeRouteBitset(Object.keys(state.completed || {}).filter(id => state.completed[id]))}`,
    `Q=${encodeRouteBitset(Object.keys(state.skipped || {}).filter(id => state.skipped[id]))}`
  ];
  const body = fields.join(";");
  return `${body};K=${adler32(body)}`;
}

export function decodeWebStatus(raw) {
  const { fields } = parseEnvelope(raw, WEB_PREFIX);
  return {
    includeDungeons: fields.D === "1",
    includeGroupQuests: fields.G === "1",
    nextStepId: safeDecode(fields.N),
    nextStepTitle: safeDecode(fields.T),
    completedRouteStepIds: fields.P ? decodeRegistryBitset(fields.P, SYNC_ROUTE_STEP_IDS, "Route") : new Set(),
    skippedRouteStepIds: fields.Q ? decodeRegistryBitset(fields.Q, SYNC_ROUTE_STEP_IDS, "Route") : new Set()
  };
}

export function statusSummary(status) {
  return {
    level: status.level,
    location: [status.zone, status.subzone].filter(Boolean).join(" — ") || "Unknown location",
    coordinates: status.x !== null && status.y !== null ? `${status.x.toFixed(1)}, ${status.y.toFixed(1)}` : "Unavailable",
    completedQuests: status.completedQuestIds.size,
    activeQuests: status.activeQuestIds.size,
    completedRouteSteps: status.completedRouteStepIds.size,
    skippedRouteSteps: status.skippedRouteStepIds.size,
    hearth: status.hearth || "Unknown"
  };
}
