export const TASK_DUE_SHORTCUTS = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "weekend", label: "Weekend" },
  { key: "next-week", label: "Next week" },
  { key: "clear", label: "No date" }
];

export function getTaskDueShortcutDate(shortcut, baseDate = new Date()) {
  if (shortcut === "clear") return "";
  if (shortcut === "today") return toDateInput(baseDate);
  if (shortcut === "tomorrow") return toDateInput(addDays(baseDate, 1));
  if (shortcut === "weekend") return toDateInput(getUpcomingWeekendDate(baseDate));
  if (shortcut === "next-week") return toDateInput(addDays(baseDate, 7));
  return null;
}

export function getVisibleTaskDueShortcuts(task, baseDate = new Date()) {
  const dueAt = task?.dueAt || "";
  return TASK_DUE_SHORTCUTS.filter((shortcut) => getTaskDueShortcutDate(shortcut.key, baseDate) !== dueAt);
}

function getUpcomingWeekendDate(date) {
  const next = new Date(date);
  const day = next.getDay();
  if (day === 0) return next;
  const daysUntilSaturday = (6 - day + 7) % 7;
  next.setDate(next.getDate() + daysUntilSaturday);
  return next;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
