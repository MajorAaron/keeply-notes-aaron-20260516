const LABELS = {
  all: "All labels",
  work: "Work",
  home: "Home",
  ideas: "Ideas",
  personal: "Personal"
};

const TASK_WINDOWS = {
  all: "All dates",
  overdue: "Overdue",
  today: "Today",
  tomorrow: "Tomorrow",
  week: "This week",
  upcoming: "Upcoming",
  unscheduled: "No date"
};

const TASK_PRIORITIES = {
  all: "All priorities",
  high: "High priority",
  normal: "Normal priority",
  low: "Low priority"
};

const TASK_COMPLETIONS = {
  all: "All status",
  open: "Open tasks",
  done: "Done tasks"
};

const NOTE_COLORS = {
  all: "All colors",
  sun: "Sun notes",
  mint: "Mint notes",
  sky: "Sky notes",
  rose: "Rose notes",
  ink: "Ink notes"
};

const NOTE_PINS = {
  all: "All notes",
  pinned: "Pinned notes",
  unpinned: "Other notes"
};

export function getActiveFilterSummary(filters = {}) {
  const chips = [];
  const label = filters.label || "all";
  const taskWindow = filters.taskWindow || "all";
  const taskPriority = filters.taskPriority || "all";
  const taskCompletion = filters.taskCompletion || "all";
  const noteColor = filters.noteColor || "all";
  const notePin = filters.notePin || "all";
  const query = String(filters.query || "").trim();

  if (label !== "all") {
    chips.push(buildFilterChip("label", LABELS[label] || titleCase(label)));
  }

  if (filters.view === "tasks" && taskWindow !== "all") {
    chips.push(buildFilterChip("taskWindow", TASK_WINDOWS[taskWindow] || titleCase(taskWindow)));
  }

  if (filters.view === "tasks" && taskPriority !== "all") {
    chips.push(buildFilterChip("taskPriority", TASK_PRIORITIES[taskPriority] || titleCase(taskPriority)));
  }

  if (filters.view === "tasks" && taskCompletion !== "all") {
    chips.push(buildFilterChip("taskCompletion", TASK_COMPLETIONS[taskCompletion] || titleCase(taskCompletion)));
  }

  if (filters.view === "active" && noteColor !== "all") {
    chips.push(buildFilterChip("noteColor", NOTE_COLORS[noteColor] || titleCase(noteColor)));
  }

  if (filters.view === "active" && notePin !== "all") {
    chips.push(buildFilterChip("notePin", NOTE_PINS[notePin] || titleCase(notePin)));
  }

  if (query) {
    chips.push(buildFilterChip("query", `Search: ${truncateQuery(query)}`));
  }

  return {
    active: chips.length > 0,
    chips
  };
}

export function shouldShowFilterSummary(filters = {}) {
  return getActiveFilterSummary(filters).active;
}

export function getFilterRemovalPatch(key) {
  const resetKey = String(key || "");
  const resetValues = {
    label: "all",
    taskWindow: "all",
    taskPriority: "all",
    taskCompletion: "all",
    noteColor: "all",
    notePin: "all",
    query: ""
  };

  if (!Object.hasOwn(resetValues, resetKey)) return null;
  return { key: resetKey, value: resetValues[resetKey] };
}

function buildFilterChip(key, label) {
  return {
    key,
    label,
    removeLabel: `Remove ${label} filter`,
    title: `Remove ${label}`
  };
}

function truncateQuery(query) {
  return query.length > 24 ? `${query.slice(0, 21)}...` : query;
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
