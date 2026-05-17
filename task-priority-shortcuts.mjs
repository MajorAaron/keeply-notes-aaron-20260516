export const TASK_PRIORITY_SHORTCUTS = [
  { key: "high", label: "High" },
  { key: "normal", label: "Normal" },
  { key: "low", label: "Low" }
];

export function getTaskPriorityShortcutValue(key) {
  return TASK_PRIORITY_SHORTCUTS.some((shortcut) => shortcut.key === key) ? key : null;
}

export function getVisibleTaskPriorityShortcuts(task) {
  const currentPriority = getTaskPriorityShortcutValue(task?.priority) || "normal";
  return TASK_PRIORITY_SHORTCUTS.filter((shortcut) => shortcut.key !== currentPriority);
}
