const BULLET_PREFIX_PATTERN = /^(?:[-*•‣–—]+|\d+[.)]|\[[ xX]?\])\s*/;

export function getBulkTaskLines(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim().replace(BULLET_PREFIX_PATTERN, "").trim())
    .filter(Boolean);

  return lines.length >= 2 ? lines : [];
}

export function buildBulkTasksFromText(text, options = {}) {
  const lines = getBulkTaskLines(text);
  const now = options.now || new Date().toISOString();
  const createId = typeof options.createId === "function" ? options.createId : () => crypto.randomUUID();

  return lines.map((title, index) => ({
    id: createId(index),
    title,
    details: "",
    label: options.label || "ideas",
    priority: options.priority || "normal",
    dueAt: options.dueAt || "",
    completed: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  }));
}
