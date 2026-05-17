export const TASK_LABEL_SHORTCUTS = [
  { key: "work", label: "Work" },
  { key: "home", label: "Home" },
  { key: "ideas", label: "Ideas" },
  { key: "personal", label: "Personal" }
];

export function getTaskLabelShortcutValue(key) {
  return TASK_LABEL_SHORTCUTS.some((shortcut) => shortcut.key === key) ? key : null;
}

export function getVisibleTaskLabelShortcuts(task) {
  const currentLabel = getTaskLabelShortcutValue(task?.label) || "ideas";
  return TASK_LABEL_SHORTCUTS.filter((shortcut) => shortcut.key !== currentLabel);
}
