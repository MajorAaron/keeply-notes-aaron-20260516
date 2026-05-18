export const TASK_PRIORITY_FILTERS = ["all", "high", "normal", "low"];

export function normalizeTaskPriorityFilter(value) {
  return TASK_PRIORITY_FILTERS.includes(value) ? value : "all";
}

export function matchesTaskPriorityFilter(task, priorityFilter) {
  const filter = normalizeTaskPriorityFilter(priorityFilter);
  if (filter === "all") return true;
  return normalizeTaskPriority(task?.priority) === filter;
}

export function getTaskPriorityFilterCounts(tasks) {
  const counts = Object.fromEntries(TASK_PRIORITY_FILTERS.map((priority) => [priority, 0]));

  for (const task of Array.isArray(tasks) ? tasks : []) {
    counts.all += 1;
    const priority = normalizeTaskPriority(task?.priority);
    counts[priority] = (counts[priority] ?? 0) + 1;
  }

  return counts;
}

function normalizeTaskPriority(value) {
  return ["high", "normal", "low"].includes(value) ? value : "normal";
}
