export function getSearchHighlightTerms(query, { maxTerms = 5 } = {}) {
  return [...new Set(String(query || "").toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) || [])]
    .filter((term) => term.length > 1)
    .sort((a, b) => b.length - a.length || a.localeCompare(b))
    .slice(0, maxTerms);
}

export function splitHighlightedText(value, terms) {
  const text = String(value || "");
  const cleanTerms = Array.isArray(terms) ? terms.filter(Boolean) : [];
  if (!text || cleanTerms.length === 0) return [{ text, highlighted: false }];

  const lower = text.toLowerCase();
  const ranges = [];
  let cursor = 0;

  while (cursor < text.length) {
    const match = findNextMatch(lower, cleanTerms, cursor);
    if (!match) break;
    if (match.index > cursor) ranges.push({ text: text.slice(cursor, match.index), highlighted: false });
    ranges.push({ text: text.slice(match.index, match.index + match.length), highlighted: true });
    cursor = match.index + match.length;
  }

  if (cursor < text.length) ranges.push({ text: text.slice(cursor), highlighted: false });
  return ranges.length ? ranges : [{ text, highlighted: false }];
}

function findNextMatch(lowerText, terms, start) {
  let next = null;

  for (const term of terms) {
    const index = lowerText.indexOf(term, start);
    if (index === -1) continue;
    if (!next || index < next.index || (index === next.index && term.length > next.length)) {
      next = { index, length: term.length };
    }
  }

  return next;
}
