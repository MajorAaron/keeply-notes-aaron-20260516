const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const allowedSizes = new Set(["1024x1024", "1024x1536", "1536x1024"]);
const allowedQualities = new Set(["low", "medium", "high"]);

function response(status, body) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function cleanText(value, fallback = "", maxLength = 1000) {
  const cleaned = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
  return cleaned || fallback;
}

function getEnv(name) {
  return globalThis.Netlify?.env?.get?.(name) || process.env[name];
}

function buildPrompt(payload) {
  const title = cleanText(payload?.title, "", 90);
  const body = cleanText(payload?.body, "", 700);
  const prompt = cleanText(payload?.prompt, "", 900);
  const label = cleanText(payload?.label, "ideas", 30);
  const parts = [
    prompt || body || title,
    title ? `Note title: ${title}` : "",
    body ? `Note context: ${body}` : "",
    `Keeply label: ${label}`,
    "Create a polished image for a personal note card. Avoid text, logos, watermarks, UI, and captions. Make it useful as a visual memory cue."
  ].filter(Boolean);

  return cleanText(parts.join("\n"), "", 1600);
}

function sanitizeImageResponse(data, payload) {
  const image = Array.isArray(data?.data) ? data.data[0] : null;
  if (!image?.b64_json) return null;

  const outputFormat = data.output_format === "jpeg" || data.output_format === "webp" ? data.output_format : "png";
  const mime = outputFormat === "jpeg" ? "image/jpeg" : `image/${outputFormat}`;
  const prompt = cleanText(payload?.prompt || payload?.body || payload?.title, "Generated image", 900);

  return {
    image: {
      src: `data:${mime};base64,${image.b64_json}`,
      mime,
      name: "Generated image",
      alt: cleanText(payload?.title, prompt, 140),
      prompt,
      generated: true,
      createdAt: new Date().toISOString()
    }
  };
}

export default async function handler(request) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: jsonHeaders });
  if (request.method !== "POST") return response(405, { error: "Method not allowed" });

  const apiKey = getEnv("OPENAI_API_KEY");
  if (!apiKey) return response(500, { error: "OPENAI_API_KEY is not set for the Keeply server." });

  const payload = await parseBody(request);
  const prompt = buildPrompt(payload);
  if (!prompt) return response(400, { error: "Add a prompt or note details first." });

  const model = cleanText(getEnv("OPENAI_IMAGE_MODEL"), "gpt-image-1", 80);
  const size = allowedSizes.has(payload?.size) ? payload.size : "1024x1024";
  const quality = allowedQualities.has(payload?.quality) ? payload.quality : "low";

  const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      quality,
      output_format: "jpeg"
    })
  });

  const data = await openaiResponse.json();
  if (!openaiResponse.ok) {
    return response(openaiResponse.status, { error: data?.error?.message || "Image generation failed." });
  }

  const sanitized = sanitizeImageResponse(data, { ...payload, prompt });
  if (!sanitized) return response(502, { error: "OpenAI returned no image data." });
  return response(200, sanitized);
}
