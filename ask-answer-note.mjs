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

export function buildAskAnswerCopyText(answer = {}, options = {}) {
  const question = cleanInlineText(options.question);
  const title = cleanInlineText(answer.title) || "Keeply answer";
  const answerText = cleanBlockText(answer.answer) || "No answer was found in the active Keeply items.";
  const nextStep = cleanBlockText(answer.nextStep);
  const sources = normalizeSources(answer.sources);
  const sections = [];

  sections.push(title);
  if (question) sections.push(`Question\n${question}`);
  sections.push(`Answer\n${answerText}`);
  if (nextStep) sections.push(`Next step\n${nextStep}`);
  if (sources.length) {
    sections.push(`Sources\n${sources.map((source) => `- ${source.type} · ${source.title}`).join("\n")}`);
  }

  return sections.join("\n\n");
}

export function getAskFollowUpQuestions(answer = {}, options = {}) {
  const question = cleanInlineText(options.question);
  const sources = normalizeSources(answer.sources);
  const nextStep = cleanInlineText(answer.nextStep);
  const candidates = [];

  const taskSource = sources.find((source) => source.type.toLowerCase() === "task");
  const noteSource = sources.find((source) => source.type.toLowerCase() === "note");
  const firstSource = sources[0];

  if (taskSource) candidates.push(`What is the next step for ${taskSource.title}?`);
  if (noteSource) candidates.push(`What task should come from ${noteSource.title}?`);
  if (firstSource) candidates.push(`What else connects to ${firstSource.title}?`);
  if (nextStep) candidates.push("How should I act on that next step?");
  if (question && /\b(task|tasks|todo|due|next|today|tomorrow)\b/i.test(question)) candidates.push("Which task should I do after that?");
  candidates.push("What should I ask Keeply next?");

  return uniqueQuestions(candidates).slice(0, normalizeLimit(options.limit));
}

function uniqueQuestions(questions) {
  const seen = new Set();
  return questions
    .map((question) => cleanInlineText(question))
    .filter((question) => {
      if (!question) return false;
      const key = question.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeLimit(limit) {
  const value = Number(limit);
  if (Number.isFinite(value) && value > 0) return Math.min(4, Math.floor(value));
  return 3;
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
