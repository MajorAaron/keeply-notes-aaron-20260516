export const NOTE_COLOR_SHORTCUTS = [
  { key: "sun", label: "Sun" },
  { key: "mint", label: "Mint" },
  { key: "sky", label: "Sky" },
  { key: "rose", label: "Rose" },
  { key: "ink", label: "Ink" }
];

export function getVisibleNoteColorShortcuts(note) {
  const currentColor = note?.color || "sun";
  return NOTE_COLOR_SHORTCUTS.filter((shortcut) => shortcut.key !== currentColor);
}

export function getNoteColorShortcutValue(key) {
  return NOTE_COLOR_SHORTCUTS.some((shortcut) => shortcut.key === key) ? key : null;
}
