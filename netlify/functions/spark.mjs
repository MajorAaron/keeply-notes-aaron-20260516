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
  return globalThis.Netlify?.env?.get?.(name) || process.env[name];
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

function normalizeSuggestion(suggestion, index) {
  const type = allowedTypes.has(suggestion?.type) ? suggestion.type : index === 0 ? "task" : "note";
  const label = allowedLabels.has(suggestion?.label) ? suggestion.label : "ideas";
  const color = allowedColors.has(suggestion?.color) ? suggestion.color : ["sun", "mint", "sky"][index % 3];
  const priority = allowedPriorities.has(suggestion?.priority) ? suggestion.priority : "normal";
  const dueOffsetDays = Math.min(14, Math.max(0, Number.parseInt(suggestion?.dueOffsetDays, 10) || 0));

  return {
    type,
    title: cleanText(suggestion?.title, type === "task" ? "Follow up" : "Spark note", 70),
    body: cleanText(suggestion?.body, "Clarify the next move and save it in Keeply.", 220),
    label,
    color,
    priority,
    dueOffsetDays
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
  const items = Array.isArray(payload?.items) ? payload.items.slice(0, 12) : [];

  return {
    system:
      "You are Keeply Spark, a concise personal note assistant. Return only compact JSON. Create practical notes and tasks from the user's draft and recent Keeply context. Do not invent sensitive personal facts.",
    user: JSON.stringify({
      instructions:
        "Return JSON with shape {\"summary\":\"short toast text\",\"suggestions\":[...]}. Include exactly 3 suggestions. Each suggestion needs type note|task, title, body, label work|home|ideas|personal, color sun|mint|sky|rose|ink, priority low|normal|high, dueOffsetDays 0-14. Favor one task and two notes unless task mode clearly needs more tasks.",
      draft: {
        mode: draft.mode === "task" ? "task" : "note",
        title: cleanText(draft.title, "", 120),
        body: cleanText(draft.body, "", 900),
        label: allowedLabels.has(draft.label) ? draft.label : "ideas"
      },
      recentItems: items.map((item) => ({
        type: allowedTypes.has(item.type) ? item.type : "note",
        title: cleanText(item.title, "", 90),
        body: cleanText(item.body, "", 180),
        label: allowedLabels.has(item.label) ? item.label : "ideas",
        priority: allowedPriorities.has(item.priority) ? item.priority : undefined,
        dueAt: cleanText(item.dueAt, "", 20)
      }))
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
      max_tokens: 900,
      temperature: 0.6,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }]
    })
  });

  const data = await anthropicResponse.json();
  if (!anthropicResponse.ok) {
    const message = data?.error?.message || `Claude returned ${anthropicResponse.status}`;
    throw new Error(message);
  }

  const text = data?.content?.find((block) => block.type === "text")?.text || "";
  const parsed = extractJson(text);
  const suggestions = (Array.isArray(parsed.suggestions) ? parsed.suggestions : [])
    .slice(0, 3)
    .map(normalizeSuggestion);

  if (suggestions.length === 0) {
    throw new Error("Claude returned no suggestions");
  }

  return {
    summary: cleanText(parsed.summary, "Spark suggestions ready", 80),
    suggestions
  };
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
    return response(500, { error: error.message || "Spark failed" });
  }
};

export const config = {
  path: "/api/spark"
};
