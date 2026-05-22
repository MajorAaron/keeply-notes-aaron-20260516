const emptyFoodMeta = Object.freeze({ available: false, label: "", ariaLabel: "", tone: "" });

const foodCues = [
  {
    type: "grocery",
    label: "Groceries",
    tone: "grocery",
    pattern: /\b(?:grocer(?:y|ies)|shopping list|supermarket|market run|produce|pantry|ingredients?|pick up (?:milk|eggs|bread|coffee|rice|flour|cheese|fruit|vegetables?))\b/i
  },
  {
    type: "recipe",
    label: "Recipe",
    tone: "recipe",
    pattern: /\b(?:recipe|cookbook|bake|preheat|oven|servings?|tablespoons?|teaspoons?|tbsp|tsp|cups? of|simmer|saut[ée]e?|marinate)\b/i
  },
  {
    type: "meal",
    label: "Meal",
    tone: "meal",
    pattern: /\b(?:meal prep|dinner plan|lunch plan|breakfast prep|weekly menu|meal plan|leftovers|freezer meal)\b/i
  },
  {
    type: "dining",
    label: "Dining",
    tone: "dining",
    pattern: /\b(?:restaurant|dinner reservation|brunch reservation|lunch reservation|takeout|take-out|delivery order|order pizza|coffee shop|cafe reservation)\b/i
  }
];

const blockedCuePattern = /\b(?:recipe for (?:disaster|success)|browser menu|app menu|menu bar|context menu|data produce|produce (?:the|a) report|market(?:ing)? run(?:book)?|order (?:status|number|id)|delivery (?:pipeline|deploy|release))\b/i;

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function getItemFoodMeta(text) {
  const value = normalizeText(text);
  if (!value || blockedCuePattern.test(value)) {
    return { ...emptyFoodMeta };
  }

  const matches = foodCues.filter((cue) => cue.pattern.test(value));
  if (!matches.length) {
    return { ...emptyFoodMeta };
  }

  if (matches.length > 1) {
    return {
      available: true,
      label: `${matches.length} food`,
      ariaLabel: `Contains ${matches.length} food cues`,
      tone: "multiple"
    };
  }

  const [match] = matches;
  return {
    available: true,
    label: match.label,
    ariaLabel: `Contains a ${match.label.toLowerCase()} food cue`,
    tone: match.tone
  };
}
