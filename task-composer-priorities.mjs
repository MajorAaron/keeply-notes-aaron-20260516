export const TASK_COMPOSER_PRIORITY_PRESETS = [
  { key: "high", label: "High" },
  { key: "normal", label: "Normal" },
  { key: "low", label: "Low" }
];

const PRIORITY_COPY = {
  high: "High priority selected",
  normal: "Normal priority selected",
  low: "Low priority selected"
};

export function normalizeTaskComposerPriority(value) {
  return TASK_COMPOSER_PRIORITY_PRESETS.some((preset) => preset.key === value) ? value : "normal";
}

export function getTaskComposerPriorityLabel(value) {
  return PRIORITY_COPY[normalizeTaskComposerPriority(value)];
}
