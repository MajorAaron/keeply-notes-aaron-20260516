export const TASK_COMPOSER_DUE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "none", label: "No date" }
];

const dayMs = 86400000;

export function getTaskComposerDueDate(key, now = new Date()) {
  if (key === "today") return toDateInput(now);
  if (key === "tomorrow") return toDateInput(new Date(now.getTime() + dayMs));
  if (key === "none") return "";
  return null;
}

export function getTaskComposerDueHint(dueAt, now = new Date()) {
  if (!dueAt) return "No date selected";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueAt)) return "Custom due date";

  const today = startOfLocalDay(now);
  const dueDate = parseDateInput(dueAt);
  if (!dueDate) return "Custom due date";

  const offset = Math.round((dueDate.getTime() - today.getTime()) / dayMs);
  if (offset === 0) return "Due today";
  if (offset === 1) return "Due tomorrow";
  if (offset === -1) return "Overdue by 1 day";
  if (offset < -1) return `Overdue by ${Math.abs(offset)} days`;
  if (offset <= 7) return `Due in ${offset} days`;
  return `Due ${new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(dueDate)}`;
}

function parseDateInput(value) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
