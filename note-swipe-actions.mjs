const DEFAULT_SWIPE_THRESHOLD = 70;

export function getNoteSwipeAction({ deltaX = 0, view = "", pinned = false, threshold = DEFAULT_SWIPE_THRESHOLD } = {}) {
  if (Math.abs(deltaX) <= threshold) return null;

  if (view === "active") {
    if (deltaX > 0) return pinned ? "unpin" : "pin";
    return "archive";
  }

  if (view === "archive") {
    return deltaX > 0 ? "restore" : "trash";
  }

  if (view === "trash" && deltaX > 0) return "restore";

  return null;
}
