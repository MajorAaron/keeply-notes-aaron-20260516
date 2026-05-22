const defaultMaxAgeMs = 3 * 24 * 60 * 60 * 1000;
const maxQuestionLength = 280;

export function normalizeAskDraft(question, { now = new Date() } = {}) {
  const text = String(question || "").replace(/\s+/g, " ").trim();
  if (!text) return null;
  const updatedAt = now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  return {
    question: text.slice(0, maxQuestionLength),
    updatedAt
  };
}

export function serializeAskDraft(draft) {
  const normalized = normalizeAskDraft(draft?.question, { now: draft?.updatedAt || new Date() });
  return normalized ? JSON.stringify(normalized) : "";
}

export function parseAskDraft(raw, { now = new Date(), maxAgeMs = defaultMaxAgeMs } = {}) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const draft = normalizeAskDraft(parsed?.question, { now: parsed?.updatedAt || now });
    if (!draft) return null;
    const savedAt = new Date(draft.updatedAt).getTime();
    const current = now instanceof Date ? now.getTime() : new Date(now).getTime();
    if (!Number.isFinite(savedAt) || current - savedAt > maxAgeMs) return null;
    return draft;
  } catch (error) {
    return null;
  }
}

export function getAskDraftStatus(draft) {
  if (!draft?.question) {
    return { visible: false, text: "", clearLabel: "Clear question draft" };
  }
  return {
    visible: true,
    text: "Question draft saved on this device",
    clearLabel: `Clear saved Ask Keeply draft: ${draft.question}`
  };
}
