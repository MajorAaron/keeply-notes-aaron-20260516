const emptyLocationMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const locationPatterns = [
  {
    tone: "maps",
    label: "Maps",
    ariaLabel: "Contains a map link cue",
    pattern: /\b(?:https?:\/\/)?(?:maps\.app\.goo\.gl|maps\.google\.[a-z.]+|google\.[a-z.]+\/maps|maps\.apple\.com|openstreetmap\.org)\b/i
  },
  {
    tone: "address",
    label: "Address",
    ariaLabel: "Contains a street address cue",
    pattern: /\b\d{1,6}\s+(?:[a-z0-9][a-z0-9.'-]*\s+){0,5}(?:st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|ln|lane|ct|court|pl|place|way|pkwy|parkway|terrace|ter|circle|cir)\b\.?/i
  },
  {
    tone: "room",
    label: "Room",
    ariaLabel: "Contains a room or floor location cue",
    pattern: /\b(?:conference\s+room|conf\s+room|room|suite|floor|fl\.?|building|bldg\.?)\s+[a-z0-9-]+\b/i
  }
];

export function getItemLocationMeta(text) {
  const value = String(text || "").trim();
  if (!value) {
    return { ...emptyLocationMeta };
  }

  const match = locationPatterns.find((candidate) => candidate.pattern.test(value));
  if (!match) {
    return { ...emptyLocationMeta };
  }

  return {
    available: true,
    label: match.label,
    ariaLabel: match.ariaLabel,
    tone: match.tone
  };
}
