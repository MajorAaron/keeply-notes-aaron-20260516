export const NOTE_LABEL_SHORTCUTS = [
  { key: "work", label: "Work" },
  { key: "home", label: "Home" },
  { key: "ideas", label: "Ideas" },
  { key: "personal", label: "Personal" }
];

export function getNoteLabelShortcutValue(key) {
  return NOTE_LABEL_SHORTCUTS.some((shortcut) => shortcut.key === key) ? key : null;
}

export function getVisibleNoteLabelShortcuts(note) {
  const currentLabel = getNoteLabelShortcutValue(note?.label) || "ideas";
  return NOTE_LABEL_SHORTCUTS.filter((shortcut) => shortcut.key !== currentLabel);
}
