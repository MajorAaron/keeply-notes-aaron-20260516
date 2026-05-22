const emptySectionMeta = {
  available: false,
  label: "",
  ariaLabel: ""
};

const markdownHeadingPattern = /^(#{1,6})[ \t]+(.+?)\s*#*\s*$/gm;

export function getMarkdownSectionHeadings(text) {
  if (typeof text !== "string" || !text.trim()) return [];

  const headings = [];
  for (const match of text.matchAll(markdownHeadingPattern)) {
    const title = match[2].trim().replace(/\s+/g, " ");
    if (!title) continue;
    headings.push({
      level: match[1].length,
      title
    });
  }

  return headings;
}

export function getItemSectionMeta(text) {
  const headings = getMarkdownSectionHeadings(text);
  const count = headings.length;
  if (!count) return { ...emptySectionMeta };

  return {
    available: true,
    label: count === 1 ? "Section" : `${count} sections`,
    ariaLabel: count === 1 ? "Contains 1 markdown section heading" : `Contains ${count} markdown section headings`,
    tone: count === 1 ? "single" : "multiple"
  };
}
