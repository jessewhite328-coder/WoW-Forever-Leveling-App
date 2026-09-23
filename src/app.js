import { GAME_DATA } from "../data/game-data.js";
import { ROUTE_PACKS } from "../data/route-packs.js";
import { QUEST_BY_ID, DATASET } from "../data/quest-database.js";
import { loadState, saveState, resetState, exportState, importState } from "./storage.js";
import { buildRoute, firstIncomplete, routeStats } from "./route-engine.js";
import { decodeGameStatus, mergeGameStatus, encodeWebStatus, statusSummary } from "./sync.js";

let state = loadState();
let activeSteps = [];
let routeReason = "";
let pendingGameStatus = null;

const ALL_STEPS = ROUTE_PACKS.flatMap(pack => pack.steps);
const $ = id => document.getElementById(id);
const els = {
  level: $("level"), zone: $("zone"), locationNotes: $("locationNotes"),
  includeDungeons: $("includeDungeons"), includeGroupQuests: $("includeGroupQuests"),
  buildRouteBtn: $("buildRouteBtn"), startHereBtn: $("startHereBtn"), routeList: $("routeList"), routeMessage: $("routeMessage"),
  nextTitle: $("nextTitle"), nextInstruction: $("nextInstruction"), nextType: $("nextType"), nextMeta: $("nextMeta"),
  completeNextBtn: $("completeNextBtn"), skipNextBtn: $("skipNextBtn"), routeReason: $("routeReason"),
  completedCount: $("completedCount"), remainingCount: $("remainingCount"), routeXp: $("routeXp"), routeMinutes: $("routeMinutes"),
  search: $("search"), stepFilter: $("stepFilter"), exportBtn: $("exportBtn"), importInput: $("importInput"), resetBtn: $("resetBtn"),
  dataBadge: $("dataBadge"), dataNote: $("dataNote"), nextWhy: $("nextWhy"), syncBtn: $("syncBtn"),
  syncDialog: $("syncDialog"), closeSyncBtn: $("closeSyncBtn"), gameSyncInput: $("gameSyncInput"), validateSyncBtn: $("validateSyncBtn"),
  applySyncBtn: $("applySyncBtn"), syncPreview: $("syncPreview"), syncResult: $("syncResult"), webSyncOutput: $("webSyncOutput"),
  refreshWebCodeBtn: $("refreshWebCodeBtn"), copyWebCodeBtn: $("copyWebCodeBtn"), copyGameCodeBtn: $("copyGameCodeBtn"), lastSync: $("lastSync")
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function questLinks(step) {
  return (step.questIds ?? []).map(id => QUEST_BY_ID.get(id)).filter(Boolean).map(quest =>
    `<a class="quest-link" href="${quest.sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(quest.name)} <span>#${quest.id}</span></a>`
  ).join("");
}

function populateZones() {
  els.zone.innerHTML = GAME_DATA.zones.map(zone => `<option value="${escapeHtml(zone)}">${escapeHtml(zone)}</option>`).join("");
}

function enforceProfile() {
  state.profile = {
    ...state.profile,
    faction: "Horde",
    race: "Orc",
    className: "Warrior",
    level: Math.max(1, Math.min(30, Number(state.profile.level) || 1))
  };
}

function syncProfileControls() {
  enforceProfile();
  els.level.value = state.profile.level;
  els.zone.value = GAME_DATA.zones.includes(state.profile.zone) ? state.profile.zone : "Durotar";
  els.locationNotes.value = state.profile.locationNotes;
  els.includeDungeons.checked = state.profile.includeDungeons;
  els.includeGroupQuests.checked = state.profile.includeGroupQuests;
}

function readProfile() {
  state.profile = {
    ...state.profile,
    faction: "Horde",
    race: "Orc",
    className: "Warrior",
    level: Math.max(1, Math.min(30, Number(els.level.value) || 1)),
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
  state.activeRouteIds = result.selectedSegments.map(segment => segment.id);
  saveState(state);
  render();
}

function badgeClass(type) {
  return ["accept", "turnin", "complete", "travel", "dungeon"].includes(type) ? type : "";
}

function renderNext() {
  const next = firstIncomplete(activeSteps, state);
  if (!next) {
    els.nextTitle.textContent = activeSteps.length ? "Route complete" : "Build your route";
    els.nextInstruction.textContent = activeSteps.length ? "You have completed or skipped every step in the current verified route." : "Enter your current level and location, or import status from WoW.";
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
  els.nextMeta.innerHTML = bits.map(value => `<span>${escapeHtml(value)}</span>`).join("");
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
  const query = els.search.value.trim().toLowerCase();
  const filter = els.stepFilter.value;
  const linkedQuestNames = (step.questIds ?? []).map(id => QUEST_BY_ID.get(id)?.name ?? "").join(" ");
  const text = `${step.title} ${step.instruction} ${step.zone} ${step.segmentName} ${linkedQuestNames}`.toLowerCase();
  if (query && !text.includes(query)) return false;
  if (filter === "remaining" && (state.completed[step.id] || state.skipped[step.id])) return false;
  if (filter === "complete" && !state.completed[step.id]) return false;
  if (filter === "quest" && !["accept", "complete", "turnin"].includes(step.type)) return false;
  if (filter === "travel" && step.type !== "travel") return false;
  if (filter === "dungeon" && !(step.type === "dungeon" || step.flags?.includes("dungeon"))) return false;
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
        <div class="route-text">${escapeHtml(step.title)}</div>
        <div class="route-detail">${escapeHtml(step.instruction)}</div>
        <div class="route-meta">
          <span class="badge ${badgeClass(step.type)}">${escapeHtml(step.type)}</span>
          <span class="badge">${escapeHtml(step.zone)}</span>
          ${step.estimatedMinutes ? `<span class="badge">~${step.estimatedMinutes} min</span>` : ""}
          ${state.skipped[step.id] ? `<span class="badge">skipped</span>` : ""}
        </div>
        ${step.questIds?.length ? `<div class="quest-links">${questLinks(step)}</div>` : ""}
        <details class="why-details compact"><summary>Why?</summary><p>${escapeHtml(step.reason || "This step advances the selected route cluster.")}</p></details>
      </div>
      <input class="step-check" type="checkbox" aria-label="Mark ${escapeHtml(step.title)} complete" ${state.completed[step.id] ? "checked" : ""} data-step-id="${step.id}" />`;
    els.routeList.appendChild(li);
  });
  els.routeList.querySelectorAll(".step-check").forEach(box => box.addEventListener("change", event => {
    const id = event.currentTarget.dataset.stepId;
    if (event.currentTarget.checked) {
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
  els.routeReason.textContent = routeReason || "The resolver uses Crouton's level, zone, checkpoint, completed quests, and route preferences.";
  els.dataBadge.textContent = `${DATASET.questCount} synced quests · build ${DATASET.build}`;
  els.dataNote.textContent = "Orc Warrior levels 1–30 only. Verified route instructions currently cover 1–20; the sync format already accepts levels through 30.";
}

function openDialog() {
  updateWebExport();
  els.lastSync.textContent = state.gameSync?.importedAt
    ? `Last WoW import: ${new Date(state.gameSync.importedAt).toLocaleString()}`
    : "No WoW status has been imported on this device.";
  if (typeof els.syncDialog.showModal === "function") els.syncDialog.showModal();
  else els.syncDialog.setAttribute("open", "");
}

function closeDialog() {
  if (typeof els.syncDialog.close === "function") els.syncDialog.close();
  else els.syncDialog.removeAttribute("open");
}

function validateGameCode() {
  els.syncResult.textContent = "";
  try {
    pendingGameStatus = decodeGameStatus(els.gameSyncInput.value);
    const summary = statusSummary(pendingGameStatus);
    els.syncPreview.innerHTML = `
      <strong>Crouton-compatible Orc Warrior status</strong>
      <dl>
        <div><dt>Level</dt><dd>${summary.level}</dd></div>
        <div><dt>Location</dt><dd>${escapeHtml(summary.location)}</dd></div>
        <div><dt>Coordinates</dt><dd>${escapeHtml(summary.coordinates)}</dd></div>
        <div><dt>Completed route quests</dt><dd>${summary.completedQuests}</dd></div>
        <div><dt>Active route quests</dt><dd>${summary.activeQuests}</dd></div>
        <div><dt>Addon steps completed</dt><dd>${summary.completedRouteSteps}</dd></div>
        <div><dt>Addon steps skipped</dt><dd>${summary.skippedRouteSteps}</dd></div>
        <div><dt>Hearth</dt><dd>${escapeHtml(summary.hearth)}</dd></div>
      </dl>`;
    els.syncPreview.className = "sync-preview is-valid";
    els.applySyncBtn.disabled = false;
  } catch (error) {
    pendingGameStatus = null;
    els.syncPreview.textContent = error.message;
    els.syncPreview.className = "sync-preview is-error";
    els.applySyncBtn.disabled = true;
  }
}

function applyGameCode() {
  if (!pendingGameStatus) return;
  const result = mergeGameStatus(state, pendingGameStatus, ALL_STEPS, GAME_DATA.zones);
  state = result.state;
  saveState(state);
  syncProfileControls();
  rebuild({ startHere: true });
  els.syncResult.textContent = `Imported successfully. ${result.newlyCompletedSteps} additional route steps were matched to completed WoW quests.`;
  els.lastSync.textContent = `Last WoW import: ${new Date(state.gameSync.importedAt).toLocaleString()}`;
  updateWebExport();
}

function updateWebExport() {
  readProfile();
  els.webSyncOutput.value = encodeWebStatus(state, firstIncomplete(activeSteps, state));
}

async function copyText(text, sourceElement, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    sourceElement.focus();
    sourceElement.select();
    document.execCommand("copy");
  }
  els.syncResult.textContent = successMessage;
}

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
els.importInput.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    state = await importState(file);
    enforceProfile();
    saveState(state);
    syncProfileControls();
    rebuild();
  } catch { alert("That progress backup could not be imported."); }
  event.target.value = "";
});
els.resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all saved profile, sync, and route progress on this device?")) return;
  resetState();
  state = loadState();
  enforceProfile();
  activeSteps = [];
  routeReason = "";
  syncProfileControls();
  render();
});
els.syncBtn.addEventListener("click", openDialog);
els.closeSyncBtn.addEventListener("click", closeDialog);
els.validateSyncBtn.addEventListener("click", validateGameCode);
els.applySyncBtn.addEventListener("click", applyGameCode);
els.refreshWebCodeBtn.addEventListener("click", updateWebExport);
els.copyWebCodeBtn.addEventListener("click", () => copyText(els.webSyncOutput.value, els.webSyncOutput, "Web route code copied. Paste it into /fp import in WoW."));
els.copyGameCodeBtn.addEventListener("click", () => copyText(els.gameSyncInput.value, els.gameSyncInput, "WoW status code copied."));
els.syncDialog.addEventListener("click", event => { if (event.target === els.syncDialog) closeDialog(); });

populateZones();
enforceProfile();
syncProfileControls();
if (state.activeRouteIds?.length) rebuild();
else render();

if (location.hash.startsWith("#sync=")) {
  try {
    els.gameSyncInput.value = decodeURIComponent(location.hash.slice(6));
    openDialog();
    validateGameCode();
  } catch {
    openDialog();
    els.syncPreview.textContent = "The sync link contains invalid text encoding.";
    els.syncPreview.className = "sync-preview is-error";
  }
}

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
