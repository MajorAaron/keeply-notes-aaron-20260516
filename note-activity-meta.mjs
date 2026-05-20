const DAY_MS = 86400000;
const STALE_DAY_THRESHOLD = 14;

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

function sameTimestamp(a, b) {
  const first = parseDate(a);
  const second = parseDate(b);
  if (!first || !second) return !first && !second;
  return Math.abs(first.getTime() - second.getTime()) < 1000;
}

export function getNoteActivityMeta(note = {}, options = {}) {
  const now = parseDate(options.now) || new Date();
  const updatedAt = parseDate(note.updatedAt);
  const createdAt = parseDate(note.createdAt);
  const activityDate = updatedAt || createdAt;

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
  const createdOnly = !updatedAt || sameTimestamp(note.updatedAt, note.createdAt);

  if (note.pinned) {
    return {
      available: true,
      label: `Pinned ${shortAge}`,
      ariaLabel: `Pinned note updated ${spokenAge}`,
      tone: "pinned"
    };
  }

  if (!createdOnly && days >= STALE_DAY_THRESHOLD) {
    return {
      available: true,
      label: `Stale ${days}d`,
      ariaLabel: `Note last edited ${days} days ago`,
      tone: "stale"
    };
  }

  if (createdOnly) {
    return {
      available: true,
      label: `Created ${shortAge}`,
      ariaLabel: `Note created ${spokenAge}`,
      tone: days === 0 ? "fresh" : "recent"
    };
  }

  return {
    available: true,
    label: `Edited ${shortAge}`,
    ariaLabel: `Note edited ${spokenAge}`,
    tone: days === 0 ? "fresh" : "recent"
  };
}
