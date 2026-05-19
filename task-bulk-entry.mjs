const BULLET_PREFIX_PATTERN = /^(?:[-*•‣–—]+|\d+[.)]|\[[ xX]?\])\s*/;
const validLabels = new Set(["ideas", "work", "home", "personal"]);
const validPriorities = new Set(["low", "normal", "high"]);
const priorityAliases = new Map([
  ["urgent", "high"],
  ["asap", "high"],
  ["important", "high"]
]);

export function getBulkTaskLines(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map(cleanBulkLine)
    .filter(Boolean);

  return lines.length >= 2 ? lines : [];
}

export function parseBulkTaskLine(line, options = {}) {
  const fallbackTitle = cleanBulkLine(line);
  let title = fallbackTitle;
  let dueAt = "";
  let priority = "";
  let label = "";
  const baseDate = getBaseDate(options);

  title = title.replace(/\b(next\s+week|today|tomorrow)\b/gi, (match) => {
    dueAt = dueAt || getRelativeDate(match.toLowerCase().replace(/\s+/g, "-"), baseDate);
    return " ";
  });

  title = title.replace(/(?:^|\s)(?:!|#)(high|normal|low)\b/gi, (match, value) => {
    priority = priority || value.toLowerCase();
    return " ";
  });

  title = title.replace(/\b(high|normal|low)\s+priority\b/gi, (match, value) => {
    priority = priority || value.toLowerCase();
    return " ";
  });

  title = title.replace(/\b(urgent|asap|important)\b/gi, (match, value) => {
    priority = priority || priorityAliases.get(value.toLowerCase()) || "high";
    return " ";
  });

  title = title.replace(/(?:^|\s)(?:@|#)(work|home|ideas|personal)\b/gi, (match, value) => {
    label = label || value.toLowerCase();
    return " ";
  });

  const normalizedTitle = normalizeTitle(title) || fallbackTitle;
  return {
    title: normalizedTitle,
    dueAt,
    priority,
    label
  };
}

export function buildBulkTasksFromText(text, options = {}) {
  const lines = getBulkTaskLines(text);
  const now = options.now || new Date().toISOString();
  const createId = typeof options.createId === "function" ? options.createId : () => crypto.randomUUID();

  return lines.map((line, index) => {
    const parsed = parseBulkTaskLine(line, options);

    return {
      id: createId(index),
      title: parsed.title,
      details: "",
      label: validLabels.has(parsed.label) ? parsed.label : options.label || "ideas",
      priority: validPriorities.has(parsed.priority) ? parsed.priority : options.priority || "normal",
      dueAt: parsed.dueAt || options.dueAt || "",
      completed: false,
      status: "active",
      createdAt: now,
      updatedAt: now
    };
  });
}

function cleanBulkLine(line) {
  return String(line || "")
    .trim()
    .replace(BULLET_PREFIX_PATTERN, "")
    .trim();
}

function normalizeTitle(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/[-–—:,;\s]+$/g, "")
    .trim();
}

function getBaseDate(options) {
  const raw = options.today || options.now;
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const date = raw ? new Date(raw) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function getRelativeDate(value, baseDate) {
  const date = new Date(baseDate);
  if (value === "tomorrow") {
    date.setDate(date.getDate() + 1);
  } else if (value === "next-week") {
    date.setDate(date.getDate() + 7);
  }
  return toDateInput(date);
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
