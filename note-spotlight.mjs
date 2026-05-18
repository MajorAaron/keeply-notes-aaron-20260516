const maxSummaryLength = 96;

export function getNoteSpotlight(notes = []) {
  const activeNotes = notes
    .filter((note) => note?.status === "active")
    .sort(compareSpotlightNotes);

  if (activeNotes.length === 0) {
    return {
      available: false,
      kicker: "Note spotlight",
      title: "No active notes yet",
      summary: "Capture a note to start building your workspace.",
      buttonLabel: "Add note",
      query: "",
      ariaLabel: "Create a note"
    };
  }

  const note = activeNotes[0];
  const label = titleCase(note.label || "note");
  const isPinned = Boolean(note.pinned);
  const title = normalizeText(note.title) || "Untitled note";
  const body = normalizeText(note.body);

  return {
    available: true,
    noteId: note.id || "",
    pinned: isPinned,
    kicker: isPinned ? "Pinned note" : "Recent note",
    title,
    summary: body ? truncateText(body, maxSummaryLength) : `${label} note ready to review.`,
    buttonLabel: isPinned ? "Show pinned" : "Show note",
    query: title,
    ariaLabel: `${isPinned ? "Show pinned note" : "Show note"}: ${title}`
  };
}

function compareSpotlightNotes(a, b) {
  const pinnedDelta = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
  if (pinnedDelta !== 0) return pinnedDelta;

  const updatedDelta = getTime(b.updatedAt || b.createdAt) - getTime(a.updatedAt || a.createdAt);
  if (updatedDelta !== 0) return updatedDelta;

  return String(a.title || "").localeCompare(String(b.title || ""));
}

function truncateText(value, length) {
  const text = normalizeText(value);
  if (text.length <= length) return text;
  return `${text.slice(0, length - 1).trimEnd()}…`;
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
