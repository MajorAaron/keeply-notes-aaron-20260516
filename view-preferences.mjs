const DEFAULT_PREFERENCES = {
  view: "active",
  label: "all",
  taskWindow: "all",
  taskPriority: "all",
  compact: false,
  theme: "morning"
};

const VALID_VIEWS = new Set(["active", "tasks", "archive", "trash"]);
const VALID_LABELS = new Set(["all", "work", "home", "ideas", "personal"]);
const VALID_TASK_WINDOWS = new Set(["all", "overdue", "today", "upcoming", "unscheduled"]);
const VALID_TASK_PRIORITIES = new Set(["all", "high", "normal", "low"]);
const VALID_THEMES = new Set(["morning", "night"]);

export function normalizeViewPreferences(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    view: VALID_VIEWS.has(source.view) ? source.view : DEFAULT_PREFERENCES.view,
    label: VALID_LABELS.has(source.label) ? source.label : DEFAULT_PREFERENCES.label,
    taskWindow: VALID_TASK_WINDOWS.has(source.taskWindow) ? source.taskWindow : DEFAULT_PREFERENCES.taskWindow,
    taskPriority: VALID_TASK_PRIORITIES.has(source.taskPriority) ? source.taskPriority : DEFAULT_PREFERENCES.taskPriority,
    compact: source.compact === true,
    theme: VALID_THEMES.has(source.theme) ? source.theme : DEFAULT_PREFERENCES.theme
  };
}

export function parseViewPreferences(raw) {
  if (!raw) return { ...DEFAULT_PREFERENCES };
  try {
    return normalizeViewPreferences(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function buildViewPreferences(state) {
  return normalizeViewPreferences({
    view: state?.view,
    label: state?.label,
    taskWindow: state?.taskWindow,
    taskPriority: state?.taskPriority,
    compact: state?.compact,
    theme: state?.theme
  });
}
