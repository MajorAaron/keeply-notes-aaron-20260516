const emptyMentionMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const mentionPattern = /(^|[^\p{L}\p{N}_.-])@([\p{L}][\p{L}\p{N}_-]{1,31})/gu;

function normalizeMention(rawMention) {
  return String(rawMention || "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function displayMention(rawMention) {
  const normalized = normalizeMention(rawMention);
  if (!normalized) return "";
  return `@${normalized.replace(/\s+/g, "")}`;
}

export function getItemMentionMeta(text) {
  const value = String(text || "");
  if (!value.trim()) {
    return { ...emptyMentionMeta };
  }

  const mentions = [];
  const seen = new Set();
  for (const match of value.matchAll(mentionPattern)) {
    const rawMention = match[2];
    const normalized = normalizeMention(rawMention);
    const key = normalized.toLocaleLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    mentions.push({ raw: rawMention, label: displayMention(rawMention), name: normalized });
  }

  if (mentions.length === 0) {
    return { ...emptyMentionMeta };
  }

  const first = mentions[0];
  if (mentions.length === 1) {
    return {
      available: true,
      label: first.label,
      ariaLabel: `Mentions ${first.label}`,
      tone: "single"
    };
  }

  return {
    available: true,
    label: `${first.label} +${mentions.length - 1}`,
    ariaLabel: `Mentions ${mentions.length} people or groups including ${first.label}`,
    tone: "multiple"
  };
}
