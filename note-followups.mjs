export const NOTE_FOLLOW_UP_SHORTCUTS = [
  { key: "today", label: "Task today" },
  { key: "tomorrow", label: "Task tomorrow" }
];

export function getNoteFollowUpDueDate(shortcut, baseDate = new Date()) {
  if (shortcut === "today") return toDateInput(baseDate);
  if (shortcut === "tomorrow") return toDateInput(addDays(baseDate, 1));
  return null;
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
