const emptyUrgencyMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const urgentCuePattern = /\b(?:asap|urgent(?:ly)?|critical|time[-\s]?sensitive|right away|immediate(?:ly)?|high priority|top priority|p0|p1)\b/i;
const blockedUrgencyPattern = /(?:\b(?:not|isn't|is not|wasn't|was not|no longer)\s+(?:an?\s+)?(?:asap|urgent(?:ly)?|critical|time[-\s]?sensitive|immediate|high priority|top priority|p0|p1)\b|\bnon[-\s]?urgent\b)/i;

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function getUrgencyLabel(value) {
  const normalized = value.toLowerCase();
  if (/\bp0\b/.test(normalized) || /\bcritical\b/.test(normalized)) {
    return { label: "Critical", tone: "critical", ariaLabel: "Contains a critical urgency cue" };
  }
  if (/\basap\b/.test(normalized) || /\bright away\b/.test(normalized) || /\bimmediate(?:ly)?\b/.test(normalized)) {
    return { label: "ASAP", tone: "asap", ariaLabel: "Contains an ASAP urgency cue" };
  }
  return { label: "Urgent", tone: "urgent", ariaLabel: "Contains an urgent cue" };
}

export function getItemUrgencyMeta(text) {
  const value = normalizeText(text);
  if (!value || !urgentCuePattern.test(value) || blockedUrgencyPattern.test(value)) {
    return { ...emptyUrgencyMeta };
  }

  return {
    available: true,
    ...getUrgencyLabel(value)
  };
}
