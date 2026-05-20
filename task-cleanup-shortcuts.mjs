const CLEANUP_SHORTCUTS = {
  done: {
    label: "done",
    window: "all",
    completion: "done",
    title: "Show completed tasks"
  },
  overdue: {
    label: "overdue",
    window: "overdue",
    completion: "open",
    title: "Show overdue tasks"
  }
};

export function getTaskCleanupShortcut(kind, count = 0) {
  const shortcut = CLEANUP_SHORTCUTS[kind];
  const safeCount = normalizeCount(count);
  if (!shortcut) return null;

  return {
    kind,
    count: safeCount,
    label: `${safeCount} ${shortcut.label}`,
    ariaLabel: safeCount > 0 ? `${shortcut.title}: ${safeCount}` : `No ${shortcut.label} tasks`,
    disabled: safeCount === 0,
    taskWindow: shortcut.window,
    taskCompletion: shortcut.completion,
    taskPriority: "all",
    toast: shortcut.title
  };
}

function normalizeCount(count) {
  const number = Number(count);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.floor(number);
}
