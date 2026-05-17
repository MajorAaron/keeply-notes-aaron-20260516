const validModes = new Set(["note", "task"]);
const validLabels = new Set(["ideas", "work", "home", "personal"]);
const validColors = new Set(["sun", "mint", "sky", "rose", "ink"]);
const validPriorities = new Set(["low", "normal", "high"]);

export function buildComposerDraft(input = {}) {
  return normalizeComposerDraft({
    mode: input.mode,
    title: input.title,
    body: input.body,
    label: input.label,
    color: input.color,
    dueAt: input.dueAt,
    priority: input.priority,
    image: input.image
  });
}

export function normalizeComposerDraft(input) {
  const draft = input && typeof input === "object" ? input : {};
  const mode = validModes.has(draft.mode) ? draft.mode : "note";

  return {
    mode,
    title: stringValue(draft.title, 90),
    body: stringValue(draft.body, 10000),
    label: validLabels.has(draft.label) ? draft.label : "ideas",
    color: validColors.has(draft.color) ? draft.color : "sun",
    dueAt: isDateInput(draft.dueAt) ? draft.dueAt : "",
    priority: validPriorities.has(draft.priority) ? draft.priority : "normal",
    image: mode === "note" ? normalizeDraftImage(draft.image) : null
  };
}

export function hasComposerDraftContent(draft) {
  const normalized = normalizeComposerDraft(draft);
  return Boolean(normalized.title.trim() || normalized.body.trim() || normalized.image?.src);
}

function normalizeDraftImage(image) {
  if (!image || typeof image !== "object" || typeof image.src !== "string" || !image.src.startsWith("data:image/")) {
    return null;
  }

  return {
    src: image.src,
    mime: stringValue(image.mime, 80) || "image/png",
    name: stringValue(image.name, 120) || "Draft image",
    alt: stringValue(image.alt, 240),
    prompt: stringValue(image.prompt, 500),
    generated: Boolean(image.generated),
    createdAt: stringValue(image.createdAt, 80)
  };
}

function stringValue(value, maxLength) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function isDateInput(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
