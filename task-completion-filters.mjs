export const TASK_COMPLETION_FILTERS = ["all", "open", "done"];

export function normalizeTaskCompletionFilter(value) {
  return TASK_COMPLETION_FILTERS.includes(value) ? value : "all";
}

export function matchesTaskCompletionFilter(task, completionFilter) {
  const filter = normalizeTaskCompletionFilter(completionFilter);
  if (filter === "all") return true;
  const completed = task?.completed === true;
  return filter === "done" ? completed : !completed;
}

export function getTaskCompletionFilterCounts(tasks) {
  const counts = Object.fromEntries(TASK_COMPLETION_FILTERS.map((filter) => [filter, 0]));

  for (const task of Array.isArray(tasks) ? tasks : []) {
    counts.all += 1;
    if (task?.completed === true) {
      counts.done += 1;
    } else {
      counts.open += 1;
    }
  }

  return counts;
}
