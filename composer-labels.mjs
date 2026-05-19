export const COMPOSER_LABEL_PRESETS = [
  { key: "ideas", label: "Ideas" },
  { key: "work", label: "Work" },
  { key: "home", label: "Home" },
  { key: "personal", label: "Personal" }
];

const VALID_LABELS = new Set(COMPOSER_LABEL_PRESETS.map((preset) => preset.key));

export function normalizeComposerLabel(label, fallback = "ideas") {
  if (VALID_LABELS.has(label)) return label;
  if (VALID_LABELS.has(fallback)) return fallback;
  return "ideas";
}

export function getComposerLabelPresetState(activeLabel) {
  const normalized = normalizeComposerLabel(activeLabel);
  return COMPOSER_LABEL_PRESETS.map((preset) => ({
    ...preset,
    active: preset.key === normalized,
    ariaLabel: preset.key === normalized ? `${preset.label} label selected` : `Set ${preset.label} label`
  }));
}
