const DEFAULT_LABEL = "ideas";
const LABELS = new Set(["work", "home", "ideas", "personal"]);

export function getSearchCaptureDraft(options = {}) {
  const query = normalizeQuery(options.query);
  const sourceView = options.view || "active";
  const view = sourceView === "tasks" ? "tasks" : sourceView === "active" ? "active" : "unsupported";

  if (!query || view === "unsupported") {
    return { available: false, mode: view === "tasks" ? "task" : "note", action: "" };
  }

  const mode = view === "tasks" ? "task" : "note";
  return {
    available: true,
    mode,
    action: mode === "task" ? "Capture as task" : "Capture as note",
    title: buildTitle(query),
    body: mode === "task" ? "" : query,
    label: normalizeLabel(options.label),
    priority: inferPriority(query),
    dueAt: inferDueOffset(query)
  };
}

function normalizeQuery(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildTitle(query) {
  const cleaned = query.replace(/[.!?]+$/g, "").trim();
  if (cleaned.length <= 80) return cleaned;
  return `${cleaned.slice(0, 77).trimEnd()}...`;
}

function normalizeLabel(label) {
  return LABELS.has(label) ? label : DEFAULT_LABEL;
}

function inferPriority(query) {
  const lower = query.toLowerCase();
  return /\b(urgent|asap|today|blocked|critical)\b/.test(lower) ? "high" : "normal";
}

function inferDueOffset(query) {
  const lower = query.toLowerCase();
  if (/\btomorrow\b/.test(lower)) return 1;
  if (/\btoday\b|\basap\b|\burgent\b/.test(lower)) return 0;
  return "";
}
