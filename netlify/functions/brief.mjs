const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const allowedPriorities = new Set(["low", "normal", "high"]);

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

function normalizeBrief(value) {
  const items = (Array.isArray(value?.items) ? value.items : [])
    .slice(0, 4)
    .map((item) => ({
      title: cleanText(item?.title, "Next action", 70),
      action: cleanText(item?.action, "Pick one small move and do it next.", 150),
      priority: allowedPriorities.has(item?.priority) ? item.priority : "normal"
    }));

  return {
    title: cleanText(value?.title, "Focus brief", 70),
    summary: cleanText(value?.summary, "A short plan is ready.", 140),
    items
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
  const tasks = Array.isArray(payload?.tasks) ? payload.tasks.slice(0, 8) : [];
  const notes = Array.isArray(payload?.notes) ? payload.notes.slice(0, 8) : [];

  return {
    system:
      "You are Keeply Focus Brief, a practical personal planning assistant. Return only compact JSON. Do not invent sensitive facts. Use the supplied tasks and notes only.",
    user: JSON.stringify({
      instructions:
        "Return JSON with shape {\"title\":\"short headline\",\"summary\":\"one sentence\",\"items\":[...]}. Include 2-4 items. Each item needs title, action, and priority low|normal|high. Prioritize overdue/high-priority tasks, then pinned notes that imply a next action.",
      tasks: tasks.map((task) => ({
        title: cleanText(task.title, "", 90),
        body: cleanText(task.body, "", 180),
        label: cleanText(task.label, "ideas", 20),
        priority: allowedPriorities.has(task.priority) ? task.priority : "normal",
        dueAt: cleanText(task.dueAt, "", 20)
      })),
      notes: notes.map((note) => ({
        title: cleanText(note.title, "", 90),
        body: cleanText(note.body, "", 180),
        label: cleanText(note.label, "ideas", 20),
        pinned: Boolean(note.pinned)
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
      max_tokens: 700,
      temperature: 0.4,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }]
    })
  });

  const data = await anthropicResponse.json();
  if (!anthropicResponse.ok) {
    throw new Error(data?.error?.message || `Claude returned ${anthropicResponse.status}`);
  }

  const text = data?.content?.find((block) => block.type === "text")?.text || "";
  const brief = normalizeBrief(extractJson(text));
  if (brief.items.length === 0) {
    throw new Error("Claude returned no brief items");
  }

  return brief;
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
    return response(500, { error: error.message || "Brief failed" });
  }
};

export const config = {
  path: "/api/brief"
};
