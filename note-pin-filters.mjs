export const NOTE_PIN_FILTERS = ["all", "pinned", "unpinned"];

export function normalizeNotePinFilter(value) {
  return NOTE_PIN_FILTERS.includes(value) ? value : "all";
}

export function matchesNotePinFilter(note, pinFilter) {
  const filter = normalizeNotePinFilter(pinFilter);
  if (filter === "all") return true;
  const pinned = note?.pinned === true;
  return filter === "pinned" ? pinned : !pinned;
}

export function getNotePinFilterCounts(notes) {
  const counts = Object.fromEntries(NOTE_PIN_FILTERS.map((filter) => [filter, 0]));

  for (const note of Array.isArray(notes) ? notes : []) {
    counts.all += 1;
    counts[note?.pinned === true ? "pinned" : "unpinned"] += 1;
  }

  return counts;
}
