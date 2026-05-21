const CONTEXT_TIME_PATTERN = /\b(?:at|by|before|after|around|from|until)\s+(noon|midnight|(?:[01]?\d|2[0-3])(?::([0-5]\d))?\s*(?:a\.?m\.?|p\.?m\.?)?)\b/i;
const MERIDIEM_TIME_PATTERN = /\b((?:1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(?:a\.?m\.?|p\.?m\.?))\b/i;
const COLON_24_HOUR_PATTERN = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;

export function getTaskScheduledTimeMeta(task) {
  const text = `${task?.title || ""} ${task?.details || ""}`.replace(/\s+/g, " ").trim();
  if (!text) return unavailableMeta();

  const scheduledTime = extractTaskScheduledTime(text);
  if (!scheduledTime) return unavailableMeta();

  return {
    available: true,
    label: scheduledTime.label,
    ariaLabel: `Mentions scheduled time ${scheduledTime.ariaLabel}`
  };
}

export function extractTaskScheduledTime(text) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source) return null;

  const contextMatch = CONTEXT_TIME_PATTERN.exec(source);
  if (contextMatch) {
    const parsed = parseTimeToken(contextMatch[1]);
    if (parsed) return parsed;
  }

  const meridiemMatch = MERIDIEM_TIME_PATTERN.exec(source);
  if (meridiemMatch) {
    const parsed = parseTimeToken(meridiemMatch[1]);
    if (parsed) return parsed;
  }

  const colonMatch = COLON_24_HOUR_PATTERN.exec(source);
  if (colonMatch) {
    const parsed = parseTimeParts(colonMatch[1], colonMatch[2], "");
    if (parsed) return parsed;
  }

  return null;
}

function parseTimeToken(token) {
  const normalized = String(token || "").trim().toLowerCase().replace(/\./g, "");
  if (normalized === "noon") {
    return { hour: 12, minute: 0, label: "Noon", ariaLabel: "noon" };
  }
  if (normalized === "midnight") {
    return { hour: 0, minute: 0, label: "Midnight", ariaLabel: "midnight" };
  }

  const match = /^(\d{1,2})(?::([0-5]\d))?\s*(am|pm)?$/.exec(normalized);
  if (!match) return null;
  return parseTimeParts(match[1], match[2] || "", match[3] || "");
}

function parseTimeParts(hourText, minuteText, meridiem) {
  let hour = Number.parseInt(hourText, 10);
  const minute = minuteText ? Number.parseInt(minuteText, 10) : 0;
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  const hasMeridiem = meridiem === "am" || meridiem === "pm";
  if (hasMeridiem) {
    if (hour < 1 || hour > 12) return null;
    if (meridiem === "am") hour = hour === 12 ? 0 : hour;
    if (meridiem === "pm") hour = hour === 12 ? 12 : hour + 12;
  } else if (!minuteText && hour < 13) {
    return null;
  }

  const label = formatScheduledTime(hour, minute);
  return { hour, minute, label, ariaLabel: label };
}

function formatScheduledTime(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const minuteLabel = minute ? `:${String(minute).padStart(2, "0")}` : "";
  return `${displayHour}${minuteLabel} ${period}`;
}

function unavailableMeta() {
  return {
    available: false,
    label: "",
    ariaLabel: ""
  };
}
