const emptyDeadlineMeta = Object.freeze({ available: false, label: "", ariaLabel: "", tone: "" });

const deadlineCues = [
  {
    type: "deadline",
    label: "Deadline",
    tone: "deadline",
    pattern: /\b(?:deadline|hard deadline|cut-?off|cutoff date|drop-dead date|due (?:by|before|on)|needed by|final day)\b/i
  },
  {
    type: "submit",
    label: "Submit",
    tone: "submit",
    pattern: /\b(?:submit(?:ted|ting)? by|submission due|turn in by|file by|send (?:it|this|the .{1,32}) by)\b/i
  },
  {
    type: "rsvp",
    label: "RSVP",
    tone: "rsvp",
    pattern: /\b(?:rsvp by|reply by|respond by|confirm by|register by|sign up by)\b/i
  },
  {
    type: "expires",
    label: "Expires",
    tone: "expires",
    pattern: /\b(?:expires?(?: on| by| at| tomorrow| today| next)?|expiration date|valid until|offer ends?|last day to)\b/i
  }
];

const blockedCuePattern = /\b(?:deadline scheduler|deadline queue|deadline timer|css cutoff|cutoff frequency|submit button|form submit handler|reply-by header|expires header|cache expires|token expires|jwt expires|session expires)\b/i;

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function getItemDeadlineMeta(text) {
  const value = normalizeText(text);
  if (!value || blockedCuePattern.test(value)) {
    return { ...emptyDeadlineMeta };
  }

  const matches = deadlineCues.filter((cue) => cue.pattern.test(value));
  if (!matches.length) {
    return { ...emptyDeadlineMeta };
  }

  if (matches.length > 1) {
    return {
      available: true,
      label: `${matches.length} deadlines`,
      ariaLabel: `Contains ${matches.length} deadline cues`,
      tone: "multiple"
    };
  }

  const [match] = matches;
  return {
    available: true,
    label: match.label,
    ariaLabel: `Contains a ${match.label.toLowerCase()} cue`,
    tone: match.tone
  };
}
