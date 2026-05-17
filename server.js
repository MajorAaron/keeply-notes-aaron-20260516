import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { handler as itemsHandler } from "./netlify/functions/items.mjs";
import shapeHandler from "./netlify/functions/shape.mjs";
import askHandler from "./netlify/functions/ask.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || "127.0.0.1";
const anthropicVersion = "2023-06-01";
const defaultModel = "claude-haiku-4-5-20251001";

loadLocalEnv();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (req.method === "POST" && url.pathname === "/api/spark") {
      await handleSpark(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/shape") {
      await handleShape(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/ask") {
      await handleAsk(req, res);
      return;
    }
    if (url.pathname === "/api/items") {
      await handleItems(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    await serveStatic(url.pathname, req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Server error" });
  }
});

server.listen(port, host, () => {
  console.log(`Keeply running at http://${host}:${port}`);
});

function loadLocalEnv() {
  const envPaths = [join(root, ".env"), join(homedir(), ".claude", "skills", "env.txt")];

  for (const envPath of envPaths) {
    if (!existsSync(envPath)) continue;

    const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }

  process.env.TURSO_DATABASE_URL ||= process.env.TURSO_DB_URL;
  process.env.TURSO_AUTH_TOKEN ||= process.env.TURSO_DB_TOKEN;
}

async function handleSpark(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "ANTHROPIC_API_KEY is not set for the Keeply server." });
    return;
  }

  const body = await readJsonBody(req);
  const payload = normalizeSparkPayload(body);
  const message = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": anthropicVersion,
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || defaultModel,
      max_tokens: 900,
      temperature: 0.8,
      system: [
        "You are Keeply Spark, a playful but practical assistant inside a personal notes and tasks app.",
        "Return only valid JSON with no markdown.",
        "Make suggestions concrete, short, and ready to save.",
        "Allowed labels: work, home, ideas, personal. Allowed note colors: sun, mint, sky, rose, ink. Allowed task priorities: low, normal, high."
      ].join(" "),
      messages: [
        {
          role: "user",
          content: [
            "Use the draft and recent Keeply items to suggest useful follow-ups.",
            "Output schema:",
            "{\"summary\":\"one short sentence\",\"suggestions\":[{\"type\":\"note|task\",\"title\":\"max 70 chars\",\"body\":\"note text or task details, max 220 chars\",\"label\":\"work|home|ideas|personal\",\"color\":\"sun|mint|sky|rose|ink\",\"priority\":\"low|normal|high\",\"dueOffsetDays\":0}]}",
            "Return 3 to 5 suggestions. For notes, priority and dueOffsetDays may be omitted. For tasks, include priority and a dueOffsetDays value between 0 and 14.",
            JSON.stringify(payload)
          ].join("\n\n")
        }
      ]
    })
  });

  const data = await message.json();
  if (!message.ok) {
    const detail = data?.error?.message || "Anthropic request failed.";
    sendJson(res, message.status, { error: detail });
    return;
  }

  const text = data?.content?.find((part) => part.type === "text")?.text || "";
  const parsed = parseClaudeJson(text);
  if (!parsed) {
    sendJson(res, 502, { error: "Claude returned an unreadable Spark response." });
    return;
  }

  sendJson(res, 200, sanitizeSparkResponse(parsed));
}

async function handleItems(req, res) {
  const rawBody = req.method === "GET" || req.method === "HEAD" ? "" : await readRawBody(req);
  const result = await itemsHandler({
    httpMethod: req.method,
    path: "/api/items",
    headers: req.headers,
    body: rawBody,
    isBase64Encoded: false
  });

  res.writeHead(result.statusCode || 200, result.headers || {});
  res.end(req.method === "HEAD" ? "" : result.body || "");
}

async function handleShape(req, res) {
  await runWebFunction(req, res, "/api/shape", shapeHandler);
}

async function handleAsk(req, res) {
  await runWebFunction(req, res, "/api/ask", askHandler);
}

async function runWebFunction(req, res, pathname, handler) {
  globalThis.Netlify ||= {};
  globalThis.Netlify.env = {
    get(name) {
      return process.env[name];
    }
  };

  const rawBody = await readRawBody(req);
  const result = await handler(
    new Request(`http://localhost${pathname}`, {
      method: req.method,
      headers: { "content-type": req.headers["content-type"] || "application/json" },
      body: rawBody || "{}"
    })
  );

  res.writeHead(result.status, Object.fromEntries(result.headers.entries()));
  res.end(await result.text());
}

async function readJsonBody(req) {
  const raw = await readRawBody(req);
  return raw ? JSON.parse(raw) : {};
}

async function readRawBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20000) throw new Error("Request body too large");
  }
  return raw;
}

function normalizeSparkPayload(body) {
  return {
    draft: {
      mode: clean(body?.draft?.mode, 12),
      title: clean(body?.draft?.title, 120),
      body: clean(body?.draft?.body, 1200),
      label: clean(body?.draft?.label, 20)
    },
    items: Array.isArray(body?.items)
      ? body.items.slice(0, 12).map((item) => ({
          type: clean(item?.type, 10),
          title: clean(item?.title, 120),
          body: clean(item?.body, 400),
          label: clean(item?.label, 20),
          priority: clean(item?.priority, 20),
          dueAt: clean(item?.dueAt, 20)
        }))
      : []
  };
}

function sanitizeSparkResponse(value) {
  const labels = new Set(["work", "home", "ideas", "personal"]);
  const colors = new Set(["sun", "mint", "sky", "rose", "ink"]);
  const priorities = new Set(["low", "normal", "high"]);
  const suggestions = Array.isArray(value?.suggestions) ? value.suggestions : [];

  return {
    summary: clean(value?.summary, 160) || "A few sparks are ready.",
    suggestions: suggestions.slice(0, 5).map((item) => ({
      type: item?.type === "task" ? "task" : "note",
      title: clean(item?.title, 90) || "Untitled",
      body: clean(item?.body, 260),
      label: labels.has(item?.label) ? item.label : "ideas",
      color: colors.has(item?.color) ? item.color : "sun",
      priority: priorities.has(item?.priority) ? item.priority : "normal",
      dueOffsetDays: clampNumber(item?.dueOffsetDays, 0, 14)
    }))
  };
}

function parseClaudeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function clean(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(min, Math.min(max, Math.round(number)));
}

async function serveStatic(pathname, req, res) {
  const requested = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = resolve(root, `.${normalize(requested)}`);
  if (!filePath.startsWith(root)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    await readFile(filePath);
  } catch {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  res.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "x-content-type-options": "nosniff"
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}
