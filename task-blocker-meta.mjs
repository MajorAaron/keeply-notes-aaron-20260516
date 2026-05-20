const BLOCKED_PATTERNS = [
  { pattern: /\bblocked\b|\bblocker\b|\bblocking\b/i, label: "Blocked", tone: "blocked", aria: "Task is marked blocked" },
  { pattern: /\bstuck\b|\bon hold\b/i, label: "Stuck", tone: "blocked", aria: "Task is marked stuck" },
  { pattern: /\bwaiting\s+(?:on|for)\b|\bawaiting\b/i, label: "Waiting", tone: "waiting", aria: "Task is waiting on something" },
  { pattern: /\bdepends\s+on\b|\bdependency\b/i, label: "Depends", tone: "waiting", aria: "Task has a dependency" }
];

export function getTaskBlockerMeta(task) {
  if (!task || task.completed) return unavailableMeta();

  const text = `${task.title || ""} ${task.details || ""}`.replace(/\s+/g, " ").trim();
  if (!text) return unavailableMeta();

  const match = BLOCKED_PATTERNS.find((entry) => entry.pattern.test(text));
  if (!match) return unavailableMeta();

  return {
    available: true,
    label: match.label,
    tone: match.tone,
    ariaLabel: match.aria
  };
}

function unavailableMeta() {
  return {
    available: false,
    label: "",
    tone: "",
    ariaLabel: ""
  };
}
