export const TASK_WINDOWS = ["all", "overdue", "today", "upcoming", "unscheduled"];

export function matchesTaskWindow(task, windowName, baseDate = new Date()) {
  if (!TASK_WINDOWS.includes(windowName) || windowName === "all") return true;

  const dueAt = task?.dueAt || "";
  const today = toDateInput(baseDate);

  if (windowName === "unscheduled") return !dueAt;
  if (!dueAt) return false;
  if (windowName === "overdue") return !task.completed && dueAt < today;
  if (windowName === "today") return dueAt === today;
  if (windowName === "upcoming") return dueAt > today;

  return true;
}

export function getTaskWindowCounts(tasks, baseDate = new Date()) {
  const counts = Object.fromEntries(TASK_WINDOWS.map((name) => [name, 0]));

  for (const task of Array.isArray(tasks) ? tasks : []) {
    counts.all += 1;
    for (const windowName of TASK_WINDOWS.slice(1)) {
      if (matchesTaskWindow(task, windowName, baseDate)) counts[windowName] += 1;
    }
  }

  return counts;
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
