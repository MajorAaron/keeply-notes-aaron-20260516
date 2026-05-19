const NOTE_VIEWS = new Set(["active", "archive", "trash"]);
const TASK_VIEWS = new Set(["tasks", "archive", "trash"]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasRecoverableEmptyStateFilters({ view = "active", label = "all", taskWindow = "all", taskPriority = "all", taskCompletion = "all", noteColor = "all", query = "" } = {}) {
  if (label !== "all" || hasText(query)) return true;
  if (view === "active" && noteColor !== "all") return true;
  if (view === "tasks" && (taskWindow !== "all" || taskPriority !== "all" || taskCompletion !== "all")) return true;
  return false;
}

export function getEmptyStateCopy(filters = {}) {
  const view = filters.view || "active";
  const recoverable = hasRecoverableEmptyStateFilters(filters);

  if (recoverable) {
    const noun = view === "tasks" ? "tasks" : view === "archive" || view === "trash" ? "cards" : "notes";
    return {
      title: `No matching ${noun}`,
      message: "Clear filters to get back to everything in this view.",
      action: "Clear filters"
    };
  }

  if (view === "tasks") {
    return {
      title: "No tasks here",
      message: "Add a task with a due date, priority, and label.",
      action: ""
    };
  }

  if (view === "archive") {
    return {
      title: "Archive is empty",
      message: "Archived notes and tasks will collect here when you need them later.",
      action: ""
    };
  }

  if (view === "trash") {
    return {
      title: "Trash is empty",
      message: "Deleted notes and tasks will wait here until you remove them forever.",
      action: ""
    };
  }

  if (!NOTE_VIEWS.has(view) && !TASK_VIEWS.has(view)) {
    return {
      title: "Nothing here yet",
      message: "Create something new or switch views to keep moving.",
      action: ""
    };
  }

  return {
    title: "No notes here",
    message: "Create one, change filters, or restore something from archive.",
    action: ""
  };
}
