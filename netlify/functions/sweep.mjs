const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const allowedActions = new Set(["archive_note", "pin_note", "create_task", "raise_task", "snooze_task"]);
const allowedTargetTypes = new Set(["note", "task"]);
const allowedLabels = new Set(["work", "home", "ideas", "personal"]);
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

function cleanItem(item, type) {
  return {
    id: cleanText(item?.id, "", 80),
    type,
    title: cleanText(item?.title, "", 90),
    body: cleanText(item?.body, "", 220),
    label: allowedLabels.has(item?.label) ? item.label : "ideas",
    priority: allowedPriorities.has(item?.priority) ? item.priority : undefined,
    dueAt: cleanText(item?.dueAt, "", 20),
    completed: Boolean(item?.completed),
    pinned: Boolean(item?.pinned),
    createdAt: cleanText(item?.createdAt, "", 32),
    updatedAt: cleanText(item?.updatedAt, "", 32)
  };
}

function normalizeSweep(value) {
  const suggestions = (Array.isArray(value?.suggestions) ? value.suggestions : [])
    .slice(0, 4)
    .map((item) => ({
      action: allowedActions.has(item?.action) ? item.action : "pin_note",
      targetId: cleanText(item?.targetId, "", 80),
      targetType: allowedTargetTypes.has(item?.targetType) ? item.targetType : "note",
      title: cleanText(item?.title, "Review item", 70),
      reason: cleanText(item?.reason, "This item is ready for a quick cleanup.", 150),
      taskTitle: cleanText(item?.taskTitle, "", 70),
      taskBody: cleanText(item?.taskBody, "", 220)
    }))
    .filter((item) => item.targetId);

  return {
    title: cleanText(value?.title, "Smart sweep", 70),
    summary: cleanText(value?.summary, "A few cleanup moves are ready.", 140),
    suggestions
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
  const notes = (Array.isArray(payload?.notes) ? payload.notes : []).slice(0, 12).map((item) => cleanItem(item, "note"));
  const tasks = (Array.isArray(payload?.tasks) ? payload.tasks : []).slice(0, 12).map((item) => cleanItem(item, "task"));

  return {
    system:
      "You are Keeply Smart Sweep, a careful organizing assistant. Return only compact JSON. Recommend safe cleanup actions from supplied Keeply notes and tasks only.",
    user: JSON.stringify({
      instructions:
        "Return JSON with shape {\"title\":\"short headline\",\"summary\":\"one sentence\",\"suggestions\":[...]}. Include 2-4 suggestions. Each suggestion needs action archive_note|pin_note|create_task|raise_task|snooze_task, targetId, targetType note|task, title, and reason. For create_task also include taskTitle and taskBody. Prefer stale unpinned notes for archive, action-like notes for create_task, overdue tasks for snooze_task, important tasks for raise_task, and important active notes for pin_note. Never suggest deleting.",
      notes,
      tasks
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
      max_tokens: 850,
      temperature: 0.35,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }]
    })
  });

  const data = await anthropicResponse.json();
  if (!anthropicResponse.ok) {
    throw new Error(data?.error?.message || `Claude returned ${anthropicResponse.status}`);
  }

  const text = data?.content?.find((block) => block.type === "text")?.text || "";
  const sweep = normalizeSweep(extractJson(text));
  if (sweep.suggestions.length === 0) {
    throw new Error("Claude returned no sweep suggestions");
  }

  return sweep;
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
    return response(500, { error: error.message || "Sweep failed" });
  }
};

export const config = {
  path: "/api/sweep"
};
