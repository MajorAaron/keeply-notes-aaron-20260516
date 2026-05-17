const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const allowedTypes = new Set(["note", "task"]);
const allowedLabels = new Set(["work", "home", "ideas", "personal"]);

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

function cleanItem(item) {
  const type = allowedTypes.has(item?.type) ? item.type : "note";
  return {
    id: cleanText(item?.id, "", 80),
    type,
    title: cleanText(item?.title, type === "task" ? "Untitled task" : "Untitled note", 90),
    body: cleanText(item?.body, "", 260),
    label: allowedLabels.has(item?.label) ? item.label : "ideas",
    pinned: Boolean(item?.pinned),
    priority: cleanText(item?.priority, "", 20),
    dueAt: cleanText(item?.dueAt, "", 20),
    completed: Boolean(item?.completed),
    updatedAt: cleanText(item?.updatedAt, "", 32)
  };
}

function normalizeAnswer(value, knownItems) {
  const knownIds = new Set(knownItems.map((item) => item.id));
  const sources = (Array.isArray(value?.sources) ? value.sources : [])
    .slice(0, 4)
    .map((source) => {
      const id = cleanText(source?.id, "", 80);
      const match = knownItems.find((item) => item.id === id);
      return {
        id,
        type: allowedTypes.has(source?.type) ? source.type : match?.type || "note",
        title: cleanText(source?.title, match?.title || "Source", 80),
        label: allowedLabels.has(source?.label) ? source.label : match?.label || "ideas"
      };
    })
    .filter((source) => knownIds.has(source.id));

  return {
    title: cleanText(value?.title, "Keeply answer", 70),
    answer: cleanText(value?.answer, "I could not find enough saved context to answer that.", 520),
    nextStep: cleanText(value?.nextStep, "Ask a narrower question or add more detail to Keeply.", 140),
    sources
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
  const question = cleanText(payload?.question, "", 220);
  const items = (Array.isArray(payload?.items) ? payload.items : []).slice(0, 24).map(cleanItem).filter((item) => item.id);

  return {
    question,
    items,
    system:
      "You are Ask Keeply, a careful assistant inside a personal notes and tasks app. Answer only from supplied Keeply items. If the answer is uncertain, say what is missing. Return only compact JSON.",
    user: JSON.stringify({
      instructions:
        "Return JSON with shape {\"title\":\"short headline\",\"answer\":\"direct answer from saved items\",\"nextStep\":\"one useful next move\",\"sources\":[{\"id\":\"source id\",\"type\":\"note|task\",\"title\":\"source title\",\"label\":\"work|home|ideas|personal\"}]}. Use 1-4 sources and never cite ids that are not supplied.",
      question,
      items
    })
  };
}

async function askClaude(payload) {
  const apiKey = getEnv("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const prompt = buildPrompt(payload);
  if (!prompt.question) {
    throw new Error("Question is required");
  }
  if (prompt.items.length === 0) {
    throw new Error("No Keeply items supplied");
  }

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
      max_tokens: 850,
      temperature: 0.2,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }]
    })
  });

  const data = await anthropicResponse.json();
  if (!anthropicResponse.ok) {
    throw new Error(data?.error?.message || `Claude returned ${anthropicResponse.status}`);
  }

  const text = data?.content?.find((block) => block.type === "text")?.text || "";
  return normalizeAnswer(extractJson(text), prompt.items);
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
    return response(500, { error: error.message || "Ask failed" });
  }
};

export const config = {
  path: "/api/ask"
};
