const emptyTagMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const hashtagPattern = /(^|[^\p{L}\p{N}_])#([\p{L}][\p{L}\p{N}_-]{1,31})/gu;

function normalizeTag(rawTag) {
  return String(rawTag || "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function displayTag(rawTag) {
  const normalized = normalizeTag(rawTag);
  if (!normalized) return "";
  return `#${normalized.replace(/\s+/g, "")}`;
}

export function getItemTagMeta(text) {
  const value = String(text || "");
  if (!value.trim()) {
    return { ...emptyTagMeta };
  }

  const tags = [];
  const seen = new Set();
  for (const match of value.matchAll(hashtagPattern)) {
    const rawTag = match[2];
    const normalized = normalizeTag(rawTag);
    const key = normalized.toLocaleLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    tags.push({ raw: rawTag, label: displayTag(rawTag), name: normalized });
  }

  if (tags.length === 0) {
    return { ...emptyTagMeta };
  }

  const first = tags[0];
  if (tags.length === 1) {
    return {
      available: true,
      label: first.label,
      ariaLabel: `Contains tag ${first.label}`,
      tone: "single"
    };
  }

  return {
    available: true,
    label: `${first.label} +${tags.length - 1}`,
    ariaLabel: `Contains ${tags.length} tags including ${first.label}`,
    tone: "multiple"
  };
}
