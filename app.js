const STORAGE_KEY = "keeply-data-v2";
const LEGACY_NOTES_KEY = "keeply-notes-v1";
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
  hasLocalData: loaded.hasLocalData,
  syncReady: false,
  syncTimer: 0,
  syncInFlight: false,
  dirtyWhileLoading: false,
  view: "active",
  label: "all",
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
        hasLocalData: true
      };
    } catch {
      return { notes: seedNotes, tasks: seedTasks, hasLocalData: false };
    }
  }

  const legacyNotes = localStorage.getItem(LEGACY_NOTES_KEY);
  if (!legacyNotes) return { notes: seedNotes, tasks: seedTasks, hasLocalData: false };

  try {
    const parsed = JSON.parse(legacyNotes);
    return {
      notes: Array.isArray(parsed) ? parsed : seedNotes,
      tasks: seedTasks,
      hasLocalData: Array.isArray(parsed)
    };
  } catch {
    return { notes: seedNotes, tasks: seedTasks, hasLocalData: false };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: state.notes, tasks: state.tasks }));
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
      state.notes = state.dirtyWhileLoading ? mergeByUpdatedAt(remoteNotes, state.notes) : remoteNotes;
      state.tasks = state.dirtyWhileLoading ? mergeByUpdatedAt(remoteTasks, state.tasks) : remoteTasks;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes: state.notes, tasks: state.tasks }));
      render();
      if (state.dirtyWhileLoading) queueRemoteSave(true);
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

function mergeByUpdatedAt(remoteItems, localItems) {
  const items = new Map(remoteItems.map((item) => [item.id, item]));

  for (const localItem of localItems) {
    const remoteItem = items.get(localItem.id);
    if (!remoteItem || new Date(localItem.updatedAt || localItem.createdAt) > new Date(remoteItem.updatedAt || remoteItem.createdAt)) {
      items.set(localItem.id, localItem);
    }
  }

  return [...items.values()];
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
      body: JSON.stringify({ notes: state.notes, tasks: state.tasks })
    });

    if (!response.ok) throw new Error(`Sync returned ${response.status}`);
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
  els.pinnedNotes.replaceChildren(...pinned.map(renderNote));
  els.notesGrid.replaceChildren(...others.map(renderNote));
  els.taskList.replaceChildren(...tasks.map(renderTask));
  els.emptyState.classList.toggle("show", notes.length + tasks.length === 0);
  els.emptyState.querySelector("h2").textContent = showTasks ? "No tasks here" : "No notes here";
  els.emptyState.querySelector("p").textContent = showTasks
    ? "Add a task with a due date, priority, and label."
    : "Create one, change filters, or restore something from archive.";
  els.pinnedNotes.classList.toggle("compact", state.compact);
  els.notesGrid.classList.toggle("compact", state.compact);

  renderStats();
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
els.sparkButton.addEventListener("click", sparkIdeas);
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

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") addItem();
});

render();
loadRemoteData();
