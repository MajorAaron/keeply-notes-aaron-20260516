const emptyAmountMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const currencyNames = new Map([
  ["usd", "$"],
  ["cad", "CA$"],
  ["aud", "A$"],
  ["eur", "€"],
  ["gbp", "£"]
]);

const symbolAmountPattern = /(?<![\w])([$€£])\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)(?![\w])/g;
const leadingCodeAmountPattern = /\b(usd|cad|aud|eur|gbp)\s+([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\b/gi;
const trailingCodeAmountPattern = /\b([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(usd|cad|aud|eur|gbp)\b/gi;

function parseAmount(rawAmount) {
  const normalized = String(rawAmount || "").replace(/,/g, "");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

function formatNumber(value) {
  if (value >= 1000000) {
    return `${trimTrailingZero(value / 1000000)}M`;
  }

  if (value >= 10000) {
    return `${Math.round(value / 1000)}k`;
  }

  if (value >= 1000) {
    return `${trimTrailingZero(value / 1000)}k`;
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(2).replace(/\.00$/, "");
}

function trimTrailingZero(value) {
  return value.toFixed(1).replace(/\.0$/, "");
}

function compactAmount(symbol, value) {
  if (!symbol || value === null) return "";
  return `${symbol}${formatNumber(value)}`;
}

function collectAmounts(text) {
  const amounts = [];
  const seen = new Set();

  function add(symbol, rawAmount) {
    const value = parseAmount(rawAmount);
    if (value === null || value <= 0) return;
    const label = compactAmount(symbol, value);
    const key = `${symbol}:${value.toFixed(2)}`;
    if (!label || seen.has(key)) return;
    seen.add(key);
    amounts.push({ symbol, value, label });
  }

  for (const match of text.matchAll(symbolAmountPattern)) {
    add(match[1], match[2]);
  }

  for (const match of text.matchAll(leadingCodeAmountPattern)) {
    add(currencyNames.get(match[1].toLowerCase()), match[2]);
  }

  for (const match of text.matchAll(trailingCodeAmountPattern)) {
    add(currencyNames.get(match[2].toLowerCase()), match[1]);
  }

  return amounts;
}

export function getItemAmountMeta(text) {
  const value = String(text || "").trim();
  if (!value) {
    return { ...emptyAmountMeta };
  }

  const amounts = collectAmounts(value);
  if (amounts.length === 0) {
    return { ...emptyAmountMeta };
  }

  const first = amounts[0];
  const total = amounts.reduce((sum, amount) => sum + amount.value, 0);
  const tone = amounts.length > 1 ? "multiple" : first.value >= 1000 ? "large" : "amount";

  if (amounts.length === 1) {
    return {
      available: true,
      label: first.label,
      ariaLabel: `Contains amount ${first.label}`,
      tone
    };
  }

  return {
    available: true,
    label: `${amounts.length} amounts`,
    ariaLabel: `Contains ${amounts.length} amounts including ${first.label}`,
    tone,
    totalLabel: compactAmount(first.symbol, total)
  };
}
