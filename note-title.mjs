const MARKER_PREFIX_PATTERN = /^(?:[-*•‣–—]+|\d+[.)]|\[[ xX]?\])\s*/;
const DEFAULT_TITLE_LIMIT = 60;

export function getNoteCaptureTitle(draft = {}, options = {}) {
  const explicitTitle = cleanTitle(draft.title, options);
  if (explicitTitle) return explicitTitle;

  const bodyTitle = deriveNoteTitleFromBody(draft.body, options);
  if (bodyTitle) return bodyTitle;

  return draft.hasImage ? "Image note" : "Untitled";
}

export function deriveNoteTitleFromBody(body, options = {}) {
  const firstLine = String(body || "")
    .split(/\r?\n/)
    .map((line) => line.trim().replace(MARKER_PREFIX_PATTERN, "").trim())
    .find(Boolean);

  if (!firstLine) return "";
  return cleanTitle(firstLine, options);
}

function cleanTitle(value, options = {}) {
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
