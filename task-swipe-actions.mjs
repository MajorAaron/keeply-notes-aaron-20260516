const DEFAULT_SWIPE_THRESHOLD = 70;

export function getTaskSwipeAction({ deltaX = 0, view = "", completed = false, threshold = DEFAULT_SWIPE_THRESHOLD } = {}) {
  if (Math.abs(deltaX) <= threshold) return null;

  if (view === "tasks") {
    if (deltaX > 0) return completed ? "reopen" : "complete";
    return "archive";
  }

  if (deltaX > 0 && (view === "archive" || view === "trash")) return "restore";

  return null;
}
