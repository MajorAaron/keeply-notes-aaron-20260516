const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function cleanSuggestion(item, fallbackLabel) {
  const type = item?.type === "task" ? "task" : "note";
  return {
    type,
    title: String(item?.title || "Untitled").slice(0, 90),
    body: String(item?.body || "").slice(0, 260),
    label: ["work", "home", "ideas", "personal"].includes(item?.label) ? item.label : fallbackLabel,
    color: ["sun", "mint", "sky", "rose", "ink"].includes(item?.color) ? item.color : "sun",
    priority: ["low", "normal", "high"].includes(item?.priority) ? item.priority : "normal",
    dueOffsetDays: Number.isFinite(Number(item?.dueOffsetDays)) ? Math.max(1, Math.min(14, Number(item.dueOffsetDays))) : 2
  };
}

function fallbackSuggestions(draft = {}) {
  const base = draft.title || draft.body || "the idea";
  const label = ["work", "home", "ideas", "personal"].includes(draft.label) ? draft.label : "ideas";
  return {
    summary: "Spark drafted a few next moves.",
    suggestions: [
      { type: "task", title: `Define the first step for ${base}`, body: "Write one tiny action you can finish in the next 24 hours.", label, priority: "normal", dueOffsetDays: 1 },
      { type: "note", title: `${base}: why it matters`, body: "Capture the reason, constraints, and what success would look like.", label, color: "sun" },
      { type: "task", title: `Schedule a check-in for ${base}`, body: "Pick a realistic review point and adjust the plan based on progress.", label, priority: "normal", dueOffsetDays: 7 }
    ]
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { ...headers, allow: "POST" }, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" }) };
  }

  const draft = payload.draft || {};
  const items = Array.isArray(payload.items) ? payload.items.slice(0, 12) : [];
  const fallbackLabel = ["work", "home", "ideas", "personal"].includes(draft.label) ? draft.label : "ideas";

  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 800,
        temperature: 0.7,
        system: "You generate concise productivity suggestions for a notes/tasks app. Return only valid JSON with a string summary and exactly 3 suggestions. Each suggestion has type note|task, title, body, label work|home|ideas|personal, optional color sun|mint|sky|rose|ink, optional priority low|normal|high, optional dueOffsetDays 1-14.",
        messages: [
          {
            role: "user",
            content: JSON.stringify({ draft, recent_items: items })
          }
        ]
      })
    });

    const data = await anthropicResponse.json();
    if (!anthropicResponse.ok) {
      throw new Error(data?.error?.message || `Anthropic returned ${anthropicResponse.status}`);
    }

    const text = data?.content?.map((part) => part?.text || "").join("\n").trim() || "";
    const parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3).map((s) => cleanSuggestion(s, fallbackLabel)) : [];
    if (!suggestions.length) throw new Error("No suggestions returned");

    return { statusCode: 200, headers, body: JSON.stringify({ summary: String(parsed.summary || "Spark is ready."), suggestions }) };
  } catch (error) {
    const fallback = fallbackSuggestions(draft);
    return { statusCode: 200, headers, body: JSON.stringify(fallback) };
  }
};
