export const NOTE_COLOR_FILTERS = ["all", "sun", "mint", "sky", "rose", "ink"];

export function normalizeNoteColorFilter(value) {
  return NOTE_COLOR_FILTERS.includes(value) ? value : "all";
}

export function matchesNoteColorFilter(note, colorFilter) {
  const filter = normalizeNoteColorFilter(colorFilter);
  if (filter === "all") return true;
  return normalizeNoteColor(note?.color) === filter;
}

export function getNoteColorFilterCounts(notes) {
  const counts = Object.fromEntries(NOTE_COLOR_FILTERS.map((color) => [color, 0]));

  for (const note of Array.isArray(notes) ? notes : []) {
    counts.all += 1;
    const color = normalizeNoteColor(note?.color);
    counts[color] = (counts[color] ?? 0) + 1;
  }

  return counts;
}

function normalizeNoteColor(value) {
  return ["sun", "mint", "sky", "rose", "ink"].includes(value) ? value : "sun";
}
