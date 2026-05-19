const MARKER_PREFIX_PATTERN = /^(?:[-*•‣–—]+|\d+[.)]|\[[ xX]?\])\s*/;
const DEFAULT_TITLE_LIMIT = 60;

export function getTaskCaptureTitle(draft = {}, options = {}) {
  const explicitTitle = cleanTaskTitle(draft.title, options);
  if (explicitTitle) return explicitTitle;

  return deriveTaskTitleFromDetails(draft.details, options);
}

export function deriveTaskTitleFromDetails(details, options = {}) {
  const firstLine = String(details || "")
    .split(/\r?\n/)
    .map((line) => line.trim().replace(MARKER_PREFIX_PATTERN, "").trim())
    .find(Boolean);

  if (!firstLine) return "";
  return cleanTaskTitle(firstLine, options);
}

function cleanTaskTitle(value, options = {}) {
  const limit = Number.isFinite(options.limit) ? options.limit : DEFAULT_TITLE_LIMIT;
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:;,-]+$/g, "")
    .trim();

  if (!text) return "";
  if (text.length <= limit) return text;

  const clipped = text.slice(0, limit + 1);
  const boundary = clipped.search(/\s+\S*$/);
  const safe = boundary > 24 ? clipped.slice(0, boundary) : text.slice(0, limit);
  return `${safe.trim().replace(/[.:;,-]+$/g, "")}…`;
}
