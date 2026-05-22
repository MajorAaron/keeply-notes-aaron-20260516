const emptyTravelMeta = Object.freeze({ available: false, label: "", ariaLabel: "", tone: "" });

const travelCues = [
  {
    type: "flight",
    label: "Flight",
    tone: "flight",
    pattern: /\b(?:flight|boarding pass|gate\s+[a-z]?\d{1,3}|terminal\s+[a-z]?\d{0,2}|airport|tsa|airline|departures?|arrivals?)\b/i
  },
  {
    type: "hotel",
    label: "Hotel",
    tone: "hotel",
    pattern: /\b(?:hotel|airbnb|hostel|lodging|room\s+reservation|hotel\s+check[-\s]?in|hotel\s+check[-\s]?out|booking confirmation)\b/i
  },
  {
    type: "transit",
    label: "Transit",
    tone: "transit",
    pattern: /\b(?:train|amtrak|metro|subway|bus|rental car|rideshare|uber|lyft|ferry)\b/i
  },
  {
    type: "itinerary",
    label: "Trip",
    tone: "trip",
    pattern: /\b(?:itinerary|travel plan|trip plan|passport|visa|packing list|reservation code|confirmation number)\b/i
  }
];

const blockedCuePattern = /\b(?:terminal\s+(?:command|shell|window|app|session)|gate\s+(?:review|approval|check|logic|condition)|check[-\s]?in\s+(?:recap|meeting|sync|with))\b/i;

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function getItemTravelMeta(text) {
  const value = normalizeText(text);
  if (!value || blockedCuePattern.test(value)) {
    return { ...emptyTravelMeta };
  }

  const matches = travelCues.filter((cue) => cue.pattern.test(value));
  if (!matches.length) {
    return { ...emptyTravelMeta };
  }

  if (matches.length > 1) {
    return {
      available: true,
      label: `${matches.length} travel`,
      ariaLabel: `Contains ${matches.length} travel cues`,
      tone: "multiple"
    };
  }

  const [match] = matches;
  return {
    available: true,
    label: match.label,
    ariaLabel: `Contains a ${match.label.toLowerCase()} travel cue`,
    tone: match.tone
  };
}
