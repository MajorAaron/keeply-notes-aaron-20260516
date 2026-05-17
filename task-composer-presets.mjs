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

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
