const PRIORITY_RANK = {
  high: 0,
  normal: 1,
  low: 2
};

const WINDOW_LABELS = {
  overdue: "Overdue",
  today: "Today",
  upcoming: "Upcoming",
  unscheduled: "No date"
};

export function getNextTaskHighlight(tasks = [], options = {}) {
  const today = toDateInput(options.now || new Date());
  const candidates = tasks
    .filter((task) => task?.status === "active" && !task.completed)
    .map((task) => ({ task, window: getTaskWindow(task, today) }))
    .sort(compareCandidates);

  if (candidates.length === 0) {
    return {
      available: false,
      title: "No open tasks",
      kicker: "Next up",
      summary: "All active tasks are complete.",
      buttonLabel: "Review tasks",
      completeLabel: "Mark done",
      canComplete: false,
      window: "all",
      tone: "quiet",
      ariaLabel: "No open tasks",
      completeAriaLabel: "No next task to complete"
    };
  }

  const candidate = candidates[0];
  const task = candidate.task;
  const title = normalizeText(task.title) || "Untitled task";
  const priority = normalizePriority(task.priority);
  const windowLabel = WINDOW_LABELS[candidate.window] || "Next";
  const priorityLabel = titleCase(priority);
  const duePhrase = getDuePhrase(candidate.window, task.dueAt);

  return {
    available: true,
    id: task.id || "",
    title,
    kicker: `${windowLabel} · ${priorityLabel}`,
    summary: duePhrase,
    buttonLabel: candidate.window === "overdue" ? "Show overdue" : candidate.window === "today" ? "Show today" : "Show task",
    completeLabel: "Mark done",
    canComplete: true,
    window: candidate.window,
    tone: candidate.window,
    ariaLabel: `Next task: ${title}. ${priorityLabel} priority. ${duePhrase}`,
    completeAriaLabel: `Mark next task done: ${title}`
  };
}

function compareCandidates(a, b) {
  const windowDelta = getWindowRank(a.window) - getWindowRank(b.window);
  if (windowDelta !== 0) return windowDelta;

  const priorityDelta = getPriorityRank(a.task.priority) - getPriorityRank(b.task.priority);
  if (priorityDelta !== 0) return priorityDelta;

  const aDue = normalizeText(a.task.dueAt);
  const bDue = normalizeText(b.task.dueAt);
  if (aDue && bDue && aDue !== bDue) return aDue.localeCompare(bDue);
  if (aDue !== bDue) return aDue ? -1 : 1;

  return getTimestamp(b.task.updatedAt || b.task.createdAt) - getTimestamp(a.task.updatedAt || a.task.createdAt);
}

function getTaskWindow(task, today) {
  const dueAt = normalizeText(task.dueAt);
  if (!dueAt) return "unscheduled";
  if (dueAt < today) return "overdue";
  if (dueAt === today) return "today";
  return "upcoming";
}

function getWindowRank(window) {
  return {
    overdue: 0,
    today: 1,
    upcoming: 2,
    unscheduled: 3
  }[window] ?? 4;
}

function getPriorityRank(priority) {
  return PRIORITY_RANK[normalizePriority(priority)] ?? PRIORITY_RANK.normal;
}

function normalizePriority(priority) {
  return ["high", "normal", "low"].includes(String(priority || "").toLowerCase()) ? String(priority).toLowerCase() : "normal";
}

function getDuePhrase(window, dueAt) {
  if (window === "overdue") return `Due ${formatDate(dueAt)} and waiting for attention.`;
  if (window === "today") return "Due today — a good next move.";
  if (window === "upcoming") return `Due ${formatDate(dueAt)}.`;
  return "No due date yet — ready when you are.";
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  if (!Number.isFinite(date.getTime())) return "soon";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function toDateInput(date) {
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function titleCase(value) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function getTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}
