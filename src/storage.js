const KEY = "forever-path-state-v1";

export const defaultState = {
  profile: {
    faction: "Horde",
    race: "Orc",
    className: "Warrior",
    level: 1,
    zone: "Durotar",
    locationNotes: "",
    includeDungeons: true,
    includeGroupQuests: true
  },
  completed: {},
  skipped: {},
  activeRouteIds: [],
  routeStartedFromHereAt: null,
  gameSync: null
};

export function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return parsed ? { ...structuredClone(defaultState), ...parsed, profile: { ...defaultState.profile, ...parsed.profile } } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `forever-path-progress-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importState(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  return parsed.state ?? parsed;
}
