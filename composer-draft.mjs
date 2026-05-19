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

export function getComposerDraftResume(draft) {
  const normalized = normalizeComposerDraft(draft);
  const kind = normalized.mode === "task" ? "task" : "note";
  const title = normalized.title.trim() || firstMeaningfulLine(normalized.body) || (normalized.image?.src ? "Image draft" : "Untitled draft");
  const details = [titleCase(kind), titleCase(normalized.label)];

  if (kind === "task") {
    if (normalized.priority !== "normal") details.push(`${titleCase(normalized.priority)} priority`);
    if (normalized.dueAt) details.push("Due date set");
  } else if (normalized.image?.src) {
    details.push("Image attached");
  }

  return {
    available: hasComposerDraftContent(normalized),
    kicker: "Draft restored",
    title: truncateText(title, 56),
    summary: details.join(" • "),
    action: "Discard"
  };
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

function firstMeaningfulLine(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)]|\[[ xX]\])\s*/, "").trim())
    .find(Boolean) || "";
}

function truncateText(value, maxLength) {
  const text = stringValue(value, maxLength + 1).trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

function titleCase(value) {
  const text = String(value || "");
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
}

function isDateInput(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
