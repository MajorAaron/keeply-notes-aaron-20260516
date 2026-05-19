import { latestUpdate } from "./release-updates.mjs";
import { getTaskWindowCounts, matchesTaskWindow } from "./task-filters.mjs";
import { buildLocalNoteImage, dataUrlBytes } from "./note-images.mjs";
import { getTaskDueShortcutDate, getVisibleTaskDueShortcuts } from "./task-due-shortcuts.mjs";
import { getTaskPriorityShortcutValue, getVisibleTaskPriorityShortcuts } from "./task-priority-shortcuts.mjs";
import { getTaskLabelShortcutValue, getVisibleTaskLabelShortcuts } from "./task-label-shortcuts.mjs";
import { NOTE_FOLLOW_UP_SHORTCUTS, buildFollowUpTask, removeFollowUpTask } from "./note-followups.mjs";
import { getNoteColorShortcutValue, getVisibleNoteColorShortcuts } from "./note-color-shortcuts.mjs";
import { getNoteLabelShortcutValue, getVisibleNoteLabelShortcuts } from "./note-label-shortcuts.mjs";
import { captureItemRestore, restoreItem } from "./undo-restore.mjs";
import { archiveCompletedTasks } from "./completed-task-cleanup.mjs";
import { TASK_COMPOSER_DUE_PRESETS, getTaskComposerDueDate, getTaskComposerDueHint } from "./task-composer-presets.mjs";
import { TASK_COMPOSER_PRIORITY_PRESETS, getTaskComposerPriorityLabel, normalizeTaskComposerPriority } from "./task-composer-priorities.mjs";
import { toggleTaskCompletion } from "./task-completion.mjs";
import { snoozeOverdueTasks } from "./snooze-overdue-tasks.mjs";
import { buildComposerDraft, getComposerDraftResume, hasComposerDraftContent, normalizeComposerDraft } from "./composer-draft.mjs";
import { insertChecklistMarker } from "./composer-checklist.mjs";
import { getTaskChecklistMeta } from "./task-checklist-meta.mjs";
import { getNoteChecklistMeta } from "./note-checklist-meta.mjs";
import { getNoteCaptureTitle } from "./note-title.mjs";
import { buildTaskCaptureFields } from "./task-capture-hints.mjs";
import { formatLabelCount, getLabelCounts } from "./label-counts.mjs";
import { buildViewPreferences, parseViewPreferences } from "./view-preferences.mjs";
import { getSearchHighlightTerms, splitHighlightedText } from "./search-highlights.mjs";
import { getActiveFilterSummary } from "./active-filters.mjs";
import { buildNoteSharePayload, buildTaskSharePayload } from "./item-share.mjs";
import { getArchiveRestoreAction, getTrashAction } from "./item-status-actions.mjs";
import { duplicateNote, duplicateTask } from "./duplicate-items.mjs";
import { removeCopiedItem } from "./duplicate-undo.mjs";
import { buildNoteEditPatch, buildTaskEditPatch } from "./edit-items.mjs";
import { getNotePinLabel, toggleNotePin } from "./note-pin.mjs";
import { buildBulkTasksFromText } from "./task-bulk-entry.mjs";
import { getTaskSwipeAction } from "./task-swipe-actions.mjs";
import { getNoteSwipeAction } from "./note-swipe-actions.mjs";
import { buildNotePreview } from "./note-preview.mjs";
import { getTaskDueBadge } from "./task-due-badge.mjs";
import { buildTaskDetailPreview } from "./task-detail-preview.mjs";
import { getNoteReadingMeta } from "./note-reading-meta.mjs";
import { getTaskPriorityFilterCounts, matchesTaskPriorityFilter, normalizeTaskPriorityFilter } from "./task-priority-filters.mjs";
import { getNoteColorFilterCounts, matchesNoteColorFilter, normalizeNoteColorFilter } from "./note-color-filters.mjs";
import { compareTasksForDisplay } from "./task-sort.mjs";
import { compareNotesForDisplay } from "./note-sort.mjs";
import { getTodayTaskProgress } from "./task-today-progress.mjs";
import { getNextTaskHighlight } from "./next-task.mjs";
import { getNoteSpotlight } from "./note-spotlight.mjs";
import { getCleanupSpotlight } from "./cleanup-spotlight.mjs";
import { getAskSuggestions } from "./ask-suggestions.mjs";
import { getEmptyStateCopy } from "./empty-state.mjs";
import { getSearchCaptureDraft } from "./search-capture.mjs";
import { getQuickAddTarget } from "./quick-add-target.mjs";
import { getSearchClearState } from "./search-clear.mjs";
import { getSyncStatusView } from "./sync-status.mjs";
import { getNavigationBadges } from "./navigation-badges.mjs";

const STORAGE_KEY = "keeply-data-v2";
const LEGACY_NOTES_KEY = "keeply-notes-v1";
const UPDATE_SEEN_KEY = "keeply-last-seen-update";
const COMPOSER_DRAFT_KEY = "keeply-composer-draft-v1";
const VIEW_PREFERENCES_KEY = "keeply-view-preferences-v1";
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
const savedPreferences = parseViewPreferences(localStorage.getItem(VIEW_PREFERENCES_KEY));
const state = {
  notes: loaded.notes,
  tasks: loaded.tasks,
  deletedIds: loaded.deletedIds,
  hasLocalData: loaded.hasLocalData,
  syncReady: false,
  syncTimer: 0,
  syncInFlight: false,
  syncStatus: "syncing",
  dirtyWhileLoading: false,
  view: savedPreferences.view,
  label: savedPreferences.label,
  taskWindow: savedPreferences.taskWindow,
  taskPriority: savedPreferences.taskPriority,
  noteColor: savedPreferences.noteColor,
  query: "",
  color: "sun",
  compact: savedPreferences.compact,
  theme: savedPreferences.theme,
  composerMode: savedPreferences.view === "tasks" ? "task" : "note",
  draftImage: null,
  editingItem: null
};

const els = {
  composer: document.querySelector("#composer"),
  railButtons: document.querySelectorAll(".rail-button"),
  viewTitle: document.querySelector("#viewTitle"),
  syncStatusPill: document.querySelector("#syncStatusPill"),
  searchInput: document.querySelector("#searchInput"),
  searchClearButton: document.querySelector("#searchClearButton"),
  titleInput: document.querySelector("#titleInput"),
  bodyInput: document.querySelector("#bodyInput"),
  imageInput: document.querySelector("#imageInput"),
  imagePreview: document.querySelector("#imagePreview"),
  imagePreviewTitle: document.querySelector("#imagePreviewTitle"),
  imagePreviewMeta: document.querySelector("#imagePreviewMeta"),
  attachImageButton: document.querySelector("#attachImageButton"),
  generateImageButton: document.querySelector("#generateImageButton"),
  removeImageButton: document.querySelector("#removeImageButton"),
  dueInput: document.querySelector("#dueInput"),
  dueInputHint: document.querySelector("#dueInputHint"),
  priorityInput: document.querySelector("#priorityInput"),
  taskFields: document.querySelector("#taskFields"),
  taskComposerPresets: document.querySelector("#taskComposerPresets"),
  taskComposerPriorities: document.querySelector("#taskComposerPriorities"),
  composerDraftResume: document.querySelector("#composerDraftResume"),
  composerDraftKicker: document.querySelector("#composerDraftKicker"),
  composerDraftTitle: document.querySelector("#composerDraftTitle"),
  composerDraftSummary: document.querySelector("#composerDraftSummary"),
  composerDraftDiscard: document.querySelector("#composerDraftDiscard"),
  colorDots: document.querySelector(".color-dots"),
  labelInput: document.querySelector("#labelInput"),
  checklistButton: document.querySelector("#checklistButton"),
  shapeButton: document.querySelector("#shapeButton"),
  sparkButton: document.querySelector("#sparkButton"),
  sparkPanel: document.querySelector("#sparkPanel"),
  sparkStatus: document.querySelector("#sparkStatus"),
  sparkSuggestions: document.querySelector("#sparkSuggestions"),
  addButton: document.querySelector("#addButton"),
  addButtonLabel: document.querySelector("#addButtonLabel"),
  editCancelButton: document.querySelector("#editCancelButton"),
  quickAddButton: document.querySelector("#quickAddButton"),
  layoutButton: document.querySelector("#layoutButton"),
  themeButton: document.querySelector("#themeButton"),
  pinnedNotes: document.querySelector("#pinnedNotes"),
  notesGrid: document.querySelector("#notesGrid"),
  taskList: document.querySelector("#taskList"),
  pinnedHeading: document.querySelector("#pinnedHeading"),
  othersHeading: document.querySelector("#othersHeading"),
  emptyState: document.querySelector("#emptyState"),
  emptyStateAction: document.querySelector("#emptyStateAction"),
  emptyStateCapture: document.querySelector("#emptyStateCapture"),
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
  askSuggestions: document.querySelector("#askSuggestions"),
  askTitle: document.querySelector("#askTitle"),
  askSummary: document.querySelector("#askSummary"),
  askAnswer: document.querySelector("#askAnswer"),
  noteColorFilters: document.querySelector("#noteColorFilters"),
  taskFilters: document.querySelector("#taskFilters"),
  taskPriorityFilters: document.querySelector("#taskPriorityFilters"),
  filterSummary: document.querySelector("#filterSummary"),
  filterSummaryChips: document.querySelector("#filterSummaryChips"),
  filterClearButton: document.querySelector("#filterClearButton"),
  taskBulkActions: document.querySelector("#taskBulkActions"),
  noteSpotlightCard: document.querySelector("#noteSpotlightCard"),
  noteSpotlightKicker: document.querySelector("#noteSpotlightKicker"),
  noteSpotlightTitle: document.querySelector("#noteSpotlightTitle"),
  noteSpotlightSummary: document.querySelector("#noteSpotlightSummary"),
  noteSpotlightButton: document.querySelector("#noteSpotlightButton"),
  cleanupSpotlightCard: document.querySelector("#cleanupSpotlightCard"),
  cleanupSpotlightKicker: document.querySelector("#cleanupSpotlightKicker"),
  cleanupSpotlightTitle: document.querySelector("#cleanupSpotlightTitle"),
  cleanupSpotlightSummary: document.querySelector("#cleanupSpotlightSummary"),
  cleanupSpotlightButton: document.querySelector("#cleanupSpotlightButton"),
  nextTaskCard: document.querySelector("#nextTaskCard"),
  nextTaskKicker: document.querySelector("#nextTaskKicker"),
  nextTaskTitle: document.querySelector("#nextTaskTitle"),
  nextTaskSummary: document.querySelector("#nextTaskSummary"),
  nextTaskButton: document.querySelector("#nextTaskButton"),
  nextTaskCompleteButton: document.querySelector("#nextTaskCompleteButton"),
  taskTodayProgress: document.querySelector("#taskTodayProgress"),
  taskTodayTitle: document.querySelector("#taskTodayTitle"),
  taskTodaySummary: document.querySelector("#taskTodaySummary"),
  taskTodayMeter: document.querySelector("#taskTodayMeter"),
  taskTodayFill: document.querySelector("#taskTodayFill"),
  taskTodayPercent: document.querySelector("#taskTodayPercent"),
  taskTodayOpen: document.querySelector("#taskTodayOpen"),
  taskTodayHigh: document.querySelector("#taskTodayHigh"),
  archiveCompletedButton: document.querySelector("#archiveCompletedButton"),
  archiveCompletedCount: document.querySelector("#archiveCompletedCount"),
  snoozeOverdueButton: document.querySelector("#snoozeOverdueButton"),
  snoozeOverdueCount: document.querySelector("#snoozeOverdueCount"),
  whatsNewBackdrop: document.querySelector("#whatsNewBackdrop"),
  whatsNewDialog: document.querySelector("#whatsNewDialog"),
  whatsNewTitle: document.querySelector("#whatsNewTitle"),
  whatsNewList: document.querySelector("#whatsNewList"),
  whatsNewDismiss: document.querySelector("#whatsNewDismiss"),
  toast: document.querySelector("#toast"),
  noteTemplate: document.querySelector("#noteTemplate"),
  taskTemplate: document.querySelector("#taskTemplate")
};

function setSyncStatus(status) {
  state.syncStatus = status;
  if (!els.syncStatusPill) return;
  const view = getSyncStatusView(status, { pendingDeletes: state.deletedIds.length });
  els.syncStatusPill.textContent = view.label;
  els.syncStatusPill.title = view.title;
  els.syncStatusPill.setAttribute("aria-label", view.ariaLabel);
  els.syncStatusPill.dataset.syncStatus = view.tone;
}

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
  if (!state.syncReady) {
    state.dirtyWhileLoading = true;
    setSyncStatus("pending");
  } else {
    setSyncStatus("syncing");
  }
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
      if (state.dirtyWhileLoading || state.deletedIds.length > 0) {
        queueRemoteSave(true);
      } else {
        setSyncStatus("synced");
      }
      state.dirtyWhileLoading = false;
      showToast("Synced");
      return;
    }

    if (state.hasLocalData) {
      queueRemoteSave(true);
    }
    state.dirtyWhileLoading = false;
    setSyncStatus("synced");
  } catch (error) {
    console.warn("Keeply sync unavailable", error);
    setSyncStatus("offline");
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

  setSyncStatus("syncing");
  state.syncTimer = window.setTimeout(syncRemoteData, immediate ? 0 : 350);
}

async function syncRemoteData() {
  if (state.syncInFlight) {
    queueRemoteSave(true);
    return;
  }

  state.syncInFlight = true;
  setSyncStatus("syncing");

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
    setSyncStatus("synced");
    render();
  } catch (error) {
    console.warn("Keeply sync failed", error);
    setSyncStatus("local");
    showToast("Saved locally");
  } finally {
    state.syncInFlight = false;
  }
}

function addItem() {
  if (state.editingItem) {
    saveEditedItem();
    return;
  }

  if (state.composerMode === "task") {
    addTask();
  } else {
    addNote();
  }
}

function saveEditedItem() {
  if (state.editingItem.type === "task") {
    saveEditedTask();
  } else {
    saveEditedNote();
  }
}

function saveEditedNote() {
  const note = state.notes.find((item) => item.id === state.editingItem.id);
  if (!note) {
    cancelEditDraft("Note no longer exists");
    return;
  }

  const title = els.titleInput.value.trim();
  const body = els.bodyInput.value.trim();
  if (!title && !body && !state.draftImage) {
    showToast("Keep some note content");
    els.bodyInput.focus();
    return;
  }

  const patch = buildNoteEditPatch(note, {
    title,
    body,
    image: state.draftImage,
    label: els.labelInput.value,
    color: state.color
  });
  state.notes = state.notes.map((item) => (item.id === note.id ? { ...item, ...patch } : item));
  finishEditing("Note updated");
}

function saveEditedTask() {
  const task = state.tasks.find((item) => item.id === state.editingItem.id);
  if (!task) {
    cancelEditDraft("Task no longer exists");
    return;
  }

  const title = els.titleInput.value.trim();
  if (!title) {
    showToast("Name the task first");
    els.titleInput.focus();
    return;
  }

  const patch = buildTaskEditPatch(task, {
    title,
    details: els.bodyInput.value,
    label: els.labelInput.value,
    priority: els.priorityInput.value,
    dueAt: els.dueInput.value
  });
  state.tasks = state.tasks.map((item) => (item.id === task.id ? { ...item, ...patch } : item));
  finishEditing("Task updated");
}

function finishEditing(message) {
  const type = state.editingItem.type;
  state.editingItem = null;
  clearComposer();
  setComposerMode(type === "task" ? "task" : "note", { saveDraft: false });
  saveData();
  render();
  showToast(message);
}

function addNote() {
  const title = els.titleInput.value.trim();
  const body = els.bodyInput.value.trim();
  if (!title && !body && !state.draftImage) {
    showToast("Write a note first");
    els.bodyInput.focus();
    return;
  }

  const now = new Date().toISOString();

  const noteTitle = getNoteCaptureTitle({ title, body, hasImage: Boolean(state.draftImage) });

  state.notes.unshift({
    id: crypto.randomUUID(),
    title: noteTitle,
    body,
    image: state.draftImage,
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
  const bulkTasks = title
    ? []
    : buildBulkTasksFromText(details, {
        label: els.labelInput.value,
        priority: els.priorityInput.value,
        dueAt: els.dueInput.value
      });
  if (bulkTasks.length > 0) {
    state.tasks = [...bulkTasks, ...state.tasks];
    clearComposer();
    setComposerMode("task");
    state.view = "tasks";
    syncNav();
    saveData();
    render();
    showToast(`${bulkTasks.length} tasks added`);
    return;
  }

  const taskFields = buildTaskCaptureFields({
    title,
    details,
    label: els.labelInput.value,
    priority: els.priorityInput.value,
    dueAt: els.dueInput.value
  });
  if (!taskFields.title) {
    showToast("Name the task or add details");
    els.bodyInput.focus();
    return;
  }

  const now = new Date().toISOString();

  state.tasks.unshift({
    id: crypto.randomUUID(),
    title: taskFields.title,
    details: taskFields.details,
    label: taskFields.label,
    priority: taskFields.priority,
    dueAt: taskFields.dueAt,
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
  clearDraftImage();
  els.dueInput.value = "";
  els.priorityInput.value = "normal";
  state.editingItem = null;
  updateComposerEditingState();
  hideSparkPanel();
  clearSavedComposerDraft();
}

function getVisibleNotes() {
  const query = state.query.toLowerCase();
  return state.notes
    .filter((note) => note.status === state.view)
    .filter((note) => state.view !== "active" || matchesNoteColorFilter(note, state.noteColor))
    .filter((note) => state.label === "all" || note.label === state.label)
    .filter((note) => {
      if (!query) return true;
      return `${note.title} ${note.body} ${note.label} ${note.image?.prompt || ""} ${note.image?.name || ""}`.toLowerCase().includes(query);
    })
    .sort(compareNotesForDisplay);
}

function getVisibleTasks() {
  const query = state.query.toLowerCase();
  const status = state.view === "tasks" ? "active" : state.view;
  return state.tasks
    .filter((task) => task.status === status)
    .filter((task) => state.view !== "tasks" || matchesTaskWindow(task, state.taskWindow))
    .filter((task) => state.view !== "tasks" || matchesTaskPriorityFilter(task, state.taskPriority))
    .filter((task) => state.label === "all" || task.label === state.label)
    .filter((task) => {
      if (!query) return true;
      return `${task.title} ${task.details} ${task.label} ${task.priority}`.toLowerCase().includes(query);
    })
    .sort(compareTasksForDisplay);
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
  els.searchInput.setAttribute("aria-label", showTasks ? "Search tasks" : "Search notes");
  renderSearchClearButton();
  els.pinnedHeading.hidden = pinned.length === 0 || state.view !== "active";
  els.othersHeading.textContent = showTasks ? "Tasks" : "Others";
  els.othersHeading.hidden = !showTasks && notes.length === 0;
  els.pinnedNotes.hidden = showTasks;
  els.notesGrid.hidden = showTasks;
  els.taskList.hidden = !showTasks && !showMixedArchive;
  els.noteColorFilters.hidden = state.view !== "active";
  els.taskFilters.hidden = !showTasks;
  els.taskPriorityFilters.hidden = !showTasks;
  els.taskBulkActions.hidden = !showTasks;
  els.pinnedNotes.replaceChildren(...pinned.map(renderNote));
  els.notesGrid.replaceChildren(...others.map(renderNote));
  els.taskList.replaceChildren(...tasks.map(renderTask));
  const emptyState = getEmptyStateCopy({
    view: state.view,
    label: state.label,
    taskWindow: state.taskWindow,
    taskPriority: state.taskPriority,
    noteColor: state.noteColor,
    query: state.query
  });
  els.emptyState.classList.toggle("show", notes.length + tasks.length === 0);
  els.emptyState.querySelector("h2").textContent = emptyState.title;
  els.emptyState.querySelector("p").textContent = emptyState.message;
  els.emptyStateAction.hidden = !emptyState.action;
  els.emptyStateAction.textContent = emptyState.action || "Clear filters";
  const searchCapture = getSearchCaptureDraft({ view: state.view, label: state.label, query: state.query });
  els.emptyStateCapture.hidden = notes.length + tasks.length !== 0 || !searchCapture.available;
  els.emptyStateCapture.textContent = searchCapture.action || "Capture search";
  els.pinnedNotes.classList.toggle("compact", state.compact);
  els.notesGrid.classList.toggle("compact", state.compact);

  renderLabelChips();
  renderFilterSummary();
  renderStats();
  renderNoteColorFilters();
  renderTaskFilters();
  renderTaskPriorityFilters();
  renderAskSuggestions();
  renderNoteSpotlight();
  renderCleanupSpotlight();
  renderNextTaskHighlight();
  renderTaskTodayProgress();
  renderTaskBulkActions();
  renderQuickAddButton();
  renderNavigationBadges();
}

function renderNavigationBadges() {
  const badges = getNavigationBadges({ notes: state.notes, tasks: state.tasks });
  els.railButtons.forEach((button) => {
    const view = button.dataset.view;
    const badge = badges[view];
    const badgeElement = button.querySelector(".rail-badge");
    const baseLabel = button.dataset.baseLabel || button.getAttribute("aria-label") || titleCase(view);
    button.dataset.baseLabel = baseLabel;
    if (!badge || !badgeElement) {
      button.setAttribute("aria-label", baseLabel);
      return;
    }
    badgeElement.hidden = !badge.visible;
    badgeElement.textContent = badge.label;
    badgeElement.setAttribute("aria-label", badge.ariaLabel);
    button.setAttribute("aria-label", badge.visible ? `${baseLabel}, ${badge.ariaLabel}` : baseLabel);
  });
}

function renderQuickAddButton() {
  const target = getQuickAddTarget(state.view);
  els.quickAddButton.setAttribute("aria-label", target.ariaLabel);
  els.quickAddButton.title = target.title;
}

function renderSearchClearButton() {
  const clearState = getSearchClearState(state.query, { view: state.view });
  els.searchClearButton.hidden = !clearState.visible;
  els.searchClearButton.setAttribute("aria-label", clearState.label);
  els.searchClearButton.title = clearState.title;
}

function clearSearchQuery() {
  if (!state.query) return;
  state.query = "";
  els.searchInput.value = "";
  render();
  els.searchInput.focus();
  showToast("Search cleared");
}

function renderLabelChips() {
  const counts = getLabelCounts(getLabelCountItems());

  document.querySelectorAll(".chip").forEach((button) => {
    const label = button.dataset.label;
    const labelText = button.querySelector(".chip-text")?.textContent || titleCase(label);
    const count = counts[label] ?? 0;
    button.classList.toggle("active", label === state.label);
    button.setAttribute("aria-label", `${labelText}, ${count} items`);
    button.querySelector(".chip-count").textContent = formatLabelCount(count);
  });
}

function getLabelCountItems() {
  if (state.view === "tasks") {
    return state.tasks.filter(
      (task) => task.status === "active" && matchesTaskWindow(task, state.taskWindow) && matchesTaskPriorityFilter(task, state.taskPriority)
    );
  }

  if (state.view === "archive" || state.view === "trash") {
    return [...state.notes, ...state.tasks].filter((item) => item.status === state.view);
  }

  return state.notes.filter((note) => note.status === "active" && matchesNoteColorFilter(note, state.noteColor));
}

function renderFilterSummary() {
  const summary = getActiveFilterSummary({
    view: state.view,
    label: state.label,
    taskWindow: state.taskWindow,
    taskPriority: state.taskPriority,
    noteColor: state.noteColor,
    query: state.query
  });

  els.filterSummary.hidden = !summary.active;
  els.filterSummaryChips.replaceChildren(
    ...summary.chips.map((chip) => {
      const item = document.createElement("span");
      item.className = "filter-summary-chip";
      item.textContent = chip.label;
      return item;
    })
  );
}

function clearActiveFilters() {
  state.label = "all";
  state.query = "";
  state.taskWindow = "all";
  state.taskPriority = "all";
  state.noteColor = "all";
  els.searchInput.value = "";
  saveViewPreferences();
  render();
  showToast("Filters cleared");
}

function captureSearchDraft() {
  const draft = getSearchCaptureDraft({ view: state.view, label: state.label, query: state.query });
  if (!draft.available) return;

  if (state.editingItem) state.editingItem = null;
  setComposerMode(draft.mode, { saveDraft: false });
  els.titleInput.value = draft.title;
  els.bodyInput.value = draft.body;
  els.labelInput.value = draft.label;
  els.priorityInput.value = draft.priority;
  els.dueInput.value = draft.dueAt === "" ? "" : toDateInput(new Date(Date.now() + dayMs * draft.dueAt));
  state.query = "";
  els.searchInput.value = "";
  renderTaskComposerPresets();
  updateComposerEditingState();
  saveComposerDraft();
  render();
  scrollComposerIntoView();
  showToast(draft.mode === "task" ? "Search captured as task draft" : "Search captured as note draft");
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

function renderNoteColorFilters() {
  const countableNotes = state.notes.filter((note) => note.status === "active" && (state.label === "all" || note.label === state.label));
  const counts = getNoteColorFilterCounts(countableNotes);

  els.noteColorFilters.querySelectorAll(".note-color-filter").forEach((button) => {
    const filter = normalizeNoteColorFilter(button.dataset.colorFilter);
    const active = filter === state.noteColor;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector(".task-filter-count").textContent = counts[filter] ?? 0;
  });
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

function renderTaskPriorityFilters() {
  const countableTasks = state.tasks.filter(
    (task) => task.status === "active" && matchesTaskWindow(task, state.taskWindow) && (state.label === "all" || task.label === state.label)
  );
  const counts = getTaskPriorityFilterCounts(countableTasks);

  els.taskPriorityFilters.querySelectorAll(".task-priority-filter").forEach((button) => {
    const filter = normalizeTaskPriorityFilter(button.dataset.priorityFilter);
    const active = filter === state.taskPriority;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector(".task-filter-count").textContent = counts[filter] ?? 0;
  });
}

function renderNoteSpotlight() {
  const spotlight = getNoteSpotlight(state.notes);
  els.noteSpotlightCard.hidden = state.view !== "active";
  els.noteSpotlightKicker.textContent = spotlight.kicker;
  els.noteSpotlightTitle.textContent = spotlight.title;
  els.noteSpotlightSummary.textContent = spotlight.summary;
  els.noteSpotlightButton.textContent = spotlight.buttonLabel;
  els.noteSpotlightButton.disabled = !spotlight.available;
  els.noteSpotlightButton.setAttribute("aria-label", spotlight.ariaLabel);
}

function focusNoteSpotlight() {
  const spotlight = getNoteSpotlight(state.notes);
  if (!spotlight.available) {
    setComposerMode("note");
    scrollComposerIntoView();
    showToast("Ready for a new note");
    return;
  }

  state.view = "active";
  state.label = "all";
  state.noteColor = "all";
  state.query = spotlight.query;
  els.searchInput.value = spotlight.query;
  syncNav();
  saveViewPreferences();
  render();
  const targetList = spotlight.pinned ? els.pinnedNotes : els.notesGrid;
  targetList.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Showing spotlight note");
}

function renderCleanupSpotlight() {
  const spotlight = getCleanupSpotlight({ view: state.view, notes: state.notes, tasks: state.tasks });
  els.cleanupSpotlightCard.hidden = !spotlight.visible;
  els.cleanupSpotlightKicker.textContent = spotlight.kicker;
  els.cleanupSpotlightTitle.textContent = spotlight.title;
  els.cleanupSpotlightSummary.textContent = spotlight.summary;
  els.cleanupSpotlightButton.textContent = spotlight.buttonLabel;
  els.cleanupSpotlightButton.disabled = !spotlight.available;
  els.cleanupSpotlightButton.setAttribute("aria-label", spotlight.ariaLabel);
}

function focusCleanupSpotlight() {
  const spotlight = getCleanupSpotlight({ view: state.view, notes: state.notes, tasks: state.tasks });
  if (!spotlight.available) {
    showToast(state.view === "trash" ? "Trash is empty" : "Archive is clear");
    return;
  }

  state.label = "all";
  state.noteColor = "all";
  state.taskWindow = "all";
  state.taskPriority = "all";
  state.query = spotlight.query;
  els.searchInput.value = spotlight.query;
  syncNav();
  saveViewPreferences();
  render();
  requestAnimationFrame(() => {
    document.querySelector(`[data-id="${CSS.escape(spotlight.id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  showToast(`Reviewing ${spotlight.type}`);
}

function renderNextTaskHighlight() {
  const highlight = getNextTaskHighlight(state.tasks);
  els.nextTaskCard.hidden = state.view !== "tasks";
  els.nextTaskCard.dataset.tone = highlight.tone;
  els.nextTaskKicker.textContent = highlight.kicker;
  els.nextTaskTitle.textContent = highlight.title;
  els.nextTaskSummary.textContent = highlight.summary;
  els.nextTaskButton.textContent = highlight.buttonLabel;
  els.nextTaskButton.dataset.window = highlight.window;
  els.nextTaskButton.setAttribute("aria-label", highlight.available ? `${highlight.buttonLabel}: ${highlight.ariaLabel}` : "Review all tasks");
  els.nextTaskCompleteButton.textContent = highlight.completeLabel;
  els.nextTaskCompleteButton.hidden = !highlight.canComplete;
  els.nextTaskCompleteButton.disabled = !highlight.canComplete;
  els.nextTaskCompleteButton.setAttribute("aria-label", highlight.completeAriaLabel);
}

function focusNextTaskWindow() {
  const highlight = getNextTaskHighlight(state.tasks);
  state.view = "tasks";
  state.label = "all";
  state.query = "";
  state.taskPriority = "all";
  state.taskWindow = highlight.window === "unscheduled" ? "unscheduled" : highlight.window === "all" ? "all" : highlight.window;
  els.searchInput.value = "";
  syncNav();
  saveViewPreferences();
  render();
  els.taskList.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(highlight.available ? "Showing next task" : "Showing tasks");
}

function completeNextTask() {
  const highlight = getNextTaskHighlight(state.tasks);
  if (!highlight.canComplete || !highlight.id) {
    showToast("No next task");
    return;
  }

  const task = state.tasks.find((item) => item.id === highlight.id);
  if (!task) {
    showToast("Task not found");
    return;
  }

  toggleTaskCompletionWithUndo(task);
}

function renderTaskTodayProgress() {
  const summary = getTodayTaskProgress(state.tasks);
  els.taskTodayProgress.hidden = state.view !== "tasks";
  els.taskTodayTitle.textContent = summary.title;
  els.taskTodaySummary.textContent = summary.summary;
  els.taskTodayPercent.textContent = `${summary.percent}%`;
  els.taskTodayOpen.textContent = `${summary.open} open`;
  els.taskTodayHigh.textContent = `${summary.highOpen} high`;
  els.taskTodayMeter.setAttribute("aria-valuenow", String(summary.percent));
  els.taskTodayMeter.setAttribute("aria-label", summary.ariaLabel);
  els.taskTodayFill.style.width = `${summary.percent}%`;
}

function renderTaskBulkActions() {
  const completedCount = state.tasks.filter((task) => task.status === "active" && task.completed).length;
  const today = toDateInput(new Date());
  const overdueCount = state.tasks.filter((task) => task.status === "active" && !task.completed && task.dueAt && task.dueAt < today).length;
  els.archiveCompletedCount.textContent = `${completedCount} done`;
  els.snoozeOverdueCount.textContent = `${overdueCount} overdue`;
  els.archiveCompletedButton.disabled = completedCount === 0;
  els.snoozeOverdueButton.disabled = overdueCount === 0;
}

function renderAskSuggestions() {
  const suggestions = getAskSuggestions(getAskContext().items, { now: new Date() });
  els.askSuggestions.replaceChildren(
    ...suggestions.map((suggestion) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ask-suggestion";
      button.textContent = suggestion;
      button.setAttribute("aria-label", `Ask Keeply: ${suggestion}`);
      button.addEventListener("click", () => useAskSuggestion(suggestion));
      return button;
    })
  );
}

function useAskSuggestion(question) {
  els.askInput.value = question;
  els.askInput.focus();
  showToast("Question ready");
}

function archiveCompletedTasksWithUndo() {
  const previousTasks = state.tasks.map((task) => ({ ...task }));
  const result = archiveCompletedTasks(state.tasks, { now: new Date().toISOString() });

  if (result.archived.length === 0) {
    showToast("No completed tasks");
    return;
  }

  state.tasks = result.tasks;
  saveData();
  render();
  showUndoToast(`${result.archived.length} completed archived`, () => {
    state.tasks = previousTasks;
    saveData();
    render();
    showToast("Tasks restored");
  });
}

function snoozeOverdueTasksWithUndo() {
  const previousTasks = state.tasks.map((task) => ({ ...task }));
  const result = snoozeOverdueTasks(state.tasks, { now: new Date() });

  if (result.snoozed.length === 0) {
    showToast("No overdue tasks");
    return;
  }

  state.tasks = result.tasks;
  state.taskWindow = "upcoming";
  state.taskPriority = "all";
  saveData();
  render();
  showUndoToast(`${result.snoozed.length} overdue snoozed`, () => {
    state.tasks = previousTasks;
    saveData();
    render();
    showToast("Tasks restored");
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
  state.noteColor = "all";
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
  const highlightTerms = getSearchHighlightTerms(state.query);
  node.dataset.id = note.id;
  node.dataset.color = note.color;
  node.classList.toggle("pinned", note.pinned);
  node.querySelector(".note-label").textContent = note.label;
  renderHighlightedText(node.querySelector("h3"), note.title, highlightTerms);
  const noteBody = note.body || "";
  const bodyPreview = buildNotePreview(noteBody, { emptyText: note.image ? "Image note" : "No extra details" });
  const bodyElement = node.querySelector("p");
  const expandButton = node.querySelector(".note-preview-toggle");
  const readingMeta = getNoteReadingMeta(noteBody);
  renderHighlightedText(bodyElement, bodyPreview.text, highlightTerms);
  expandButton.hidden = !bodyPreview.isTruncated;
  if (bodyPreview.isTruncated) {
    expandButton.addEventListener("click", () => {
      const isExpanded = expandButton.getAttribute("aria-expanded") === "true";
      expandButton.setAttribute("aria-expanded", String(!isExpanded));
      expandButton.textContent = isExpanded ? "Read more" : "Show less";
      bodyElement.classList.toggle("expanded", !isExpanded);
      renderHighlightedText(bodyElement, isExpanded ? bodyPreview.text : noteBody.replace(/\s+/g, " ").trim(), highlightTerms);
    });
  }
  node.querySelector("time").textContent = formatDate(note.createdAt);
  const readingMetaElement = node.querySelector(".note-reading-meta");
  readingMetaElement.textContent = readingMeta.label;
  readingMetaElement.setAttribute("aria-label", readingMeta.ariaLabel);
  const checklistMeta = getNoteChecklistMeta(noteBody);
  const checklistMetaElement = node.querySelector(".note-checklist-meta");
  checklistMetaElement.hidden = !checklistMeta.available;
  checklistMetaElement.textContent = checklistMeta.label;
  checklistMetaElement.setAttribute("aria-label", checklistMeta.ariaLabel);

  const image = normalizeNoteImage(note.image);
  const figure = node.querySelector(".note-image");
  if (image) {
    const img = figure.querySelector("img");
    img.src = image.src;
    img.alt = image.alt || image.prompt || note.title || "";
    figure.hidden = false;
    node.classList.add("has-image");
  }

  const archiveButton = node.querySelector(".archive-action");
  const trashButton = node.querySelector(".trash-action");
  const pinButton = node.querySelector(".pin-action");
  const editButton = node.querySelector(".edit-action");
  const shareButton = node.querySelector(".share-action");
  const duplicateButton = node.querySelector(".duplicate-action");
  const followUpRow = node.querySelector(".note-followups");
  const labelShortcutRow = node.querySelector(".note-label-shortcuts");
  const colorShortcutRow = node.querySelector(".note-color-shortcuts");

  pinButton.hidden = state.view !== "active";
  pinButton.setAttribute("aria-label", getNotePinLabel(note));
  pinButton.title = getNotePinLabel(note);
  followUpRow.hidden = state.view !== "active";
  labelShortcutRow.hidden = state.view !== "active";
  colorShortcutRow.hidden = state.view !== "active";
  followUpRow.replaceChildren(
    ...NOTE_FOLLOW_UP_SHORTCUTS.map((shortcut) => {
      const button = document.createElement("button");
      button.className = "note-followup";
      button.type = "button";
      button.textContent = shortcut.label;
      button.addEventListener("click", () => createFollowUpTask(note, shortcut.key));
      return button;
    })
  );
  labelShortcutRow.replaceChildren(
    ...getVisibleNoteLabelShortcuts(note).map((shortcut) => {
      const button = document.createElement("button");
      button.className = "note-label-shortcut";
      button.type = "button";
      button.textContent = shortcut.label;
      button.setAttribute("aria-label", `Move note to ${shortcut.label}`);
      button.addEventListener("click", () => {
        const label = getNoteLabelShortcutValue(shortcut.key);
        if (!label) return;
        updateNote(note.id, { label }, `${shortcut.label} label`);
      });
      return button;
    })
  );
  colorShortcutRow.replaceChildren(
    ...getVisibleNoteColorShortcuts(note).map((shortcut) => {
      const button = document.createElement("button");
      button.className = "note-color-shortcut";
      button.type = "button";
      button.dataset.color = shortcut.key;
      button.setAttribute("aria-label", `Change note color to ${shortcut.label}`);
      button.title = shortcut.label;
      button.addEventListener("click", () => {
        const color = getNoteColorShortcutValue(shortcut.key);
        if (!color) return;
        updateNote(note.id, { color }, `${shortcut.label} color`);
      });
      return button;
    })
  );
  const archiveAction = getArchiveRestoreAction({ view: state.view, type: "note" });
  const trashAction = getTrashAction({ view: state.view, type: "note" });
  archiveButton.setAttribute("aria-label", archiveAction.ariaLabel);
  archiveButton.title = archiveAction.title;
  archiveButton.classList.toggle("restore-action", archiveAction.action === "restore");
  if (archiveAction.buttonLabel) {
    archiveButton.textContent = archiveAction.buttonLabel;
  }
  trashButton.setAttribute("aria-label", trashAction.ariaLabel);
  trashButton.title = trashAction.title;

  pinButton.addEventListener("click", () => toggleNotePinWithUndo(note));
  editButton.addEventListener("click", () => startNoteEdit(note));
  shareButton.addEventListener("click", () => shareItem(buildNoteSharePayload(note), "Note copied"));
  duplicateButton.addEventListener("click", () => duplicateNoteCard(note));
  archiveButton.addEventListener("click", () => {
    updateNoteWithUndo(note, { status: archiveAction.status, pinned: false }, archiveAction.message);
  });
  trashButton.addEventListener("click", () => {
    if (state.view === "trash") {
      const snapshot = captureItemRestore(state.notes, note.id);
      state.notes = state.notes.filter((item) => item.id !== note.id);
      rememberDeleted(note.id);
      saveData();
      render();
      showUndoToast("Deleted forever", () => {
        state.notes = restoreItem(state.notes, snapshot);
        state.deletedIds = state.deletedIds.filter((deletedId) => deletedId !== note.id);
        saveData();
        render();
        showToast("Note restored");
      });
      return;
    }
    updateNoteWithUndo(note, { status: "trash", pinned: false }, "Moved to trash");
  });

  attachSwipe(node, note);
  return node;
}

function createFollowUpTask(note, shortcut) {
  const task = buildFollowUpTask(note, {
    shortcut,
    id: crypto.randomUUID(),
    now: new Date()
  });

  if (!task) {
    showToast("Could not create task");
    return;
  }

  state.tasks.unshift(task);
  saveData();
  render();
  showUndoToast(shortcut === "today" ? "Task added for today" : "Task added for tomorrow", () => {
    const result = removeFollowUpTask(state.tasks, task);
    if (!result.removed) {
      showToast("Task already changed");
      return;
    }
    state.tasks = result.tasks;
    rememberDeleted(task.id);
    saveData();
    render();
    showToast("Follow-up removed");
  });
}

function startNoteEdit(note) {
  state.editingItem = { type: "note", id: note.id };
  setComposerMode("note", { saveDraft: false });
  els.titleInput.value = note.title || "";
  els.bodyInput.value = note.body || "";
  els.labelInput.value = ["ideas", "work", "home", "personal"].includes(note.label) ? note.label : "ideas";
  setComposerColor(["sun", "mint", "sky", "rose", "ink"].includes(note.color) ? note.color : "sun");
  state.draftImage = normalizeNoteImage(note.image);
  renderDraftImage();
  updateComposerEditingState();
  clearSavedComposerDraft();
  scrollComposerIntoView();
  showToast("Editing note");
}

function normalizeNoteImage(image) {
  if (typeof image === "string") image = { src: image };
  if (!image?.src || !String(image.src).startsWith("data:image/")) return null;
  return {
    src: image.src,
    mime: image.mime || "image/png",
    name: image.name || "Image",
    alt: image.alt || image.prompt || "",
    prompt: image.prompt || "",
    generated: Boolean(image.generated),
    createdAt: image.createdAt || ""
  };
}

function renderTask(task) {
  const node = els.taskTemplate.content.firstElementChild.cloneNode(true);
  const highlightTerms = getSearchHighlightTerms(state.query);
  node.dataset.id = task.id;
  node.dataset.priority = task.priority;
  node.classList.toggle("completed", task.completed);
  node.classList.toggle("overdue", isOverdue(task));
  node.querySelector(".task-label").textContent = task.label;
  node.querySelector(".task-priority").textContent = task.priority;
  renderHighlightedText(node.querySelector("h3"), task.title, highlightTerms);
  const detailsPreview = buildTaskDetailPreview(task.details);
  const detailsElement = node.querySelector("p");
  const detailsToggle = node.querySelector(".task-detail-toggle");
  renderHighlightedText(detailsElement, detailsPreview.text, highlightTerms);
  detailsToggle.hidden = !detailsPreview.isTruncated;
  if (detailsPreview.isTruncated) {
    detailsToggle.addEventListener("click", () => {
      const isExpanded = detailsToggle.getAttribute("aria-expanded") === "true";
      detailsToggle.setAttribute("aria-expanded", String(!isExpanded));
      detailsToggle.textContent = isExpanded ? "Show details" : "Hide details";
      detailsElement.classList.toggle("expanded", !isExpanded);
      renderHighlightedText(detailsElement, isExpanded ? detailsPreview.text : detailsPreview.expandedText, highlightTerms);
    });
  }
  const dueBadge = getTaskDueBadge(task);
  const dueTime = node.querySelector("time");
  dueTime.textContent = dueBadge.label;
  dueTime.className = `task-due-badge ${dueBadge.tone}`;
  dueTime.setAttribute("aria-label", dueBadge.ariaLabel);
  if (dueBadge.dateTime) {
    dueTime.dateTime = dueBadge.dateTime;
  } else {
    dueTime.removeAttribute("datetime");
  }
  const checklistMeta = getTaskChecklistMeta(task.details);
  const checklistMetaElement = node.querySelector(".task-checklist-meta");
  checklistMetaElement.hidden = !checklistMeta.available;
  checklistMetaElement.textContent = checklistMeta.label;
  checklistMetaElement.setAttribute("aria-label", checklistMeta.ariaLabel);

  const checkButton = node.querySelector(".task-check");
  const archiveButton = node.querySelector(".archive-action");
  const trashButton = node.querySelector(".trash-action");
  const editButton = node.querySelector(".edit-action");
  const shareButton = node.querySelector(".share-action");
  const duplicateButton = node.querySelector(".duplicate-action");
  const dueShortcutRow = node.querySelector(".task-due-shortcuts");
  const priorityShortcutRow = node.querySelector(".task-priority-shortcuts");
  const labelShortcutRow = node.querySelector(".task-label-shortcuts");

  checkButton.hidden = state.view !== "tasks";
  dueShortcutRow.hidden = state.view !== "tasks" || task.completed;
  priorityShortcutRow.hidden = state.view !== "tasks" || task.completed;
  labelShortcutRow.hidden = state.view !== "tasks" || task.completed;
  dueShortcutRow.replaceChildren(
    ...getVisibleTaskDueShortcuts(task).map((shortcut) => {
      const button = document.createElement("button");
      button.className = "task-due-shortcut";
      button.type = "button";
      button.textContent = shortcut.label;
      button.addEventListener("click", () => {
        const dueAt = getTaskDueShortcutDate(shortcut.key);
        if (dueAt === null) return;
        updateTask(task.id, { dueAt }, dueAt ? `Due ${shortcut.label.toLowerCase()}` : "Due date cleared");
      });
      return button;
    })
  );
  priorityShortcutRow.replaceChildren(
    ...getVisibleTaskPriorityShortcuts(task).map((shortcut) => {
      const button = document.createElement("button");
      button.className = "task-priority-shortcut";
      button.type = "button";
      button.textContent = shortcut.label;
      button.addEventListener("click", () => {
        const priority = getTaskPriorityShortcutValue(shortcut.key);
        if (!priority) return;
        updateTask(task.id, { priority }, `${shortcut.label} priority`);
      });
      return button;
    })
  );
  labelShortcutRow.replaceChildren(
    ...getVisibleTaskLabelShortcuts(task).map((shortcut) => {
      const button = document.createElement("button");
      button.className = "task-label-shortcut";
      button.type = "button";
      button.textContent = shortcut.label;
      button.addEventListener("click", () => {
        const label = getTaskLabelShortcutValue(shortcut.key);
        if (!label) return;
        updateTask(task.id, { label }, `${shortcut.label} label`);
      });
      return button;
    })
  );
  const archiveAction = getArchiveRestoreAction({ view: state.view, type: "task" });
  const trashAction = getTrashAction({ view: state.view, type: "task" });
  archiveButton.setAttribute("aria-label", archiveAction.ariaLabel);
  archiveButton.title = archiveAction.title;
  archiveButton.classList.toggle("restore-action", archiveAction.action === "restore");
  if (archiveAction.buttonLabel) {
    archiveButton.textContent = archiveAction.buttonLabel;
  }
  trashButton.setAttribute("aria-label", trashAction.ariaLabel);
  trashButton.title = trashAction.title;

  checkButton.addEventListener("click", () => toggleTaskCompletionWithUndo(task));
  editButton.addEventListener("click", () => startTaskEdit(task));
  shareButton.addEventListener("click", () => shareItem(buildTaskSharePayload(task), "Task copied"));
  duplicateButton.addEventListener("click", () => duplicateTaskCard(task));
  archiveButton.addEventListener("click", () => {
    updateTaskWithUndo(task, { status: archiveAction.status }, archiveAction.message);
  });
  trashButton.addEventListener("click", () => {
    if (state.view === "trash") {
      const snapshot = captureItemRestore(state.tasks, task.id);
      state.tasks = state.tasks.filter((item) => item.id !== task.id);
      rememberDeleted(task.id);
      saveData();
      render();
      showUndoToast("Deleted forever", () => {
        state.tasks = restoreItem(state.tasks, snapshot);
        state.deletedIds = state.deletedIds.filter((deletedId) => deletedId !== task.id);
        saveData();
        render();
        showToast("Task restored");
      });
      return;
    }
    updateTaskWithUndo(task, { status: "trash" }, "Moved to trash");
  });
  attachTaskSwipe(node, task);
  return node;
}

function duplicateNoteCard(note) {
  const copy = duplicateNote(note);
  if (!copy) {
    showToast("Could not copy note");
    return;
  }

  state.notes.unshift(copy);
  state.view = "active";
  syncNav();
  saveData();
  render();
  showUndoToast("Note duplicated", () => {
    const result = removeCopiedItem(state.notes, copy.id);
    if (!result.removed) {
      showToast("Copy already changed");
      return;
    }
    state.notes = result.items;
    rememberDeleted(copy.id);
    saveData();
    render();
    showToast("Copy removed");
  });
}

function duplicateTaskCard(task) {
  const copy = duplicateTask(task);
  if (!copy) {
    showToast("Could not copy task");
    return;
  }

  state.tasks.unshift(copy);
  state.view = "tasks";
  state.taskWindow = "all";
  state.taskPriority = "all";
  setComposerMode("task");
  syncNav();
  saveViewPreferences();
  saveData();
  render();
  showUndoToast("Task duplicated", () => {
    const result = removeCopiedItem(state.tasks, copy.id);
    if (!result.removed) {
      showToast("Copy already changed");
      return;
    }
    state.tasks = result.items;
    rememberDeleted(copy.id);
    saveData();
    render();
    showToast("Copy removed");
  });
}

function startTaskEdit(task) {
  state.editingItem = { type: "task", id: task.id };
  setComposerMode("task", { saveDraft: false });
  els.titleInput.value = task.title || "";
  els.bodyInput.value = task.details || "";
  els.labelInput.value = ["ideas", "work", "home", "personal"].includes(task.label) ? task.label : "ideas";
  els.priorityInput.value = ["low", "normal", "high"].includes(task.priority) ? task.priority : "normal";
  els.dueInput.value = task.dueAt || "";
  state.draftImage = null;
  renderDraftImage();
  renderTaskComposerPresets();
  updateComposerEditingState();
  clearSavedComposerDraft();
  scrollComposerIntoView();
  showToast("Editing task");
}

function renderHighlightedText(element, text, terms) {
  const fragments = splitHighlightedText(text, terms);
  element.replaceChildren(
    ...fragments.map((fragment) => {
      if (!fragment.highlighted) return document.createTextNode(fragment.text);
      const mark = document.createElement("mark");
      mark.className = "search-highlight";
      mark.textContent = fragment.text;
      return mark;
    })
  );
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
    const action = getNoteSwipeAction({ deltaX: currentX, view: state.view, pinned: note.pinned });
    if (action === "pin" || action === "unpin") {
      toggleNotePinWithUndo(note);
    } else if (action === "archive") {
      updateNoteWithUndo(note, { status: "archive", pinned: false }, "Archived");
    } else if (action === "restore") {
      updateNoteWithUndo(note, { status: "active", pinned: false }, "Restored");
    } else if (action === "trash") {
      updateNoteWithUndo(note, { status: "trash", pinned: false }, "Moved to trash");
    } else {
      node.style.setProperty("--drag-x", "0px");
    }
    startX = 0;
    currentX = 0;
  });
}

function attachTaskSwipe(node, task) {
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
    const action = getTaskSwipeAction({ deltaX: currentX, view: state.view, completed: task.completed });
    if (action === "complete" || action === "reopen") {
      toggleTaskCompletionWithUndo(task);
    } else if (action === "archive") {
      updateTaskWithUndo(task, { status: "archive" }, "Archived");
    } else if (action === "restore") {
      updateTaskWithUndo(task, { status: "active" }, "Restored");
    } else {
      node.style.setProperty("--drag-x", "0px");
    }
    startX = 0;
    currentX = 0;
  });
}

function toggleNotePinWithUndo(note) {
  const snapshot = captureItemRestore(state.notes, note.id);
  const result = toggleNotePin(state.notes, note.id);

  if (!result.note) {
    showToast("Note not found");
    return;
  }

  state.notes = result.notes;
  saveData();
  render();
  showUndoToast(result.pinned ? "Pinned" : "Unpinned", () => {
    state.notes = restoreItem(state.notes, snapshot);
    saveData();
    render();
    showToast(result.pinned ? "Note unpinned" : "Note pinned");
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

function updateNoteWithUndo(note, patch, message) {
  const snapshot = captureItemRestore(state.notes, note.id);
  state.notes = state.notes.map((item) => (item.id === note.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  saveData();
  render();
  showUndoToast(message, () => {
    state.notes = restoreItem(state.notes, snapshot);
    saveData();
    render();
    showToast("Note restored");
  });
}

function updateTaskWithUndo(task, patch, message) {
  const snapshot = captureItemRestore(state.tasks, task.id);
  state.tasks = state.tasks.map((item) => (item.id === task.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  saveData();
  render();
  showUndoToast(message, () => {
    state.tasks = restoreItem(state.tasks, snapshot);
    saveData();
    render();
    showToast("Task restored");
  });
}

function toggleTaskCompletionWithUndo(task) {
  const snapshot = captureItemRestore(state.tasks, task.id);
  const result = toggleTaskCompletion(state.tasks, task.id);

  if (!result.task) {
    showToast("Task not found");
    return;
  }

  state.tasks = result.tasks;
  saveData();
  render();
  showUndoToast(result.completed ? "Completed" : "Reopened", () => {
    state.tasks = restoreItem(state.tasks, snapshot);
    saveData();
    render();
    showToast(result.completed ? "Task reopened" : "Task completed");
  });
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
    renderTaskComposerPresets();
  } else {
    setComposerColor(["sun", "mint", "sky", "rose", "ink"].includes(shape.color) ? shape.color : state.color);
  }

  saveComposerDraft();
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

async function handleImageInput(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Choose an image file");
    return;
  }
  if (file.size > 6 * 1024 * 1024) {
    showToast("Image must be under 6 MB");
    return;
  }

  setImageLoading(true, "Preparing...");
  try {
    const image = await fileToNoteImage(file);
    setDraftImage(image);
    setComposerMode("note");
    showToast("Image attached");
  } catch (error) {
    showToast(error.message || "Image could not be added");
  } finally {
    setImageLoading(false);
  }
}

async function generateNoteImage() {
  if (state.composerMode === "task") setComposerMode("note");

  const title = els.titleInput.value.trim();
  const body = els.bodyInput.value.trim();
  if (!title && !body) {
    showToast("Describe the image first");
    els.bodyInput.focus();
    return;
  }

  setImageLoading(true, "Generating...");
  try {
    const response = await fetch("/api/image", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        body,
        label: els.labelInput.value,
        prompt: body || title
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Image generation failed");
    setDraftImage(data.image);
    showToast("Image ready");
  } catch (error) {
    setDraftImage(buildLocalNoteImage({ title, body, label: els.labelInput.value, prompt: body || title }));
    showToast("Local image ready");
  } finally {
    setImageLoading(false);
  }
}

function setDraftImage(image) {
  state.draftImage = normalizeNoteImage(image);
  renderDraftImage();
  saveComposerDraft();
}

function clearDraftImage() {
  state.draftImage = null;
  renderDraftImage();
  saveComposerDraft();
}

function renderDraftImage() {
  const image = state.draftImage;
  els.imagePreview.hidden = !image;
  if (!image) {
    els.imagePreview.querySelector("img").removeAttribute("src");
    els.imagePreviewTitle.textContent = "";
    els.imagePreviewMeta.textContent = "";
    return;
  }

  els.imagePreview.querySelector("img").src = image.src;
  els.imagePreviewTitle.textContent = image.generated ? "Generated image" : image.name || "Attached image";
  els.imagePreviewMeta.textContent = image.generated ? "Ready to save" : formatBytes(dataUrlBytes(image.src));
}

async function fileToNoteImage(file) {
  const src = await resizeImageFile(file, 1280, 0.78);
  return {
    src,
    mime: src.slice(5, src.indexOf(";")) || file.type,
    name: file.name || "Attached image",
    alt: els.titleInput.value.trim() || file.name || "Attached image",
    generated: false,
    createdAt: new Date().toISOString()
  };
}

function resizeImageFile(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", () => reject(new Error("Image could not be read")));
    reader.addEventListener("load", () => {
      const img = new Image();
      img.addEventListener("error", () => reject(new Error("Image could not be loaded")));
      img.addEventListener("load", () => {
        const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", quality));
      });
      img.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (!bytes) return "Ready to save";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function setImageLoading(loading, label = "Image") {
  els.attachImageButton.disabled = loading;
  els.generateImageButton.disabled = loading;
  els.generateImageButton.textContent = loading ? label : "Generate";
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

function setComposerMode(mode, options = {}) {
  state.composerMode = mode;
  els.taskFields.hidden = mode !== "task";
  els.colorDots.hidden = mode === "task";
  els.attachImageButton.hidden = mode === "task";
  els.generateImageButton.hidden = mode === "task";
  els.imagePreview.hidden = mode === "task" || !state.draftImage;
  els.bodyInput.placeholder = mode === "task" ? "Task details or paste a list..." : "Take a note...";
  updateComposerEditingState();
  document.querySelectorAll(".mode-button").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderTaskComposerPresets();
  if (options.saveDraft !== false) saveComposerDraft();
}

function updateComposerEditingState() {
  const editing = Boolean(state.editingItem);
  els.composer.classList.toggle("editing", editing);
  els.editCancelButton.hidden = !editing;
  if (editing) {
    els.addButtonLabel.textContent = state.editingItem.type === "task" ? "Save task" : "Save note";
    return;
  }
  els.addButtonLabel.textContent = state.composerMode === "task" ? "Add task" : "Add";
}

function cancelEditDraft(message = "Edit canceled") {
  state.editingItem = null;
  clearComposer();
  render();
  showToast(message);
}

function scrollComposerIntoView() {
  els.composer.scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(() => els.titleInput.focus());
}

function saveViewPreferences() {
  localStorage.setItem(VIEW_PREFERENCES_KEY, JSON.stringify(buildViewPreferences(state)));
}

function applyViewPreferences() {
  document.body.classList.toggle("night", state.theme === "night");
  syncNav();
  setComposerMode(state.composerMode, { saveDraft: false });
}

function getComposerDraft() {
  return buildComposerDraft({
    mode: state.composerMode,
    title: els.titleInput.value,
    body: els.bodyInput.value,
    label: els.labelInput.value,
    color: state.color,
    dueAt: els.dueInput.value,
    priority: els.priorityInput.value,
    image: state.draftImage
  });
}

function saveComposerDraft() {
  if (!els.titleInput) return;
  if (state.editingItem) return;
  const draft = getComposerDraft();
  if (!hasComposerDraftContent(draft)) {
    clearSavedComposerDraft();
    return;
  }
  localStorage.setItem(COMPOSER_DRAFT_KEY, JSON.stringify(draft));
}

function clearSavedComposerDraft() {
  localStorage.removeItem(COMPOSER_DRAFT_KEY);
  hideComposerDraftResume();
}

function showComposerDraftResume(draft) {
  const resume = getComposerDraftResume(draft);
  if (!resume.available) {
    hideComposerDraftResume();
    return;
  }
  els.composerDraftKicker.textContent = resume.kicker;
  els.composerDraftTitle.textContent = resume.title;
  els.composerDraftSummary.textContent = resume.summary;
  els.composerDraftDiscard.textContent = resume.action;
  els.composerDraftResume.hidden = false;
}

function hideComposerDraftResume() {
  els.composerDraftResume.hidden = true;
}

function discardComposerDraft() {
  clearComposer();
  showToast("Draft discarded");
}

function insertChecklistInComposer() {
  const { value, selectionStart, selectionEnd } = insertChecklistMarker(
    els.bodyInput.value,
    els.bodyInput.selectionStart,
    els.bodyInput.selectionEnd
  );
  els.bodyInput.value = value;
  els.bodyInput.focus();
  els.bodyInput.setSelectionRange(selectionStart, selectionEnd);
  saveComposerDraft();
  showToast("Checklist line added");
}

function restoreComposerDraft() {
  const saved = localStorage.getItem(COMPOSER_DRAFT_KEY);
  if (!saved) return;

  try {
    const draft = normalizeComposerDraft(JSON.parse(saved));
    if (!hasComposerDraftContent(draft)) {
      clearSavedComposerDraft();
      return;
    }

    setComposerMode(draft.mode);
    els.titleInput.value = draft.title;
    els.bodyInput.value = draft.body;
    els.labelInput.value = draft.label;
    els.dueInput.value = draft.dueAt;
    els.priorityInput.value = draft.priority;
    setComposerColor(draft.color);
    state.draftImage = draft.image;
    renderDraftImage();
    renderTaskComposerPresets();
    showComposerDraftResume(draft);
    saveComposerDraft();
    showToast("Draft restored");
  } catch {
    clearSavedComposerDraft();
  }
}

function renderTaskComposerPresets() {
  const activeDue = els.dueInput.value;
  const activePriority = normalizeTaskComposerPriority(els.priorityInput.value);
  els.dueInputHint.textContent = getTaskComposerDueHint(activeDue);
  els.taskComposerPresets.replaceChildren(
    ...TASK_COMPOSER_DUE_PRESETS.map((preset) => {
      const button = document.createElement("button");
      const dueAt = getTaskComposerDueDate(preset.key);
      const active = dueAt !== null && dueAt === activeDue;
      button.className = "task-composer-preset";
      button.type = "button";
      button.textContent = preset.label;
      button.dataset.preset = preset.key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
      return button;
    })
  );
  els.taskComposerPriorities.replaceChildren(
    ...TASK_COMPOSER_PRIORITY_PRESETS.map((preset) => {
      const button = document.createElement("button");
      const active = preset.key === activePriority;
      button.className = "task-composer-preset task-composer-priority-preset";
      button.type = "button";
      button.textContent = preset.label;
      button.dataset.priority = preset.key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", active ? getTaskComposerPriorityLabel(preset.key) : `Set ${preset.label} priority`);
      return button;
    })
  );
}

function applyTaskComposerDuePreset(key) {
  const dueAt = getTaskComposerDueDate(key);
  if (dueAt === null) return;
  els.dueInput.value = dueAt;
  renderTaskComposerPresets();
  saveComposerDraft();
}

function applyTaskComposerPriorityPreset(key) {
  els.priorityInput.value = normalizeTaskComposerPriority(key);
  renderTaskComposerPresets();
  saveComposerDraft();
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

function showToast(message, action) {
  els.toast.replaceChildren(document.createTextNode(message));
  if (action?.label && typeof action.onClick === "function") {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      window.clearTimeout(showToast.timer);
      els.toast.classList.remove("show");
      action.onClick();
    });
    els.toast.append(button);
  }
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1700);
}

function showUndoToast(message, onUndo) {
  showToast(message, { label: "Undo", onClick: onUndo });
}

async function shareItem(payload, fallbackMessage) {
  if (!payload?.text) {
    showToast("Nothing to share");
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share(payload);
      showToast("Shared");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  try {
    await copyText(payload.text);
    showToast(fallbackMessage);
  } catch {
    showToast("Share unavailable");
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("copy failed");
  } finally {
    field.remove();
  }
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
    saveViewPreferences();
    syncNav();
    render();
  });
});

document.querySelectorAll(".chip").forEach((button) => {
  button.addEventListener("click", () => {
    state.label = button.dataset.label;
    saveViewPreferences();
    document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip === button));
    render();
  });
});

document.querySelectorAll(".note-color-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.noteColor = normalizeNoteColorFilter(button.dataset.colorFilter);
    saveViewPreferences();
    render();
  });
});

document.querySelectorAll(".task-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.taskWindow = button.dataset.window;
    saveViewPreferences();
    render();
  });
});

document.querySelectorAll(".task-priority-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.taskPriority = normalizeTaskPriorityFilter(button.dataset.priorityFilter);
    saveViewPreferences();
    render();
  });
});

document.querySelectorAll(".dot").forEach((button) => {
  button.addEventListener("click", () => {
    state.color = button.dataset.color;
    document.querySelectorAll(".dot").forEach((dot) => dot.classList.toggle("active", dot === button));
    saveComposerDraft();
  });
});

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.editingItem && button.dataset.mode !== state.editingItem.type) {
      cancelEditDraft();
    }
    setComposerMode(button.dataset.mode);
  });
});

els.addButton.addEventListener("click", addItem);
els.editCancelButton.addEventListener("click", () => cancelEditDraft());
els.attachImageButton.addEventListener("click", () => els.imageInput.click());
els.generateImageButton.addEventListener("click", generateNoteImage);
els.imageInput.addEventListener("change", handleImageInput);
els.removeImageButton.addEventListener("click", () => {
  clearDraftImage();
  showToast("Image removed");
});
els.checklistButton.addEventListener("click", insertChecklistInComposer);
els.shapeButton.addEventListener("click", shapeDraft);
els.sparkButton.addEventListener("click", sparkIdeas);
els.focusButton.addEventListener("click", briefFocus);
els.sweepButton.addEventListener("click", sweepItems);
els.askForm.addEventListener("submit", askKeeply);
els.filterClearButton.addEventListener("click", clearActiveFilters);
els.emptyStateAction.addEventListener("click", clearActiveFilters);
els.emptyStateCapture.addEventListener("click", captureSearchDraft);
els.searchClearButton.addEventListener("click", clearSearchQuery);
els.noteSpotlightButton.addEventListener("click", focusNoteSpotlight);
els.cleanupSpotlightButton.addEventListener("click", focusCleanupSpotlight);
els.nextTaskButton.addEventListener("click", focusNextTaskWindow);
els.nextTaskCompleteButton.addEventListener("click", completeNextTask);
els.archiveCompletedButton.addEventListener("click", archiveCompletedTasksWithUndo);
els.snoozeOverdueButton.addEventListener("click", snoozeOverdueTasksWithUndo);
els.taskComposerPresets.addEventListener("click", (event) => {
  const button = event.target.closest(".task-composer-preset");
  if (!button) return;
  applyTaskComposerDuePreset(button.dataset.preset);
});
els.taskComposerPriorities.addEventListener("click", (event) => {
  const button = event.target.closest(".task-composer-priority-preset");
  if (!button) return;
  applyTaskComposerPriorityPreset(button.dataset.priority);
});
els.composerDraftDiscard.addEventListener("click", discardComposerDraft);
els.dueInput.addEventListener("input", renderTaskComposerPresets);
els.priorityInput.addEventListener("change", renderTaskComposerPresets);
els.titleInput.addEventListener("input", saveComposerDraft);
els.bodyInput.addEventListener("input", saveComposerDraft);
els.labelInput.addEventListener("change", saveComposerDraft);
els.dueInput.addEventListener("input", saveComposerDraft);
els.priorityInput.addEventListener("change", saveComposerDraft);
els.quickAddButton.addEventListener("click", () => {
  const target = getQuickAddTarget(state.view);
  if (state.editingItem) cancelEditDraft();
  setComposerMode(target.mode);
  renderQuickAddButton();
  els.titleInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast(target.toast);
});
els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});
els.layoutButton.addEventListener("click", () => {
  state.compact = !state.compact;
  saveViewPreferences();
  render();
  showToast(state.compact ? "Compact list" : "Card grid");
});
els.themeButton.addEventListener("click", () => {
  state.theme = state.theme === "night" ? "morning" : "night";
  document.body.classList.toggle("night", state.theme === "night");
  saveViewPreferences();
  showToast(state.theme === "night" ? "Evening paper" : "Morning paper");
});
els.whatsNewDismiss.addEventListener("click", dismissWhatsNew);
els.whatsNewBackdrop.addEventListener("click", (event) => {
  if (event.target === els.whatsNewBackdrop) dismissWhatsNew();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.whatsNewBackdrop.hidden) dismissWhatsNew();
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") addItem();
});

applyViewPreferences();
setSyncStatus(state.syncStatus);
render();
restoreComposerDraft();
loadRemoteData();
initWhatsNew();
