const COPY_PREFIX = "Copy of ";

export function duplicateNote(note, options = {}) {
  if (!note) return null;
  const now = options.now || new Date().toISOString();
  return {
    ...note,
    id: options.id || crypto.randomUUID(),
    title: withCopyPrefix(note.title || "Untitled"),
    pinned: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  };
}

export function duplicateTask(task, options = {}) {
  if (!task) return null;
  const now = options.now || new Date().toISOString();
  return {
    ...task,
    id: options.id || crypto.randomUUID(),
    title: withCopyPrefix(task.title || "Untitled"),
    completed: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  };
}

function withCopyPrefix(title) {
  const cleanTitle = String(title || "Untitled").trim() || "Untitled";
  return cleanTitle.startsWith(COPY_PREFIX) ? cleanTitle : `${COPY_PREFIX}${cleanTitle}`;
}
