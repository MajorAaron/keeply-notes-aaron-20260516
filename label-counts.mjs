export const DEFAULT_LABELS = ["work", "home", "ideas", "personal"];

export function getLabelCounts(items, labels = DEFAULT_LABELS) {
  const counts = { all: Array.isArray(items) ? items.length : 0 };

  for (const label of labels) {
    counts[label] = 0;
  }

  if (!Array.isArray(items)) return counts;

  for (const item of items) {
    const label = typeof item?.label === "string" ? item.label.toLowerCase() : "";
    if (Object.hasOwn(counts, label)) counts[label] += 1;
  }

  return counts;
}

export function formatLabelCount(count) {
  const value = Number.isFinite(count) ? Math.max(0, count) : 0;
  return value > 99 ? "99+" : String(value);
}
