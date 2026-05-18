const LABEL_NAMES = {
  work: "Work",
  home: "Home",
  ideas: "Ideas",
  personal: "Personal"
};

export function getAskSuggestions(items, options = {}) {
  const max = Number.isInteger(options.max) ? Math.max(1, options.max) : 3;
  const now = options.now ? new Date(options.now) : new Date();
  const today = toDateInput(now);
  const activeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const suggestions = [];

  if (activeItems.length === 0) {
    return ["What should I capture first?"];
  }

  const tasks = activeItems.filter((item) => item.type === "task");
  const openTasks = tasks.filter((task) => !task.completed);
  const overdueTasks = openTasks.filter((task) => task.dueAt && task.dueAt < today);
  const todayTasks = openTasks.filter((task) => task.dueAt === today);
  const highTasks = openTasks.filter((task) => task.priority === "high");
  const pinnedNotes = activeItems.filter((item) => item.type === "note" && item.pinned);

  if (overdueTasks.length > 0) {
    addSuggestion(suggestions, "Which overdue task should I handle first?");
  } else if (todayTasks.length > 0) {
    addSuggestion(suggestions, "What should I focus on today?");
  } else if (highTasks.length > 0) {
    addSuggestion(suggestions, "Which high-priority task needs the next move?");
  } else if (openTasks.length > 0) {
    addSuggestion(suggestions, `What is the next step for ${cleanTitle(openTasks[0].title)}?`);
  }

  if (pinnedNotes.length > 0) {
    addSuggestion(suggestions, `What did I note about ${cleanTitle(pinnedNotes[0].title)}?`);
  }

  const labelSuggestion = getLabelSuggestion(activeItems);
  if (labelSuggestion) addSuggestion(suggestions, labelSuggestion);

  const recentNote = activeItems.find((item) => item.type === "note" && !item.pinned);
  if (recentNote) addSuggestion(suggestions, `Summarize ${cleanTitle(recentNote.title)}.`);

  addSuggestion(suggestions, "What needs a follow-up?");

  return suggestions.slice(0, max);
}

function getLabelSuggestion(items) {
  const counts = new Map();
  for (const item of items) {
    const label = item.label;
    if (!label || !LABEL_NAMES[label]) continue;
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  const [label, count] = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] || [];
  if (!label || count < 2) return "";
  return `What is saved under ${LABEL_NAMES[label]}?`;
}

function addSuggestion(suggestions, value) {
  const text = String(value || "").trim();
  if (!text || suggestions.includes(text)) return;
  suggestions.push(text);
}

function cleanTitle(value) {
  const text = String(value || "this item").trim().replace(/\s+/g, " ");
  return text.length > 36 ? `${text.slice(0, 33).trim()}…` : text;
}

function toDateInput(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return value.toISOString().slice(0, 10);
}
