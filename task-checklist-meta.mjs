const checklistLinePattern = /^\s*(?:[-*+]\s*)?\[(?<mark>[ xX])\]\s+(.+?)\s*$/;

export function getTaskChecklistMeta(details) {
  const lines = String(details || "").split(/\r?\n/);
  let total = 0;
  let checked = 0;

  for (const line of lines) {
    const match = line.match(checklistLinePattern);
    if (!match) continue;
    total += 1;
    if ((match.groups?.mark || "").toLowerCase() === "x") checked += 1;
  }

  if (total === 0) {
    return {
      available: false,
      checked: 0,
      total: 0,
      label: "",
      ariaLabel: "No checklist items"
    };
  }

  const noun = total === 1 ? "item" : "items";
  return {
    available: true,
    checked,
    total,
    label: `${checked}/${total} checked`,
    ariaLabel: `${checked} of ${total} checklist ${noun} checked`
  };
}
