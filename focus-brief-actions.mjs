const allowedTypes = new Set(["task", "note"]);

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeTitle(value) {
  return cleanText(value).toLowerCase();
}

function buildCandidateMap(items, type) {
  const map = new Map();
  (Array.isArray(items) ? items : []).forEach((item) => {
    const id = cleanText(item?.id);
    const title = cleanText(item?.title);
    if (!id || !title) return;
    map.set(normalizeTitle(title), {
      id,
      type,
      title,
      label: cleanText(item?.label)
    });
  });
  return map;
}

function normalizeFocusSource(value) {
  const id = cleanText(value?.id || value?.sourceId || value?.targetId);
  const title = cleanText(value?.sourceTitle || value?.targetTitle || value?.title);
  const type = cleanText(value?.type || value?.sourceType || value?.targetType).toLowerCase();
  if (!id || !allowedTypes.has(type)) return null;
  return {
    id,
    type,
    title: title || "Open item"
  };
}

function matchFocusItem(item, context) {
  const explicit = normalizeFocusSource(item?.source || item);
  if (explicit) return explicit;

  const taskMap = buildCandidateMap(context?.tasks, "task");
  const noteMap = buildCandidateMap(context?.notes, "note");
  const title = normalizeTitle(item?.title);
  const action = normalizeTitle(item?.action);

  if (title) {
    const task = taskMap.get(title);
    if (task) return task;
    const note = noteMap.get(title);
    if (note) return note;
  }

  for (const candidate of [...taskMap.values(), ...noteMap.values()]) {
    const candidateTitle = normalizeTitle(candidate.title);
    if (!candidateTitle) continue;
    const titleMatches = title && (title.includes(candidateTitle) || candidateTitle.includes(title));
    if (titleMatches || action.includes(candidateTitle)) {
      return candidate;
    }
  }

  return null;
}

export function getFocusBriefItemAction(item, context = {}) {
  const source = matchFocusItem(item, context);
  if (!source) {
    return {
      available: false,
      label: "Open item",
      ariaLabel: "Open matching Keeply item"
    };
  }

  const typeLabel = source.type === "task" ? "task" : "note";
  const title = cleanText(source.title || item?.title || "item");
  return {
    available: true,
    source,
    label: source.type === "task" ? "Open task" : "Open note",
    ariaLabel: `Open ${typeLabel}: ${title}`
  };
}

export function hydrateFocusBriefActions(brief, context = {}) {
  const items = (Array.isArray(brief?.items) ? brief.items : []).map((item) => {
    const action = getFocusBriefItemAction(item, context);
    return action.available ? { ...item, source: action.source, sourceAction: action } : { ...item };
  });

  return {
    ...brief,
    items
  };
}
