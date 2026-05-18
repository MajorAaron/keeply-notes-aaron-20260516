const DEFAULT_MAX_LENGTH = 120;
const DEFAULT_EMPTY_TEXT = "No extra details";

export function buildTaskDetailPreview(details, options = {}) {
  const maxLength = Number.isFinite(options.maxLength) && options.maxLength > 1 ? Math.floor(options.maxLength) : DEFAULT_MAX_LENGTH;
  const emptyText = typeof options.emptyText === "string" && options.emptyText.trim() ? options.emptyText.trim() : DEFAULT_EMPTY_TEXT;
  const normalized = String(details || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return { text: emptyText, expandedText: emptyText, isTruncated: false };
  }

  if (normalized.length <= maxLength) {
    return { text: normalized, expandedText: normalized, isTruncated: false };
  }

  const slice = normalized.slice(0, maxLength + 1);
  const boundary = slice.search(/\s+\S*$/);
  const trimmed = (boundary > Math.max(12, Math.floor(maxLength * 0.45)) ? slice.slice(0, boundary) : normalized.slice(0, maxLength)).trimEnd();

  return {
    text: `${trimmed.replace(/[\s,.!?;:—-]+$/u, "")}…`,
    expandedText: normalized,
    isTruncated: true
  };
}
