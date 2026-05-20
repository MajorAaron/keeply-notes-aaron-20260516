const DURATION_PATTERNS = [
  /(?:^|\s)(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b(?:\s+(\d{1,2})\s*(?:m|min|mins|minute|minutes)\b)?/i,
  /(?:^|\s)(\d{1,3})\s*(?:m|min|mins|minute|minutes)\b/i
];

export function getTaskTimeEstimateMeta(task) {
  const text = `${task?.title || ""} ${task?.details || ""}`.replace(/\s+/g, " ").trim();
  if (!text) return unavailableMeta();

  const estimate = extractTaskEstimateMinutes(text);
  if (!estimate) return unavailableMeta();

  const label = formatEstimateLabel(estimate);
  return {
    available: true,
    label,
    ariaLabel: `Estimated task time ${formatEstimateAria(estimate)}`
  };
}

export function extractTaskEstimateMinutes(text) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source) return 0;

  const hourMatch = DURATION_PATTERNS[0].exec(source);
  if (hourMatch) {
    const hours = Number.parseFloat(hourMatch[1]);
    const minutes = Number.parseInt(hourMatch[2] || "0", 10);
    const total = Math.round(hours * 60) + (Number.isFinite(minutes) ? minutes : 0);
    return normalizeEstimateMinutes(total);
  }

  const minuteMatch = DURATION_PATTERNS[1].exec(source);
  if (minuteMatch) {
    return normalizeEstimateMinutes(Number.parseInt(minuteMatch[1], 10));
  }

  return 0;
}

function normalizeEstimateMinutes(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 24 * 60) return 0;
  return Math.round(minutes);
}

function formatEstimateLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function formatEstimateAria(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  return parts.join(" ");
}

function unavailableMeta() {
  return {
    available: false,
    label: "",
    ariaLabel: ""
  };
}
