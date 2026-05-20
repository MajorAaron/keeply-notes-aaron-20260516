const MAX_TITLE_LENGTH = 90;

export function buildAskAnswerNote(answer = {}, options = {}) {
  const now = normalizeNow(options.now);
  const question = cleanInlineText(options.question);
  const answerTitle = cleanInlineText(answer.title);
  const titleBase = question || answerTitle || "Keeply answer";
  const noteTitle = truncateTitle(`Ask: ${titleBase}`);
  const answerText = cleanBlockText(answer.answer) || "No answer was found in the active Keeply items.";
  const nextStep = cleanBlockText(answer.nextStep);
  const sources = normalizeSources(answer.sources);

  const bodySections = [];
  if (question) bodySections.push(`Question\n${question}`);
  bodySections.push(`Answer\n${answerText}`);
  if (nextStep) bodySections.push(`Next step\n${nextStep}`);
  if (sources.length) {
    bodySections.push(`Sources\n${sources.map((source) => `- ${source.type} · ${source.title}`).join("\n")}`);
  }

  return {
    id: options.id || "",
    title: noteTitle,
    body: bodySections.join("\n\n"),
    label: normalizeLabel(options.label),
    color: normalizeColor(options.color),
    pinned: false,
    status: "active",
    createdAt: now,
    updatedAt: now
  };
}

function truncateTitle(title) {
  if (title.length <= MAX_TITLE_LENGTH) return title;
  return `${title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
}

function cleanInlineText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function cleanBlockText(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
}

function normalizeNow(value) {
  if (value instanceof Date) return value.toISOString();
  const timestamp = new Date(value || Date.now()).toISOString();
  return timestamp;
}

function normalizeSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources
    .map((source) => ({
      type: cleanInlineText(source?.type) || "item",
      title: cleanInlineText(source?.title) || "Untitled"
    }))
    .slice(0, 4);
}

function normalizeLabel(label) {
  return ["ideas", "work", "home", "personal"].includes(label) ? label : "ideas";
}

function normalizeColor(color) {
  return ["sun", "mint", "sky", "rose", "ink"].includes(color) ? color : "sky";
}
