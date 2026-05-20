const dayMs = 86400000;

export function getTodayTaskProgress(tasks, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const today = toDateInput(now);
  const todayTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task?.status === "active" && task.dueAt === today)
    : [];
  const total = todayTasks.length;
  const completed = todayTasks.filter((task) => task.completed).length;
  const open = Math.max(0, total - completed);
  const highOpen = todayTasks.filter((task) => !task.completed && task.priority === "high").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const dueTomorrow = Array.isArray(tasks)
    ? tasks.filter((task) => task?.status === "active" && !task.completed && task.dueAt === toDateInput(new Date(now.getTime() + dayMs))).length
    : 0;

  return {
    total,
    completed,
    open,
    highOpen,
    dueTomorrow,
    percent,
    title: buildTitle({ total, completed, open, percent }),
    summary: buildSummary({ total, completed, open, highOpen, dueTomorrow }),
    ariaLabel: buildAriaLabel({ total, completed, open, highOpen, percent }),
    action: buildAction({ total, open, dueTomorrow })
  };
}

function buildTitle({ total, completed, open, percent }) {
  if (total === 0) return "No tasks due today";
  if (open === 0) return "Today is complete";
  if (completed === 0) return `${open} due today`;
  return `${percent}% of today done`;
}

function buildSummary({ total, completed, open, highOpen, dueTomorrow }) {
  if (total === 0) {
    if (dueTomorrow === 0) return "Nothing due today or tomorrow.";
    return `${dueTomorrow} due tomorrow, nothing due today.`;
  }

  const pieces = [`${completed} done`, `${open} open`];
  if (highOpen > 0) pieces.push(`${highOpen} high priority`);
  if (dueTomorrow > 0) pieces.push(`${dueTomorrow} tomorrow`);
  return pieces.join(" · ");
}

function buildAriaLabel({ total, completed, open, highOpen, percent }) {
  if (total === 0) return "No tasks due today";
  const highText = highOpen > 0 ? `, ${highOpen} high priority open` : "";
  return `${percent} percent complete for today's tasks: ${completed} done, ${open} open${highText}`;
}

function buildAction({ total, open, dueTomorrow }) {
  if (open > 0) {
    return {
      label: "Show today",
      ariaLabel: `Show ${open} open ${open === 1 ? "task" : "tasks"} due today`,
      window: "today",
      completion: "open",
      disabled: false
    };
  }

  if (total > 0) {
    return {
      label: "Review done",
      ariaLabel: "Review completed tasks due today",
      window: "today",
      completion: "done",
      disabled: false
    };
  }

  if (dueTomorrow > 0) {
    return {
      label: "Show tomorrow",
      ariaLabel: `Show ${dueTomorrow} open ${dueTomorrow === 1 ? "task" : "tasks"} due tomorrow`,
      window: "tomorrow",
      completion: "open",
      disabled: false
    };
  }

  return {
    label: "Plan tasks",
    ariaLabel: "Show open tasks",
    window: "all",
    completion: "open",
    disabled: false
  };
}

function toDateInput(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
