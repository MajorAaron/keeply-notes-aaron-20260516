import { latestUpdate } from "./release-updates.mjs";
import { getTaskWindowCounts, matchesTaskWindow } from "./task-filters.mjs";

const STORAGE_KEY = "keeply-data-v2";
const LEGACY_NOTES_KEY = "keeply-notes-v1";
const UPDATE_SEEN_KEY = "keeply-last-seen-update";
const API_URL = "/api/items";
const dayMs = 86400000;

const seedNotes = [
  {
    id: crypto.randomUUID(),
    title: "Quarterly check-in",
    body: "Bring the metric snapshot, open risks, and the two product bets that need a decision.",
    label: "work",
    color: "sky",
    pinned: true,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Market list",
    body: "Lemons, jasmine rice, coffee filters, basil, and the good sparkling water.",
    label: "home",
    color: "mint",
    pinned: false,
    status: "active",
    createdAt: new Date(Date.now() - dayMs).toISOString(),
    updatedAt: new Date(Date.now() - dayMs).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Tiny product idea",
    body: "A note mode that turns throwaway thoughts into a decision log once they are pinned twice.",
    label: "ideas",
    color: "sun",
    pinned: true,
    status: "active",
    createdAt: new Date(Date.now() - dayMs * 2).toISOString(),
    updatedAt: new Date(Date.now() - dayMs * 2).toISOString()
  }
];

const seedTasks = [
  {
    id: crypto.randomUUID(),
    title: "Send check-in recap",
    details: "Include decisions, owners, and next review date.",
    label: "work",
    priority: "high",
    dueAt: toDateInput(new Date()),
    completed: false,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Water the basil",
    details: "Move it back to the sunny window after.",
    label: "home",
    priority: "normal",
    dueAt: toDateInput(new Date(Date.now() + dayMs)),
    completed: true,
    status: "active",
    createdAt: new Date(Date.now() - dayMs).toISOString(),
    updatedAt: new Date(Date.now() - dayMs).toISOString()
  }
];

const loaded = loadData();
const state = {
  notes: loaded.notes,
  tasks: loaded.tasks,
  deletedIds: loaded.deletedIds,
  hasLocalData: loaded.hasLocalData,
  syncReady: false,
  syncTimer: 0,
  syncInFlight: false,
  dirtyWhileLoading: false,
  view: "active",
  label: "all",
  taskWindow: "all",
  query: "",
  color: "sun",
  compact: false,
  composerMode: "note"
};

const els = {
  viewTitle: document.querySelector("#viewTitle"),
  searchInput: document.querySelector("#searchInput"),
  titleInput: document.querySelector("#titleInput"),
  bodyInput: document.querySelector("#bodyInput"),
  dueInput: document.querySelector("#dueInput"),
  priorityInput: document.querySelector("#priorityInput"),
  taskFields: document.querySelector("#taskFields"),
  colorDots: document.querySelector(".color-dots"),
  labelInput: document.querySelector("#labelInput"),
  shapeButton: document.querySelector("#shapeButton"),
  sparkButton: document.querySelector("#sparkButton"),
  sparkPanel: document.querySelector("#sparkPanel"),
  sparkStatus: document.querySelector("#sparkStatus"),
  sparkSuggestions: document.querySelector("#sparkSuggestions"),
  addButton: document.querySelector("#addButton"),
  addButtonLabel: document.querySelector("#addButtonLabel"),
  quickAddButton: document.querySelector("#quickAddButton"),
  layoutButton: document.querySelector("#layoutButton"),
  themeButton: document.querySelector("#themeButton"),
  pinnedNotes: document.querySelector("#pinnedNotes"),
  notesGrid: document.querySelector("#notesGrid"),
  taskList: document.querySelector("#taskList"),
  pinnedHeading: document.querySelector("#pinnedHeading"),
  othersHeading: document.querySelector("#othersHeading"),
  emptyState: document.querySelector("#emptyState"),
  totalCount: document.querySelector("#totalCount"),
  pinnedCount: document.querySelector("#pinnedCount"),
  todayCount: document.querySelector("#todayCount"),
  totalLabel: document.querySelector("#totalLabel"),
  middleLabel: document.querySelector("#middleLabel"),
  rightLabel: document.querySelector("#rightLabel"),
  focusBrief: document.querySelector("#focusBrief"),
  focusButton: document.querySelector("#focusButton"),
  focusTitle: document.querySelector("#focusTitle"),
  focusSummary: document.querySelector("#focusSummary"),
  focusList: document.querySelector("#focusList"),
  smartSweep: document.querySelector("#smartSweep"),
  sweepButton: document.querySelector("#sweepButton"),
  sweepTitle: document.querySelector("#sweepTitle"),
  sweepSummary: document.querySelector("#sweepSummary"),
  sweepList: document.querySelector("#sweepList"),
  askKeeply: document.querySelector("#askKeeply"),
  askForm: document.querySelector("#askForm"),
  askInput: document.querySelector("#askInput"),
  askButton: document.querySelector("#askButton"),
  askTitle: document.querySelector("#askTitle"),
  askSummary: document.querySelector("#askSummary"),
  askAnswer: document.querySelector("#askAnswer"),
  taskFilters: document.querySelector("#taskFilters"),
  whatsNewBackdrop: document.querySelector("#whatsNewBackdrop"),
  whatsNewDialog: document.querySelector("#whatsNewDialog"),
  whatsNewTitle: document.querySelector("#whatsNewTitle"),
  whatsNewList: document.querySelector("#whatsNewList"),
  whatsNewDismiss: document.querySelector("#whatsNewDismiss"),
  toast: document.querySelector("#toast"),
  noteTemplate: document.querySelector("#noteTemplate"),
  taskTemplate: document.querySelector("#taskTemplate")
};

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        notes: Array.isArray(parsed.notes) ? parsed.notes : seedNotes,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : seedTasks,
        deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
        hasLocalData: true
      };
    } catch {
      return { notes: seedNotes, tasks: seedTasks, deletedIds: [], hasLocalData: false };
    }
  }

  const legacyNotes = localStorage.getItem(LEGACY_NOTES_KEY);
  if (!legacyNotes) return { notes: seedNotes, tasks: seedTasks, deletedIds: [], hasLocalData: false };

  try {
    const parsed = JSON.parse(legacyNotes);
    return {
      notes: Array.isArray(parsed) ? parsed : seedNotes,
      tasks: seedTasks,
      deletedIds: [],
      hasLocalData: Array.isArray(parsed)
    };
  } catch {
    return { notes: seedNotes, tasks: seedTasks, deletedIds: [], hasLocalData: false };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: state.notes, tasks: state.tasks, deletedIds: state.deletedIds }));
  state.hasLocalData = true;
  if (!state.syncReady) state.dirtyWhileLoading = true;
  queueRemoteSave();
}

async function loadRemoteData() {
  try {
    const response = await fetch(API_URL, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`Sync returned ${response.status}`);

    const data = await response.json();
    const remoteNotes = Array.isArray(data.notes) ? data.notes : [];
    const remoteTasks = Array.isArray(data.tasks) ? data.tasks : [];
    const hasRemoteData = remoteNotes.length > 0 || remoteTasks.length > 0;

    state.syncReady = true;

    if (hasRemoteData) {
      state.notes = state.dirtyWhileLoading ? mergeByUpdatedAt(remoteNotes, state.notes, state.deletedIds) : filterDeletedItems(remoteNotes, state.deletedIds);
      state.tasks = state.dirtyWhileLoading ? mergeByUpdatedAt(remoteTasks, state.tasks, state.deletedIds) : filterDeletedItems(remoteTasks, state.deletedIds);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: state.notes, tasks: state.tasks, deletedIds: state.deletedIds }));
      render();
      if (state.dirtyWhileLoading || state.deletedIds.length > 0) queueRemoteSave(true);
      state.dirtyWhileLoading = false;
      showToast("Synced");
      return;
    }

    if (state.hasLocalData) {
      queueRemoteSave(true);
    }
    state.dirtyWhileLoading = false;
  } catch (error) {
    console.warn("Keeply sync unavailable", error);
    showToast("Offline mode");
  }
}

function mergeByUpdatedAt(remoteItems, localItems, deletedIds = []) {
  const deleted = new Set(deletedIds);
  const items = new Map(remoteItems.filter((item) => !deleted.has(item.id)).map((item) => [item.id, item]));

  for (const localItem of localItems) {
    if (deleted.has(localItem.id)) continue;
    const remoteItem = items.get(localItem.id);
    if (!remoteItem || new Date(localItem.updatedAt || localItem.createdAt) > new Date(remoteItem.updatedAt || remoteItem.createdAt)) {
      items.set(localItem.id, localItem);
    }
  }

  return [...items.values()];
}

function filterDeletedItems(items, deletedIds = []) {
  if (!deletedIds.length) return items;
  const deleted = new Set(deletedIds);
  return items.filter((item) => !deleted.has(item.id));
}

function queueRemoteSave(immediate = false) {
  window.clearTimeout(state.syncTimer);
  if (!state.syncReady) return;

  state.syncTimer = window.setTimeout(syncRemoteData, immediate ? 0 : 350);
}

async function syncRemoteData() {
  if (state.syncInFlight) {
    queueRemoteSave(true);
    return;
  }

  state.syncInFlight = true;

  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ notes: state.notes, tasks: state.tasks, deletedIds: state.deletedIds })
    });

    if (!response.ok) throw new Error(`Sync returned ${response.status}`);

    const data = await response.json();
    state.notes = Array.isArray(data.notes) ? data.notes : state.notes;
    state.tasks = Array.isArray(data.tasks) ? data.tasks : state.tasks;
    state.deletedIds = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: state.notes, tasks: state.tasks, deletedIds: state.deletedIds }));
    render();
  } catch (error) {
    console.warn("Keeply sync failed", error);
    showToast("Saved locally");
  } finally {
    state.syncInFlight = false;
  }
}

function addItem() {
  if (state.composerMode === "task") {
    addTask();
  } else {
    addNote();
  }
}

function addNote() {
  const title = els.titleInput.value.trim();
  const body = els.bodyInput.value.trim();
  if (!title && !body) {
    showToast("Write a note first");
    els.bodyInput.focus();
    return;
  }

  const now = new Date().toISOString();

  state.notes.unshift({
    id: crypto.randomUUID(),
    title: title || "Untitled",
    body,
    label: els.labelInput.value,
    color: state.color,
    pinned: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  });

  clearComposer();
  state.view = "active";
  syncNav();
  saveData();
  render();
  showToast("Note added");
}

function addTask() {
  const title = els.titleInput.value.trim();
  const details = els.bodyInput.value.trim();
  if (!title) {
    showToast("Name the task first");
    els.titleInput.focus();
    return;
  }

  const now = new Date().toISOString();

  state.tasks.unshift({
    id: crypto.randomUUID(),
    title,
    details,
    label: els.labelInput.value,
    priority: els.priorityInput.value,
    dueAt: els.dueInput.value,
    completed: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  });

  clearComposer();
  setComposerMode("task");
  state.view = "tasks";
  syncNav();
  saveData();
  render();
  showToast("Task added");
}

function clearComposer() {
  els.titleInput.value = "";
  els.bodyInput.value = "";
  els.dueInput.value = "";
  els.priorityInput.value = "normal";
  hideSparkPanel();
}

function getVisibleNotes() {
  const query = state.query.toLowerCase();
  return state.notes
    .filter((note) => note.status === state.view)
    .filter((note) => state.label === "all" || note.label === state.label)
    .filter((note) => {
      if (!query) return true;
      return `${note.title} ${note.body} ${note.label}`.toLowerCase().includes(query);
    });
}

function getVisibleTasks() {
  const query = state.query.toLowerCase();
  const status = state.view === "tasks" ? "active" : state.view;
  return state.tasks
    .filter((task) => task.status === status)
    .filter((task) => state.view !== "tasks" || matchesTaskWindow(task, state.taskWindow))
    .filter((task) => state.label === "all" || task.label === state.label)
    .filter((task) => {
      if (!query) return true;
      return `${task.title} ${task.details} ${task.label} ${task.priority}`.toLowerCase().includes(query);
    })
    .sort(compareTasks);
}

function compareTasks(a, b) {
  if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
  if (a.dueAt && b.dueAt && a.dueAt !== b.dueAt) return a.dueAt.localeCompare(b.dueAt);
  if (a.dueAt !== b.dueAt) return a.dueAt ? -1 : 1;
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function render() {
  const showTasks = state.view === "tasks";
  const showMixedArchive = state.view === "archive" || state.view === "trash";
  const notes = showTasks ? [] : getVisibleNotes();
  const tasks = showTasks || showMixedArchive ? getVisibleTasks() : [];
  const pinned = state.view === "active" ? notes.filter((note) => note.pinned) : [];
  const others = state.view === "active" ? notes.filter((note) => !note.pinned) : notes;

  els.viewTitle.textContent = getViewTitle();
  els.searchInput.placeholder = showTasks ? "Search tasks" : "Search notes";
  els.pinnedHeading.hidden = pinned.length === 0 || state.view !== "active";
  els.othersHeading.textContent = showTasks ? "Tasks" : "Others";
  els.othersHeading.hidden = !showTasks && notes.length === 0;
  els.pinnedNotes.hidden = showTasks;
  els.notesGrid.hidden = showTasks;
  els.taskList.hidden = !showTasks && !showMixedArchive;
  els.taskFilters.hidden = !showTasks;
  els.pinnedNotes.replaceChildren(...pinned.map(renderNote));
  els.notesGrid.replaceChildren(...others.map(renderNote));
  els.taskList.replaceChildren(...tasks.map(renderTask));
  els.emptyState.classList.toggle("show", notes.length + tasks.length === 0);
  els.emptyState.querySelector("h2").textContent = showTasks ? "No tasks here" : "No notes here";
  els.emptyState.querySelector("p").textContent = showTasks
    ? state.taskWindow === "all"
      ? "Add a task with a due date, priority, and label."
      : "Try another date filter or add a task for this window."
    : "Create one, change filters, or restore something from archive.";
  els.pinnedNotes.classList.toggle("compact", state.compact);
  els.notesGrid.classList.toggle("compact", state.compact);

  renderStats();
  renderTaskFilters();
}

function renderStats() {
  if (state.view === "tasks") {
    const activeTasks = state.tasks.filter((task) => task.status === "active");
    els.totalCount.textContent = activeTasks.length;
    els.pinnedCount.textContent = activeTasks.filter((task) => !task.completed).length;
    els.todayCount.textContent = activeTasks.filter((task) => task.dueAt && isDueSoon(task)).length;
    els.totalLabel.textContent = "Tasks";
    els.middleLabel.textContent = "Open";
    els.rightLabel.textContent = "Due";
    return;
  }

  const activeNotes = state.notes.filter((note) => note.status === "active");
  const today = new Date().toDateString();
  els.totalCount.textContent = activeNotes.length;
  els.pinnedCount.textContent = activeNotes.filter((note) => note.pinned).length;
  els.todayCount.textContent = activeNotes.filter((note) => new Date(note.createdAt).toDateString() === today).length;
  els.totalLabel.textContent = "Total";
  els.middleLabel.textContent = "Pinned";
  els.rightLabel.textContent = "Today";
}

function renderTaskFilters() {
  const activeTasks = state.tasks.filter((task) => task.status === "active");
  const counts = getTaskWindowCounts(activeTasks);

  els.taskFilters.querySelectorAll(".task-filter").forEach((button) => {
    const active = button.dataset.window === state.taskWindow;
    const count = counts[button.dataset.window] ?? 0;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector(".task-filter-count").textContent = count;
  });
}

function renderFocusBrief(brief) {
  const items = Array.isArray(brief.items) ? brief.items : [];
  els.focusTitle.textContent = brief.title || "Focus brief";
  els.focusSummary.textContent = brief.summary || "Keep the day moving with one clear next step.";
  els.focusList.replaceChildren(...items.slice(0, 4).map(renderFocusItem));
}

function renderFocusItem(item) {
  const row = document.createElement("article");
  row.className = "focus-item";
  row.dataset.priority = item.priority || "normal";

  const priority = document.createElement("span");
  priority.className = "focus-priority";
  priority.textContent = item.priority || "normal";

  const content = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = item.title || "Next action";
  const action = document.createElement("p");
  action.textContent = item.action || "Pick one small action and do it next.";

  content.append(title, action);
  row.append(priority, content);
  return row;
}

async function briefFocus() {
  const context = getFocusContext();
  if (context.tasks.length + context.notes.length === 0) {
    showToast("Add a few active items first");
    return;
  }

  setFocusLoading(true);

  try {
    const response = await fetch("/api/brief", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(context)
    });
    const brief = await response.json();
    if (!response.ok) throw new Error(brief.error || "Brief failed");
    renderFocusBrief(brief);
    showToast("Focus brief ready");
  } catch (error) {
    renderFocusBrief(buildLocalFocusBrief(context));
    showToast("Local brief ready");
  } finally {
    setFocusLoading(false);
  }
}

function getFocusContext() {
  const activeTasks = state.tasks
    .filter((task) => task.status === "active" && !task.completed)
    .sort(compareTasks)
    .slice(0, 8)
    .map((task) => ({
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt
    }));

  const activeNotes = state.notes
    .filter((note) => note.status === "active")
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 8)
    .map((note) => ({
      title: note.title,
      body: note.body,
      label: note.label,
      pinned: note.pinned
    }));

  return { tasks: activeTasks, notes: activeNotes };
}

function buildLocalFocusBrief(context) {
  const overdue = context.tasks.find((task) => task.dueAt && task.dueAt < toDateInput(new Date()));
  const high = context.tasks.find((task) => task.priority === "high");
  const nextTask = overdue || high || context.tasks[0];
  const pinnedNote = context.notes.find((note) => note.pinned) || context.notes[0];
  const items = [];

  if (nextTask) {
    items.push({
      priority: nextTask.priority || "normal",
      title: nextTask.title,
      action: nextTask.dueAt ? `Move this before ${formatDueDate(nextTask.dueAt).toLowerCase()}.` : "Turn this into the first concrete action."
    });
  }

  if (pinnedNote) {
    items.push({
      priority: pinnedNote.pinned ? "high" : "normal",
      title: pinnedNote.title,
      action: "Review the note and decide whether it needs a task."
    });
  }

  return {
    title: nextTask ? "Start with the nearest task" : "Review your strongest note",
    summary: `${context.tasks.length} open tasks and ${context.notes.length} active notes are in view.`,
    items
  };
}

function setFocusLoading(loading) {
  els.focusButton.disabled = loading;
  els.focusButton.textContent = loading ? "Briefing..." : "Brief me";
  els.focusBrief.classList.toggle("loading", loading);
}

function renderSweep(sweep) {
  const suggestions = Array.isArray(sweep.suggestions) ? sweep.suggestions : [];
  els.sweepTitle.textContent = sweep.title || "Smart sweep";
  els.sweepSummary.textContent = sweep.summary || "A few tidy-up moves are ready.";
  els.sweepList.replaceChildren(...suggestions.slice(0, 4).map(renderSweepItem));
}

function renderSweepItem(suggestion) {
  const row = document.createElement("article");
  row.className = "sweep-item";
  row.dataset.action = suggestion.action || "review";

  const badge = document.createElement("span");
  badge.className = "sweep-action";
  badge.textContent = getSweepActionLabel(suggestion.action);

  const content = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = suggestion.title || "Review item";
  const reason = document.createElement("p");
  reason.textContent = suggestion.reason || "This item looks ready for a quick cleanup.";
  content.append(title, reason);

  const apply = document.createElement("button");
  apply.type = "button";
  apply.className = "sweep-apply";
  apply.textContent = "Apply";
  apply.addEventListener("click", () => applySweepSuggestion(suggestion));

  row.append(badge, content, apply);
  return row;
}

async function sweepItems() {
  const context = getSweepContext();
  if (context.notes.length + context.tasks.length === 0) {
    showToast("Nothing active to sweep");
    return;
  }

  setSweepLoading(true);

  try {
    const response = await fetch("/api/sweep", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(context)
    });
    const sweep = await response.json();
    if (!response.ok) throw new Error(sweep.error || "Sweep failed");
    renderSweep(sweep);
    showToast("Sweep ready");
  } catch (error) {
    renderSweep(buildLocalSweep(context));
    showToast("Local sweep ready");
  } finally {
    setSweepLoading(false);
  }
}

function getSweepContext() {
  const notes = state.notes
    .filter((note) => note.status === "active")
    .sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt))
    .slice(0, 12)
    .map((note) => ({
      id: note.id,
      type: "note",
      title: note.title,
      body: note.body,
      label: note.label,
      pinned: note.pinned,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }));

  const tasks = state.tasks
    .filter((task) => task.status === "active")
    .sort(compareTasks)
    .slice(0, 12)
    .map((task) => ({
      id: task.id,
      type: "task",
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));

  return { notes, tasks };
}

function buildLocalSweep(context) {
  const staleNote = context.notes.find((note) => !note.pinned) || context.notes[0];
  const looseNote = context.notes.find((note) => note.body && !note.pinned);
  const overdueTask = context.tasks.find((task) => task.dueAt && task.dueAt < toDateInput(new Date()) && !task.completed);
  const suggestions = [];

  if (overdueTask) {
    suggestions.push({
      action: "snooze_task",
      targetId: overdueTask.id,
      targetType: "task",
      title: overdueTask.title,
      reason: "It is overdue, so move it to tomorrow or decide it is no longer active."
    });
  }

  if (looseNote) {
    suggestions.push({
      action: "create_task",
      targetId: looseNote.id,
      targetType: "note",
      title: looseNote.title,
      reason: "This note reads like it could use a follow-up task.",
      taskTitle: `Follow up: ${looseNote.title}`.slice(0, 70),
      taskBody: looseNote.body
    });
  }

  if (staleNote && !suggestions.some((item) => item.targetId === staleNote.id)) {
    suggestions.push({
      action: "archive_note",
      targetId: staleNote.id,
      targetType: "note",
      title: staleNote.title,
      reason: "It is unpinned and older than the rest of the active stack."
    });
  }

  return {
    title: "A few quick cleanup moves",
    summary: `${context.notes.length} notes and ${context.tasks.length} tasks were reviewed locally.`,
    suggestions
  };
}

function applySweepSuggestion(suggestion) {
  const action = suggestion.action;
  const now = new Date().toISOString();

  if (action === "archive_note") {
    updateNote(suggestion.targetId, { status: "archive", pinned: false }, "Note archived");
  } else if (action === "pin_note") {
    updateNote(suggestion.targetId, { pinned: true }, "Note pinned");
  } else if (action === "raise_task") {
    updateTask(suggestion.targetId, { priority: "high" }, "Task raised");
  } else if (action === "snooze_task") {
    updateTask(suggestion.targetId, { dueAt: toDateInput(new Date(Date.now() + dayMs)) }, "Task snoozed");
  } else if (action === "create_task") {
    const source = state.notes.find((note) => note.id === suggestion.targetId);
    state.tasks.unshift({
      id: crypto.randomUUID(),
      title: suggestion.taskTitle || `Follow up: ${source?.title || "note"}`,
      details: suggestion.taskBody || source?.body || suggestion.reason || "",
      label: source?.label || "ideas",
      priority: "normal",
      dueAt: toDateInput(new Date(Date.now() + dayMs)),
      completed: false,
      status: "active",
      createdAt: now,
      updatedAt: now
    });
    saveData();
    render();
    showToast("Task created");
  } else {
    showToast("Nothing to apply");
    return;
  }

  removeAppliedSweep(suggestion);
}

function removeAppliedSweep(suggestion) {
  const next = [...els.sweepList.querySelectorAll(".sweep-item")].filter((item) => {
    return item.querySelector("h3")?.textContent !== (suggestion.title || "Review item");
  });
  els.sweepList.replaceChildren(...next);
  if (next.length === 0) {
    els.sweepTitle.textContent = "Sweep complete";
    els.sweepSummary.textContent = "The suggested cleanup moves have been handled.";
  }
}

function getSweepActionLabel(action) {
  if (action === "archive_note") return "Archive";
  if (action === "pin_note") return "Pin";
  if (action === "create_task") return "Task";
  if (action === "raise_task") return "Raise";
  if (action === "snooze_task") return "Snooze";
  return "Review";
}

function setSweepLoading(loading) {
  els.sweepButton.disabled = loading;
  els.sweepButton.textContent = loading ? "Sweeping..." : "Sweep";
  els.smartSweep.classList.toggle("loading", loading);
}

async function askKeeply(event) {
  event.preventDefault();
  const question = els.askInput.value.trim();
  if (!question) {
    showToast("Ask a question first");
    els.askInput.focus();
    return;
  }

  const context = getAskContext();
  if (context.items.length === 0) {
    showToast("Save a few items first");
    return;
  }

  setAskLoading(true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, items: context.items })
    });
    const answer = await response.json();
    if (!response.ok) throw new Error(answer.error || "Ask failed");
    renderAskAnswer(answer);
    showToast("Answer ready");
  } catch (error) {
    renderAskAnswer(buildLocalAskAnswer(question, context.items));
    showToast("Local answer ready");
  } finally {
    setAskLoading(false);
  }
}

function getAskContext() {
  const notes = state.notes
    .filter((note) => note.status === "active")
    .map((note) => ({
      id: note.id,
      type: "note",
      title: note.title,
      body: note.body,
      label: note.label,
      pinned: note.pinned,
      updatedAt: note.updatedAt || note.createdAt
    }));
  const tasks = state.tasks
    .filter((task) => task.status === "active")
    .map((task) => ({
      id: task.id,
      type: "task",
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt,
      completed: task.completed,
      updatedAt: task.updatedAt || task.createdAt
    }));

  return {
    items: [...notes, ...tasks]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 24)
  };
}

function buildLocalAskAnswer(question, items) {
  const terms = tokenize(question);
  const scored = items
    .map((item) => ({
      item,
      score: scoreAskItem(item, terms)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  const sources = scored.length ? scored : items.slice(0, 2);
  const first = sources[0];

  return {
    title: sources.length ? "Best local match" : "Nothing active yet",
    answer: first
      ? `${first.title} looks most relevant. ${first.body || "It has no extra details saved yet."}`
      : "Save a few notes or tasks, then ask again.",
    nextStep: first?.type === "task" ? "Open Tasks and check whether this needs action today." : "Pin or shape the matching note if it needs follow-up.",
    sources: sources.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      label: item.label
    }))
  };
}

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);
}

function scoreAskItem(item, terms) {
  const haystack = `${item.title} ${item.body} ${item.label} ${item.priority || ""}`.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), item.pinned ? 0.5 : 0);
}

function renderAskAnswer(answer) {
  const card = document.createElement("article");
  card.className = "ask-card";

  const title = document.createElement("h3");
  title.textContent = answer.title || "Keeply answer";

  const body = document.createElement("p");
  body.textContent = answer.answer || "No answer was found in the active Keeply items.";

  const next = document.createElement("div");
  next.className = "ask-next";
  next.textContent = answer.nextStep || "Save another note or ask a narrower question.";

  const sources = document.createElement("div");
  sources.className = "ask-sources";
  for (const source of Array.isArray(answer.sources) ? answer.sources.slice(0, 4) : []) {
    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "ask-source";
    badge.textContent = `${source.type || "item"} · ${source.title || "Untitled"}`;
    badge.addEventListener("click", () => jumpToSource(source));
    sources.append(badge);
  }

  card.append(title, body, next, sources);
  els.askAnswer.replaceChildren(card);
}

function jumpToSource(source) {
  if (!source?.id) return;
  state.view = source.type === "task" ? "tasks" : "active";
  state.label = "all";
  state.query = source.title || "";
  els.searchInput.value = state.query;
  document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.label === "all"));
  syncNav();
  render();
  requestAnimationFrame(() => {
    document.querySelector(`[data-id="${CSS.escape(source.id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function setAskLoading(loading) {
  els.askButton.disabled = loading;
  els.askButton.textContent = loading ? "Asking..." : "Ask";
  els.askKeeply.classList.toggle("loading", loading);
}

function renderNote(note) {
  const node = els.noteTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.id = note.id;
  node.dataset.color = note.color;
  node.classList.toggle("pinned", note.pinned);
  node.querySelector(".note-label").textContent = note.label;
  node.querySelector("h3").textContent = note.title;
  node.querySelector("p").textContent = note.body || "No extra details";
  node.querySelector("time").textContent = formatDate(note.createdAt);

  const archiveButton = node.querySelector(".archive-action");
  const trashButton = node.querySelector(".trash-action");
  const pinButton = node.querySelector(".pin-action");

  pinButton.hidden = state.view !== "active";
  archiveButton.setAttribute("aria-label", state.view === "archive" ? "Restore note" : "Archive note");
  trashButton.setAttribute("aria-label", state.view === "trash" ? "Delete forever" : "Move note to trash");

  pinButton.addEventListener("click", () => updateNote(note.id, { pinned: !note.pinned }, note.pinned ? "Unpinned" : "Pinned"));
  archiveButton.addEventListener("click", () => {
    const status = state.view === "archive" ? "active" : "archive";
    updateNote(note.id, { status, pinned: false }, status === "archive" ? "Archived" : "Restored");
  });
  trashButton.addEventListener("click", () => {
    if (state.view === "trash") {
      state.notes = state.notes.filter((item) => item.id !== note.id);
      rememberDeleted(note.id);
      saveData();
      render();
      showToast("Deleted forever");
      return;
    }
    updateNote(note.id, { status: "trash", pinned: false }, "Moved to trash");
  });

  attachSwipe(node, note);
  return node;
}

function renderTask(task) {
  const node = els.taskTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.id = task.id;
  node.dataset.priority = task.priority;
  node.classList.toggle("completed", task.completed);
  node.classList.toggle("overdue", isOverdue(task));
  node.querySelector(".task-label").textContent = task.label;
  node.querySelector(".task-priority").textContent = task.priority;
  node.querySelector("h3").textContent = task.title;
  node.querySelector("p").textContent = task.details || "No extra details";
  node.querySelector("time").textContent = task.dueAt ? formatDueDate(task.dueAt) : "No due date";

  const checkButton = node.querySelector(".task-check");
  const archiveButton = node.querySelector(".archive-action");
  const trashButton = node.querySelector(".trash-action");

  checkButton.hidden = state.view !== "tasks";
  archiveButton.setAttribute("aria-label", state.view === "archive" ? "Restore task" : "Archive task");
  trashButton.setAttribute("aria-label", state.view === "trash" ? "Delete forever" : "Move task to trash");

  checkButton.addEventListener("click", () => {
    updateTask(task.id, { completed: !task.completed }, task.completed ? "Reopened" : "Completed");
  });
  archiveButton.addEventListener("click", () => {
    const status = state.view === "archive" ? "active" : "archive";
    updateTask(task.id, { status }, status === "archive" ? "Archived" : "Restored");
  });
  trashButton.addEventListener("click", () => {
    if (state.view === "trash") {
      state.tasks = state.tasks.filter((item) => item.id !== task.id);
      rememberDeleted(task.id);
      saveData();
      render();
      showToast("Deleted forever");
      return;
    }
    updateTask(task.id, { status: "trash" }, "Moved to trash");
  });

  return node;
}

function attachSwipe(node, note) {
  let startX = 0;
  let currentX = 0;

  node.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX = event.clientX;
    currentX = 0;
    node.setPointerCapture(event.pointerId);
  });

  node.addEventListener("pointermove", (event) => {
    if (!startX) return;
    currentX = Math.max(-92, Math.min(92, event.clientX - startX));
    node.style.setProperty("--drag-x", `${currentX}px`);
  });

  node.addEventListener("pointerup", () => {
    if (Math.abs(currentX) > 70) {
      if (currentX > 0 && state.view === "active") {
        updateNote(note.id, { pinned: !note.pinned }, note.pinned ? "Unpinned" : "Pinned");
      } else {
        const status = state.view === "trash" ? "active" : "trash";
        updateNote(note.id, { status, pinned: false }, status === "trash" ? "Moved to trash" : "Restored");
      }
    } else {
      node.style.setProperty("--drag-x", "0px");
    }
    startX = 0;
    currentX = 0;
  });
}

function updateNote(id, patch, message) {
  state.notes = state.notes.map((note) => (note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note));
  saveData();
  render();
  showToast(message);
}

function updateTask(id, patch, message) {
  state.tasks = state.tasks.map((task) => (task.id === id ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task));
  saveData();
  render();
  showToast(message);
}

function rememberDeleted(id) {
  state.deletedIds = [...new Set([...state.deletedIds, id])];
}

async function shapeDraft() {
  const title = els.titleInput.value.trim();
  const body = els.bodyInput.value.trim();
  if (!title && !body) {
    showToast("Write a rough capture first");
    els.bodyInput.focus();
    return;
  }

  setShapeLoading(true);

  try {
    const response = await fetch("/api/shape", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        draft: {
          mode: state.composerMode,
          title,
          body,
          label: els.labelInput.value
        }
      })
    });
    const shape = await response.json();
    if (!response.ok) throw new Error(shape.error || "Shape failed");
    applyDraftShape(shape);
    showToast(shape.summary || "Draft shaped");
  } catch (error) {
    applyDraftShape(buildLocalDraftShape({ title, body, mode: state.composerMode, label: els.labelInput.value }));
    showToast("Local shape applied");
  } finally {
    setShapeLoading(false);
  }
}

function applyDraftShape(shape) {
  const mode = shape.type === "task" ? "task" : "note";
  setComposerMode(mode);
  els.titleInput.value = shape.title || els.titleInput.value.trim() || "Untitled";
  els.bodyInput.value = shape.body || els.bodyInput.value.trim();
  els.labelInput.value = ["work", "home", "ideas", "personal"].includes(shape.label) ? shape.label : els.labelInput.value;

  if (mode === "task") {
    els.priorityInput.value = ["low", "normal", "high"].includes(shape.priority) ? shape.priority : "normal";
    els.dueInput.value = toDateInput(new Date(Date.now() + dayMs * getDueOffset(shape)));
  } else {
    setComposerColor(["sun", "mint", "sky", "rose", "ink"].includes(shape.color) ? shape.color : state.color);
  }
}

function buildLocalDraftShape(draft) {
  const combined = `${draft.title} ${draft.body}`.toLowerCase();
  const taskWords = ["call", "send", "buy", "book", "schedule", "email", "finish", "review", "follow up", "todo"];
  const homeWords = ["market", "grocery", "home", "kitchen", "water", "clean"];
  const workWords = ["meeting", "client", "recap", "metric", "product", "quarter", "review"];
  const type = draft.mode === "task" || taskWords.some((word) => combined.includes(word)) ? "task" : "note";
  const label = workWords.some((word) => combined.includes(word)) ? "work" : homeWords.some((word) => combined.includes(word)) ? "home" : draft.label;
  const title = draft.title || sentenceTitle(draft.body) || (type === "task" ? "Follow up" : "Captured thought");

  return {
    type,
    title,
    body: draft.body || draft.title,
    label,
    color: label === "home" ? "mint" : label === "work" ? "sky" : "sun",
    priority: combined.includes("urgent") || combined.includes("today") ? "high" : "normal",
    dueOffsetDays: combined.includes("tomorrow") ? 1 : 0,
    summary: "Draft shaped locally"
  };
}

function sentenceTitle(value) {
  return String(value || "")
    .split(/[.!?\n]/)[0]
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 70);
}

function setComposerColor(color) {
  state.color = color;
  document.querySelectorAll(".dot").forEach((dot) => dot.classList.toggle("active", dot.dataset.color === color));
}

function setShapeLoading(loading) {
  els.shapeButton.disabled = loading;
  els.shapeButton.textContent = loading ? "Shaping..." : "Shape";
}

async function sparkIdeas() {
  const title = els.titleInput.value.trim();
  const body = els.bodyInput.value.trim();
  if (!title && !body && state.notes.length + state.tasks.length === 0) {
    showToast("Add a draft or save a few items first");
    els.bodyInput.focus();
    return;
  }

  setSparkLoading(true);

  try {
    const response = await fetch("/api/spark", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        draft: {
          mode: state.composerMode,
          title,
          body,
          label: els.labelInput.value
        },
        items: getSparkContext()
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Spark failed");

    renderSpark(data);
  } catch (error) {
    showToast(error.message);
    renderSparkError(error.message);
  } finally {
    clearSparkLoading();
  }
}

function getSparkContext() {
  const notes = state.notes
    .filter((note) => note.status === "active")
    .slice(0, 8)
    .map((note) => ({
      type: "note",
      title: note.title,
      body: note.body,
      label: note.label
    }));
  const tasks = state.tasks
    .filter((task) => task.status === "active")
    .slice(0, 8)
    .map((task) => ({
      type: "task",
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt
    }));

  return [...notes, ...tasks]
    .sort((a, b) => (a.title > b.title ? 1 : -1))
    .slice(0, 12);
}

function setSparkLoading(loading) {
  els.sparkButton.disabled = loading;
  els.sparkButton.textContent = loading ? "Sparking..." : "Spark";
  els.sparkPanel.hidden = false;
  els.sparkPanel.classList.toggle("loading", loading);
  if (loading) {
    els.sparkStatus.textContent = "Thinking";
    els.sparkSuggestions.replaceChildren(renderSparkSkeleton(), renderSparkSkeleton(), renderSparkSkeleton());
  }
}

function clearSparkLoading() {
  els.sparkButton.disabled = false;
  els.sparkButton.textContent = "Spark";
  els.sparkPanel.classList.remove("loading");
}

function renderSpark(data) {
  const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
  els.sparkPanel.hidden = false;
  els.sparkStatus.textContent = suggestions.length ? "Ready" : "Empty";
  els.sparkSuggestions.replaceChildren(...suggestions.map(renderSparkSuggestion));
  if (data.summary) showToast(data.summary);
}

function renderSparkError(message) {
  const card = document.createElement("article");
  card.className = "spark-card spark-error";
  const title = document.createElement("h3");
  title.textContent = "Spark is waiting";
  const body = document.createElement("p");
  body.textContent = message;
  card.append(title, body);
  els.sparkPanel.hidden = false;
  els.sparkStatus.textContent = "Offline";
  els.sparkSuggestions.replaceChildren(card);
}

function renderSparkSuggestion(suggestion) {
  const card = document.createElement("article");
  card.className = "spark-card";
  card.dataset.type = suggestion.type;
  card.dataset.color = suggestion.color || "sun";

  const meta = document.createElement("div");
  meta.className = "spark-meta";
  meta.textContent = `${suggestion.type || "note"} · ${suggestion.label || "ideas"}`;

  const title = document.createElement("h3");
  title.textContent = suggestion.title || "Untitled";

  const body = document.createElement("p");
  body.textContent = suggestion.body || "No extra details";

  const action = document.createElement("button");
  action.type = "button";
  action.className = "spark-add";
  action.textContent = suggestion.type === "task" ? "Add task" : "Add note";
  action.addEventListener("click", () => addSparkSuggestion(suggestion));

  card.append(meta, title, body, action);
  return card;
}

function renderSparkSkeleton() {
  const card = document.createElement("article");
  card.className = "spark-card skeleton";
  card.innerHTML = "<span></span><strong></strong><p></p>";
  return card;
}

function addSparkSuggestion(suggestion) {
  const now = new Date().toISOString();

  if (suggestion.type === "task") {
    state.tasks.unshift({
      id: crypto.randomUUID(),
      title: suggestion.title || "Untitled",
      details: suggestion.body || "",
      label: suggestion.label || "ideas",
      priority: suggestion.priority || "normal",
      dueAt: toDateInput(new Date(Date.now() + dayMs * getDueOffset(suggestion))),
      completed: false,
      status: "active",
      createdAt: now,
      updatedAt: now
    });
    state.view = "tasks";
    setComposerMode("task");
    syncNav();
    saveData();
    render();
    showToast("Spark task added");
    return;
  }

  state.notes.unshift({
    id: crypto.randomUUID(),
    title: suggestion.title || "Untitled",
    body: suggestion.body || "",
    label: suggestion.label || "ideas",
    color: suggestion.color || "sun",
    pinned: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  });
  state.view = "active";
  syncNav();
  saveData();
  render();
  showToast("Spark note added");
}

function getDueOffset(suggestion) {
  const offset = Number.parseInt(suggestion.dueOffsetDays, 10);
  if (Number.isNaN(offset)) return 0;
  return Math.min(14, Math.max(0, offset));
}

function hideSparkPanel() {
  els.sparkPanel.hidden = true;
  els.sparkStatus.textContent = "";
  els.sparkSuggestions.replaceChildren();
}

function setComposerMode(mode) {
  state.composerMode = mode;
  els.taskFields.hidden = mode !== "task";
  els.colorDots.hidden = mode === "task";
  els.bodyInput.placeholder = mode === "task" ? "Task details..." : "Take a note...";
  els.addButtonLabel.textContent = mode === "task" ? "Add task" : "Add";
  document.querySelectorAll(".mode-button").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function syncNav() {
  document.querySelectorAll(".rail-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
}

function getViewTitle() {
  if (state.view === "active") return "Notes";
  if (state.view === "tasks") return "Tasks";
  return titleCase(state.view);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1700);
}

function initWhatsNew() {
  if (!latestUpdate?.id || !latestUpdate.title || !Array.isArray(latestUpdate.bullets)) return;
  const lastSeen = localStorage.getItem(UPDATE_SEEN_KEY);
  if (lastSeen === latestUpdate.id) return;
  showWhatsNew(latestUpdate);
}

function showWhatsNew(update) {
  els.whatsNewTitle.textContent = update.title;
  els.whatsNewList.replaceChildren(
    ...update.bullets.slice(0, 4).map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    })
  );
  els.whatsNewBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => els.whatsNewDismiss.focus());
}

function dismissWhatsNew() {
  if (latestUpdate?.id) localStorage.setItem(UPDATE_SEEN_KEY, latestUpdate.id);
  els.whatsNewBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function formatDueDate(value) {
  const date = new Date(`${value}T00:00:00`);
  const today = toDateInput(new Date());
  if (value === today) return "Today";
  if (value === toDateInput(new Date(Date.now() + dayMs))) return "Tomorrow";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function isDueSoon(task) {
  const today = toDateInput(new Date());
  const tomorrow = toDateInput(new Date(Date.now() + dayMs));
  return !task.completed && task.dueAt >= today && task.dueAt <= tomorrow;
}

function isOverdue(task) {
  return !task.completed && task.dueAt && task.dueAt < toDateInput(new Date());
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

document.querySelectorAll(".rail-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    if (state.view === "tasks") setComposerMode("task");
    syncNav();
    render();
  });
});

document.querySelectorAll(".chip").forEach((button) => {
  button.addEventListener("click", () => {
    state.label = button.dataset.label;
    document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip === button));
    render();
  });
});

document.querySelectorAll(".task-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.taskWindow = button.dataset.window;
    render();
  });
});

document.querySelectorAll(".dot").forEach((button) => {
  button.addEventListener("click", () => {
    state.color = button.dataset.color;
    document.querySelectorAll(".dot").forEach((dot) => dot.classList.toggle("active", dot === button));
  });
});

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => setComposerMode(button.dataset.mode));
});

els.addButton.addEventListener("click", addItem);
els.shapeButton.addEventListener("click", shapeDraft);
els.sparkButton.addEventListener("click", sparkIdeas);
els.focusButton.addEventListener("click", briefFocus);
els.sweepButton.addEventListener("click", sweepItems);
els.askForm.addEventListener("submit", askKeeply);
els.quickAddButton.addEventListener("click", () => {
  els.titleInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});
els.layoutButton.addEventListener("click", () => {
  state.compact = !state.compact;
  render();
  showToast(state.compact ? "Compact list" : "Card grid");
});
els.themeButton.addEventListener("click", () => {
  document.body.classList.toggle("night");
  showToast(document.body.classList.contains("night") ? "Evening paper" : "Morning paper");
});
els.whatsNewDismiss.addEventListener("click", dismissWhatsNew);
els.whatsNewBackdrop.addEventListener("click", (event) => {
  if (event.target === els.whatsNewBackdrop) dismissWhatsNew();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.whatsNewBackdrop.hidden) dismissWhatsNew();
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") addItem();
});

render();
loadRemoteData();
initWhatsNew();
