const VIEWS = new Set(["archive", "trash"]);

function normalizeView(view) {
  return view === "trash" ? "trash" : view === "archive" ? "archive" : "active";
}

function normalizeDate(value) {
  const date = new Date(value || 0);
  const time = date.getTime();
  return Number.isFinite(time) ? time : 0;
}

function titleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function summarizeItem(item) {
  const type = item.type === "task" ? "task" : "note";
  const bits = [titleCase(item.label || "unlabeled")];
  if (type === "task") {
    if (item.completed) bits.push("done");
    if (item.priority) bits.push(`${item.priority} priority`);
    if (item.dueAt) bits.push(`due ${item.dueAt}`);
  } else if (item.pinned) {
    bits.push("was pinned");
  }
  return bits.filter(Boolean).join(" · ");
}

export function getCleanupSpotlight({ view, notes = [], tasks = [] } = {}) {
  const normalizedView = normalizeView(view);
  const viewLabel = normalizedView === "trash" ? "Trash" : "Archive";
  const actionVerb = normalizedView === "trash" ? "deleted" : "archived";

  if (!VIEWS.has(normalizedView)) {
    return {
      visible: false,
      available: false,
      kicker: "Cleanup review",
      title: "Review saved-away items",
      summary: "Open Archive or Trash to review saved-away cards.",
      buttonLabel: "Review",
      query: "",
      ariaLabel: "Review saved-away items"
    };
  }

  const archiveNotes = notes
    .filter((note) => note?.status === normalizedView)
    .map((note) => ({ ...note, type: "note" }));
  const archiveTasks = tasks
    .filter((task) => task?.status === normalizedView)
    .map((task) => ({ ...task, type: "task" }));
  const items = [...archiveNotes, ...archiveTasks].sort(
    (a, b) => normalizeDate(b.updatedAt || b.createdAt) - normalizeDate(a.updatedAt || a.createdAt)
  );
  const latest = items[0];

  if (!latest) {
    return {
      visible: true,
      available: false,
      kicker: `${viewLabel} review`,
      title: normalizedView === "trash" ? "Trash is empty" : "Archive is clear",
      summary: normalizedView === "trash" ? "Deleted notes and tasks will appear here for review." : "Archived notes and tasks will appear here for review.",
      buttonLabel: "Nothing to review",
      query: "",
      ariaLabel: `${viewLabel} has no saved-away items`
    };
  }

  const noteCount = archiveNotes.length;
  const taskCount = archiveTasks.length;
  const typeLabel = latest.type === "task" ? "task" : "note";
  const countSummary = `${formatCount(noteCount, "note")} · ${formatCount(taskCount, "task")}`;
  const itemSummary = summarizeItem(latest);

  return {
    visible: true,
    available: true,
    id: latest.id,
    type: typeLabel,
    kicker: `Latest ${actionVerb} ${typeLabel}`,
    title: latest.title || "Untitled",
    summary: `${itemSummary ? `${itemSummary} · ` : ""}${countSummary} in ${viewLabel.toLowerCase()}`,
    buttonLabel: `Review ${typeLabel}`,
    query: latest.title || "",
    ariaLabel: `Review ${latest.title || `untitled ${typeLabel}`} in ${viewLabel}`
  };
}
