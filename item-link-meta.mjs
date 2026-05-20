const URL_PATTERN = /\bhttps?:\/\/[^\s<>()]+/gi;

export function getItemLinkMeta(text = "") {
  const links = extractLinks(text);
  const count = links.length;

  if (count === 0) {
    return {
      available: false,
      count: 0,
      label: "",
      ariaLabel: "No links",
      firstUrl: ""
    };
  }

  const host = getHostLabel(links[0]);
  const label = count === 1 ? "1 link" : `${count} links`;

  return {
    available: true,
    count,
    label,
    ariaLabel: host ? `${label}, first link to ${host}` : label,
    firstUrl: links[0]
  };
}

export function extractLinks(text = "") {
  if (typeof text !== "string" || !text.trim()) return [];
  const matches = text.match(URL_PATTERN) || [];
  const seen = new Set();
  const links = [];

  for (const match of matches) {
    const url = match.replace(/[.,;:!?]+$/g, "");
    if (seen.has(url)) continue;
    seen.add(url);
    links.push(url);
  }

  return links;
}

function getHostLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
