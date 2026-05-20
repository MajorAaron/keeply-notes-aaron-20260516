const DAY_MS = 86400000;
const STALE_DAY_THRESHOLD = 7;

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayDelta(date, now) {
  const thenDay = startOfLocalDay(date);
  const nowDay = startOfLocalDay(now);
  return Math.max(0, Math.round((nowDay - thenDay) / DAY_MS));
}

function getShortAge(days) {
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function getSpokenAge(days) {
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function getTaskActivityMeta(task = {}, options = {}) {
  const now = parseDate(options.now) || new Date();
  const activityDate = parseDate(task.updatedAt) || parseDate(task.createdAt);

  if (!activityDate) {
    return {
      available: false,
      label: "",
      ariaLabel: "",
      tone: "fresh"
    };
  }

  const days = getDayDelta(activityDate, now);
  const shortAge = getShortAge(days);
  const spokenAge = getSpokenAge(days);

  if (task.completed) {
    return {
      available: true,
      label: `Done ${shortAge}`,
      ariaLabel: `Task completed ${spokenAge}`,
      tone: "done"
    };
  }

  if (days >= STALE_DAY_THRESHOLD) {
    return {
      available: true,
      label: `Stale ${days}d`,
      ariaLabel: `Task last updated ${days} days ago`,
      tone: "stale"
    };
  }

  return {
    available: true,
    label: `Updated ${shortAge}`,
    ariaLabel: `Task updated ${spokenAge}`,
    tone: days === 0 ? "fresh" : "recent"
  };
}
