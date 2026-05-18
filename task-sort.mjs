const PRIORITY_RANK = {
  high: 0,
  normal: 1,
  low: 2
};

export function getTaskPriorityRank(priority) {
  return PRIORITY_RANK[String(priority || "").toLowerCase()] ?? PRIORITY_RANK.normal;
}

export function compareTasksForDisplay(a = {}, b = {}) {
  if (Boolean(a.completed) !== Boolean(b.completed)) {
    return Number(Boolean(a.completed)) - Number(Boolean(b.completed));
  }

  const aDue = normalizeDueDate(a.dueAt);
  const bDue = normalizeDueDate(b.dueAt);
  if (aDue && bDue && aDue !== bDue) return aDue.localeCompare(bDue);
  if (aDue !== bDue) return aDue ? -1 : 1;

  const priorityDelta = getTaskPriorityRank(a.priority) - getTaskPriorityRank(b.priority);
  if (priorityDelta !== 0) return priorityDelta;

  return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
}

function normalizeDueDate(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}
