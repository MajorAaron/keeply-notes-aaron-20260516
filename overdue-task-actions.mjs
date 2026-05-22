export function getOverdueTaskNudge(task = {}, options = {}) {
  const baseDate = normalizeDate(options.now || new Date());
  const today = toDateInput(baseDate);
  const dueAt = normalizeText(task.dueAt);

  if (!dueAt || task.completed || task.status === "archive" || task.status === "trash" || dueAt >= today) {
    return { visible: false, title: "", summary: "", actions: [] };
  }

  const tomorrow = toDateInput(addDays(baseDate, 1));
  return {
    visible: true,
    title: "Overdue nudge",
    summary: `Was due ${formatDueDate(dueAt)}`,
    actions: [
      {
        key: "tomorrow",
        label: "Snooze to tomorrow",
        ariaLabel: "Snooze overdue task to tomorrow",
        dueAt: tomorrow,
        toast: "Due tomorrow"
      },
      {
        key: "clear",
        label: "No date",
        ariaLabel: "Clear overdue task due date",
        dueAt: "",
        toast: "Due date cleared"
      }
    ]
  };
}

function normalizeDate(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
}

function normalizeText(value) {
  return String(value || "").trim();
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

function formatDueDate(value) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
