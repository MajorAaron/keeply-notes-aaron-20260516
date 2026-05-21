const meetingPatterns = [
  {
    tone: "video",
    label: "Zoom",
    ariaLabel: "Contains a Zoom meeting cue",
    pattern: /\bzoom\b|zoom\.us\//i
  },
  {
    tone: "video",
    label: "Meet",
    ariaLabel: "Contains a Google Meet cue",
    pattern: /\bgoogle\s+meet\b|meet\.google\.com\//i
  },
  {
    tone: "video",
    label: "Teams",
    ariaLabel: "Contains a Microsoft Teams meeting cue",
    pattern: /\b(?:microsoft\s+)?teams\b|teams\.microsoft\.com\//i
  },
  {
    tone: "video",
    label: "Webex",
    ariaLabel: "Contains a Webex meeting cue",
    pattern: /\bwebex\b|webex\.com\//i
  },
  {
    tone: "call",
    label: "Call",
    ariaLabel: "Contains a phone call cue",
    pattern: /\b(?:phone\s+call|call\s+(?:with|about|for|from|to)|prep\s+call|client\s+call|sales\s+call)\b/i
  },
  {
    tone: "in-person",
    label: "In person",
    ariaLabel: "Contains an in-person meeting cue",
    pattern: /\b(?:in[-\s]?person|onsite|on-site|at\s+the\s+office|at\s+office|conference\s+room|coffee\s+chat)\b/i
  },
  {
    tone: "meeting",
    label: "Meeting",
    ariaLabel: "Contains a meeting cue",
    pattern: /\b(?:meeting|standup|stand-up|sync|1:1|one-on-one|check[-\s]?in|retro|review)\b/i
  }
];

export function getItemMeetingMeta(text) {
  const value = String(text || "").trim();
  if (!value) {
    return { available: false, label: "", ariaLabel: "" };
  }

  const match = meetingPatterns.find((entry) => entry.pattern.test(value));
  if (!match) {
    return { available: false, label: "", ariaLabel: "" };
  }

  return {
    available: true,
    label: match.label,
    ariaLabel: match.ariaLabel,
    tone: match.tone
  };
}
