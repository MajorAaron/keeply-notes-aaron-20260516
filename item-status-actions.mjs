const RESTORABLE_VIEWS = new Set(["archive", "trash"]);
const ITEM_TYPES = new Set(["note", "task"]);

function normalizeType(type) {
  return ITEM_TYPES.has(type) ? type : "item";
}

function itemName(type) {
  const normalized = normalizeType(type);
  return normalized === "item" ? "item" : normalized;
}

export function getArchiveRestoreAction({ view, type } = {}) {
  const name = itemName(type);
  const shouldRestore = RESTORABLE_VIEWS.has(view);

  if (shouldRestore) {
    return {
      action: "restore",
      status: "active",
      ariaLabel: `Restore ${name}`,
      title: `Restore ${name}`,
      buttonLabel: "Restore",
      message: "Restored"
    };
  }

  return {
    action: "archive",
    status: "archive",
    ariaLabel: `Archive ${name}`,
    title: `Archive ${name}`,
    buttonLabel: "",
    message: "Archived"
  };
}

export function getTrashAction({ view, type } = {}) {
  const name = itemName(type);

  if (view === "trash") {
    return {
      action: "deleteForever",
      ariaLabel: `Delete ${name} forever`,
      title: `Delete ${name} forever`,
      message: "Deleted forever"
    };
  }

  return {
    action: "trash",
    ariaLabel: `Move ${name} to trash`,
    title: `Move ${name} to trash`,
    message: "Moved to trash"
  };
}
