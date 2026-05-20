export const NOTE_FOLLOW_UP_SHORTCUTS = [
  { key: "today", label: "Task today" },
  { key: "tomorrow", label: "Task tomorrow" },
  { key: "weekend", label: "Task weekend" },
  { key: "next-week", label: "Task next week" }
];

export function getNoteFollowUpDueDate(shortcut, baseDate = new Date()) {
  if (shortcut === "today") return toDateInput(baseDate);
  if (shortcut === "tomorrow") return toDateInput(addDays(baseDate, 1));
  if (shortcut === "weekend") return toDateInput(getUpcomingWeekendDate(baseDate));
  if (shortcut === "next-week") return toDateInput(addDays(baseDate, 7));
  return null;
}

export function getNoteFollowUpToast(shortcut) {
  if (shortcut === "today") return "Task added for today";
  if (shortcut === "tomorrow") return "Task added for tomorrow";
  if (shortcut === "weekend") return "Task added for the weekend";
  if (shortcut === "next-week") return "Task added for next week";
  return "Task added";
}

export function buildFollowUpTask(note, options = {}) {
  const shortcut = options.shortcut || "tomorrow";
  const dueAt = getNoteFollowUpDueDate(shortcut, options.baseDate || new Date());
  if (!note?.id || dueAt === null) return null;

  const now = options.now instanceof Date ? options.now.toISOString() : options.now || new Date().toISOString();
  const title = `Follow up: ${note.title || "Untitled"}`.slice(0, 90);

  return {
    id: options.id,
    title,
    details: note.body || "",
    label: note.label || "ideas",
    priority: "normal",
    dueAt,
    completed: false,
    status: "active",
    sourceNoteId: note.id,
    createdAt: now,
    updatedAt: now
  };
}

export function removeFollowUpTask(tasks, snapshot) {
  const list = Array.isArray(tasks) ? tasks : [];
  if (!snapshot?.id || !snapshot?.sourceNoteId) return { tasks: list, removed: null };

  const index = list.findIndex((task) => task?.id === snapshot.id && task?.sourceNoteId === snapshot.sourceNoteId);
  if (index === -1) return { tasks: list, removed: null };

  return {
    tasks: [...list.slice(0, index), ...list.slice(index + 1)],
    removed: list[index]
  };
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getUpcomingWeekendDate(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return date;
  return addDays(date, 6 - day);
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
