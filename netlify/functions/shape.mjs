const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const allowedLabels = new Set(["work", "home", "ideas", "personal"]);
const allowedColors = new Set(["sun", "mint", "sky", "rose", "ink"]);
const allowedPriorities = new Set(["low", "normal", "high"]);
const allowedTypes = new Set(["note", "task"]);

function response(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });
}

function getEnv(name) {
  return globalThis.Netlify?.env?.get?.(name);
}

async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function cleanText(value, fallback, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return (text || fallback).slice(0, maxLength);
}

function clampNumber(value, min, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function normalizeShape(value) {
  const type = allowedTypes.has(value?.type) ? value.type : "note";
  const label = allowedLabels.has(value?.label) ? value.label : "ideas";

  return {
    type,
    title: cleanText(value?.title, type === "task" ? "Follow up" : "Captured thought", 70),
    body: cleanText(value?.body, "", 260),
    label,
    color: allowedColors.has(value?.color) ? value.color : label === "work" ? "sky" : "sun",
    priority: allowedPriorities.has(value?.priority) ? value.priority : "normal",
    dueOffsetDays: clampNumber(value?.dueOffsetDays, 0, 14),
    summary: cleanText(value?.summary, "Draft shaped", 80)
  };
}

function extractJson(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Claude returned an unreadable response");
    return JSON.parse(match[0]);
  }
}

function buildPrompt(payload) {
  const draft = payload?.draft || {};

  return {
    system:
      "You are Keeply Shape, a concise capture assistant inside a notes and tasks app. Return only compact JSON. Clean up the user's rough capture without adding sensitive facts.",
    user: JSON.stringify({
      instructions:
        "Return JSON with shape {\"type\":\"note|task\",\"title\":\"max 70 chars\",\"body\":\"max 260 chars\",\"label\":\"work|home|ideas|personal\",\"color\":\"sun|mint|sky|rose|ink\",\"priority\":\"low|normal|high\",\"dueOffsetDays\":0,\"summary\":\"short toast\"}. Choose task only when the capture clearly implies an action. For tasks, dueOffsetDays should be 0 for today, 1 for tomorrow, otherwise 2-14 if a later due date is implied. Keep the user's meaning intact.",
      draft: {
        mode: draft.mode === "task" ? "task" : "note",
        title: cleanText(draft.title, "", 120),
        body: cleanText(draft.body, "", 900),
        label: allowedLabels.has(draft.label) ? draft.label : "ideas"
      }
    })
  };
}

async function askClaude(payload) {
  const apiKey = getEnv("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const prompt = buildPrompt(payload);
  const model = getEnv("ANTHROPIC_MODEL") || "claude-haiku-4-5-20251001";
  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      temperature: 0.25,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }]
    })
  });

  const data = await anthropicResponse.json();
  if (!anthropicResponse.ok) {
    throw new Error(data?.error?.message || `Claude returned ${anthropicResponse.status}`);
  }

  const text = data?.content?.find((block) => block.type === "text")?.text || "";
  return normalizeShape(extractJson(text));
}

export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (request.method !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  try {
    return response(200, await askClaude(await parseBody(request)));
  } catch (error) {
    console.error(error);
    return response(500, { error: error.message || "Shape failed" });
  }
};

export const config = {
  path: "/api/shape"
};
