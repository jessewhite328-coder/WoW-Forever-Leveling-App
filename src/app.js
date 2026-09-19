import { GAME_DATA } from "../data/game-data.js";
import { ROUTE_PACKS } from "../data/route-packs.js";
import { QUEST_BY_ID, DATASET } from "../data/quest-database.js";
import { loadState, saveState, resetState, exportState, importState } from "./storage.js";
import { buildRoute, firstIncomplete, routeStats } from "./route-engine.js";

let state = loadState();
let activeSteps = [];
let routeReason = "";

const $ = id => document.getElementById(id);
const els = {
  faction: $("faction"), race: $("race"), className: $("className"), level: $("level"), zone: $("zone"),
  locationNotes: $("locationNotes"), includeDungeons: $("includeDungeons"), includeGroupQuests: $("includeGroupQuests"),
  buildRouteBtn: $("buildRouteBtn"), startHereBtn: $("startHereBtn"), routeList: $("routeList"), routeMessage: $("routeMessage"),
  nextTitle: $("nextTitle"), nextInstruction: $("nextInstruction"), nextType: $("nextType"), nextMeta: $("nextMeta"),
  completeNextBtn: $("completeNextBtn"), skipNextBtn: $("skipNextBtn"), routeReason: $("routeReason"),
  completedCount: $("completedCount"), remainingCount: $("remainingCount"), routeXp: $("routeXp"), routeMinutes: $("routeMinutes"),
  search: $("search"), stepFilter: $("stepFilter"), exportBtn: $("exportBtn"), importInput: $("importInput"), resetBtn: $("resetBtn"),
  dataBadge: $("dataBadge"), dataNote: $("dataNote"), nextWhy: $("nextWhy")
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function questLinks(step) {
  return (step.questIds ?? []).map(id => QUEST_BY_ID.get(id)).filter(Boolean).map(quest =>
    `<a class="quest-link" href="${quest.sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(quest.name)} <span>#${quest.id}</span></a>`
  ).join("");
}

function populateSelect(select, values, selected) {
  select.innerHTML = values.map(v => `<option value="${v}" ${v === selected ? "selected" : ""}>${v}</option>`).join("");
}

function syncProfileControls() {
  els.faction.value = state.profile.faction;
  populateSelect(els.race, GAME_DATA.races[state.profile.faction], state.profile.race);
  populateSelect(els.className, GAME_DATA.classes, state.profile.className);
  populateSelect(els.zone, GAME_DATA.zones, state.profile.zone);
  els.level.value = state.profile.level;
  els.locationNotes.value = state.profile.locationNotes;
  els.includeDungeons.checked = state.profile.includeDungeons;
  els.includeGroupQuests.checked = state.profile.includeGroupQuests;
}

function readProfile() {
  state.profile = {
    faction: els.faction.value,
    race: els.race.value,
    className: els.className.value,
    level: Math.max(1, Math.min(60, Number(els.level.value) || 1)),
    zone: els.zone.value,
    locationNotes: els.locationNotes.value.trim(),
    includeDungeons: els.includeDungeons.checked,
    includeGroupQuests: els.includeGroupQuests.checked
  };
  saveState(state);
}

function rebuild({ startHere = false } = {}) {
  readProfile();
  if (startHere) state.routeStartedFromHereAt = new Date().toISOString();
  const result = buildRoute(ROUTE_PACKS, state.profile, state, { startHere });
  activeSteps = result.steps;
  routeReason = result.reason;
  state.activeRouteIds = result.selectedSegments.map(s => s.id);
  saveState(state);
  render();
}

function badgeClass(type) {
  return ["accept","turnin","complete","travel","dungeon"].includes(type) ? type : "";
}

function renderNext() {
  const next = firstIncomplete(activeSteps, state);
  if (!next) {
    els.nextTitle.textContent = activeSteps.length ? "Route complete" : "Build your route";
    els.nextInstruction.textContent = activeSteps.length ? "You have completed or skipped every step in the current route." : "Choose your character state, then build the route.";
    els.nextType.textContent = activeSteps.length ? "DONE" : "—";
    els.nextType.className = "badge";
    els.nextMeta.innerHTML = "";
    els.nextWhy.hidden = true;
    els.completeNextBtn.disabled = true;
    els.skipNextBtn.disabled = true;
    return;
  }
  els.nextTitle.textContent = next.title;
  els.nextInstruction.textContent = next.instruction;
  els.nextType.textContent = next.type.toUpperCase();
  els.nextType.className = `badge ${badgeClass(next.type)}`;
  const linkedXp = [...new Set(next.questIds ?? [])].reduce((sum, id) => sum + (QUEST_BY_ID.get(id)?.xp || 0), 0);
  const bits = [next.zone, `Lvl ${next.minLevel || "?"}+`, next.estimatedMinutes ? `~${next.estimatedMinutes} min` : null, linkedXp ? `${linkedXp.toLocaleString()} linked quest XP` : null].filter(Boolean);
  els.nextMeta.innerHTML = bits.map(x => `<span>${x}</span>`).join("");
  els.nextWhy.hidden = false;
  els.nextWhy.open = false;
  els.nextWhy.querySelector("p").textContent = next.reason || "This step advances the selected route cluster.";
  els.completeNextBtn.disabled = false;
  els.skipNextBtn.disabled = false;
}

function renderStats() {
  const stats = routeStats(activeSteps, state, QUEST_BY_ID);
  els.completedCount.textContent = stats.completed;
  els.remainingCount.textContent = stats.remaining;
  els.routeXp.textContent = stats.xp.toLocaleString();
  els.routeMinutes.textContent = stats.minutes;
}

function matchesFilter(step) {
  const q = els.search.value.trim().toLowerCase();
  const f = els.stepFilter.value;
  const linkedQuestNames = (step.questIds ?? []).map(id => QUEST_BY_ID.get(id)?.name ?? "").join(" ");
  const text = `${step.title} ${step.instruction} ${step.zone} ${step.segmentName} ${linkedQuestNames}`.toLowerCase();
  if (q && !text.includes(q)) return false;
  if (f === "remaining" && (state.completed[step.id] || state.skipped[step.id])) return false;
  if (f === "complete" && !state.completed[step.id]) return false;
  if (f === "quest" && !["accept","complete","turnin"].includes(step.type)) return false;
  if (f === "travel" && step.type !== "travel") return false;
  if (f === "dungeon" && !(step.type === "dungeon" || step.flags?.includes("dungeon"))) return false;
  return true;
}

function renderRoute() {
  els.routeList.innerHTML = "";
  if (!activeSteps.length) {
    els.routeMessage.style.display = "block";
    els.routeMessage.textContent = routeReason || "No route loaded yet.";
    return;
  }
  els.routeMessage.style.display = "none";
  const next = firstIncomplete(activeSteps, state);
  activeSteps.filter(matchesFilter).forEach(step => {
    const li = document.createElement("li");
    li.className = `route-item ${state.completed[step.id] ? "is-done" : ""} ${next?.id === step.id ? "is-next" : ""}`;
    li.innerHTML = `
      <div></div>
      <div>
        <div class="route-text">${step.title}</div>
        <div class="route-detail">${step.instruction}</div>
        <div class="route-meta">
          <span class="badge ${badgeClass(step.type)}">${step.type}</span>
          <span class="badge">${step.zone}</span>
          ${step.estimatedMinutes ? `<span class="badge">~${step.estimatedMinutes} min</span>` : ""}
          ${state.skipped[step.id] ? `<span class="badge">skipped</span>` : ""}
        </div>
        ${step.questIds?.length ? `<div class="quest-links">${questLinks(step)}</div>` : ""}
        <details class="why-details compact"><summary>Why?</summary><p>${escapeHtml(step.reason || "This step advances the selected route cluster.")}</p></details>
      </div>
      <input class="step-check" type="checkbox" aria-label="Mark ${step.title} complete" ${state.completed[step.id] ? "checked" : ""} data-step-id="${step.id}" />`;
    els.routeList.appendChild(li);
  });
  els.routeList.querySelectorAll(".step-check").forEach(box => box.addEventListener("change", e => {
    const id = e.currentTarget.dataset.stepId;
    if (e.currentTarget.checked) {
      state.completed[id] = true;
      delete state.skipped[id];
    } else delete state.completed[id];
    saveState(state);
    render();
  }));
}

function render() {
  renderNext();
  renderStats();
  renderRoute();
  els.routeReason.textContent = routeReason || "The resolver chooses the nearest eligible segment matching your faction, level, zone, prerequisites, and route preferences.";
  els.dataBadge.textContent = `${DATASET.questCount} quests · build ${DATASET.build}`;
  els.dataNote.textContent = state.profile.faction === "Horde" && ["Orc", "Troll"].includes(state.profile.race)
    ? "v0.2 covers the Orc/Troll Durotar → Barrens 1–20 route. Quest facts are database-verified; route timing is beta."
    : "This release prioritizes Crouton's Orc/Horde path. Other race and Alliance packs are not verified yet.";
}

els.faction.addEventListener("change", () => {
  const faction = els.faction.value;
  populateSelect(els.race, GAME_DATA.races[faction], GAME_DATA.races[faction][0]);
  const suggestedZone = faction === "Horde" ? "Durotar" : "Elwynn Forest";
  els.zone.value = suggestedZone;
});
els.buildRouteBtn.addEventListener("click", () => rebuild());
els.startHereBtn.addEventListener("click", () => rebuild({ startHere: true }));
els.search.addEventListener("input", renderRoute);
els.stepFilter.addEventListener("change", renderRoute);
els.completeNextBtn.addEventListener("click", () => {
  const next = firstIncomplete(activeSteps, state);
  if (!next) return;
  state.completed[next.id] = true;
  delete state.skipped[next.id];
  saveState(state);
  render();
});
els.skipNextBtn.addEventListener("click", () => {
  const next = firstIncomplete(activeSteps, state);
  if (!next) return;
  state.skipped[next.id] = true;
  saveState(state);
  render();
});
els.exportBtn.addEventListener("click", () => exportState(state));
els.importInput.addEventListener("change", async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    state = await importState(file);
    saveState(state);
    syncProfileControls();
    rebuild();
  } catch { alert("That progress file could not be imported."); }
  e.target.value = "";
});
els.resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all saved profile and route progress on this device?")) return;
  resetState();
  state = loadState();
  activeSteps = [];
  routeReason = "";
  syncProfileControls();
  render();
});

syncProfileControls();
if (state.activeRouteIds?.length) rebuild();
else render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
