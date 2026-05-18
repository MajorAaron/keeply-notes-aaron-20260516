export function compareNotesForDisplay(a = {}, b = {}) {
  if (Boolean(a.pinned) !== Boolean(b.pinned)) {
    return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
  }

  const updatedDelta = getNoteTimestamp(b) - getNoteTimestamp(a);
  if (updatedDelta !== 0) return updatedDelta;

  const createdDelta = getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
  if (createdDelta !== 0) return createdDelta;

  return String(a.title || "").localeCompare(String(b.title || ""));
}

export function getNoteTimestamp(note = {}) {
  const updatedAt = getTimestamp(note.updatedAt);
  if (updatedAt) return updatedAt;
  return getTimestamp(note.createdAt);
}

function getTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}
