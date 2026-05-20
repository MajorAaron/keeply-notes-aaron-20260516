import { parseBulkTaskLine } from "./task-bulk-entry.mjs";
import { getTaskCaptureTitle } from "./task-title.mjs";

const validLabels = new Set(["ideas", "work", "home", "personal"]);
const validPriorities = new Set(["low", "normal", "high"]);

export function buildTaskCaptureFields(input = {}, options = {}) {
  const rawTitle = String(input.title || "").trim();
  const details = String(input.details || "").trim();
  const fallbackTitle = getTaskCaptureTitle({ title: rawTitle, details });

  if (!fallbackTitle) {
    return {
      title: "",
      details,
      label: normalizeLabel(input.label),
      priority: normalizePriority(input.priority),
      dueAt: normalizeDueAt(input.dueAt),
      usedHints: false
    };
  }

  const parsed = parseBulkTaskLine(fallbackTitle, options);
  const label = validLabels.has(parsed.label) ? parsed.label : normalizeLabel(input.label);
  const priority = validPriorities.has(parsed.priority) ? parsed.priority : normalizePriority(input.priority);
  const dueAt = parsed.clearsDue ? "" : parsed.dueAt || normalizeDueAt(input.dueAt);
  const title = parsed.title || fallbackTitle;

  return {
    title,
    details,
    label,
    priority,
    dueAt,
    usedHints: title !== fallbackTitle || Boolean(parsed.label || parsed.priority || parsed.dueAt || parsed.clearsDue)
  };
}

function normalizeLabel(label) {
  return validLabels.has(label) ? label : "ideas";
}

function normalizePriority(priority) {
  return validPriorities.has(priority) ? priority : "normal";
}

function normalizeDueAt(dueAt) {
  return typeof dueAt === "string" ? dueAt : "";
}
