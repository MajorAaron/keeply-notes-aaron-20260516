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
    chips.push({ key: "label", label: LABELS[label] || titleCase(label) });
  }

  if (filters.view === "tasks" && taskWindow !== "all") {
    chips.push({ key: "taskWindow", label: TASK_WINDOWS[taskWindow] || titleCase(taskWindow) });
  }

  if (filters.view === "tasks" && taskPriority !== "all") {
    chips.push({ key: "taskPriority", label: TASK_PRIORITIES[taskPriority] || titleCase(taskPriority) });
  }

  if (filters.view === "tasks" && taskCompletion !== "all") {
    chips.push({ key: "taskCompletion", label: TASK_COMPLETIONS[taskCompletion] || titleCase(taskCompletion) });
  }

  if (filters.view === "active" && noteColor !== "all") {
    chips.push({ key: "noteColor", label: NOTE_COLORS[noteColor] || titleCase(noteColor) });
  }

  if (filters.view === "active" && notePin !== "all") {
    chips.push({ key: "notePin", label: NOTE_PINS[notePin] || titleCase(notePin) });
  }

  if (query) {
    chips.push({ key: "query", label: `Search: ${truncateQuery(query)}` });
  }

  return {
    active: chips.length > 0,
    chips
  };
}

export function shouldShowFilterSummary(filters = {}) {
  return getActiveFilterSummary(filters).active;
}

function truncateQuery(query) {
  return query.length > 24 ? `${query.slice(0, 21)}...` : query;
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
