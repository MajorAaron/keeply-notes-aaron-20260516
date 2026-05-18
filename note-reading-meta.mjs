const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;
const WORDS_PER_MINUTE = 220;

export function getNoteReadingMeta(body) {
  const text = typeof body === "string" ? body.trim() : "";
  const words = text.match(WORD_PATTERN) || [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      label: "Quick note",
      ariaLabel: "Quick note with no body text",
      wordCount,
      minutes: 0
    };
  }

  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  const wordLabel = wordCount === 1 ? "word" : "words";
  const minuteLabel = minutes === 1 ? "minute" : "minutes";

  return {
    label: `${wordCount} ${wordLabel} · ${minutes} min`,
    ariaLabel: `${wordCount} ${wordLabel}, about ${minutes} ${minuteLabel} to read`,
    wordCount,
    minutes
  };
}
