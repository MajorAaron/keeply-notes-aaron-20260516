const labelNames = {
  ideas: "Ideas",
  work: "Work",
  home: "Home",
  personal: "Personal"
};

export function buildNoteSharePayload(note = {}) {
  const title = cleanText(note.title) || "Untitled note";
  const label = formatLabel(note.label);
  const body = cleanText(note.body);
  const imageLine = note.image ? "Image attached in Keeply." : "";
  const text = compactLines([title, label ? `Label: ${label}` : "", body, imageLine]).join("\n");

  return {
    title,
    text
  };
}

export function buildTaskSharePayload(task = {}) {
  const title = cleanText(task.title) || "Untitled task";
  const status = task.completed ? "[x]" : "[ ]";
  const label = formatLabel(task.label);
  const priority = formatLabel(task.priority);
  const due = cleanText(task.dueAt);
  const details = cleanText(task.details);
  const meta = compactLines([
    label ? `Label: ${label}` : "",
    priority ? `Priority: ${priority}` : "",
    due ? `Due: ${due}` : ""
  ]);
  const text = compactLines([`${status} ${title}`, ...meta, details]).join("\n");

  return {
    title,
    text
  };
}

function compactLines(lines) {
  return lines.map(cleanText).filter(Boolean);
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function formatLabel(value) {
  const key = cleanText(value).toLowerCase();
  return labelNames[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : "");
}
