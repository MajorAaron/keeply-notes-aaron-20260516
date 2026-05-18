export function insertChecklistMarker(value, selectionStart = 0, selectionEnd = selectionStart) {
  const text = String(value || "");
  const start = clampIndex(selectionStart, text.length);
  const end = clampIndex(selectionEnd, text.length);
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);
  const selected = text.slice(rangeStart, rangeEnd);

  if (selected.trim()) {
    const replacement = selected
      .split("\n")
      .map((line) => toChecklistLine(line))
      .join("\n");
    return {
      value: `${text.slice(0, rangeStart)}${replacement}${text.slice(rangeEnd)}`,
      selectionStart: rangeStart,
      selectionEnd: rangeStart + replacement.length
    };
  }

  const needsLeadingBreak = rangeStart > 0 && text[rangeStart - 1] !== "\n";
  const needsTrailingBreak = rangeStart < text.length && text[rangeStart] !== "\n";
  const insertion = `${needsLeadingBreak ? "\n" : ""}- [ ] ${needsTrailingBreak ? "\n" : ""}`;
  const cursor = rangeStart + insertion.length - (needsTrailingBreak ? 1 : 0);

  return {
    value: `${text.slice(0, rangeStart)}${insertion}${text.slice(rangeStart)}`,
    selectionStart: cursor,
    selectionEnd: cursor
  };
}

function toChecklistLine(line) {
  if (!line.trim()) return line;
  const indent = line.match(/^\s*/)?.[0] || "";
  const content = line.slice(indent.length);
  if (/^[-*]\s+\[[ xX]\]\s+/.test(content)) return line;
  return `${indent}- [ ] ${content.replace(/^[-*]\s+/, "")}`;
}

function clampIndex(value, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(max, Math.trunc(number)));
}
