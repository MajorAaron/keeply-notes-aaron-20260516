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

  if (task.completed) {
    return {
      label: `Done · ${dateLabel}`,
      tone: "done",
      dateTime: dueAt,
      ariaLabel: `Completed task, due ${dateLabel}`
    };
  }

  const todayKey = toDateKey(now);
  const tomorrowKey = toDateKey(new Date(startOfLocalDay(now).getTime() + dayMs));

  if (dueAt < todayKey) {
    return {
      label: `Overdue · ${dateLabel}`,
      tone: "overdue",
      dateTime: dueAt,
      ariaLabel: `Due ${dateLabel}, overdue`
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
    ariaLabel: `Due ${dateLabel}`
  };
}

function formatShortDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return "No date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(year, month - 1, day));
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
