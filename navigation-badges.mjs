const NAV_BADGE_CONFIG = {
  active: { singular: "active note", plural: "active notes" },
  tasks: { singular: "open task", plural: "open tasks" },
  archive: { singular: "archived item", plural: "archived items" },
  trash: { singular: "trashed item", plural: "trashed items" }
};

export function getNavigationBadges({ notes = [], tasks = [] } = {}) {
  const safeNotes = Array.isArray(notes) ? notes : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const counts = {
    active: safeNotes.filter((note) => note.status === "active").length,
    tasks: safeTasks.filter((task) => task.status === "active" && !task.completed).length,
    archive: countByStatus(safeNotes, "archive") + countByStatus(safeTasks, "archive"),
    trash: countByStatus(safeNotes, "trash") + countByStatus(safeTasks, "trash")
  };

  return Object.fromEntries(
    Object.entries(counts).map(([view, count]) => [
      view,
      {
        count,
        visible: count > 0,
        label: formatBadgeCount(count),
        ariaLabel: formatBadgeAriaLabel(view, count)
      }
    ])
  );
}

function countByStatus(items, status) {
  return items.filter((item) => item.status === status).length;
}

function formatBadgeCount(count) {
  if (count > 99) return "99+";
  return String(Math.max(0, count));
}

function formatBadgeAriaLabel(view, count) {
  const config = NAV_BADGE_CONFIG[view] || { singular: "item", plural: "items" };
  const noun = count === 1 ? config.singular : config.plural;
  return `${count} ${noun}`;
}
