export const STATS_SHORTCUT_SLOTS = ["total", "middle", "right"];

export function getStatsShortcut({ view, slot, counts = {} } = {}) {
  if (!STATS_SHORTCUT_SLOTS.includes(slot)) return buildDisabledShortcut("Summary only");

  if (view === "tasks") return getTaskStatsShortcut(slot, counts);
  if (view === "active") return getNoteStatsShortcut(slot, counts);

  return buildDisabledShortcut("Summary only");
}

function getTaskStatsShortcut(slot, counts) {
  if (slot === "total") {
    return {
      enabled: true,
      label: "Show all tasks",
      toast: "Showing all tasks",
      filters: buildTaskFilters()
    };
  }

  if (slot === "middle") {
    return {
      enabled: true,
      label: "Show open tasks",
      toast: "Showing open tasks",
      filters: buildTaskFilters({ taskCompletion: "open" })
    };
  }

  const dueToday = Number(counts.dueToday || 0);
  const dueTomorrow = Number(counts.dueTomorrow || 0);
  const taskWindow = dueToday > 0 ? "today" : dueTomorrow > 0 ? "tomorrow" : "all";
  return {
    enabled: true,
    label: dueToday > 0 ? "Show tasks due today" : dueTomorrow > 0 ? "Show tasks due tomorrow" : "Show open tasks",
    toast: dueToday > 0 ? "Showing today tasks" : dueTomorrow > 0 ? "Showing tomorrow tasks" : "Showing open tasks",
    filters: buildTaskFilters({ taskWindow, taskCompletion: "open" })
  };
}

function getNoteStatsShortcut(slot) {
  if (slot === "middle") {
    return {
      enabled: true,
      label: "Show pinned notes",
      toast: "Showing pinned notes",
      filters: buildNoteFilters({ notePin: "pinned" })
    };
  }

  if (slot === "total") {
    return {
      enabled: true,
      label: "Show all active notes",
      toast: "Showing all notes",
      filters: buildNoteFilters()
    };
  }

  return buildDisabledShortcut("Today count is a summary");
}

function buildTaskFilters(overrides = {}) {
  return {
    view: "tasks",
    label: "all",
    query: "",
    taskWindow: "all",
    taskPriority: "all",
    taskCompletion: "all",
    ...overrides
  };
}

function buildNoteFilters(overrides = {}) {
  return {
    view: "active",
    label: "all",
    query: "",
    noteColor: "all",
    notePin: "all",
    ...overrides
  };
}

function buildDisabledShortcut(label) {
  return {
    enabled: false,
    label,
    toast: "",
    filters: null
  };
}
