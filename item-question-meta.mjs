const emptyQuestionMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const questionWordPattern = /(?:^|[.!?\n]\s+|[-*•]\s+)(?:who|what|when|where|why|how|which|can|could|should|would|is|are|do|does|did|will)\b[^.!?\n]{2,}\?/gi;
const questionMarkPattern = /\?/g;

function countQuestionMarks(value) {
  return (value.match(questionMarkPattern) || []).length;
}

function countQuestionSentences(value) {
  const matchedRanges = [];
  for (const match of value.matchAll(questionWordPattern)) {
    matchedRanges.push([match.index || 0, (match.index || 0) + match[0].length]);
  }

  const directQuestionCount = countQuestionMarks(value);
  if (directQuestionCount <= matchedRanges.length) {
    return matchedRanges.length;
  }

  return directQuestionCount;
}

export function getItemQuestionMeta(text) {
  const value = String(text || "").trim();
  if (!value) {
    return { ...emptyQuestionMeta };
  }

  const questionCount = countQuestionSentences(value);
  if (questionCount < 1) {
    return { ...emptyQuestionMeta };
  }

  if (questionCount === 1) {
    return {
      available: true,
      label: "Question",
      ariaLabel: "Contains 1 question",
      tone: "single"
    };
  }

  return {
    available: true,
    label: `${questionCount} questions`,
    ariaLabel: `Contains ${questionCount} questions`,
    tone: "multiple"
  };
}
