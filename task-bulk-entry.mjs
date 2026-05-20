const BULLET_PREFIX_PATTERN = /^(?:[-*•‣–—]+|\d+[.)]|\[[ xX]?\])\s*/;
const validLabels = new Set(["ideas", "work", "home", "personal"]);
const validPriorities = new Set(["low", "normal", "high"]);
const priorityAliases = new Map([
  ["urgent", "high"],
  ["asap", "high"],
  ["important", "high"]
]);
const weekdayHints = new Map([
  ["sunday", 0],
  ["monday", 1],
  ["tuesday", 2],
  ["wednesday", 3],
  ["thursday", 4],
  ["friday", 5],
  ["saturday", 6]
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

  let clearsDue = false;

  title = title.replace(/\b(next\s+week|this\s+weekend|weekend|today|tomorrow|this\s+(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)|sunday|monday|tuesday|wednesday|thursday|friday|saturday|no\s+date|unscheduled|someday)\b/gi, (match) => {
    const hint = match.toLowerCase().replace(/\s+/g, "-");
    if (isNoDateHint(hint)) {
      clearsDue = true;
      dueAt = "";
    } else if (!clearsDue) {
      dueAt = dueAt || getRelativeDate(hint, baseDate);
    }
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
    label,
    ...(clearsDue ? { clearsDue: true } : {})
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
      dueAt: parsed.clearsDue ? "" : parsed.dueAt || options.dueAt || "",
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

function isNoDateHint(value) {
  return value === "no-date" || value === "unscheduled" || value === "someday";
}

function getRelativeDate(value, baseDate) {
  const date = new Date(baseDate);
  const weekday = getWeekdayHint(value);
  if (weekday !== null) {
    return toDateInput(getUpcomingWeekdayDate(date, weekday));
  }

  if (value === "tomorrow") {
    date.setDate(date.getDate() + 1);
  } else if (value === "weekend" || value === "this-weekend") {
    return toDateInput(getUpcomingWeekendDate(date));
  } else if (value === "next-week") {
    date.setDate(date.getDate() + 7);
  }
  return toDateInput(date);
}

function getWeekdayHint(value) {
  const normalized = String(value || "").replace(/^this-/, "");
  return weekdayHints.has(normalized) ? weekdayHints.get(normalized) : null;
}

function getUpcomingWeekdayDate(date, weekday) {
  const next = new Date(date);
  const daysUntilWeekday = (weekday - next.getDay() + 7) % 7;
  next.setDate(next.getDate() + daysUntilWeekday);
  return next;
}

function getUpcomingWeekendDate(date) {
  const next = new Date(date);
  const day = next.getDay();
  if (day === 0) return next;
  const daysUntilSaturday = (6 - day + 7) % 7;
  next.setDate(next.getDate() + daysUntilSaturday);
  return next;
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
