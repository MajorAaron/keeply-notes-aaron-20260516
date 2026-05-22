const REPEAT_PATTERNS = [
  {
    key: "daily",
    label: "Daily",
    aria: "daily repeat",
    pattern: /\b(?:every\s+(?:day|morning|afternoon|evening|night)|each\s+day|repeat(?:s|ing)?\s+daily|daily(?=\s*(?:$|[.,;:!?])))\b/i
  },
  {
    key: "weekly",
    label: "Weekly",
    aria: "weekly repeat",
    pattern: /\b(?:every\s+(?:week|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)|each\s+week|repeat(?:s|ing)?\s+weekly|weekly(?=\s*(?:$|[.,;:!?])))\b/i
  },
  {
    key: "monthly",
    label: "Monthly",
    aria: "monthly repeat",
    pattern: /\b(?:every\s+month|each\s+month|repeat(?:s|ing)?\s+monthly|monthly(?=\s*(?:$|[.,;:!?])))\b/i
  },
  {
    key: "yearly",
    label: "Yearly",
    aria: "yearly repeat",
    pattern: /\b(?:every\s+year|each\s+year|repeat(?:s|ing)?\s+(?:yearly|annually)|(?:annually|annual|yearly)(?=\s*(?:$|[.,;:!?])))\b/i
  }
];

export function getTaskRepeatMeta(task) {
  const text = `${task?.title || ""} ${task?.details || ""}`.replace(/\s+/g, " ").trim();
  if (!text || task?.completed) return unavailableMeta();

  const repeat = extractTaskRepeatCue(text);
  if (!repeat) return unavailableMeta();

  return {
    available: true,
    label: repeat.label,
    ariaLabel: `Mentions ${repeat.aria}`,
    tone: repeat.key
  };
}

export function extractTaskRepeatCue(text) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source) return null;

  const matches = REPEAT_PATTERNS.filter((repeat) => repeat.pattern.test(source));
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    return {
      key: "multiple",
      label: "Repeats",
      aria: "multiple repeat cues"
    };
  }
  return {
    key: matches[0].key,
    label: matches[0].label,
    aria: matches[0].aria
  };
}

function unavailableMeta() {
  return {
    available: false,
    label: "",
    ariaLabel: "",
    tone: ""
  };
}
