const MAX_HISTORY = 4;
const MAX_QUESTION_LENGTH = 120;

export function parseAskHistory(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return normalizeHistory(parsed);
  } catch {
    return [];
  }
}

export function addAskHistoryQuestion(history, question, options = {}) {
  const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : MAX_HISTORY;
  const normalized = normalizeQuestion(question);
  if (!normalized) return normalizeHistory(history).slice(0, limit);

  const existing = normalizeHistory(history).filter((item) => item.toLowerCase() !== normalized.toLowerCase());
  return [normalized, ...existing].slice(0, limit);
}

export function serializeAskHistory(history) {
  return JSON.stringify(normalizeHistory(history).slice(0, MAX_HISTORY));
}

export function getAskHistoryChips(history) {
  return normalizeHistory(history).slice(0, MAX_HISTORY).map((question) => ({
    question,
    label: `Recent: ${question}`,
    ariaLabel: `Ask recent question: ${question}`
  }));
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  const seen = new Set();
  const normalized = [];

  for (const item of history) {
    const question = normalizeQuestion(item);
    const key = question.toLowerCase();
    if (!question || seen.has(key)) continue;
    seen.add(key);
    normalized.push(question);
    if (normalized.length >= MAX_HISTORY) break;
  }

  return normalized;
}

function normalizeQuestion(value) {
  const question = String(value || "").replace(/\s+/g, " ").trim();
  if (!question) return "";
  if (question.length <= MAX_QUESTION_LENGTH) return question;
  return `${question.slice(0, MAX_QUESTION_LENGTH - 1).trimEnd()}…`;
}
