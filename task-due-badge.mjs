const dayMs = 86400000;

export function getTaskDueBadge(task = {}, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const dueAt = typeof task.dueAt === "string" ? task.dueAt : "";

  if (!dueAt) {
    return {
      label: "No date",
      tone: "unscheduled",
      dateTime: "",
      ariaLabel: "No due date"
    };
  }

  const dateLabel = formatShortDate(dueAt);
  const spokenDateLabel = formatSpokenDate(dueAt);

  if (task.completed) {
    return {
      label: `Done · ${dateLabel}`,
      tone: "done",
      dateTime: dueAt,
      ariaLabel: `Completed task, due ${spokenDateLabel}`
    };
  }

  const todayKey = toDateKey(now);
  const tomorrowKey = toDateKey(new Date(startOfLocalDay(now).getTime() + dayMs));

  if (dueAt < todayKey) {
    return {
      label: `Overdue · ${dateLabel}`,
      tone: "overdue",
      dateTime: dueAt,
      ariaLabel: `Due ${spokenDateLabel}, overdue`
    };
  }

  if (dueAt === todayKey) {
    return {
      label: "Today",
      tone: "today",
      dateTime: dueAt,
      ariaLabel: "Due today"
    };
  }

  if (dueAt === tomorrowKey) {
    return {
      label: "Tomorrow",
      tone: "tomorrow",
      dateTime: dueAt,
      ariaLabel: "Due tomorrow"
    };
  }

  return {
    label: dateLabel,
    tone: "upcoming",
    dateTime: dueAt,
    ariaLabel: `Due ${spokenDateLabel}`
  };
}

function formatShortDate(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(date);
}

function formatSpokenDate(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date) {
  const local = startOfLocalDay(date);
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
