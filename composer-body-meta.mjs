const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

export function getComposerBodyMeta(text, { mode = "note" } = {}) {
  const content = typeof text === "string" ? text.trim() : "";
  const wordCount = content ? Array.from(content.matchAll(WORD_PATTERN)).length : 0;
  const lineCount = content ? content.split(/\r\n|\r|\n/).filter((line) => line.trim()).length : 0;
  const checklistCount = content
    ? content.split(/\r\n|\r|\n/).filter((line) => /^\s*[-*]\s+\[[ xX]\]/.test(line)).length
    : 0;

  if (!wordCount && !checklistCount) {
    return {
      visible: false,
      label: mode === "task" ? "Task details are empty" : "Note body is empty",
      title: "Start typing to see a quick draft summary"
    };
  }

  const parts = [];
  if (wordCount) parts.push(`${wordCount} ${wordCount === 1 ? "word" : "words"}`);
  if (lineCount > 1) parts.push(`${lineCount} lines`);
  if (checklistCount) parts.push(`${checklistCount} ${checklistCount === 1 ? "check" : "checks"}`);

  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  if (mode !== "task" && wordCount >= 40) {
    parts.push(`${readingMinutes} min read`);
  }

  const label = parts.join(" • ");
  return {
    visible: true,
    label,
    title: mode === "task" ? `Task detail summary: ${label}` : `Note draft summary: ${label}`
  };
}
