const labelPalettes = {
  work: ["#9fd4ff", "#37678a", "#ffffff"],
  home: ["#9ce0b6", "#2f6a49", "#ffffff"],
  ideas: ["#f8d75f", "#8f6b13", "#232426"],
  personal: ["#f7a9b7", "#87384b", "#ffffff"]
};

export function buildLocalNoteImage({ title = "", body = "", prompt = "", label = "ideas" } = {}) {
  const source = cleanText(prompt || body || title, "Visual note", 220);
  const palette = labelPalettes[label] || labelPalettes.ideas;
  const seed = hashText(`${source} ${label}`);
  const shapes = buildShapes(seed, palette);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" role="img" aria-label="${escapeXml(source)}">`,
    `<rect width="1024" height="768" fill="${palette[0]}"/>`,
    `<circle cx="${180 + (seed % 180)}" cy="${170 + (seed % 120)}" r="${170 + (seed % 80)}" fill="${palette[2]}" opacity=".34"/>`,
    `<path d="M0 620 C220 520 370 730 570 612 C752 505 852 612 1024 524 L1024 768 L0 768 Z" fill="${palette[1]}" opacity=".22"/>`,
    shapes,
    `<rect x="84" y="84" width="856" height="600" rx="52" fill="none" stroke="${palette[2]}" stroke-width="18" opacity=".44"/>`,
    "</svg>"
  ].join("");

  return {
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    mime: "image/svg+xml",
    name: "Local visual",
    alt: source,
    prompt: source,
    generated: true,
    localFallback: true,
    createdAt: new Date().toISOString()
  };
}

export function dataUrlBytes(src) {
  const value = String(src || "");
  const [, payload = ""] = value.split(",");
  if (!payload) return 0;
  if (/;base64[,;]/.test(value)) return Math.round((payload.length * 3) / 4);
  return new TextEncoder().encode(decodeURIComponent(payload)).length;
}

function buildShapes(seed, palette) {
  const count = 4 + (seed % 3);
  const shapes = [];
  for (let index = 0; index < count; index += 1) {
    const next = hashText(`${seed}-${index}`);
    const x = 120 + (next % 720);
    const y = 120 + ((next >> 3) % 500);
    const size = 76 + ((next >> 5) % 150);
    const color = palette[index % palette.length];
    const opacity = 0.28 + (((next >> 7) % 30) / 100);
    shapes.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${24 + (next % 28)}" fill="${color}" opacity="${opacity}" transform="rotate(${next % 28} ${x} ${y})"/>`);
  }
  return shapes.join("");
}

function hashText(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function cleanText(value, fallback, maxLength) {
  const cleaned = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
  return cleaned || fallback;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
