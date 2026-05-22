const emptyQuoteMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const markdownQuoteLinePattern = /^\s*>\s*\S.+/gm;
const quotedPhrasePattern = /(?:"[^"\n]{4,160}"|“[^”\n]{4,160}”|‘[^’\n]{4,160}’|'[^'\n]{4,160}')/g;
const apostropheWordPattern = /\b\w+'\w+\b/g;

function normalizeText(text) {
  return String(text || "").trim();
}

function uniqueQuoteKey(value) {
  return value.replace(/^\s*>\s*/, "").replace(/["“”‘’']/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function getItemQuoteMeta(text) {
  const value = normalizeText(text);
  if (!value) {
    return { ...emptyQuoteMeta };
  }

  const matches = [
    ...(value.match(markdownQuoteLinePattern) || []),
    ...(value.replace(apostropheWordPattern, "").match(quotedPhrasePattern) || [])
  ];
  const uniqueQuotes = [...new Set(matches.map(uniqueQuoteKey).filter(Boolean))];

  if (uniqueQuotes.length === 0) {
    return { ...emptyQuoteMeta };
  }

  if (uniqueQuotes.length === 1) {
    return {
      available: true,
      label: "Quote",
      ariaLabel: "Contains a quoted excerpt",
      tone: "single"
    };
  }

  return {
    available: true,
    label: `${uniqueQuotes.length} quotes`,
    ariaLabel: `Contains ${uniqueQuotes.length} quoted excerpts`,
    tone: "multiple"
  };
}
