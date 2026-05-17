const noteColors = new Set(["sun", "mint", "sky", "rose", "ink"]);
const labels = new Set(["work", "home", "ideas", "personal"]);
const priorities = new Set(["low", "normal", "high"]);

export function buildEditedNote(note, draft, options = {}) {
  if (!note || !draft) return null;
  const title = cleanText(draft.title).slice(0, 90);
  const body = cleanText(draft.body);
  const image = normalizeDraftImage(draft.image);

  if (!title && !body && !image) return null;

  return {
    ...note,
    title: title || "Untitled",
    body,
    image,
    label: normalizeChoice(draft.label, labels, note.label || "ideas"),
    color: normalizeChoice(draft.color, noteColors, note.color || "sun"),
    updatedAt: options.now || new Date().toISOString()
  };
}

export function buildEditedTask(task, draft, options = {}) {
  if (!task || !draft) return null;
  const title = cleanText(draft.title).slice(0, 90);
  if (!title) return null;

  return {
    ...task,
    title,
    details: cleanText(draft.body),
    label: normalizeChoice(draft.label, labels, task.label || "ideas"),
    priority: normalizeChoice(draft.priority, priorities, task.priority || "normal"),
    dueAt: normalizeDueDate(draft.dueAt),
    updatedAt: options.now || new Date().toISOString()
  };
}

export function buildNoteEditPatch(note, draft, options = {}) {
  const edited = buildEditedNote(note, draft, options);
  if (!edited) return null;
  return {
    title: edited.title,
    body: edited.body,
    image: edited.image,
    label: edited.label,
    color: edited.color,
    updatedAt: edited.updatedAt
  };
}

export function buildTaskEditPatch(task, draft, options = {}) {
  const edited = buildEditedTask(task, draft, options);
  if (!edited) return null;
  return {
    title: edited.title,
    details: edited.details,
    label: edited.label,
    priority: edited.priority,
    dueAt: edited.dueAt,
    updatedAt: edited.updatedAt
  };
}

export function getEditableNoteDraft(note) {
  if (!note) return null;
  return {
    mode: "note",
    title: note.title || "",
    body: note.body || "",
    label: normalizeChoice(note.label, labels, "ideas"),
    color: normalizeChoice(note.color, noteColors, "sun"),
    image: normalizeDraftImage(note.image)
  };
}

export function getEditableTaskDraft(task) {
  if (!task) return null;
  return {
    mode: "task",
    title: task.title || "",
    body: task.details || "",
    label: normalizeChoice(task.label, labels, "ideas"),
    priority: normalizeChoice(task.priority, priorities, "normal"),
    dueAt: normalizeDueDate(task.dueAt)
  };
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeChoice(value, choices, fallback) {
  return choices.has(value) ? value : fallback;
}

function normalizeDueDate(value) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function normalizeDraftImage(image) {
  if (!image) return null;
  if (typeof image === "string") image = { src: image };
  if (!String(image.src || "").startsWith("data:image/")) return null;
  return {
    src: image.src,
    mime: image.mime || "image/png",
    name: image.name || "Image",
    alt: image.alt || image.prompt || "",
    prompt: image.prompt || "",
    generated: Boolean(image.generated),
    createdAt: image.createdAt || ""
  };
}
